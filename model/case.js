const mongoose = require("mongoose");
const Joi = require("joi");

const currentYear = new Date().getFullYear();
const minBirthYear = currentYear - 65;
const maxBirthYear = currentYear - 18;

const constants = require("../config/constants");
const ONE_MONTH = 30*24*3600*1000;
const ONE_DAY = 24*3600*1000;
const ONE_HOUR = 3600*1000;

const humanizeDuration =require("humanize-duration"); 

const timeDiffDisplay =(timeDiff)=>{
  if(timeDiff>ONE_DAY){ //
    return humanizeDuration(timeDiff,{ round:true,largest: 1 ,units: ["d"] });
  } else if(timeDiff>ONE_HOUR){
     return humanizeDuration(timeDiff,{ round:true,largest: 1 ,units: ["h"] });
  }else {
     return humanizeDuration(timeDiff,{ round:true,largest: 1 ,units: ["m"] });
  }
}

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
}, (opts = { toJSON: { virtuals: true } }));

CaseSchema.virtual("postDateDisplay").get(function () {
  if(this.reference) return this.reference.postDate;
  const diff =  new Date() - this.postDate ;
  if(diff > ONE_MONTH){
    return this.postDate.toLocaleDateString('en-GB')
  } else {
    return timeDiffDisplay(diff);
  }
});
CaseSchema.virtual("authorDisplay").get(function () {
  if(this.reference) return "";
  else return this.author;
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
        id: Joi.string().required(),
        name: Joi.string().required(),
        type: Joi.string(),
        size: Joi.number().integer(),
        lastModified: Joi.number(),
      })
    ),
}).required();

const Case = mongoose.model("Case", CaseSchema);

module.exports = { Case, joiScheme };
