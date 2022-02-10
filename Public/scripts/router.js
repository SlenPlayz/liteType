const itemsDiv = document.querySelector('.items')
const itemsWrap = document.querySelector('.itemsWrap')
const info = document.querySelector('.info')
const editorWrapper = document.querySelector('.editorWrapper')
const backBtn = document.querySelector('.back')
const saveBtn = document.querySelector('.saveBtn')
let type
let Path
let data = {
    uid: '',
    email: '',
    notes: []
}
let curr
let currPath = []
let tmp

fetch('/api/userdata')
    .then(data => data = data.json())
    .then(res => {data = res})
    .then(()=>{
        fetch('/api/userinfo')
            .then(data => data = data.json())
            .then(res => {
                init(res)
                load(data)
            })
    })

window.addEventListener('hashchange', () => load(data))
function hashchange() {
    if (window.location.hash){
        type = window.location.hash.substring(1).split('/')[0]
        Path = window.location.hash.substring(7)
    }else{
        type = 'folder'
        Path = '/'
    }
    RecFind()
}
hashchange()
function load(res){
    hashchange()
    // console.log(res)
    // info.innerHTML = '' 
    if(type == 'folder'){
        editorWrapper.classList.add('disabled')
        itemsWrap.classList.remove('disabled')
        saveBtn.classList.add('disabled')
        if (Path == '/') {
            backBtn.classList.add('disabled')
        }else{
            backBtn.classList.remove('disabled')
        }
        info.innerHTML = ''
        showFiles()
    }else if(type == 'editor'){
        // editorWrapper.classList.remove('disabled')
        itemsWrap.classList.add('disabled')
        backBtn.classList.remove('disabled')
        saveBtn.classList.remove('disabled')
    }
    // if (Path != '/') {
    //     console.log(Path.split('/'))
    // }
}
function loopFind(name, array){
    tmp = curr
    for (let index = 0; index < array.length; index++) {
        const element = array[index];
        if(element.title == name){
            // console.log('found')
            currPath.push(index)
            if (element.type == 'folder') {
                curr = element.contents
            }else if (element.type == 'note') {
                curr = element
                console.log('test')
                document.querySelector('.info').innerHTML = '<div class="progress circular"></div>'
                fetch('/api/getnote?' + element.id)
                    .then((res)=>res.json())
                    .then((data)=>{
                        newEditor(data)
                        editorWrapper.classList.remove('disabled')
                        info.innerHTML = ''
                    })
                // newEditor(curr)
            }
        }
    }
    if (tmp == curr) {
        itemsDiv.innerHTML = 'Error! Specified folder or file does not exist'
    }
}
function RecFind() {
    if (Path.slice(-1) == '/') {
        window.location.hash = `#${type}${Path.slice(0, Path.length-1)}`
    }
    const PathaaArr = Path.split('/')
    curr = data.notes
    // itemsDiv.innerHTML = ''
    currPath = []
    if (Path != '/') {
        for (let i = 1; i < PathaaArr.length; i++) {
            console.log(`Loop: ${i}`)
            const element = decodeURI(PathaaArr[i])
            loopFind(element, curr)
        }
    }
    // console.log(curr)
}
function getPathIndex(index) {
    return currPath[index]
}
