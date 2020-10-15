const mongoose = require("mongoose");
const Joi = require("joi");

const currentYear = new Date().getFullYear();
const minBirthYear = currentYear - 65;
const maxBirthYear = currentYear - 18;

const constants = require("../config/constants");
const { AppFile } = require("./appFile_Buffer");

const ExternalSourceSchema = new mongoose.Schema({
  source: {
    type: String,
    required: true,
    min: 3,
    max: 100,
  },
  link: {
    type: String,
    required: false,
  },
  postDate: {
    type: String,
    required: true,
  },
});
const AuthorSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
    required: true,
  },
});
const AppFileSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AppFile",
    },
    name: {
      type: String,
      required: true,
    },
  },
  (opts = { toJSON: { virtuals: true } })
);
AppFileSchema.virtual("url").get(function () {
  return "/file/" + this._id;
});
const MaidSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 60,
  },
  nationality: {
    type: String,
    enum: constants.MAID_NATIONALITY.values,
    required: true,
  },
  yearOfBirth: {
    type: Number,
    required: false,
    min: minBirthYear,
    max: maxBirthYear,
  },
  monthOfBirth: {
    type: Number,
    requried: false,
    min: 1,
    max: 12,
  },
});

const CaseSchema = new mongoose.Schema({
  maid: {
    type: MaidSchema,
    required: true,
  },
  categories: {
    type: [String],
    maxlength: 50,
  },
  details: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 5000,
  },
  reference: {
    type: ExternalSourceSchema,
    required: false,
  },
  author: {
    type: AuthorSchema,
    required: false,
  },
  postDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: constants.STATUS_CASE.values,
    required: true,
    default: constants.STATUS_CASE.SAVED,
  },
  files: {
    type: [AppFileSchema],
    maxlength: 10,
  },
});

const joiScheme = Joi.object({
  maid: Joi.object({
    name: Joi.string().required().min(3).max(100),
    nationality: Joi.string()
      .required()
      .valid(
        constants.MAID_NATIONALITY.Idonesia,
        constants.MAID_NATIONALITY.Philippines,
        constants.MAID_NATIONALITY.Thailand
      ),
    yearOfBirth: Joi.number().integer().min(minBirthYear).max(maxBirthYear),
    monthOfBirth: Joi.number().integer().min(1).max(12),
  }).required(),
  categories: Joi.array().max(50),
  details: Joi.string().required().min(5).max(5000),
  reference: Joi.object({
    source: Joi.string().required().min(3).max(100),
    link: Joi.string(),
    postDate: Joi.string().isoDate(),
  }),
  files: Joi.array()
    .max(10)
    .items(
      Joi.object({
        name: Joi.string().required(),
        type: Joi.string().required(),
        data: Joi.string().required(),
        size: Joi.number().integer().required(),
        lastModified: Joi.number(),
      })
    ),
}).required();

const Case = mongoose.model("Case", CaseSchema);

module.exports = { Case, joiScheme };
