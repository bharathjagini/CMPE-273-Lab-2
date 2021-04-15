const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var groupSchema = new Schema({
    _id: {type: Number, required: true},
    groupName: {type: String,unique:true, required: true},
    createdBy: {type: String, required: true},
    createdDate: {type: Date, required: true},
    modifiedBy: {type: String, required: false},
    modifiedDate:{type: Date, required: false},
    createdByCustId:{type: Number, required: true}
   
},
{
    versionKey: false
});
// groupSchema.method('transform', function() {
//     var obj = this.toObject();

//     //Rename fields
//     obj.groupId = obj._id;
//     delete obj._id;

//     return obj;
// });
const groupModel = mongoose.model('groups', groupSchema);
module.exports = groupModel;