window.onload = init

var members = [
  {
    fname: 'Travis',
    lname: 'Percy',
    photo: 'images/members/travis.jpg',
    bio: 'blah blah',
    ig: 'instagram.com'
  },
  {
    fname: 'Odeosa',
    lname: 'Idahor',
    photo: 'images/members/odeosa.jpg',
    bio: 'blah blah',
    ig: 'instagram.com'
  }
]

function init () {
  var men = document.getElementById('men')
  for (var i = 0; i < members.length; i++) {
    var html = ''
    html += '<div class="person"><p>' + members[i].fname +
            '</p><img class="prof_pic" src="' + members[i].photo + '" /></div>'
    men.innerHTML += html
  }
}
