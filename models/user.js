'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    username: DataTypes.STRING
  }, { tableName: "users", timestamps: false });
  User.associate = function(models) {
    User.belongsToMany(models.Show, {
      as: "Favorites",
      through: "users_favorites"
    });
    // associations can be defined here
  };
  return User;
};