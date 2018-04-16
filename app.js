"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const app = express();

// middleware stack
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public', { extensions: "html"}));

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
    SelectedUser.addFavorite(ShowId)
    .then( (newRecord) => {
      res.status(201).json(newRecord);
    });
  })
});

// adding a favorite for a user
app.post("/directors", (req, res, next ) => {
  console.log(req.body);
  Director.create(req.body)
  .then( (addedDirector) => {
    res.status(201).json(addedDirector);
  })
});

//if the req.body includes a showId attribute, it adds to the users_favorites join table, if not, updates existing user.
app.put("/users/:id", (req, res, next) => {
  User.findById(req.body.id)
  .then( (foundUser) => {
    const func = req.body.ShowId ? "addFavorite" : "update";
    foundUser[func](req.body.ShowId || req.body)
    .then( (item) => {
      res.status(201).json
    });
  });
});

app.post("/shows", ({body: { name, network, genre, in_production, directorName }}, res, next) => {
  Director.find({
    where: { name: directorName }
  })
  .then((selectedDirector) => {
    const directorId = selectedDirector.id;
    Show.create({name, network, genre, in_production, directorId})
    .then( addedShow => {
      console.log(addedShow);
      res.status(201).json(addedShow);
    });
  })
})

app.post("/directors", ({body: { name, birth_year, twitter_handle }}, res, next) => {
  console.log( name, birth_year, twitter_handle);
  Director.create({name, birth_year, twitter_handle})
  .then( addedDirector => {
    console.log(addedDirector);
    res.status(201).json(addedDirector);
  });
})

app.patch('/shows/:id', ({ params: { id }, body: { updates } }, res) => {
  Show.find({
    where: { id: id }
  })
    .then(showQ => {
      return showQ.updateAttributes(updates)
    })
    .then(updatedShow => {
      res.status(201).json(updatedShow);
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
