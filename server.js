require("dotenv").config();
const path = require("path");
const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("express-flash");
const passport = require("passport");
const checkLogin = require("./scripts/authCheck.js");

// Establish Connection to database
require("./handlers/dbConnection.js").connect();

const app = express();

// get database data model
const Movie = require("./models/Movie");

// tell node to use json and HTTP header features in body-parser
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Express session
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// use express flash, which will be used for passing messages
app.use(flash());

// Require the passport authentication
require("./scripts/userAuth.js");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// serves up static files from the public folder.
app.use("/static", express.static(path.join(__dirname, "/public")));
app.use(express.static("public"));

// Route handlers for Movies
const moviesRouter = require("./handlers/moviesRouter.js");
moviesRouter.handleAllMovies(app, Movie);
moviesRouter.handleMovieLimit(app, Movie);
moviesRouter.handleMovieID(app, Movie);
moviesRouter.handleMovieTMDB(app, Movie);
moviesRouter.handleMoviebyYear(app, Movie);
moviesRouter.handleMoviebyRating(app, Movie);
moviesRouter.handleMovieTitle(app, Movie);
moviesRouter.handleMovieGenre(app, Movie);

// Homepage that also checks if user is logged in.
app.get("/", checkLogin.checkAuthentication, (req, res) => {
  res.render("home.ejs", {user: req.user});
});

// login and logout routers here
app.get("/login", (req, res) => {
  res.render("login.ejs", {message: req.flash("error")});
});

app.post(
  "/login",
  // use passport authentication to see if valid login
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
  })
);

app.get("/logout", (req, resp) => {
  req.logout();
  req.flash("info", "You were logged out");
  resp.render("login", {message: req.flash("info")});
});

// Show error if status returns 404
app.use(function(req, res, next) {
  res.status(404).send("Can't find what you are looking for, Sorry!");
});

const port = process.env.PORT || 1000;
app.listen(port, () => {
  console.log("Server up and listening at port = " + port);
});
