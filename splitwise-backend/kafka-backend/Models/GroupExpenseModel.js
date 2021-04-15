const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var grpExpSchema = new Schema({
    _id: {type: Number, required: true},
    expenseDesc: {type: String, required: true},
    amount: {type: Number, required: true},
    createdBy: {type: String, required: true},
    createdDate: {type: Date, required: true},
    createdByCustId:{type:Number,ref:"customers",required:true},
    groupId:{type:Number,ref:"groups",required:true}  
},
{
    versionKey: false,
     collection: 'groupExpenses' 
});

const groupExpensesModel = mongoose.model('groupExpenses', grpExpSchema);
module.exports = groupExpensesModel;