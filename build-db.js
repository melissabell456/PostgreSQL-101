'use strict';

const models = require("./models");
const { directors } = require("./seeders/data/directors");
const { shows } = require("./seeders/data/shows");
const { users } = require("./seeders/data/users");

models.sequelize.sync({ force: true })
.then( () => {
  return models.Director.bulkCreate(directors)
  .then( () => {
    return models.Show.bulkCreate(shows)
  })
  .then( () => {
    return models.User.bulkCreate(users)
  })
  .then( () => {
    process.exit();
  })
})