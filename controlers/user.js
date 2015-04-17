var express = require('express');
var router = express.Router();
var db = require('../models');

router.get('/history', function(req,res){
  if(req.user){
    db.user.find({where: {id: req.user.id}, include: [db.history]})
      .then(function(data){
        console.log('USER HISTORY ACCESSED');
        var history = data.histories;
        // res.send(history)
        res.render('user/history', {history: history});
      })
  } else {
    req.flash('danger','Please log in to access your history page.')
    res.redirect('/ninjitsu')
  }
})

router.post('/history',function(req,res){
  if(req.user){
    var data = req.body;
    db.history.findOrCreate({where: {userId: req.user.id,
    restaurant: req.body.restaurant, lat: req.body.lat,
    lng: req.body.lng, phone: req.body.phone}})
      .spread(function(history,created){
        console.log('HISTORY ADDED', history.get({
        plain: true
      }));

        console.log(created)

        db.user.find({where: {id: req.user.id}, include: [db.history]})
          .then(function(data){
          console.log('USER HISTORY ACCESSED');
          var history = data.histories;
          res.render('user/history', {history: history});
        })
      })
  } else {
    req.flash('danger', 'Please log in to use this feature');
    res.redirect('/ninjitsu');
  }
});

router.put('/like',function(req,res){
  var data = req.body;
  db.history.update({
    like:data.like,
    meh:null
  },{
    where:{
      id:data.id
    }
  }).then(function(data){
    res.send(data)
  });
});

router.put('/meh',function(req,res){
  var data = req.body;
  db.history.update({
    like:null,
    meh:data.like
  },{
    where:{
      id:data.id
    }
  }).then(function(data){
    res.send(data)
  });
});


// router.put('/unlike', function(req,res){
//   var data = req.body;
//   db.history.update({
//     like:data.like,
//     meh:false
//   },{
//     where:{
//       id:data.id
//     }
//   }).then(function(data){
//     res.send(data)
//   });
// });

module.exports = router;