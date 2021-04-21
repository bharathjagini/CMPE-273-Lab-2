const Group = require('../Models/GroupModel');
const autoSeq=require('../controller/AutoSeq.controller');
const CustGroup=require('../Models/CustomerGroupModel')
const ActivityLog=require('../Models/ActivityLogModel')
const activityLogSvc=require('./ActivityLogSvc');
module.exports = {

createGroup:async (createGrpReq)=>{

console.log('createGrpReq',createGrpReq)
    const groupId=await autoSeq.getSequenceValue('group');
  
    console.log('Group Id value::',groupId)
    const newGroup=new Group({
    _id:groupId,
    groupName:createGrpReq.groupName,
    createdBy:createGrpReq.createdCustName,
    createdDate:new Date(),
    createdByCustId:createGrpReq.createdCustId
    })
   const createGroupResponse= await module.exports.saveGrpDetails(newGroup);
   
   const actLogId=await autoSeq.getSequenceValue('activityLog');
      const activity=new ActivityLog({
        _id:actLogId,
        groupId:groupId,
        createdBy:createGrpReq.createdCustName,
        createdDate:new Date(),
        createdByCustId:createGrpReq.createdCustId,
        activityType:'created'

      }) 
      const activityLogRes=await activityLogSvc.saveActivity(activity)

     for(const custId of createGrpReq.custIds){
            const custGroupId=await autoSeq.getSequenceValue('custGroup');
   const newCustGroup=new CustGroup({
    _id:custGroupId,
    groupId:groupId,
    createdBy:createGrpReq.createdCustName,
    createdDate:new Date(),
    custId:custId,
    createdByCustId:createGrpReq.createdCustId
    })
    if(custId===createGrpReq.createdCustId)
    newCustGroup.inviteAccepted=true;
  const createdCustGroup= await module.exports.createCustGroup(newCustGroup);

  console.log('createdCustGroup',createdCustGroup)


   }

    return createGroupResponse;



},

saveGrpDetails:(newGroup)=>{
    return new Promise((resolve,reject)=>{
    Group.findOne({ groupName:newGroup.groupName }, (error, oldGroup) => {
        if (error) {
      const errorRes={
               "code":"E01",
               "desc":"Unable to check whether group exists"
           }
           return resolve(errorRes);
        }
        if (oldGroup) {
              const errorRes={
               "code":"E01",
               "desc":"Group already exists"
           }
           return resolve(errorRes);
        }
        else {
            console.log('new group')
            newGroup.save((error, data) => {
                if (error) {
            const errorRes={
               "code":"E01",
               "desc":"Unable to create new group"
           }
           return resolve(errorRes);
                }
                else {
                    
                   return resolve(data);
                }
            });
        }
    });
})
},
createCustGroup:  (newCustGroup)=>{
   return new Promise((resolve,reject)=>{
            newCustGroup.save((error, data) => {
                if (error) {  
                const errorRes={
               "code":"E01",
               "desc":"Unable to create customer group"
           }
           return resolve(errorRes);
                }
                else {
                    data.code="S01";
           return  resolve(data);
                }
            })
        })      

},
getGroupsForCust:async (customerId)=>{
   return new Promise((resolve,reject)=>{
    const custId=Number(customerId);
    Group.find({"createdByCustId":custId}).exec((err,result)=>{
        if(err) {
              const errorRes={
               "code":"E01",
               "desc":"Unable to fetch groups for customer"
           }
            return resolve(errorRes);
        }
        else{
       result.code="S01";
       return resolve(result);
            
        }
    })
})
}

}