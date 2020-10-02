const config = require("config");
const express = require("express");
require("express-async-errors");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const Joi = require("joi");

const winston = require("winston");

const constants = require("../config/constants");
const validateRequestBody = require("../utility/validation");

const { User } = require("../model/user");

const joiSchema = Joi.object({
  email: Joi.string().required().min(5).max(50).email(),
  password: Joi.string().required().min(6).max(20),
}).required();

router.post("/", async (req, res) => {
  //Validate the input
  validateRequestBody(joiSchema, req.body);

  //find the user
  let user = await User.findOne({ email: req.body.email }).exec();

  if (!user) {
    return res.status(400).send(constants.ERROR.BERROR004);
  }

  //compare password
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res.status(400).send(constants.ERROR.BERROR004);
  }

  //Generate token and return
  const token = user.generateAuthToken();

  return res.header(constants.HEADER_AUTH_TOKEN, token).send();
});

module.exports = router;
