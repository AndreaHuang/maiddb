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

const { AppFile } = require("../model/appFile_Buffer");

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  if (id) {
    console.log;
    let appFile = await AppFile.findById(id).exec();
    if (!appFile) {
      return res.status(404).send();
    } else {
      return res.set("content-type", appFile.type).send(appFile.data);
    }
  } else {
    return res.status(400).send();
  }
});

module.exports = router;
