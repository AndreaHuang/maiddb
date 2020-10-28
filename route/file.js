const express = require("express");
require("express-async-errors");
const router = express.Router();
var multer  = require('multer')
var upload = multer()

const authz = require("../middleware/authz.js");
const {writeFile } = require("../storage/googleCloudStorageAppFile");

router.post("/", authz, upload.array("files",1),async (req, res) => {
 const result = await writeFile(req.files[0],req.user);

 if(result.url){
   res.status(201).send(result.url);
 } else if(result.error){
   res.status(500).send(result.error);
 }
 
});

module.exports = router;
