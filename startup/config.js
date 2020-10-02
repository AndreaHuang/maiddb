const config = require("config");
const winston = require("winston");
module.exports = function () {
  winston.info("PROCESS.env.NODE_ENV : ", process.env.NODE_ENV);

  if (!config.get("database")) {
    throw new Error("missing config : database");
  }
  if (!config.get("jwtPrivateKey")) {
    throw new Error("missing config : jwtPrivateKey");
  }
};
