const express = require('express');
const bp = require('body-parser')
const app = express();
const http = require('http');
const { Session } = require('inspector');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const passport = require('passport');
require('passport');
const bible = require('./APIFiles/bible.json');
const port = 3000
const GoogleStrategy = require('passport-google-oauth20');
require("dotenv").config();
const cookieSession = require('cookie-session');
const mongoose = require('mongoose')
const UserModel = require('./Models/users.js')
const NoteModel = require('./Models/notes.js');
const noteModel = require('./Models/notes.js');

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log('Connected to db')
    server.listen(port, () => {
      console.log(`listening on ${port}`);
    });
  })
  .catch((err) => {
    console.log(err)
  })
let user
let Note
// user.save()
//   .then(()=>{
//     console.log(UserModel.find())
//   })

let books = []

for(let i = 0; i<bible.length; i++){
	books.push(bible[i].book)
}

app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  keys: ['randomstringhere']
}));

app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))
app.use(passport.initialize()); 
app.use(passport.session());

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL
},
(accessToken, refreshToken, profile, done) => {
  done(null, profile); // passes the profile data to serializeUser
}
));

passport.serializeUser((user, done) => {
  done(null, user);
});

// Used to decode the received cookie and persist session
passport.deserializeUser((user, done) => {
  done(null, user);
});

function isUserAuthenticated(req, res, next) {
  if (req.user) {
      next();
  } else {
      res.redirect('/login');
  }
}

app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email'] // Used to specify the required data
}));

app.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
  res.redirect('/api/login');
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/Public/login.html')
})
app.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/login')
})
app.get('/', isUserAuthenticated, (req,res)=>{
  res.sendFile(__dirname + '/Public/index.html')
})

app.get('/api/getChapter/:book', (req, res) => {
  if (books.indexOf(req.params.book) >= 0) {
      res.send(bible[books.indexOf(req.params.book)])
  }else{
      res.send({"Error": 'True'})
  }
})
app.get('/api/userinfo', (req, res) => {
  res.send(req.user)
})
app.get('/api/pfp', (req, res)=>{
  res.send(req.user.photos[0].value )
})
app.get('/api/userdata', (req, res)=>{
  UserModel.findById(req.user.id)
    .then(data => res.send(data))
})

app.get('/api/newnote', (req,res) => {
  // res.send(req._parsedUrl.query)
  if (!req._parsedUrl.query) {
    res.send({Error: 'Enter a title for the note'})
    return
  }
  NoteModel.init()
  Note = new NoteModel({
    type: 'note',
    owner: [req.user.emails[0].value],
    title: decodeURI(req._parsedUrl.query),
    data: {
        time : "",
        blocks : [],
        version : ''
    }
  })
  console.log(Note.owner)
  Note.save().then((note)=>{
    res.send(note)
  })
})
app.get('/api/getnote', (req,res)=>{
  const id = req.query.id
  if(mongoose.isValidObjectId(id)){
      NoteModel.findById(id).then((data)=>{
        if (!data) {
          res.send({Error: "Invalid id"})
          return
        }
        if(req.user != undefined){
          console.log(data)
          if (data.owner.includes(req.user.emails[0].value) || data.editor.includes(req.user.emails[0].value) || data.viewer.includes(req.user.emails[0].value)) {
            res.send(data)
          }else{
            res.send({Error: "Unauthorised"})
          }
        }else{
          res.send({Error: "Unauthorised"})
        }
      })
    }else{
      res.send({Error: "Invalid id"})
    }
})
app.get('/api/deletenote', (req, res) => {
  const id = req.query.id
  noteModel.findOneAndDelete({_id: id}, ()=> {
    res.send()
  })
})
app.post('/api/updatenote', (req, res) => {
  const id = req.query.id
  console.log(req.body)
  NoteModel.findById(id).then((data)=>{
    if (data) {
      if (data.owner.includes(req.user.emails[0].value) || data.editor.includes(req.user.emails[0].value) || data.viewer.includes(req.user.emails[0].value)) {
        data.data = req.body
        data.save()
        res.send(req.body)
      }else{
        res.send({Error: "Invalid id"})
      }
    }
  })
})
app.get('/api/login', (req, res)=>{
  UserModel.findOne({ _id: req.user.id }).select("_id").lean().then(result => {
    if (result) {
        res.redirect('/')
    }else{
      UserModel.init()
      user = new UserModel({
        _id: req.user.id,
        email: req.user.emails[0].value,
        notes: []
      })
      user.save().then(()=>{
        res.redirect('/')
      })
    }
});
})

app.use(express.static('Public'))

io.on('connection', (socket) => {
    console.log('New user connected');
    socket.on('save', (data) => {
        UserModel.updateOne({email: data.email}, {notes: data.notes}, {new: true},()=>{
          return
        })
    })
});