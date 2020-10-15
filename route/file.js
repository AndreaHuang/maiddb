const express = require("express");
require("express-async-errors");
const router = express.Router();

const { readFile, getUploadStorage } = require("../model/appFile");

const upload = getUploadStorage();

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  if (id) {
    const result = await readFile(res, id);
  } else {
    return res.status(400).send();
  }
});

router.post("/", upload.array("files", 1), async (req, res) => {
  console.log(req.files);
  res.send(req.files[0].id.toString());
});

module.exports = router;
