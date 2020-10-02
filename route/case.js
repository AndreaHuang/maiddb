const express = require("express");
require("express-async-errors");
const router = express.Router();
//const _ = require("lodash");

const authz = require("../middleware/authz.js");
const AppError = require("../model/AppError");
const paginatedData = require("../utility/pagination");
const validateRequestBody = require("../utility/validation");

const { Case, joiScheme } = require("../model/case");
const { request } = require("express");
const constants = require("../config/constants.js");
const winston = require("winston/lib/winston/config");
router.get("/", async (req, res) => {
  const filter = {};
  const result = await paginatedData(Case, filter)(req, res);
  res.send(result);
});
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const result = await Case.findById(id);
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
    reference: {
      source: req.body.reference.source,
      link: req.body.reference.link,
      postDate: req.body.reference.postDate,
    },
    author: {
      _id: req.user._id,
      name: req.user.name,
    },
    postDate: Date.now(),
    status: constants.STATUS_CASE.SAVED,
  });

  await newCase.save();
  winston.info("New Case created", newCase._id + " for " + newCase.maid.name);

  return res.status(200).send(newCase);
});

module.exports = router;
