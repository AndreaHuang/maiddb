const mongoose = require("mongoose");
const { createModel } = require("mongoose-gridfs");
const { Readable } = require("stream");
const winston = require("winston");

let AppFile;
const initAppFile = () => {
  winston.info("initiaiing AppFile");
  const connection = mongoose.connection;
  AppFile = createModel({
    modelName: "AppFile",
    connection: connection,
  });
  console.log(AppFile);
  //   Object.freeze(AppFile);
};

const saveFile = ({ data, name, type }) => {
  // create Node Read Stream
  const readStream = Readable.from(data);

  const options = { filename: name, contentType: type };
  return new Promise((resolve, reject) => {
    AppFile.write(options, readStream, (error, file) => {
      if (error) {
        reject({ message: error.message });
      } else {
        console.log(file);
        resolve(JSON.stringify({ _id: file._id }));
      }
    });
  });
};

module.exports = { initAppFile, saveFile };
