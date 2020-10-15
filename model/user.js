const mongoose = require("mongoose");
const { Schema } = mongoose;
const Joi = require("joi");
const config = require("config");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

const daysOfJwtValidness = config.get("daysOfJwtValidness")
  ? parseInt(config.get("daysOfJwtValidness"))
  : 7;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 100,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

UserSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    _.pick(this, ["_id", "email", "name", "verified", "isAdmin"]),
    config.get("jwtPrivateKey"),
    { expiresIn: daysOfJwtValidness * 24 * 3600 }
  );
};

const User = mongoose.model("User", UserSchema);

const joiSchema = Joi.object({
  name: Joi.string().required().min(5).max(50),
  email: Joi.string().required().email(),
  password: Joi.string().required().min(6).max(20),
}).required();

module.exports = { User, joiSchema };
