const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var expCmntSchema = new Schema({
    _id: {type: Number, required: true},
    commentDesc: {type: String, required: true},
    createdBy: {type: String, required: true},
    createdDate: {type: Date, required: true},
    createdByCustId:{type:Number,required:true},
    expenseId:{type:Number,ref:'groupExpenses',required:true} ,
    deletedComment: {type:Boolean,required:true},
     modifiedBy: {type: String, required: false},
     modifiedDate: {type: Date, required: false},
     modifiedByCustId:{type:Number,required:false}
},
{
    versionKey: false,
     collection: 'expComments' 
});

const expCommentModel = mongoose.model('expComments', expCmntSchema);
module.exports = expCommentModel;