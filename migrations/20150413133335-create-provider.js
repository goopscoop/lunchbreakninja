"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable("providers", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      pid: {
        type: DataTypes.STRING
      },
      token: {
        type: DataTypes.STRING
      },
      type: {
        type: DataTypes.STRING
      },
      userId: {
        type: DataTypes.INTEGER
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
    migration.dropTable("providers").done(done);
  }
};