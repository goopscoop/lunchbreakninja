"use strict";
module.exports = function(sequelize, DataTypes) {
  var categoriesusers = sequelize.define("categoriesusers", {
    userId: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return categoriesusers;
};