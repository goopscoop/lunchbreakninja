var express = require('express');
var db = require('../models');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var router = express.Router();
var passport = require('passport')

//POST /login
//process login data and login user
router.post('/login',function(req,res){
  //passport login
  passport.authenticate('local',function(err,user,info){
    if(user){
      req.login(user,function(err){
        if(err) throw err;
        req.flash('success','You are now logged in.');
      })
      res.redirect('/ninjitsu');
    } else {
      var errorMsg = info && info.message ? info.message : 'Unknown error.';
      req.flash('danger', errorMsg);
      res.redirect('/');
    }
  })(req,res);
});

//sign up form
router.get('/signup', function(req,res){
  db.category.findAll().then(function(categories){
    // res.send(categories)
  res.render('auth/signup', {categories: categories})
  })
});

router.post('/signup', function(req,res){
  var userQuery = { email: req.body.email };
  var userData =  {
                  email: req.body.email,
                  name: req.body.name,
                  password: req.body.password
                  };
                  console.log(userData)
  db.user.findOrCreate({where: userQuery, defaults:userData})
    .spread(function(user,created){
      if (created) {
        req.login(user,function(err){
          if(err) throw err;
          console.log('REGULAR USER !!!!!!!!!!', user)
          res.send(user);
        })
      } else {
        res.send('email already exists');
      }
    }).catch(function(error){
     console.log('"Do you want me to talk?"  "No Mr. Bond, I want you to die!"');
     console.log(error);
     res.send(error);
    })

  // res.send('Success!')
})

//GET /auth/logout
//logout logged in user
router.get('/logout',function(req,res){
    req.logout();
    req.flash('info','You have been logged out.')
    res.redirect('/');
});

//oAuth login route
router.get('/login/:provider',function(req,res){
  passport.authenticate(
    req.params.provider,
    {scope:['public_profile','email']}
  )(req,res);
});

//oAuth callback route
router.get('/callback/:provider',function(req,res){
  passport.authenticate(req.params.provider,function(err,user,info){
    if(user){
      req.login(user,function(err){
        if(err) throw err;
        req.flash('success','You are now logged in.');
      })
        res.redirect('/ninjitsu');
    } else {
      var errorMsg = info && info.message ? info.message : 'Unknown error.';
      req.flash('danger', errorMsg);
      // res.render('auth/signup');
      res.send({error: err, info: info, user: user});
    }
  })(req,res);
});

router.get('/categories',function(req,res){
  if(req.user) {
  var user = req.user.id;
    db.category.findAll()
      .then(function(categories){
        db.user.find({where: {id: req.user.id }, include: [db.category] })
          .then(function(userData) {
          console.log(userData)
          console.log('user', user)
          // res.send(userData)
          res.render('auth/categories', {'categories': categories, 'user': user, 'userData': userData});
        })
      });
  } else {
    res.redirect('/auth/signup')
  }
})


module.exports = router;