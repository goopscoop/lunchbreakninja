var express = require('express');
var router = express.Router();
var db = require('../models');

router.get('/history', function(req,res){
  if(req.user){
    db.user.find({where: {id: req.user.id}, include: [db.history]})
      .then(function(data){
        console.log('USER HISTORY ACCESSED');
        var history = data.histories;
        res.render('user/history', {history: history});
      })
  } else {
    req.flash('danger','Please log in to access your history page.')
    res.redirect('/ninjitsu')
  }
})

router.post('/history',function(req,res){
  if(req.user){
    var data = req.body
    db.history.findOrCreate({where: {userId: req.user.id,
    restaurant: req.body.restaurant, lat: req.body.lat,
    lng: req.body.lng, phone: req.body.phone}})
      .spread(function(history,created){
        console.log('HISTORY ADDED', history.get({
        plain: true
      }))
        console.log(created)
        res.render('user/history')
      })
  } else {
    req.flash('danger', 'Please log in to use this feature')
    res.redirect('/ninjitsu')
  }
})

module.exports = router;