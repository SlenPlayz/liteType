let qs
if(window.location.hash){
    document.querySelector('.items').classList.add('disabled')
    qs = window.location.hash
    window.location.hash = ''
    window.location.hash = qs
}else{
    document.querySelector('.editorWrapper').classList.add('disabled')
}
window.addEventListener('hashchange', function() { 
    if(window.location.hash){
        if (decodeURI(window.location.hash.substring(1,7)) == 'editor' || decodeURI(window.location.hash.substring(1,8)) == 'feditor'){
            loadeditor()
            document.querySelector('.items').classList.add('disabled')
            document.querySelector('.editorWrapper').classList.remove('disabled')
        }else if(decodeURI(window.location.hash.substring(1,8)) == 'folders'){
            console.log('d')
            loadfolder()
        }
    }else{
        document.querySelector('.editorWrapper').classList.add('disabled')
        document.querySelector('.items').classList.remove('disabled')
        load(db)
    } 
});