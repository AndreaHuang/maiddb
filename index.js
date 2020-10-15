const express = require("express");
require("express-async-errors");
const debugger_startup = require("debug")("startup");
const app = express();
const winston = require("winston");

const error = require("./middleware/error");

//start up
require("./startup/logging")();
require("./startup/config")();
require("./startup/database")();
//Test script for unhandled exception or rejection
// throw new Error("Start up failure");
// const p = Promise.reject("Promise rejection");
// p.then(() => {
//   console.log("OK");
// });
//middleware middleware
require("./startup/middleware")(app);
//router handler middleware
require("./startup/route")(app);

//error handling must be the last one
app.use(error);

const port = process.env.PORT || 3001;
const env = app.get("env");

const server = app.listen(port, () => {
  winston.info(`server started on port ${port} for environment ${env} ...`);
});
module.exports = server;
