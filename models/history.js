"use strict";
module.exports = function(sequelize, DataTypes) {
  var history = sequelize.define("history", {
    userId: DataTypes.INTEGER,
    restaurant: DataTypes.STRING,
    lat: DataTypes.FLOAT,
    lng: DataTypes.FLOAT,
    phone: DataTypes.STRING,
    like: DataTypes.BOOLEAN,
    meh: DataTypes.BOOLEAN,
    reviewed: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.history.belongsTo(models.user);
      }
    }
  });
  return history;
};