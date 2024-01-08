const mongooes = require("mongoose");

require("dotenv").config();

const dbConnect = () => {
  mongooes
    .connect("mongodb://localhost:27017/telegram-bot", {})
    .then(() => console.log("DB connect ho gaya"))
    .catch((error) => {
      console.log("Issue in db connection");
      console.error(error.message);
      process.exit(1);
    });
};

module.exports = dbConnect;
