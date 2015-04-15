"use strict";
module.exports = function(sequelize, DataTypes) {
  var category = sequelize.define("category", {
    category: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.category.hasMany(models.user);
      }
    }
  });
  return category;
};