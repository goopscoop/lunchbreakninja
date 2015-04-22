var express = require('express');
var router = express.Router();


router.get('/changelog', function(req,res){
  // res.send('hello')
  res.render('main/changelog');
});

router.get('/about', function(req,res){
  res.render('main/about');
});

module.exports = router;