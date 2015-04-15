var express = require('express');
var router = express.Router();
var db = require('../models');
var geocoder = require('geocoder');
// var request = require('request');

var yelp = require("yelp").createClient({
  consumer_key: process.env.YELP_CONSUMER_KEY,
  consumer_secret: process.env.YELP_CONSUMER_SECRET,
  token: process.env.YELP_TOKEN,
  token_secret: process.env.YELP_SECRET
});

router.post('/categories', function(req,res){
  var catInfo = req.body;
  console.log('ADDING CATEGORY INFO', catInfo)
  db.categoriesusers.findOrCreate({where:
    {userId: catInfo.userId, categoryId: catInfo.category }
  }).spread(function(category,created){
    console.log(category.get({
      plain: true
    }))
    console.log(created)
  })
  res.send('success')
});

router.post('/categories/remove', function(req,res){
  var catInfo = req.body;
  console.log('REMOVING CATEGORY INFO', catInfo)
  db.categoriesusers.destroy({where:
    {userId: catInfo.userId, categoryId: catInfo.category}
  }).then(function() {

    res.send({result:true})
  })
});






router.get('/', function(req,res){

  // console.log("!!!!!!!",req.user)
  // console.log("222222222", loggedIn)
var catSearch = [];
if (req.user) {
    db.category.find({order: 'random()', where: {userId: req.user.id } }).then(function(data){
      for(var key in data.get()) {
        if (key == 'true') catSearch.push(key)
      }
      console.log('!!!!!!!!!!!!!',catSearch)
    })
  }
  res.render('ninjitsu/search')
});


router.get('/result', function(req,res){

var getPick = function(foodType, place){
  yelp.search({term: foodType, location: place}, function(error, data) {
  var narrowArray = []

    //sorts all restaurants by rating with 4.5 and up
    //at the beginning of the array, and 4.0 at the end.
    for(var i = 0; i < data.businesses.length; i++) {
      if( data.businesses[i].rating > 4 ) {
        narrowArray.unshift(data.businesses[i])
      } else if ( data.businesses[i].rating > 3.5 ) {
        narrowArray.push(data.businesses[i])
      }
    }

    //If the above function returns an array of 3 or less
    //the below function then adds restaurants with a score
    //of 3.5.
    if( narrowArray.length < 4 ) {
      console.log('!!!!!!low results!!!!!!!')
      for( var j = 0; j < data.businesses.length; j++ ) {
        if ( data.businesses[i].rating < 4 && data.businesses[i].rating > 3 )
          narrowArray.push(data.businesses[i]);
      }
    }

    //Checks to make sure all restaurants in 'narrowArray' are
    //actually of the inteded category. If they aren't, it deletes them.
    var categoryCheck = []

    narrowArray.forEach(function(item, loc){
      var temp = []

      narrowArray[loc].categories.forEach(function(item2, loc2){
        if ( item2[0] === foodType || item2[1] === foodType ) {
          categoryCheck.push(narrowArray[loc]);
        }
      });
    })


  var finalPick = []

  var randomNum = Math.floor(Math.random() * (categoryCheck.length));

  finalPick.push(categoryCheck[randomNum])

  // res.send(finalPick)
  res.render('ninjitsu/result', {'finalPick': finalPick});
  })
};


getPick('japanese', '500 Yale Avenue North, Seattle, WA 98109')


// var pick = getPick('mexican', 'north bend')
      // console.log(req.getPick('mexican', 'north bend'))
    // console.log(narrowArray.length)
});



//Search route
//returns this object:
// {
// location: "Chicago",
// distanceRadios: "1",
// familiarRadios: "new"
// }

router.post('/result', function(req,res){
  // var data = req.body

  var getPick = function(foodType, place, distance){
    yelp.search({term: foodType, location: place}, function(error, data) {
    var narrowArray = []

      //sorts all restaurants by rating with 4.5 and up
      //at the beginning of the array, and 4.0 at the end.
      for(var i = 0; i < data.businesses.length; i++) {
        if( data.businesses[i].rating > 4 ) {
          narrowArray.unshift(data.businesses[i])
        } else if ( data.businesses[i].rating > 3.5 ) {
          narrowArray.push(data.businesses[i])
        }
      }

      //If the above function returns an array of 3 or less
      //the below function then adds restaurants with a score
      //of 3.5.
      if( narrowArray.length < 4 ) {
        console.log('!!!!!!low results!!!!!!!')
        for( var j = 0; j < data.businesses.length; j++ ) {
          if ( data.businesses[i].rating < 4 && data.businesses[i].rating > 3 )
            narrowArray.push(data.businesses[i]);
        }
      }

      //Checks to make sure all restaurants in 'narrowArray' are
      //actually of the inteded category. If they aren't, it deletes them.
      var categoryCheck = []

      narrowArray.forEach(function(item, loc){
        var temp = []

        narrowArray[loc].categories.forEach(function(item2, loc2){
          if ( item2[0] === foodType || item2[1] === foodType ) {
            categoryCheck.push(narrowArray[loc]);
          }
        });
      })


    var finalPick = []

    var randomNum = Math.floor(Math.random() * (categoryCheck.length));

    finalPick.push(categoryCheck[randomNum])


    // res.send(finalPick)
    res.render('ninjitsu/result', {'finalPick': finalPick});
  })
};

  if (req.user) {

    db.category.find({where: {userId: req.user.id } }).then(function(data){
      console.log(data)
    })
  }
  getPick('bbq', req.body.location, req.body.distanceRadios)

});


// r/ninjitsu/address

module.exports = router;