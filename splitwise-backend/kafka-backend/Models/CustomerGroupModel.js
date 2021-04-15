const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var customerGroupSchema = new Schema({
    _id: {type: Number, required: true},
    groupId: {type: Number, ref: 'groups',required: true},
    custId: {type: Number,  ref: 'customers',required: true},
    createdBy: {type: String, required: true},
    createdDate: {type: Date, required: true},
    modifiedBy: {type: String, required: false},
    modifiedDate:{type: Date, required: false},
    removedMember: {type: Boolean,default:false, required: true},
    inviteAccepted:{type: Boolean,default:false, required: true},
    createdByCustId:{type:Number,required:true}
},
{
    versionKey: false
});

const customerGroupModel = mongoose.model('custGroups', customerGroupSchema);
module.exports = customerGroupModel;