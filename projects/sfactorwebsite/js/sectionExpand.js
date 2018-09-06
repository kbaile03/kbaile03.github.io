var coll = document.getElementsByClassName('header')
var i

console.log(coll.length)

for (i = 0; i < coll.length; i++) {
  coll[i].parentNode.addEventListener('click', function () {

    if (this.style.height === '400px') {
      this.style.height = '1200px'
    } else {
      this.style.height = '400px'
    }


    this.children[0].classList.toggle('active')
    console.log('clicked')
    var header = this.children[0]
    if (header.style.height !== '400px') {
      header.style.height = '400px'
    } else {
      header.style.height = '200px'
    }
    var content = this.children[1]
    if (content.style.height !== '0px') {
      content.style.height = '0px'
    } else {
      content.style.height = '1000px'
      content.style.color = 'black'
    }
  })
}
