const GrpExp = require('../Models/GroupExpenseModel');
const autoSeq=require('./AutoSeq.controller');
const CustGrpExp=require('../Models/CustGrpExpModel');
const CustGroup = require('../Models/CustomerGroupModel');
const ExpCmnt = require('../Models/ExpCmntModel');

exports.createExpense=async (req,res)=>{

    console.log(req.body);
      const expenseId=await autoSeq.getSequenceValue('grpExp');
 const createdExp=   await saveGrpExpInDB(req,expenseId);
 const custGrpExpId=await autoSeq.getSequenceValue('custGrpExp');
 const custGroupExpRes=await saveCustGrpExpInDB(req,expenseId,custGrpExpId);
 res.status(201).send(createdExp);
}
saveGrpExpInDB=(req,expenseId)=>{
return new Promise((resolve,reject)=>{
    let grpExp=new GrpExp({
        _id:expenseId,
        expenseDesc:req.body.expenseDesc,
        amount:req.body.amount,
        createdBy:req.body.custName,
        createdDate:new Date(),
        createdByCustId:req.body.custId,
        groupId:req.body.groupId
    })
    grpExp.save((error,createdExp)=>{
     if(error){
        console.log(error); 
        return reject("Unable to create expense")}
     else
     return resolve(createdExp);
    })
    })
}

saveCustGrpExpInDB=(req,expenseId,custGrpExpId)=>{
    let custGrpExpList=[];
    const custIds=req.body.custIds;
return new Promise((resolve,reject)=>{
    let amount = Number(req.body.amount);
    amount = (amount / (custIds.length + 1)).toFixed(2);
    console.log('amount',amount)
    for(const custId of custIds){
    const custGrpExp=new CustGrpExp({
        _id:custGrpExpId,
        expenseId:expenseId,   
        amount:amount,
        createdBy:req.body.custName,
        createdDate:new Date(),
        createdByCustId:req.body.custId,
        paidByCustId:req.body.custId,
        oweByCustId:custId,
        groupId:req.body.groupId,
        settledUp:false
    })
    custGrpExpList.push(custGrpExp);
}
console.log('custGrpExp',custGrpExpList);
    CustGrpExp.insertMany(custGrpExpList,(error,createdGrpExp)=>{
     if(error) {
        console.log(error); 
        return reject("Unable to add expenses for group members")}
     else
     return resolve(createdGrpExp);
    })
    })
}

exports.grpMemOweDetails =async (req, res) => {
  const groupId = Number(req.query.groupId);
  let grpMemTxnList=[];
  const custDetailList=await fetchCustDetailsFromDb(groupId);
  const custIds=custDetailList.map(cust=>cust.custId._id);
  const grpExpenseDtls = await getGroupExpenseDtls(groupId);
 
    const custGrpMemberTxnList = await getAllTxnsByGroupId(groupId);
    for(const custDetail of custDetailList)
    {
  const paidTxnList= custGrpMemberTxnList.filter(txn=>txn.paidByCustId===custDetail.custId._id);
  const oweTxnList= custGrpMemberTxnList.filter(txn=>txn.oweByCustId===custDetail.custId._id)
  
  
  const custPaymentDtls= await getCustAmountDtls(paidTxnList,oweTxnList,custDetail);
  
grpMemTxnList.push(custPaymentDtls);
}
const grpDtls = {
      otherCustGrpPayList: grpMemTxnList,
      groupExpenses: grpExpenseDtls,
         custIds:custIds
    };
    res.status(200).send(grpDtls);
}
fetchCustDetailsFromDb=(groupId)=>{
    return new Promise((resolve,reject)=>{
CustGroup.find({groupId:groupId,inviteAccepted:true,removedMember:false}).populate('custId','custName custEmail').exec((err,custGrpDtls)=>{;
    if(err)
    return reject('Unable to fetch cust details for group');
    else
    return resolve(custGrpDtls);
})

    })
}
getGroupExpenseDtls=(groupId)=>{
    return new Promise((resolve,reject)=>{
       GrpExp.find({groupId:groupId},(err,groupExpenses)=>{
           if(err) return reject('Unable to fetch group expenses');
           else
           return resolve(groupExpenses)
       })
    })
}
getAllTxnsByGroupId=(groupId)=>{
    return new Promise((resolve,reject)=>{
       CustGrpExp.find({groupId:groupId,settledUp:false},(err,groupExpenses)=>{
           if(err) return reject('Unable to fetch group expenses');
           else{
            return resolve(groupExpenses)
           }
       })
    })
}

getCustAmountDtls = (
  paidTxnList,
  oweTxnList,
  custDetail=null
) => {
  return new Promise((resolve, reject) => {
    
    const custPaidAmount = paidTxnList
      .map(txn => txn.amount)
      .reduce((prev, curr) => prev + curr, 0);
  
    const custOweAmount = oweTxnList
      .map(txn => txn.amount)
      .reduce((prev, curr) => prev + curr, 0);
let custName;
      if(custDetail!==null)
      custName=custDetail.custId.custName;
    let custPaymentDtls = {
      amount: custPaidAmount-custOweAmount,
      custId: custDetail.custId._id,
      custName:custName
    };
    return resolve(custPaymentDtls);
  });
};

exports.createComment=async (req,res)=>{
      const commentId=await autoSeq.getSequenceValue('expCmmnt');
const expComment=new ExpCmnt({
_id:commentId,
commentDesc:req.body.commentDesc,
createdBy:req.body.createdBy,
createdByCustId:req.body.createdByCustId,
expenseId:req.body.expenseId,
createdDate:new Date(),
deletedComment:false
})
expComment.save((err,commentRes)=>{

  if(err)
  res.status(500).send("Unable to create comment")
  else
  res.status(201).send(commentRes);

})

}

exports.fetchComments=async (req,res)=>{
      const expenseId=Number(req.params.expenseId);
ExpCmnt.find({"expenseId":expenseId,"deletedComment":false},(err,commentRes)=>{

  if(err)
  res.status(500).send("Unable to fetch comments")
  else
  res.status(200).send(commentRes);

})

}

exports.deleteComment=async (req,res)=>{
    
  console.log(req.body);
      const expenseId=req.body.expenseId;
      const commentId=req.body.commentId;
      const modifiedDate=new Date();
      const deletedComment=true;
      const modifiedBy=req.body.modifiedBy;
      const modifiedByCustId=req.body.modifiedByCustId;

ExpCmnt.updateOne({"expenseId":expenseId,"_id":commentId},{$set:{"deletedComment":deletedComment,modifiedBy:modifiedBy,modifiedByCustId:modifiedByCustId,
modifiedDate:modifiedDate}}).exec((err,deleteCommentRes)=>{

  if(err)
  res.status(500).send("Unable to fetch comments")
  else
  res.status(200).send(deleteCommentRes);

})

}