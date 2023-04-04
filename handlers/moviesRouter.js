// Query and return all movies from the database
const handleAllMovies = (app, Movie) => {
  app.get("/api/movies", (req, resp) => {
    Movie.find()
      .then(data => {
        if (!data.length) {
          resp.json({message: "No data found"});
        } else {
          resp.json(data);
        }
      })
      .catch(err => {
        resp.json({message: "Unable to establish connection to Movies"});
      });
  });
};

// Query and return limit number of movies from the database based on input
const handleMovieLimit = (app, Movie) => {
  app.get("/api/movies/limit/:num", (req, resp) => {
    if (req.params.num < 1 || req.params.num > 200) {
      resp.json({
        message: "Invalid Parameter. value range should be between 1 - 200"
      });
    } else {
      // Retrieve all Movie information from Database
      Movie.find()
        .limit(req.params.num)
        .then(data => {
          if (!data.length) {
            resp.json({message: "No data found"});
          } else {
            resp.json(data);
          }
        })
        .catch(err => {
          resp.json({message: "Unable to establish connection to Movies"});
        });
    }
  });
};

// Query and return a single movie based on the ID input
const handleMovieID = (app, Movie) => {
  app.get("/api/movies/:id", (req, resp) => {
    Movie.find({id: req.params.id})
      .then(data => {
        if (!data.length) {
          resp.json({message: "No data found"});
        } else {
          resp.json(data);
        }
      })
      .catch(err => {
        resp.json({message: "Unable to establish connection to Movies"});
      });
  });
};

// Query and return a single movie based on the tmdb_ID input
const handleMovieTMDB = (app, Movie) => {
  app.get("/api/movies/tmdb/:id", (req, resp) => {
    Movie.find({tmdb_id: req.params.id})
      .then(data => {
        console.log(data);
        if (!data.length) {
          resp.json({message: "No data found"});
        } else {
          resp.json(data);
        }
      })
      .catch(err => {
        resp.json({message: "Unable to establish connection to Movies"});
      });
  });
};

// Query and return movies contains string (title) input
const handleMovieTitle = (app, Movie) => {
  app.get("/api/movies/title/:text", (req, resp) => {
    Movie.find({title: {$regex: req.params.text, $options: "i"}})
      .then(data => {
        if (!data.length) {
          resp.json({message: "No data found"});
        } else {
          resp.json(data);
        }
      })
      .catch(err => {
        resp.json({message: "Unable to establish connection to Movies"});
      });
  });
};

// Query and return movies based on the genre name input (Exact Match)
const handleMovieGenre = (app, Movie) => {
  app.get("/api/movies/genre/:name", (req, resp) => {
    Movie.find({
      "details.genres.name": {
        $regex: "^" + req.params.name + "$",
        $options: "i"
      }
    })
      .then(data => {
        if (!data.length) {
          resp.json({message: "No data found"});
        } else {
          resp.json(data);
        }
      })
      .catch(err => {
        resp.json({message: "Unable to establish connection to Movies"});
      });
  });
};

// Query and return movies withing the range of years input
const handleMoviebyYear = (app, Movie) => {
  app.get("/api/movies/year/:min/:max", (req, resp) => {
    if (req.params.min > req.params.max) {
      resp.json({
        message:
          "Invalid Parameter. Initial value should be less than the succeeding value"
      });
    } else {
      const startDate = req.params.min + "-01-01";
      const endDate = req.params.max + "-11-31";
      Movie.find({
        release_date: {$gte: startDate, $lte: endDate}
      })
        .sort({release_date: 1})
        .then(data => {
          if (!data.length) {
            resp.json({message: "No data found"});
          } else {
            resp.json(data);
          }
        })
        .catch(err => {
          resp.json({message: "Unable to establish connection to Movies"});
        });
    }
  });
};

// Query and return movies withing the range of rating input
const handleMoviebyRating = (app, Movie) => {
  app.get("/api/movies/ratings/:min/:max", (req, resp) => {
    if (req.params.min > req.params.max) {
      resp.json({
        message:
          "Invalid Parameter. Initial value should be less than the succeeding value"
      });
    } else {
      Movie.find()
        .where("ratings.average")
        .gte(req.params.min)
        .lte(req.params.max)
        .sort({"ratings.average": 1})
        .exec()
        .then(data => {
          if (!data.length) {
            resp.json({message: "No data found"});
          } else {
            resp.json(data);
          }
        })
        .catch(err => {
          resp.json({message: "Unable to establish connection to Movies"});
        });
    }
  });
};

module.exports = {
  handleAllMovies,
  handleMovieLimit,
  handleMovieID,
  handleMovieTMDB,
  handleMoviebyYear,
  handleMoviebyRating,
  handleMovieTitle,
  handleMovieGenre
};
