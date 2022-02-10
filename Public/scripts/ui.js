const pfp = document.querySelector('.pfp')
const username = document.querySelector('.username')
let userinfo

fetch('/api/userinfo')
    .then((data)=> data =  data.json())
    .then((data)=> init(data))
function init(data) {
    userinfo = data
    console.log(userinfo)
    pfp.src = userinfo.photos[0].value
    username.innerHTML = userinfo.displayName
}