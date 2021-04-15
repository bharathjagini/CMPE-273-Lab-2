const CustGroup = require('../Models/CustomerGroupModel');


exports.getCustGroups=(req,res)=>{
  
    console.log(req.params.custId)
    CustGroup.find({"custId":Number(req.params.custId),"removedMember":false,"inviteAccepted":true}).populate('custId','custName custEmail').populate('groupId','groupName').exec((err,result)=>{
        if(err) console.log(err);
        else{
        console.log('result',result);
            res.status(200).send(result);
        }
    })
}