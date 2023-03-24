require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const mongoDb = require('./database/mongoDb');
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const User = require("./models/User")


// Connecting to the database. 
const db = mongoDb.getInstance();
db.connect();

const app = express();

// A middleware that parses the body of the request. 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// This is a middleware that creates a session.
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id).then(user => {
    done(null, user);
  });
});

// This is a CORS middleware. It allows the server to accept requests from a different domain. 
const corsOptions = {
  origin: ['http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200 
}
app.use(cors(corsOptions));

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
