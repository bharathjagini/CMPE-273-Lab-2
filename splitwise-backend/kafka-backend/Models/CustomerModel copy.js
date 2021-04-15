const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var customerSchema = new Schema({
    _id: {type: Number, required: true},
    custName: {type: String, required: true},
    custEmail: {type: String,unique:true, required: true},
    custPasswd: {type: String, required: true},
    custPhoneNumber: {type: String, required: false},
    createdBy: {type: String, required: true},
    createdDate: {type: Date, required: true},
    modifiedBy: {type: String, required: false},
    modifiedDate:{type: Date, required: false},
    image: {type: String, required: false},
    currencyId: {type: Number,  ref: 'currencies',required: false},
    timezoneId: {type: Number,  ref: 'timezones',required: false},
    languageId:{type: Number,  ref: 'languages',required: false},
    token:{type: String, required: false}

},
{
    versionKey: false
  
});

const customerModel = mongoose.model('customers', customerSchema);
module.exports = customerModel;