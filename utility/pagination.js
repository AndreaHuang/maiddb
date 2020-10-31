const mongoose = require("mongoose");
const logger = require("winston");
const config = require("config");
const MetaPaginated = require("../model/MetaPaginated");

module.exports = function (Model, filter,sortBy) {
  return async (req, res, next) => {
    const metadata = new MetaPaginated();
    const result = {};
    let limit;
    let skip;
    let totalRecords;
    let data;
    // has query parameter all, then just return all
    if (req.query.all != undefined) {
      metadata.returnAllRecords = true;
      result.meta = metadata;
      if (filter) {
        result.data = await Model.find(filter).sort(sortBy).exec();
      } else {
        result.data = await Model.find().sort(sortBy).exec();
      }
      return result;
    }
    metadata.returnAllRecords = false;
    //if  has query parameter limit

    if (req.query.limit != undefined) {
      limit = parseInt(req.query.limit);
      if (limit < 0) {
        limit = config.get("recordsPerPage");
      }
    }
    //if don't have query parameter limit, use the default value from config
    if (!limit) {
      limit = config.get("recordsPerPage");
    }
    metadata.recordsPerPage = limit;

    // if has query paramter page
    let page = 1;
    if (req.query.page != undefined) {
      let pageParsed = parseInt(req.query.page);
      if (pageParsed > 0) {
        page = pageParsed;
      }
    }
    metadata.currentPage = page;
    skip = limit * (page - 1);

    totalRecords = await Model.countDocuments(filter).exec();
    data = await Model.find(filter).sort(sortBy).skip(skip).limit(limit).exec();

    metadata.totalRecords = totalRecords;
    if (skip > 0) {
      metadata.previousPage = metadata.currentPage - 1;
    }
    if (totalRecords > skip + limit) {
      metadata.nextPage = metadata.currentPage + 1;
    }
    metadata.firstPage = 1;
    metadata.lastPage = Math.ceil(totalRecords / limit);
    result.meta = metadata;
    result.data = data;

    return result;
  };
};
