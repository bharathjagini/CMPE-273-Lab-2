const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var currencySchema = new Schema({
    _id: {type: Number, required: true},
    currencyName: {type: String,unique:true, required: true},
    currencyValue: {type: String,unique:true, required: true},
    createdBy: {type: String, required: true},
    createdDate: {type: Date, required: true},
    modifiedBy: {type: String, required: false},
    modifiedDate:{type: Date, required: false},   
},
{
    versionKey: false,
      collection: 'currency' 
});

const currencyModel = mongoose.model('currency', currencySchema);
module.exports = currencyModel;