const express = require("express");
require("express-async-errors");
const router = express.Router();
const winston = require("winston");

const authz = require("../middleware/authz.js");
const paginatedData = require("../utility/pagination");
const validateRequestBody = require("../utility/validation");
const { Case, joiScheme } = require("../model/case");
const constants = require("../config/constants.js");

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
    const newFiles = req.body.files.map((fileItem) => {
      return {
        _id: fileItem.id,
        name: fileItem.name,
      };
    });
    newCase.files = newFiles;
  }

  await newCase.save();
  winston.info("New Case created", newCase._id.toString());

  return res.status(200).send(newCase._id);
});

module.exports = router;
