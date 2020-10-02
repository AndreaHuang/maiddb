const AppError = require("../model/AppError");
const winston = require("winston");
const jwt = require("jsonwebtoken");
const config = require("config");

const constants = require("../config/constants");

module.exports = function (req, res, next) {
  const token = req.header(constants.HEADER_AUTH_TOKEN);
  if (!token) {
    return res.status(401).send(constants.ERROR.BERROR005);
  }
  try {
    const decoded = jwt.verify(
      token,
      config.get(constants.CONFIG_JWT_PRIVATE_KEY)
    );
    req.user = decoded;
    next();
  } catch (ex) {
    winston.error(ex.name);
    return res.status(400).send(constants.ERROR.BERROR006);
  }
};
