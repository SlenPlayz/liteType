let data
function broadcastData(res){
    data = res
    init(res)
}
function loadeditor(){
    console.log(decodeURI(window.location.hash.substring(8)))
    for (let index = 0; index < db.notes.length; index++) {
        const c = db.notes[index];
        if (c.title == decodeURI(window.location.hash.substring(8))) {
            newEditor(c.data)
        }else{
            console.log(window.location.hash.split('/'))
            if (window.location.hash.split('/').length == 3) {
                console.log(c)
                // newEditor(c.notes[2].contents[1].data)
                if (c.type == 'folder') {
                    newEditor(c.contents[0].data)
                }
            }
        }
    }
    // neweditor()
}
function loadfolder(){
    for (let k = 0; k < folders.length; k++) {
        const c = folders[k];
        if (c.title == decodeURI(window.location.hash.substring(9))){
            console.log(c)
            items.innerHTML = ''
            for (let h = 0; h < c.contents.length; h++) {
                const e = c.contents[h];
                items.innerHTML = `${items.innerHTML} <a href='#editor/${c.title}/${encodeURI(e.title)}'><i class="far fa-file-alt"></i> ${e.title}</a>`
            }
        }
    }
    
}

fetch('/api/userinfo')
    .then((data)=>data.json())
    .then(res=>broadcastData(res))