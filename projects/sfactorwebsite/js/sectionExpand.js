console.log('hello world')
var coll = document.getElementsByClassName('content')

for (i = 0; i < coll.length; i++) {
  coll[i].parentNode.addEventListener('click', function () {

    if (this.style.height === '400px') {
      this.style.height = '1200px'
    } else {
      this.style.height = '400px'
    }
    console.log('clicked')
    var header = this.children[0]
    if (header.style.height !== '400px') {
      header.style.height = '400px'
    } else {
      header.style.height = '200px'
      header.classList.toggle('hideMe', false)
    }
    var content = this.children[1]
    if (content.style.height !== '0px') {
      content.style.height = '0px'
      content.classList.toggle('hideMe', true)
      setchildren(content, false);

    } else {
      content.classList.toggle('hideMe', false)
      content.style.height = '1000px'
      content.style.color = 'black'
      content.style.padding = '40px'
    }
  })
}

function setchildren (parent, bool) {
  for (var i = 0; i < parent.children.length; i++) {
    parent.children[i].classList.toggle('active', bool)
    console.log(parent.children[i]);
  }
}
