'use strict';
module.exports = (sequelize, DataTypes) => {
  var Show = sequelize.define('Show', {
    name: DataTypes.STRING,
    network: DataTypes.STRING,
    genre: DataTypes.STRING,
    in_production: DataTypes.BOOLEAN
  }, { tableName: "shows", timestamps: false });
  Show.associate = function(models) {
    // associations can be defined here
    Show.belongsTo(models.Director, {
      foreignKey: "directorId",
      onDelete: "CASCADE"
    });
    Show.belongsToMany(models.User, {
      through: "users_favorites"
    });
  };
  return Show;
};