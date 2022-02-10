const pfp = document.querySelector('.pfp')
const username = document.querySelector('.username')
let userInfo
let connectionStatus = 'online'
function init(data) {
    pfp.src = data.photos[0].value
    username.innerHTML =  data.displayName
    userInfo = data
}

function back() {
    // window.history.go('-1')
    console.log(Path)
    const PathaaArr = Path.split('/')
    const currPaaA = PathaaArr[PathaaArr.length -1].length
    window.location.hash = `#folder${Path.slice(0, -currPaaA)}`
    if(editor){
        save()
        editor.destroy()
    }
}

function newFile(type) {
    let dialog = document.querySelector('.dialog')
    const h1 = document.createElement('h3')
    const input = document.createElement('input')
    const actionWrapper = document.createElement('div')
    const ActionCnfm = document.createElement('button')
    const ActionCncl = document.createElement('button')
    h1.innerHTML = `Enter name of ${type}`
    input.placeholder = 'Name...'
    ActionCncl.innerHTML = 'Nevermind'
    ActionCncl.classList.add('neutralBtn')
    ActionCnfm.innerHTML = 'Create'
    ActionCnfm.classList.add('confirmBtn')
    actionWrapper.classList.add('actionWrap')
    dialog.close = ()=>{
        dialog.innerHTML = ''
        document.querySelector('.dialogWrap').classList.add('disabled')
    }
    ActionCncl.addEventListener('click',()=>{
        dialog.close()
    })
    ActionCnfm.addEventListener('click', ()=>{
        if (input.value) {
            // curr.push({
            //     type: type,
            //     title: input.value,
            //     data: {}
            // })
            if (type == 'folder') {
                curr.push({
                    type: type,
                    title: input.value,
                    contents: []
                })
            }else if(type == 'note'){
                curr.push({
                    type: type,
                    title: input.value,
                    data: {}
                })
            }
            console.log(input.value)
            pushSave()
            showFiles()
            dialog.close()
        }else{
            input.placeholder = 'U need to actually add a name lol'
        }
    })
    actionWrapper.appendChild(ActionCncl)
    actionWrapper.appendChild(ActionCnfm)
    dialog.appendChild(h1)
    dialog.appendChild(input)
    dialog.appendChild(actionWrapper)
    document.querySelector('.dialogWrap').classList.remove('disabled')
}
function Delete(name) {
    for (let k = 0; k < curr.length; k++) {
        const e = curr[k];
        if (e.title == name) { 
            curr.splice(k, 1)
            showFiles()
            pushSave()
        }
    }
}
function Rename(name) {
    const dialog = document.querySelector('.dialog')
    const h3 = document.createElement('h3')
    const input = document.createElement('input')
    const actionWrapper = document.createElement('div')
    const ActionCnfm = document.createElement('button')
    const ActionCncl = document.createElement('button')
    h3.innerHTML = 'Enter new name of ' + name
    input.placeholder = 'New name...'
    ActionCncl.innerHTML = 'Nevermind'
    ActionCncl.classList.add('neutralBtn')
    ActionCnfm.innerHTML = 'Rename'
    ActionCnfm.classList.add('confirmBtn')
    actionWrapper.classList.add('actionWrap')
    dialog.close = ()=>{
        dialog.innerHTML = ''
        document.querySelector('.dialogWrap').classList.add('disabled')
        closeMenu()
    }
    ActionCncl.addEventListener('click',()=>{
        dialog.close()
    })
    ActionCnfm.addEventListener('click', () => {
        if (input.value) {
            for (let l = 0; l < curr.length; l++) {
                const k = curr[l];
                if (k.title == name) {
                    k.title = input.value
                    showFiles()
                    pushSave()
                    dialog.close()
                }
            }
        }else{
            dialog.close()
        }
    })
    actionWrapper.appendChild(ActionCncl)
    actionWrapper.appendChild(ActionCnfm)
    dialog.appendChild(h3)
    dialog.appendChild(input)
    dialog.appendChild(actionWrapper)
    document.querySelector('.dialogWrap').classList.remove('disabled')
}
function closeMenu(){
    const details = document.querySelectorAll('details')
    details.forEach((detail)=>{
        detail.removeAttribute("open")
    })
}
function showOptions() {
    document.querySelector(".userOptions").classList.toggle("disabled")
}
window.addEventListener("offline", ()=>{
    connectionStatus = 'offline'
    alertia('Offline switched to readonly mode', 'Danger', 3000)
    if(editor){
        editor.readOnly.toggle();
    }
})