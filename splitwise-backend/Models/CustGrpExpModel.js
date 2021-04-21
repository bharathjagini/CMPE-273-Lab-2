const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var custGrpExpSchema = new Schema({
    _id: {type: Number, required: true},
    amount: {type: Number, required: true},
    createdBy: {type: String, required: true},
    createdDate: {type: Date, required: true},
    createdByCustId:{type:Number, ref: 'customers',required:true},
    groupId:{type:Number,ref:'groups',required:true},
    paidByCustId:{type:Number,  ref: 'customers',required:true},
    oweByCustId:{type:Number, ref: 'customers',required:true},
    expenseId:{type:Number,ref: 'groupExpenses',required:true},
    settledUp:{type:Boolean,required:true}
},
{
    versionKey: false,
       collection: 'custGroupExpenses' 
});

const custGroupExpensesModel = mongoose.model('custGroupExpenses', custGrpExpSchema);
module.exports = custGroupExpensesModel;