const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var languageSchema = new Schema({
    _id: {type: Number, required: true},
    languageName: {type: String,unique:true, required: true},
    languageValue: {type: String,unique:true, required: true},
    createdBy: {type: String, required: true},
    createdDate: {type: Date, required: true},
    modifiedBy: {type: String, required: false},
    modifiedDate:{type: Date, required: false},   
},
{
    versionKey: false
});

const languageModel = mongoose.model('languages', languageSchema);
module.exports = languageModel;