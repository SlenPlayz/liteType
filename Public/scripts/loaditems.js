const items = document.querySelector('.items')
let db
fetch('/mock.json')
    .then((data)=>data = data.json())
    .then(res => {
        db = res
        load(db)
    })
let folders = []
let notes = []
let openfolders = []
function load(res){
    items.innerHTML = ' '
    folders = []
    notes = []
    for (let index = 0; index < res.notes.length; index++) {
        const c = res.notes[index]
        if (c.type == 'folder') {
            folders.push(c)
            // items.innerHTML = `${items.innerHTML} <a href='#'><i class="far fa-folder"></i> ${c.title}</a>`
        }else if(c.type == 'note'){
            notes.push(c)
            // items.innerHTML = `${items.innerHTML} <a href='#'><i class="far fa-file-alt"></i> ${c.title}</a>`
        }
    }
    for (let i = 0; i < folders.length; i++) {
        const e = folders[i];
        items.innerHTML = `${items.innerHTML} <a href='#folders/${encodeURI(e.title)}'><i class="far fa-folder"></i> ${e.title}</a>`
    }
    for (let j = 0; j < notes.length; j++) {
        const e = notes[j];
        items.innerHTML = `${items.innerHTML} <a href='#editor/${encodeURI(e.title)}'><i class="far fa-file-alt"></i> ${e.title}</a>`
    }
}