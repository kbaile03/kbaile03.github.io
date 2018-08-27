window.onload = init

 var members =
  [
    {
      'fname': 'Travis',
      lname: 'Percy',
      photo: 'images/members/travispercy.jpg',
      quote: 'blah blah',
      song: 'Psycho - Post Malone',
      onEboard: false,
      title: '',
      part: 'T2',
      year: '2018',
      major: 'Everything',
      fb: false,
      ig: true,
      sc: true,
      scld: true,
      fbl: '',
      igl: '',
      scl: '',
      scldl: 'kennedy-bailey-612002265'
    },
    {
      fname: 'Odeosa',
      lname: 'Idahor',
      photo: 'images/members/odeosaidahor.jpg',
      quote: 'blah blah',
      song: 'Something - Brandy',
      onEboard: false,
      title: '',
      part: 'T1',
      year: '2018',
      major: 'Pre Med',
      fb: true,
      ig: true,
      sc: true,
      scld: false,
      fbl: '',
      igl: '',
      scl: '',
      scldl: ''
    },
    {
      fname: 'Ethan',
      lname: 'Chen',
      photo: 'images/members/ethanchen.jpg',
      quote: 'blah blah',
      song: '',
      onEboard: true,
      title: 'Business Manager',
      part: 'B1',
      year: '2019',
      major: 'Computer Science, Economics',
      fb: false,
      ig: false,
      sc: false,
      scld: false,
      fbl: '',
      igl: '',
      scl: '',
      scldl: ''
    },
    {
      fname: 'Michael',
      lname: 'Kodua',
      photo: 'images/members/michaelkodua.jpg',
      quote: 'blah blah',
      song: 'something good',
      onEboard: true,
      title: 'President',
      part: 'B1',
      year: '2018',
      major: 'Pre Med',
      fb: true,
      ig: true,
      sc: true,
      scld: false,
      fbl: '',
      igl: '',
      scl: '',
      scldl: ''
    },
    {
      fname: 'Henry',
      lname: 'Li',
      photo: 'images/members/henryli.jpg',
      quote: 'blah blah',
      song: '',
      onEboard: false,
      title: '',
      part: 'B1',
      year: '2020',
      major: '',
      fb: true,
      ig: true,
      sc: true,
      scld: false,
      fbl: '',
      igl: '',
      scl: '',
      scldl: ''
    },
    {
      fname: 'Edwin',
      lname: 'Jain',
      photo: 'images/members/edwinjain.jpg',
      quote: 'blah blah',
      song: '',
      onEboard: true,
      title: 'Music Director',
      part: 'T2',
      year: '2019',
      major: 'Literally everything',
      fb: true,
      ig: true,
      sc: true,
      scld: false,
      fbl: '',
      igl: '',
      scl: '',
      scldl: ''
    },
    {
      fname: 'Isaiah',
      lname: 'Marshall-Thomas',
      photo: 'images/members/isaiahmarshall-thomas.jpg',
      quote: 'blah blah',
      song: '',
      onEboard: false,
      title: '',
      part: 'B2',
      year: '2019',
      major: '',
      fb: true,
      ig: true,
      sc: true,
      scld: true,
      fbl: '',
      igl: '',
      scl: '',
      scldl: ''
    },
    {
      fname: 'Jordan',
      lname: 'Barnes',
      photo: 'images/members/jordanbarnes.jpg',
      quote: 'blah blah',
      song: 'Bright Side - Kennedy Bailey',
      onEboard: true,
      title: 'Brotherhood Chair',
      part: 'B1',
      year: '2019',
      major: '',
      fb: true,
      ig: true,
      sc: true,
      scld: true,
      fbl: '',
      igl: '',
      scl: '',
      scldl: ''
    },
    {
      fname: 'Kennedy',
      lname: 'Bailey',
      photo: 'images/members/kennedybailey.jpg',
      quote: 'blah blah',
      song: 'Wake Up - Beyoncé',
      onEboard: false,
      title: '',
      part: 'T1',
      year: '2018',
      major: '',
      fb: true,
      ig: true,
      sc: true,
      scld: true,
      fbl: '',
      igl: '',
      scl: '',
      scldl: ''
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
      } else {
        html += '<h2></h2>'
      }
      html += '<span><b>Voice Part: </b>' + members[i].part + '</span></br><span><b>Favorite Song: </b>' +
              members[i].song + '</span></br><span><b>Quote: </b>' +
              members[i].quote + '</span></br><span><b>Major/Grad Year: </b>' +
              members[i].major + ', ' + members[i].year + '</span></br><div id ="currLinks">'

      if (members[i].fb) {
        html += '<a id="fb" href="https://facebook.com/' + members[i].fbl + '" class="social"><img class="icon" src="images/icons/fb_icon_full.png" /></a>'
      }
      if (members[i].ig) {
        html += '<a id="ig" href="https://instagram.com/' + members[i].igl + '" class="social"><img class="icon" src="images/icons/IG_Glyph_Fill.png" /></a>'
      }
      if (members[i].sc) {
        html += '<a id="sc" href="https://snapchat.com/add/' + members[i].scl + '" class="social"><img class="icon" src="images/icons/snap-ghost-yellow.png" /></a>'
      }
      if (members[i].scld) {
        html += '<a id="scld" href="https://soundcloud.com/' + members[i].scldl + '" class="social"><img class="icon" src="images/icons/scld_icon.png" /></a>'
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
