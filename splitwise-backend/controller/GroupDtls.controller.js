const Group = require('../Models/GroupModel');
const autoSeq=require('./AutoSeq.controller');
const CustGroup=require('../Models/CustomerGroupModel')

exports.createGroup= async (req,res)=>{

console.log(req.body);
    const groupId=await autoSeq.getSequenceValue('group');

    console.log('Group Id value::',groupId)
    const newGroup=new Group({
    _id:groupId,
    groupName:req.body.groupName,
    createdBy:req.body.createdCustName,
    createdDate:new Date(),
    createdByCustId:req.body.createdCustId
    })
   const createGroupResponse= await saveGrpDetails(newGroup);
  

     for(const custId of req.body.custIds){
            const custGroupId=await autoSeq.getSequenceValue('custGroup');
   const newCustGroup=new CustGroup({
    _id:custGroupId,
    groupId:groupId,
    createdBy:req.body.createdCustName,
    createdDate:new Date(),
    custId:custId,
    createdByCustId:req.body.createdCustId
    })
    if(custId===req.body.createdCustId)
    newCustGroup.inviteAccepted=true;
  const createdCustGroup= await createCustGroup(newCustGroup);
 //const userGroupRes= await getCustGroups(req.body.createdCustId)
}
  res.status(201).send(createGroupResponse)
  
}

saveGrpDetails=(newGroup)=>{
    return new Promise((resolve,reject)=>{
    Group.findOne({ groupName:newGroup.groupName }, (error, oldGroup) => {
        if (error) {
   // console.log('error',error)
         // return reject('Failed');
        }
        if (oldGroup) {
             return reject('Group Already Exists');
        }
        else {
            console.log('new group')
            newGroup.save((error, data) => {
                if (error) {
    console.log(error)
               return reject('Failed');
                }
                else {
                   return resolve(data);
                }
            });
        }
    });
})
}
createCustGroup=  (newCustGroup)=>{
   return new Promise((resolve,reject)=>{
            newCustGroup.save((error, data) => {
                if (error) {  
                   reject('Failed');
                }
                else {
             resolve(data);
                }
            })
        })      

}
exports.getGroupsForCust=(req,res)=>{
 
    const custId=Number(req.params.custId);
    Group.find({"createdByCustId":custId}).exec((err,result)=>{
        if(err) console.log(err);
        else{
        console.log('result',result);
        res.status(200).send(result);
            
        }
    })
   
}
