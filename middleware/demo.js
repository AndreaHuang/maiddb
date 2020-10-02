module.exports = function (req, res, next) {
  req.on("end", function () {
    console.log(res.body);
    console.log("on request end");
  });
  next();
};
