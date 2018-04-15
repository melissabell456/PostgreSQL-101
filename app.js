"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const app = express();

// middleware stack
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//const { Show, Director, User } = require('models');
// with express, you can add methods to the app.settings
app.set("models", require("./models"))
const { User, Show, Director } = app.get("models");
// could export app if models are needed elsewhere

app.get('/shows', (req, res, next) => {
  Show.findAll({include: [{model: Director}]}) // 'include' takes an array
  .then(shows => {
    res.status(200).json(shows);
  })
})

app.get('/directors', (req, res, next) => {
  Director.findAll({include: [{model: Show}]}) // 'include' takes an array
  .then(directors => {
    res.status(200).json(directors);
  })
})

app.get("/shows/:id", (req, res, next) => {
  Show.findOne({
    raw:true,
    where: {id: req.params.id},
    include: [{ model: Director, attributes: ["name"] }]
  })
  .then(show => {
    res.status(200).json(show);
  })
})

// adding a favorite for a user
app.post("/favorites", ({body: { UserId, ShowId }}, res, next ) => {
  console.log(UserId, ShowId);
  User.findById(UserId)
  .then( SelectedUser => {
    SelectedUser.addFavorites(ShowId)
    .then( (newRecord) => {
      res.status(201).json(newRecord);
    });
  })
});

app.post("/shows", ({body: { name, network, genre, in_production, directorId }}, res, next) => {
  Show.create({name, network, genre, in_production, directorId})
  .then( addedShow => {
    console.log(addedShow);
    res.status(201).json(addedShow);
  });
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
