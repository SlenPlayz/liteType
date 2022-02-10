class Bible {
    static get toolbox() {
        return {
        title: 'Bible',
        icon: '<svg style="height: 50%;" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="bible" class="svg-inline--fa fa-bible fa-w-14" role="img" viewBox="0 0 448 512"><path  d="M448 358.4V25.6c0-16-9.6-25.6-25.6-25.6H96C41.6 0 0 41.6 0 96v320c0 54.4 41.6 96 96 96h326.4c12.8 0 25.6-9.6 25.6-25.6v-16c0-6.4-3.2-12.8-9.6-19.2-3.2-16-3.2-60.8 0-73.6 6.4-3.2 9.6-9.6 9.6-19.2zM144 144c0-8.84 7.16-16 16-16h48V80c0-8.84 7.16-16 16-16h32c8.84 0 16 7.16 16 16v48h48c8.84 0 16 7.16 16 16v32c0 8.84-7.16 16-16 16h-48v112c0 8.84-7.16 16-16 16h-32c-8.84 0-16-7.16-16-16V192h-48c-8.84 0-16-7.16-16-16v-32zm236.8 304H96c-19.2 0-32-12.8-32-32s16-32 32-32h284.8v64z"/></svg>'
        };
    }
    constructor({data}){
        this.data = data;
    }

    render(){
        const input = document.createElement('input');
        const addBtn = document.createElement('button')
        const wrapper = document.createElement('div');
        let Verses
        wrapper.appendChild(input);
        wrapper.appendChild(addBtn);
        addBtn.innerHTML = 'Add'
        input.placeholder = 'Enter verses like this: John 3:16-17'
        if (this.data && this.data.bkv) {
            wrapper.innerHTML = `<div><h5>${this.data.bkv}</h5><p>${this.data.content}</p></div>`
        }else{
            addBtn.onclick = () => {
            fetch(`/api/getChapter/${input.value.split(' ')[0]}`)
                .then(data => data = data.json())
                .then(data => {
                    let verse = input.value.split(' ')[1].split(':')[1]
                    let chapter =  parseInt(input.value.split(' ')[1].split(':')[0] -1)
                    if (verse.split('-')[1]) {
                        Verses = ''
                        for (let index = parseInt(verse.split('-')[0]); index <= verse.split('-')[1]; index++) {
                            let String = ''
                            Verses = `${Verses} ${data.chapters[chapter].verses[index].text}`
                        }
                        wrapper.innerHTML = `<div><h5>${input.value}:</h5><p>${Verses}</p></div>`
                    }else{
                        wrapper.innerHTML = `<div><h5>${input.value}:</h5><p>${data.chapters[chapter].verses[parseInt(verse)].text}</p></div>`
                    }
                })
        }
        }
        return wrapper
    }

    save(blockContent){
        let bkv
        let content
        if (blockContent.querySelector('h5')) {
            bkv = blockContent.querySelector('h5').innerHTML
            content = blockContent.querySelector('p').innerHTML
        }

        return {
            bkv: bkv,
            content: content
        }
    }
}