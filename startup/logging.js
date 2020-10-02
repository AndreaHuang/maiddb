const winston = require("winston");
require("winston-mongodb");
const config = require("config");

module.exports = function () {
  winston.configure({
    level: "info",
    format: winston.format.json(),
  });

  winston.add(
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      handleExceptions: true,
    })
  );
  winston.add(
    new winston.transports.MongoDB({
      db: config.get("database"),
      options: {
        useUnifiedTopology: true,
      },
      level: "info",
      expireAfterSeconds: 3600 * 24 * config.get("daysToRetainInfoLogs"),
      collection: "info-logs",
    })
  );
  winston.add(
    new winston.transports.MongoDB({
      db: config.get("database"),
      options: {
        useUnifiedTopology: true,
      },
      level: "error",
      expireAfterSeconds: 3600 * 24 * config.get("daysToRetainErrorLogs"),
      collection: "error-logs",
      handleExceptions: true,
    })
  );

  if (process.env.NODE_ENV !== "production") {
    winston.add(
      new winston.transports.Console({
        format: winston.format.simple(),
        level: "debug",
        handleExceptions: true,
      })
    );
  }
  //handle uncaughtException, synchronized code
  winston.exceptions.handle(
    new winston.transports.File({
      filename: "logs/uncaughtException.log",
      handleExceptions: true,
    }),
    new winston.transports.Console({
      format: winston.format.simple(),
      level: "error",
      handleExceptions: true,
    }),
    new winston.transports.MongoDB({
      db: config.get("database"),
      options: {
        useUnifiedTopology: true,
      },
      level: "error",
      expireAfterSeconds: 3600 * 24 * config.get("daysToRetainErrorLogs"),
      collection: "unhandledException-logs",
      handleExceptions: true,
    })
  );

  //handle unhandledRejection, asynchronized code
  process.on("unhandledRejection", (ex) => {
    throw ex;
  });
};
