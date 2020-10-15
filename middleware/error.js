const AppError = require("../model/AppError");
const winston = require("winston");
const _ = require("lodash");
module.exports = function (err, req, res, next) {
  if (_.startsWith(err.message, "ValidationError")) {
    winston.error(err.message);
    return res.status(400).send(new AppError("BERR001", err.message));
  } else if (_.startsWith(err.message, "FileNotFound")) {
    winston.error(err.message);
    return res.status(404).send(new AppError("SERR002", err.message));
  }
  //system error, need to return 500
  winston.error(err.message, err);
  res.status(500).send(new AppError("SERR001", err.message));
};
