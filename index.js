var express = require('express');
var bodyParser = require('body-parser');
var db = require('./models')
var session = require('express-session');
var flash = require('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

var NODE_ENV = process.env.NODE_ENV || 'development';
var BASE_URL = (NODE_ENV === 'production') ? 'https://lunchbreakninja.heroku.com' || 'http://www.lunchbreak.ninja' : 'http://localhost:3000' ;

//setup passport user serialization ///
passport.serializeUser(function(user, done){
  done(null, user.id);
});

passport.deserializeUser(function(id, done){
  db.user.find(id).then(function(user){
    done(null,user.get());
  }).catch(done);
});

//Passport Middleware

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: BASE_URL+'/auth/callback/facebook'
},function(accessToken, refreshToken, profile, done) {
  console.log(profile);
  db.provider.find({
    where:{
      pid:profile.id,
      type:profile.provider
    },
    include:[db.user]
  }).then(function(provider){
    console.log("inside found provider");
    if(provider && provider.user){
      //login
      provider.token = accessToken;
      provider.save().then(function(){
        done(null,provider.user.get());
      });
    } else {
      //signup
      var email = profile.emails[0].value;
      db.user.findOrCreate({
        where:{
          email:email
        },
        defaults:{
          email:email,
          name:profile.displayName
        }
      }).spread(function(user,created){
        if(created){
          //user created
          user.createProvider({
            pid:profile.id,
            token:accessToken,
            type:profile.provider
          }).then(function(){
            done(null,user.get());
          });
        } else {
          //signup failed
          done(null,false,{message:'You already signed up with this email address. Please log in with username and password.'})
        }
      })
    }
  })
}));

passport.use(new LocalStrategy({
  usernameField: 'email'
},
function(email,password,done){
  db.user.find({where:{email:email}})
    .then(function(user){
      if(user){
        user.checkPassword(password,function(err,result){
          if(err) return done(err);
          if(result){
            done(null,user.get())
          } else {
            done(null,false,{message: 'Invalid Password.'})
          }
        })
      } else {
        done(null,false,{message: 'Unknown User. Please sign up.'})
      }
    })
  }
));

//configure express
var app = express();
app.set('view engine', 'ejs');

//load middleware
var yelp = require("yelp").createClient({
  consumer_key: process.env.YELP_CONSUMER_KEY,
  consumer_secret: process.env.YELP_CONSUMER_SECRET,
  token: process.env.YELP_TOKEN,
  token_secret: process.env.YELP_SECRET
});

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(__dirname+'/public'));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());



app.use(function(req,res,next){
  res.locals.alerts = req.flash();
  next();
});

// app.use(function(req,res,next){
//   req.getUser = function() {
//     return req.user || false;
//   }
//   next();
// })

app.use(function(req,res,next){
  res.locals.loggedIn = req.user;
  // console.log('GET USER INFO!!!!!!!!', res.locals.loggedIn)
  next();
})



app.get('/', function(req,res){
  res.render('index')
});

app.use('/main', require('./controlers/main'));
app.use('/auth', require('./controlers/auth'));
app.use('/ninjitsu', require('./controlers/ninjitsu'));
// app.use('/user', require('./controlers/user'));

app.listen(process.env.PORT || 3000);