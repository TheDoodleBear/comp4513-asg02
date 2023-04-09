require("dotenv").config();
const path = require("path");
const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("express-flash");
const passport = require("passport");
const checkLogin = require("./scripts/authCheck.js");
const app = express();

// serves up static files from the public folder.
app.use(express.static("public"));
// also add a path to static
app.use("/static", express.static(path.join(__dirname, "public")));

// get database data model
const Movie = require("./models/Movie");
const User = require("./models/User");

// tell node to use json and HTTP header features in body-parser
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Express session
app.use(cookieParser("oreos"));
app.use(
  session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true
  })
);

// view engine setup
app.set("views", "./views");
app.set("view engine", "ejs");

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// use express flash, which will be used for passing messages
app.use(flash());

// set up the passport authentication
require("./scripts/userAuth.js");

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

// Establish Connection to database
require("./handlers/dbConnection.js").connect();

app.get("/", checkLogin.checkAuthentication, (req, res) => {
  res.render("home.ejs", {user: req.user});
});
app.get("/site/list", checkLogin.checkAuthentication, (req, res) => {
  res.render("list.ejs", {books: controller.getAll()});
});
app.get("/site/book/:isbn", checkLogin.checkAuthentication, (req, res) => {
  res.render("book.ejs", {book: controller.findByISBN10(req.params.isbn)});
});
// login and logout routers here
app.get("/login", (req, res) => {
  res.render("login.ejs", {message: req.flash("error")});
});
app.post("/login", async (req, resp, next) => {
  // use passport authentication to see if valid login
  passport.authenticate("localLogin", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
  })(req, resp, next);
});
app.get("/logout", (req, resp) => {
  req.logout();
  req.flash("info", "You were logged out");
  resp.render("login", {message: req.flash("info")});
});

// Show error if status returns 404
app.use(function(req, res, next) {
  res.status(404).send("Can't find what you are looking for, Sorry!");
});

const port = process.env.port;
app.listen(port, () => {
  console.log("Server up and listening at port = " + port);
});
