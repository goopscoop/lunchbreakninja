"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable("histories", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      userId: {
        type: DataTypes.INTEGER
      },
      restaurant: {
        type: DataTypes.STRING
      },
      lat: {
        type: DataTypes.FLOAT
      },
      lng: {
       type: DataTypes.FLOAT
      },
      phone: {
        type: DataTypes.STRING
      },
      like: {
        type: DataTypes.BOOLEAN
      },
      meh: {
        type: DataTypes.BOOLEAN
      },
      reviewed: {
        type: DataTypes.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    }).done(done);
  },
  down: function(migration, DataTypes, done) {
    migration.dropTable("histories").done(done);
  }
};