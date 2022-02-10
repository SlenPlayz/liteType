const editor = document.querySelector('.editor')
let focusedElement
let newElem
let tmpStore

function placeCaretAtEnd(el) {
    //el.focus();
    if (typeof window.getSelection != "undefined" &&
      typeof document.createRange != "undefined") {
      var range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    } else if (typeof document.body.createTextRange != "undefined") {
      var textRange = document.body.createTextRange();
      textRange.moveToElementText(el);
      textRange.collapse(false);
      textRange.select();
    }
  }

document.addEventListener('keydown', event => {
    focusedElement = document.activeElement
    if (event.key === 'Enter') {
      event.preventDefault()
      if (event.target.tagName == 'UL'){
        console.log(event.target.tagName)
        newElem = document.createElement('li')
        tmpStore = newElem
        newElem = document.createElement('div')
        tmpStore.appendChild(newElem)
        event.target.appendChild(tmpStore)
        console.log(newElem)
        newElem.focus()
      }else{
        newElem = document.createElement('div')
        newElem.setAttribute("contenteditable", true)
        newElem.classList.add("block")
        editor.insertBefore(newElem, focusedElement.nextSibling)
        newElem.focus()
      }
    }
    if (event.key === 'Backspace') {
        if (event.path[0].innerHTML == '') {
            event.preventDefault()
            event.path[0].previousSibling.focus()
            placeCaretAtEnd(event.path[0].previousSibling)
            event.path[0].remove()
        }
    }
    if (event.key === '/') {
        console.log('/')
        event.preventDefault()
        newElem = document.createElement('ul')
        newElem.classList.add("block")
        newElem.setAttribute("contenteditable", true)
        tmpStore = newElem
        newElem = document.createElement('li')
        tmpStore.appendChild(newElem)
        editor.appendChild(tmpStore)
        tmpStore.focus()
    }
  })

