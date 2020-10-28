const mongoose = require("mongoose");
const { Schema } = mongoose;
const fileSchema =  new Schema({
    url:{
        type:String,
    },
    originalName:{
        type:String,
        required:true
    },
    size:{
        type:Number,
        required:true
    },
    encoding:{
        type:String
    },
    uploadBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
});

const AppFile = mongoose.model("AppFile", fileSchema);

module.exports = { AppFile };