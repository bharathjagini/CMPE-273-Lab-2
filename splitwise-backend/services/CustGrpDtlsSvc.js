    const CustGroup = require('../Models/CustomerGroupModel');
module.exports={




custGroups:async(custId)=>{
  return new Promise((resolve,reject)=>{
    console.log(custId)
    CustGroup.find({"custId":Number(custId),"removedMember":false,"inviteAccepted":true}).populate('custId','custName custEmail').populate('groupId','groupName').exec((err,result)=>{
        if(err) {
    const errorRes={
               "code":"E01",
               "desc":"Unable to fetch groups for customer"
           }
            return resolve(errorRes);
        }
        else{
         return  resolve(result);
        }
    })
    })
}
    

}