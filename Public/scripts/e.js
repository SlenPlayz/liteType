const socket = io()
let previousSave
let SaveButton = document.querySelector('.saveBtn')
let editor
const Heading = document.querySelector('.title')
function newEditor(data) {
  console.log("data")
  editor = new EditorJS({
    holder: 'editor',
    placeholder: 'Write something...',
    tools: {
        header: Header,
        list: List,
        checklist: {
            class: Checklist,
            inlineToolbar: true,
        },
        bible: {
          class: Bible,
          inlineToolbar: true
        }
    },
    onChange: () => {
        editor.save().then((outputData) => {
            if (outputData != previousSave) {
                SaveButton.disabled = false
            }
          }).catch((error) => {
            console.log('Saving failed: ', error)
          });
    },
    data: data.data
  })
  document.querySelector('.title').innerHTML  = data.title
}

document.addEventListener('keydown', e => {
  if (e.ctrlKey && e.key === 's') {
    e.preventDefault();
    save()
  }
});

function save(){

}

function pushSave(){
  socket.emit('save', data)
}