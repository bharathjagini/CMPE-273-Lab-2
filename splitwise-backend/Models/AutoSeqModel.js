const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var autoSeqSchema = new Schema({
    _id: {type: String, required: true},
    value: {type: Number, required: true}   
},
{
    versionKey: false
});

const autoSeqModel = mongoose.model('sequences', autoSeqSchema);
module.exports = autoSeqModel;