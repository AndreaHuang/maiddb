const mongoose = require("mongoose");
const config = require("config");
const winston = require("winston");

const database = config.get("database");
module.exports = () => {
  mongoose.connect(
    database,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    },
    (err) => {
      if (err) {
        winston.error(
          `error when connect to to database ${database}, details: ${ex.message}`
        );
        process.exit(-1);
      } else {
        winston.info(`Connected to database ${database}`);
      }
    }
  );
};
