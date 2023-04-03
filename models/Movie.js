const mongoose = require("mongoose");
// define a schema that maps to the structure of the data in MongoDB
const movieSchema = new mongoose.Schema({
  id: Number,
  tmdb_id: Number,
  imdb_id: String,
  release_date: Date,
  title: String,
  runtime: Number,
  revenue: Number,
  tagline: String,
  poster: String,
  backdrop: String,
  ratings: {
    popularity: Number,
    average: Number,
    count: Number
  },
  details: {
    overview: String,
    genres: [
      {
        id: String,
        name: String
      }
    ]
  }
});
module.exports = mongoose.model("Movie", movieSchema, "movies");
