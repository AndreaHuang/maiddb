const AppError = require("../model/AppError");
const winston = require("winston");
const jwt = require("jsonwebtoken");
const config = require("config");

const constants = require("../config/constants");

module.exports = function (req, res, next) {
  if (!req.user.isAdmin) {
    return res.status(403).send(constants.ERROR.BERROR007);
  }
  next();
};
