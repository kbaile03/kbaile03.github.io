window.onload = init


var members = [
  {
    fname: 'Travis',
    lname: 'Percy',
    photo: 'images/members/travis.jpg',
    quote: 'blah blah',
    part: 'T2',
    year: '2018',
    major: 'Everything',
    fb: false,
    ig: true,
    sc: true,
    fbl: 'https://facebook.com',
    igl: 'https://instagram.com',
    scl: 'https://snapchat.com'
  },
  {
    fname: 'Odeosa',
    lname: 'Idahor',
    photo: 'images/members/odeosa.jpg',
    quote: 'blah blah',
    part: 'T1',
    year: '2018',
    major: 'Pre Med',
    fb: true,
    ig: true,
    sc: true,
    fbl: 'https://facebook.com',
    igl: 'https://instagram.com',
    scl: 'https://snapchat.com'
  }
]


function init () {
  var men = document.getElementById('men')
  for (var i = 0; i < members.length; i++) {
    var html = ''
    html += '<div class="person"><p onclick="showCurr(\'' + members[i].lname + '\')">' + members[i].fname +
            '</p><img class="prof_pic" src="' + members[i].photo + '" /></div>'
    men.innerHTML += html
  }
}


function showCurr(lname) {
  console.log('in prof')
  enable('current', true)
  enable('background', true)
  var curr = document.getElementById('current')
  curr.innerHTML = ''
  for (var i = 0; i < members.length; i++) {
    if (members[i].lname === lname) {
      var html = ''
      html += '<div id="currLeft"><input type="image" id="close_button" onclick="hideCurr()" src="images/icons/x_button.png" alt="close button icon" /><h1>' +
              members[i].fname + ' ' + members[i].lname + '</h1>'
      if (members[i].onEboard) {
        html += '<h2>' + members[i].title + '</h2>'
      }
      html += '<span><b>Voice Part: </b>' + members[i].part + '</span></br><span><b>Favorite Song: </b>' +
              members[i].song + '</span></br><span><b>Quote: </b>' +
              members[i].quote + '<span></br><span><b>Major/Grad Year: </b>' +
              members[i].major + ', ' + members[i].year + '</span></br><div id ="currLinks">'

      if (members[i].fb) {
        html += '<a id="fb" href="' + members[i].fbl + '" class="social"><img class="icon" src="images/icons/fb_icon_full.png" /></a>'
      }
      if (members[i].ig) {
        html += '<a id="ig" href="' + members[i].fbl + '" class="social"><img class="icon" src="images/icons/IG_Glyph_Fill.png" /></a>'
      }
      if (members[i].sc) {
        html += '<a id="sc" href="' + members[i].scl + '" class="social"><img class="icon" src="images/icons/snap-ghost-yellow.png" /></a>'
      }
      html += '</div></div><div id ="currRight"><img id="currPhoto" src="' + members[i].photo + '" /></div>'

      curr.innerHTML += html
    }
  }
}

function hideCurr() {
  enable('current', false)
  enable('background', false)
}


function enable(id, bEnable)
{
  var element = document.getElementById(id)
  if (bEnable) {
    element.classList.remove('hideMe')
  } else {
    element.classList.add('hideMe')
  }
}
