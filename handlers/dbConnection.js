require("dotenv").config();
const connect = () => {
  const mongoose = require("mongoose");
  const opt = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    dbName: "comp4513-asg02"
  };
  console.log("Initiating connection to database, please wait...");
  mongoose.connect(process.env.MONGO_URL, opt);
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", () => {
    console.log("Connection to database established. Please proceed");
  });
};

module.exports = {
  connect
};
