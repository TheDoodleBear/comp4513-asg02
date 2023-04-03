require("dotenv").config();
const express = require("express");
const app = express();

// serves up static files from the public folder.
app.use(express.static("public"));
// also add a path to static
app.use("/static", express.static("public"));

// get database data model
const Movie = require("./models/Movie");

// tell node to use json and HTTP header features in body-parser
app.use(express.urlencoded({extended: true}));

// Route handlers
const moviesRouter = require("./handlers/moviesRouter.js");
moviesRouter.handleAllMovies(app, Movie);
moviesRouter.handleSingleMovie(app, Movie);
moviesRouter.handleMoviebyYear(app, Movie);

// Establish Connection to database
require("./handlers/dbConnection.js").connect();

// Show error if status returns 404
app.use(function(req, res, next) {
  res.status(404).send("Can't find what you are looking for, Sorry!");
});

const port = process.env.port;
app.listen(port, () => {
  console.log("Server up and listening at port = " + port);
});
