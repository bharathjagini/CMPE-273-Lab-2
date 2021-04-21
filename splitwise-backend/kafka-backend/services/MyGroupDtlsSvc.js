  const CustGroup=require('../Models/CustomerGroupModel')
module.exports={
  
groupInvites:async (customerId)=>{

    return new Promise((resolve,reject)=>{
    const custId=Number(customerId);
    CustGroup.find({"custId":custId,"inviteAccepted":false}).populate('groupId','groupName').exec((err,grpInvites)=>{
        if(err){
            const errorRes={
               "code":"E01",
               "desc":"Unable to fetch group invites for customer "
           }
           return errorRes;
        }
        
        else{
            console.log('grpinvites',grpInvites)
        return resolve(grpInvites);
        }

    })
})
},

acceptInvite:async(accInvReq)=>{

    const custId=accInvReq.custId;
    const groupId=accInvReq.groupId;
    CustGroup.updateOne({"custId":custId,"groupId":groupId},{$set:{"inviteAccepted":true}}).exec((err,grpInvites)=>{
        if(err){
           const errorRes={
               "code":"E01",
               "desc":"Unable to accept Invite for group "
           }
           return errorRes;
        }
 
        else
       return grpInvites;

    })
},
deleteGroup:async (delGrpReq)=>{

    
    const custId=Number(delGrpReq.custId);
    const groupId=Number(delGrpReq.groupId);
    CustGroup.updateOne({"custId":custId,"groupId":groupId},{$set:{"removedMember":true}}).exec((err,userGrpList)=>{
        if(err)
      {
           const errorRes={
               "code":"E01",
               "desc":"Unable to delete group for customer"
           }
           return errorRes;
        }
        else
     return userGrpList;

    })
}
}