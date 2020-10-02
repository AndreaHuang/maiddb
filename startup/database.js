const mongoose = require("mongoose");
const config = require("config");
const winston = require("winston");

const database = config.get("database");
module.exports = function () {
  mongoose.connect(
    database,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
      winston.info(`Connected to database ${database}`);
    }
  );
};
