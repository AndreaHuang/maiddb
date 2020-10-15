const mongoose = require("mongoose");
const { Schema } = mongoose;
const config = require("config");
const _ = require("lodash");

const AppFileSchema = new mongoose.Schema({
  data: {
    type: Buffer,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  lastModified: {
    type: Number,
  },
});

AppFileSchema.methods.returnAsUrl = function () {
  return;
};

const AppFile = mongoose.model("AppFile", AppFileSchema);

module.exports = { AppFileSchema, AppFile };
