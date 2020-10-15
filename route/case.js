const express = require("express");
require("express-async-errors");
const router = express.Router();
const winston = require("winston");
//const _ = require("lodash");

const authz = require("../middleware/authz.js");
const AppError = require("../model/AppError");
const paginatedData = require("../utility/pagination");
const validateRequestBody = require("../utility/validation");

const { Case, joiScheme } = require("../model/case");

const constants = require("../config/constants.js");
const { AppFile } = require("../model/appFile_Buffer");

// const { saveFile } = require("../model/appFile");
const mongoose = require("mongoose");
const { createModel } = require("mongoose-gridfs");
const { Readable } = require("stream");

saveFiles = async (filesFromRequest) => {
  const files = [];
  for (let index = 0; index < filesFromRequest.length; index++) {
    const newFile = await saveFile(filesFromRequest[index]);
    console.log("after call saveFile", newFile);
    if (newFile) {
      files.push(newFile);
    }
  }
  console.log(files);
  return files;
};
saveFile_Buffer = async (fileItem) => {
  const newFile = new AppFile({
    data: Buffer.from(fileItem.data, "base64"),
    name: fileItem.name,
    type: fileItem.type,
    size: fileItem.size,
    lastModified: fileItem.lastModified,
  });
  await newFile.save();
  winston.info("New file saved ", newFile._id);
  return { _id: newFile._id, name: newFile.name };
};

saveFile = ({ data, name, type }) => {
  const connection = mongoose.connection;
  const AppFileModel = createModel({
    modelName: "AppFileModel",
    connection: connection,
  });

  // create Node Read Stream
  const readStream = Readable.from(data);

  const options = { filename: name, contentType: type };
  return new Promise((resolve, reject) => {
    AppFileModel.write(options, readStream, (error, file) => {
      if (error) {
        reject({ message: error.message });
      } else {
        console.log(file);
        // resolve(JSON.stringify());
        resolve({ _id: file._id, name: file.filename });
      }
    });
  });
};

router.get("/", async (req, res) => {
  const filter = {};
  const result = await paginatedData(Case, filter)(req, res);
  res.send(result);
});

router.post("/", authz, async (req, res) => {
  validateRequestBody(joiScheme, req.body);

  let newCase = new Case({
    maid: {
      name: req.body.maid.name,
      nationality: req.body.maid.nationality,
      yearOfBirth: req.body.maid.yearOfBirth,
      monthOfBirth: req.body.maid.monthOfBirth,
    },
    categories: req.body.categories,
    details: req.body.details,
    author: {
      _id: req.user._id,
      name: req.user.name,
    },
    postDate: Date.now(),
    status: constants.STATUS_CASE.SAVED,
  });

  if (req.body.reference) {
    newCase.reference = {
      source: req.body.reference.source,
      link: req.body.reference.link,
      postDate: req.body.reference.postDate,
    };
  }
  //handle files is any
  if (req.body.files) {
    newCase.files = await saveFiles(req.body.files);
  }

  await newCase.save();
  winston.info("New Case created", newCase._id);

  return res.status(200).send(newCase._id);
});

module.exports = router;
