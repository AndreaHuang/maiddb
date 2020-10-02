// const mongoose = require("mongoose");
// const metaPaginatedSchema = new mongoose.Schema({
//   totalRecords: Number,
//   totalPages: Number,
//   returnAllRecords: {
//     type: Boolean,
//     default: false,
//   },
//   recordsPerPage: Number,
//   currentPage: Number,
//   previousPage: Number,
//   nextPage: Number,
//   firstPage: Number,
//   lastPage: Number,
// });
// const MetaPaginated = mongoose.model("MetaPaginated", metaPaginatedSchema);

function MetaPaginated() {
  this.returnAllRecords = false;
  this.totalRecords = undefined;

  this.recordsPerPage = undefined;

  this.currentPage = undefined;
  this.firstPage = undefined;
  this.previousPage = undefined;
  this.nextPage = undefined;
  this.lastPage = undefined;
}

module.exports = MetaPaginated;
