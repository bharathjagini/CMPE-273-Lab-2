const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var timezoneSchema = new Schema({
    _id: {type: Number, required: true},
    timezoneName: {type: String,unique:true, required: true},
    timezoneValue: {type: String,unique:true, required: true},
    createdBy: {type: String, required: true},
    createdDate: {type: Date, required: true},
    modifiedBy: {type: String, required: false},
    modifiedDate:{type: Date, required: false},   
},
{
    versionKey: false
});

const timezoneModel = mongoose.model('timezones', timezoneSchema);
module.exports = timezoneModel;