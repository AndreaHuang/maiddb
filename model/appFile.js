const mongoose = require("mongoose");
const winston = require("winston");
const { GridFSBucket, ObjectID } = require("mongodb");
const config = require("config");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");

const database = config.get("database");

const getUploadStorage = () => {
  winston.debug("-------getUploadStorage() is called------");
  const storage = new GridFsStorage({
    url: database,
    options: { useUnifiedTopology: true },
  });
  const upload = multer({ storage });
  return upload;
};

const readFile = (res, _id) => {
  winston.debug(`-------readFile() is called for ${_id}------`);
  return new Promise((resolve, reject) => {
    const connection = mongoose.connection;
    const bucket = new GridFSBucket(connection.db);
    bucket
      .openDownloadStream(new ObjectID(_id))

      .on("file", () => {
        winston.debug("found the file");
      })
      .on("error", (error) => {
        reject({ message: error.message });
      })
      .on("end", () => {
        winston.debug("done retreiving the file");
        resolve();
      })
      .pipe(res); //Must put pipe to the last so that the error can be handled
  });
};
module.exports = { getUploadStorage, readFile };
