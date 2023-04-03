const handleAllMovies = (app, Movie) => {
  app.get("/api/movies", (req, resp) => {
    // Retrieve all Movie information from Database
    Movie.find()
      .then(data => {
        resp.json(data);
      })
      .catch(err => {
        resp.json({message: "Unable to establish connection to Movies"});
      });
  });
};

// handle requests for specific book: e.g., /api/books/0321886518
const handleSingleMovie = (app, Movie) => {
  app.get("/api/movies/:id", (req, resp) => {
    Movie.find({id: req.params.id})
      .then(data => {
        resp.json(data);
      })
      .catch(err => {
        resp.json({message: "Unable to establish connection to Movies"});
      });
  });
};

// handle requests for specific book: e.g., /api/books/0321886518
const handleMoviebyYear = (app, Movie) => {
  app.get("/api/movies/year/:year", (req, resp) => {
    const regex = new RegExp(`^${req.params.year}-`);
    Movie.find({
      release_date: {
        $regex: regex
      }
    })
      .then(data => {
        resp.json(data);
      })
      .catch(err => {
        resp.json({message: "Unable to establish connection to Movies"});
      });
  });
};

module.exports = {
  handleAllMovies,
  handleSingleMovie,
  handleMoviebyYear
};
