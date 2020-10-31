const mongoose = require("mongoose");
const winston = require("winston");
const stream = require("stream");
const path=require("path");
const config = require("config");

const multer = require("multer");
const {Storage} = require("@google-cloud/storage");
const constants = require("../config/constants");
const {AppFile} = require("../model/appFile");


const bucketName=config.get(constants.CONFIG_GCP_BUCKET);// "maiddb-files";
const projectId=config.get(constants.CONFIG_GCP_PROJECID);//"maiddb";
const gcpUrl=config.get(constants.CONFIG_GCP_STORAGE_URL);//"https://storage.cloud.google.com/";
const credentialFile=path.join(__dirname,"../maiddb-files-gcp-credential.json");
const dummyExtension = ".png";
const storage = new Storage({
    projectId: projectId,
    keyFilename: credentialFile
  });
const bucket = storage.bucket(bucketName);


const getUrl=(id)=>{
 return path.join(gcpUrl,bucketName,id)+dummyExtension;
}

const writeFile =  (file,user)=> {
    console.log(file);
        
    return new Promise((resolve, reject) => {
        let appFile = new AppFile();
      
        const gcpStream = bucket.file(appFile._id+dummyExtension,{

        }).createWriteStream({
            resumable:false,
            metadata:{
                contentType:file.mimetype,
            }
        })
        .on("error", (error) => {
            winston.error("Hit and error ", error);
            reject( constants.ERROR.SERROR002);
        })
        .on("finish",()=>{
            winston.debug("uploaded");
            const url= getUrl(appFile._id.toString());
            
            appFile.originalName = file.originalname;
            appFile.size=file.size;
            appFile.encoding = file.encoding;
            appFile.uploadBy = user._id;
            appFile.url= url;
            appFile.save();

            resolve ({"url":appFile.url});
        });

         const bufferStream = stream.PassThrough();
         bufferStream.end(file.buffer);
         bufferStream.pipe(gcpStream);
         });
}

module.exports = {writeFile,getUrl};


