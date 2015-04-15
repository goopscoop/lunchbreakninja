"use strict";
var bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define("user", {
    email: DataTypes.STRING,
    name: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.user.hasMany(models.provider);
        models.user.hasMany(models.category);
      }
    },
    instanceMethods: {
      checkPassword: function(pass, callback){
        if(pass && this.password){
          bcrypt.compare(pass,this.password,callback);
        } else {
          callback(null,false);
        }
      }
    },
    hooks:{
      beforeCreate: function(user,options,sendback){
        if(user.password){
          bcrypt.hash(user.password,10,function(err,hash){
            if(err) throw err;
            user.password=hash;
            sendback(null,user);
          });
        } else {
          sendback(null,user);
        }
      }
    }
  });
  return user;
};