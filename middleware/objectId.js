const mongoose = require("mongoose");
const constants = require("../config/constants")

module.exports = function (req, res, next) {
  const id = req.params.id;
  if(!id){
    return res.status(400).send(constants.ERROR.BERROR001);
  }
  const valid = mongoose.Types.ObjectId.isValid(id);
  if(!valid){
   return res.status(400).send(constants.ERROR.BERROR001);
  }

  next();
};
