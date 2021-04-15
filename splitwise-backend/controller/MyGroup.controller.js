const CustGroup=require('../Models/CustomerGroupModel')

exports.groupInvites=(req,res)=>{

    const custId=Number(req.params.custId);
    CustGroup.find({"custId":custId,"inviteAccepted":false}).populate('groupId','groupName').exec((err,grpInvites)=>{
        if(err)
        console.log(err)
        else
        res.status(200).send(grpInvites);

    })
}

exports.acceptInvite=(req,res)=>{
console.log(req.body);
    const custId=req.body.custId;
    const groupId=req.body.groupId;
    CustGroup.updateOne({"custId":custId,"groupId":groupId},{$set:{"inviteAccepted":true}}).exec((err,grpInvites)=>{
        if(err)
        console.log(err)
        else
        res.status(200).send(grpInvites);

    })
}
exports.deleteGroup=(req,res)=>{

    console.log(req.body);
    const custId=Number(req.body.custId);
    const groupId=Number(req.body.groupId);
    CustGroup.updateOne({"custId":custId,"groupId":groupId},{$set:{"removedMember":true}}).exec((err,userGrpList)=>{
        if(err)
        console.log(err)
        else
        res.status(200).send(userGrpList);

    })
}