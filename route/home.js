const pug = require("pug");
const express = require("express");
const router = express.Router();
const config = require("config");
router.get("/", (req, res) => {
  res.render("../view/home.pug", {
    title: config.get("name"),
    message: "Welcome to Maid DB",
  });
});
module.exports = router;
