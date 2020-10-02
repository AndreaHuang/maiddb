const config = require("config");
const express = require("express");
require("express-async-errors");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const winston = require("winston");

const constants = require("../config/constants");
const paginatedData = require("../utility/pagination");
const validateRequestBody = require("../utility/validation");
const validatePasswordComplexity = require("../utility/validationPasswordComplexity");
const authz = require("../middleware/authz");

const { User, joiSchema } = require("../model/user");
const roundsOfSalt = config.get(constants.CONFIG_ROUNDOFSALT)
  ? parseInt(config.get(constants.CONFIG_ROUNDOFSALT))
  : 10;

router.get("/me", authz, async (req, res) => {
  let user = await User.findById(req.user._id).exec();
  if (!user) {
    return res.status(400).send(constants.ERROR.BERROR006);
  }

  let returned = _.pick(user, ["name", "email"]);
  return res.send(returned);
});

router.post("/", async (req, res) => {
  //Validate the input
  validateRequestBody(joiSchema, req.body);
  validatePasswordComplexity(req.body.password);

  //Check if email already registered
  let user = await User.findOne({ email: req.body.email }).exec();

  if (user) {
    return res.status(400).send(constants.ERROR.BERROR002);
  }
  //Check if name is already in use
  user = await User.findOne({ name: req.body.name }).exec();

  if (user) {
    return res.status(400).send(constants.ERROR.BERROR003);
  }

  user = new User(_.pick(req.body, ["name", "email"]));
  //hash the password
  user.password = await bcrypt.hash(req.body.password, roundsOfSalt);
  await user.save();
  const result = _.pick(user, ["name", "email", "_id"]);
  winston.info("New user created: ", result);

  const token = user.generateAuthToken();
  return res.header(constants.HEADER_AUTH_TOKEN, token).send(result);
});

module.exports = router;
