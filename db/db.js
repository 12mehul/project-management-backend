const mongoose = require("mongoose");

const connectToDB = (url) => {
  mongoose
    .set("strictQuery", false)
    .connect(url)
    .then(() => console.log("Connected to DB"))
    .catch((err) => console.log(err));
};

module.exports = connectToDB;
