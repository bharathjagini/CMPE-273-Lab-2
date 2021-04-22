const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var activityLogSchema = new Schema({
    _id: {type: Number, required: true},
    groupId: {type: Number, ref: 'groups',required: false},
    activityType: {type: String, required: true},
    createdBy: {type: String, required: true},
    createdDate: {type: Date, required: true},
    createdByCustId:{type:Number,ref: 'customers',required:true},
    settledWithCustId:{type:Number,ref: 'customers',required:false},
    expenseDesc: {type: String, required: false},
    amount: {type: Number, required: false},
    expenseId: {type: Number, ref:'groupExpenses',required: false}

},
{
    versionKey: false,
    collection: 'activityLog'
});

const activityLogModel = mongoose.model('activityLog', activityLogSchema);
module.exports = activityLogModel;