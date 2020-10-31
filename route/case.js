const express = require("express");
require("express-async-errors");
const router = express.Router();
const winston = require("winston");
const {ObjectID} = require("mongodb");

const authz = require("../middleware/authz.js");
const objectId = require("../middleware/objectId");
const paginatedData = require("../utility/pagination");
const validateRequestBody = require("../utility/validation");
const { Case, joiScheme } = require("../model/case");
const constants = require("../config/constants.js");

router.get("/:id",objectId, async (req, res) => {
 
  const caseId = req.params.id;
  const result = await Case.findById(caseId);
  if(!result){
    res.status(404);
  }else{
    res.send(result);
  }
});

router.get("/", async (req, res) => {
  const searchKeyword = req.query.search;
  const sortBy={reportDate:"desc"};
  let filter = {};
  if (searchKeyword) {
    filter["maid.name"] = new RegExp(searchKeyword, "i");
  }
  const result = await paginatedData(Case, filter,sortBy)(req, res);
  res.send(result);
});

router.post("/", authz, async (req, res) => {
  validateRequestBody(joiScheme, req.body);

  let newCase = new Case({
    maid: {
      name: req.body.maid.name,
      nationality: req.body.maid.nationality,
      birthday: req.body.maid.birthday,
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
      postDate: req.body.reference.postDate.split("T")[0],
    };
     newCase.reportDate = newCase.reference.postDate;
  } else{
    newCase.reportDate = newCase.postDate.toISOString().split("T")[0];
  }
 
  //handle files is any
  if (req.body.files) {
    const newFiles = req.body.files.map((fileItem) => 
      fileItem.id);
    newCase.files = newFiles;
  }

  await newCase.save();
  winston.info("New Case created", newCase._id.toString());

  return res.status(200).send(newCase._id.toString());
});

module.exports = router;
