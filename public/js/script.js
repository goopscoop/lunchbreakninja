
//returns the value of a parameter in the url
// var getUrlParameter = function(sParam)
// {
//     var sPageURL = window.location.search.substring(1);
//     var sURLVariables = sPageURL.split('&');
//     for (var i = 0; i < sURLVariables.length; i++)
//     {
//         var sParameterName = sURLVariables[i].split('=');
//         if (sParameterName[0] == sParam)
//         {
//             return sParameterName[1];
//         }
//     }
// }

var user = {};

//Function Creates Map
var drawMap = function(markers) {

  L.mapbox.accessToken = 'pk.eyJ1IjoiZ29vcHNjb29wIiwiYSI6InQwVllZcTAifQ.hqdCSUTnNKUbVU7DiaPjvw';

  var mapboxTiles = L.tileLayer('https://{s}.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=' + L.mapbox.accessToken, {
      attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>'
  });

  var map = L.map('map').addLayer(mapboxTiles)


   markers.forEach(function(marker) {
    console.log(marker);
    L.marker([marker.lat, marker.lng]).addTo(map).bindPopup(marker.name)
    map.setView([marker.lat, marker.lng], 15);
   })

}

$(function(){

$('#signup-form-1').on('submit', function(e){
  var form = $(this);
  console.log($('#signup-email').val())
  e.preventDefault();
  var myUrl = $(this).attr('action');
  var myData = $(this).serialize();
  if($('#signup-email').val() == null || $('#signup-email').val() == ''
      || $('#signup-pass').val() == null || $('#signup-pass').val() == ''
      || $('#signup-pass-conf').val() == null || $('#signup-pass-conf').val() == ''
      || $('#signup-pass').val() !== $('#signup-pass-conf').val() ) {
    $('.signup-1').effect('shake');
  } else {
    $.ajax({
      method: 'POST',
      url: myUrl,
      data: myData
    }).done(function(data){
      console.log('USER DATA (this log from script.js)',data)
      if (data === 'email already exists') {
        $( "#dialog" ).dialog();
      } else {
        user = data.user;
        $('.signup-1').hide( 'drop', {direction: 'left'}, function(){
        $('.signup-2').show( 'drop', {direction: 'right'})
        });
      }
    });
  }
});


$( document ).tooltip();

if(window.location.pathname === '/auth/categories') {
  var user = user;
    $('.signup-2').show( 'drop', {direction: 'right'})
};


//Auto populates the location feild and causes drop animation
if(window.location.pathname === '/ninjitsu' ||
   window.location.pathname === '/ninjitsu/' ) {
  $('#search-form').show('drop', {direction: 'right'}, 450);
  if(navigator) {
    navigator.geolocation.getCurrentPosition(function(position) {
       console.log(position.coords.latitude)
       console.log(position.coords.longitude)
      $.ajax({
        method: 'get',
        url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+position.coords.latitude+','+position.coords.longitude
      }).done(function(data){
        $('#search-location').val(data.results[0].formatted_address)
        // console.log()
      });
    });
  }
}

$('.cat-check').on('click', function(e){
  var checkbox = $(this);
  var value = $(this).attr('value')
  var data = { userId: user.id,
               category: value }
  console.log(value, user.id)
  if($(checkbox).prop('checked')){
    console.log('check')
    $.ajax({
      'method': 'post',
      'url': '/ninjitsu/categories',
      'data': data
    }).done(function(success){
      console.log('success!', success)
    })
  } else {
    console.log('uncheck')
    $.ajax({
      'method': 'post',
      'url': '/ninjitsu/categories/remove',
      'data': data
    }).done(function(success){
      console.log('CATEGOREY success!', success)
    })
  }
})


$('#location-feild').on('submit', function(e){
  if( $('#search-location').val() === null ||
      $('#search-location').val() === '' ) {
    e.preventDefault();
    $('#search-form').effect('shake');
  }
});

$('.like-btn').on('submit', function(e){
  var form = $(this)
  e.preventDefault();
  var data = $(this).serialize()
  $.ajax({
    'method': 'put',
      'url': '/user/like',
      'data': data
  }).done(function(success){
    console.log('LIKE SUCCESS!', success)
  });
  $(form).children('button').addClass('btn-success');
  $(form).children('button').removeClass('btn-default');
  $(form).siblings('.unlike-btn, .meh-btn').children('button').removeClass('btn-danger, btn-warning');
  $(form).siblings('form').children('button').addClass('btn-default');
});

$('.unlike-btn').on('submit', function(e){
  var form = $(this)
  e.preventDefault();
  var data = $(this).serialize()
  $.ajax({
    'method': 'put',
      'url': '/user/like',
      'data': data
  }).done(function(success){
    console.log('LIKE/UNLIKE SUCCESS!', success)
  });
  $(form).children('button').addClass('btn-danger');
  $(form).children('button').removeClass('btn-default');
  $(form).siblings('.like-btn, .meh-btn').children('button').removeClass('btn-success, btn-warning');
  $(form).siblings('form').children('button').addClass('btn-default');
});


$('.meh-btn').on('submit', function(e){
  var form = $(this)
  e.preventDefault();
  var data = $(this).serialize()
  $.ajax({
    'method': 'put',
      'url': '/user/meh',
      'data': data
  }).done(function(success){
    console.log('MEH SUCCESS!', success)
  });
    $(form).children('button').addClass('btn-warning');
    $(form).children('button').removeClass('btn-default');
    $(form).siblings('.like-btn, .unlike-btn').children('button').removeClass('btn-success, btn-danger')
    $(form).siblings('form').children('button').addClass('btn-default')
});

});