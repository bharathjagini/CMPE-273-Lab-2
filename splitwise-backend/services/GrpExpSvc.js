const GrpExp = require('../Models/GroupExpenseModel');
const autoSeq=require('../controller/AutoSeq.controller');
const CustGrpExp=require('../Models/CustGrpExpModel');
const CustGroup = require('../Models/CustomerGroupModel');
const ExpCmnt = require('../Models/ExpCmntModel');
const activityLogSvc=require('./ActivityLogSvc');
const ActivityLog=require('../Models/ActivityLogModel')
module.exports={
    

createExpense:async (createExpReq)=>{

 
      const expenseId=await autoSeq.getSequenceValue('grpExp');
 const createdExp=   await module.exports.saveGrpExpInDB(createExpReq,expenseId);
 const custGrpExpId=await autoSeq.getSequenceValue('custGrpExp');
 const custGroupExpRes=await module.exports.saveCustGrpExpInDB(createExpReq,expenseId,custGrpExpId);
 const actLogId=await autoSeq.getSequenceValue('activityLog');
      const activity=new ActivityLog({
        _id:actLogId,
        groupId:createExpReq.groupId,
        createdBy:createExpReq.custName,
        createdDate:new Date(),
        createdByCustId:createExpReq.custId,
        activityType:'paid',
        expenseDesc:createExpReq.expenseDesc,
        amount:createExpReq.amount,
        expenseId:expenseId
      }) 
      const activityLogRes=await activityLogSvc.saveActivity(activity)


 return createdExp;
},
saveGrpExpInDB:async(createExpReq,expenseId)=>{
return new Promise((resolve,reject)=>{
    let grpExp=new GrpExp({
        _id:expenseId,
        expenseDesc:createExpReq.expenseDesc,
        amount:createExpReq.amount,
        createdBy:createExpReq.custName,
        createdDate:new Date(),
        createdByCustId:createExpReq.custId,
        groupId:createExpReq.groupId
    })
    grpExp.save((error,createdExp)=>{
     if(error){
      const errorRes={
               "code":"E01",
               "desc":"Unable to create expense"
           }
          return resolve(errorRes);
        }
     else
     return resolve(createdExp);
    })
    })
},

saveCustGrpExpInDB:async(createExpReq,expenseId,custGrpExpId)=>{
    let custGrpExpList=[];
    const custIds=createExpReq.custIds;
return new Promise((resolve,reject)=>{
    let amount = Number(createExpReq.amount);
    amount = (amount / (custIds.length + 1)).toFixed(2);
    console.log('amount',amount)
    for(const custId of custIds){
    const custGrpExp=new CustGrpExp({
        _id:custGrpExpId,
        expenseId:expenseId,   
        amount:amount,
        createdBy:createExpReq.custName,
        createdDate:new Date(),
        createdByCustId:createExpReq.custId,
        paidByCustId:createExpReq.custId,
        oweByCustId:custId,
        groupId:createExpReq.groupId,
        settledUp:false
    })
    custGrpExpList.push(custGrpExp);
}
console.log('custGrpExp',custGrpExpList);
    CustGrpExp.insertMany(custGrpExpList,(error,createdGrpExp)=>{
     if(error) {
     const errorRes={
               "code":"E01",
               "desc":"Unable to create each customer expense"
           }
          return resolve(errorRes);   
    }
     else
     return resolve(createdGrpExp);
    })
    })
},

grpMemOweDetails :async (grpId) => {
  const groupId = Number(grpId);
  let grpMemTxnList=[];
  const custDetailList=await module.exports.fetchCustDetailsFromDb(groupId);
  const custIds=custDetailList.map(cust=>cust.custId._id);
  const grpExpenseDtls = await module.exports.getGroupExpenseDtls(groupId);
 
    const custGrpMemberTxnList = await module.exports.getAllTxnsByGroupId(groupId);
    for(const custDetail of custDetailList)
    {
  const paidTxnList= custGrpMemberTxnList.filter(txn=>txn.paidByCustId===custDetail.custId._id);
  const oweTxnList= custGrpMemberTxnList.filter(txn=>txn.oweByCustId===custDetail.custId._id)
  
  
  const custPaymentDtls= await module.exports.getCustAmountDtls(paidTxnList,oweTxnList,custDetail);
  
grpMemTxnList.push(custPaymentDtls);
}
const grpDtls = {
      otherCustGrpPayList: grpMemTxnList,
      groupExpenses: grpExpenseDtls,
         custIds:custIds
    };
    return grpDtls;
},
fetchCustDetailsFromDb:(groupId)=>{
    return new Promise((resolve,reject)=>{
CustGroup.find({groupId:groupId,inviteAccepted:true,removedMember:false}).populate('custId','custName custEmail').exec((err,custGrpDtls)=>{;
    if(err)
    {
          const errorRes={
               "code":"E01",
               "desc":"Unable to fetch cust details for group"
           }
          return resolve(errorRes);  
    }
  
    else
    return resolve(custGrpDtls);
})

    })
},
getGroupExpenseDtls:(groupId)=>{
    return new Promise((resolve,reject)=>{
       GrpExp.find({groupId:groupId},(err,groupExpenses)=>{
           if(err)
           {
          const errorRes={
               "code":"E01",
               "desc":"Unable to fetch group expenses"
           }
          return resolve(errorRes);  
    } 
           else
           return resolve(groupExpenses)
       })
    })
},
getAllTxnsByGroupId:(groupId)=>{
    return new Promise((resolve,reject)=>{
       CustGrpExp.find({groupId:groupId,settledUp:false},(err,groupExpenses)=>{
           if(err) {
          const errorRes={
               "code":"E01",
               "desc":"Unable to fetch txns for group"
           }
          return resolve(errorRes);  
    } 
           else{
            return resolve(groupExpenses)
           }
       })
    })
},

getCustAmountDtls : (
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
},

createComment:async (createCommentReq)=>{
      const commentId=await autoSeq.getSequenceValue('expCmmnt');
      return new Promise((resolve,reject)=>{
const expComment=new ExpCmnt({
_id:commentId,
commentDesc:createCommentReq.commentDesc,
createdBy:createCommentReq.createdBy,
createdByCustId:createCommentReq.createdByCustId,
expenseId:createCommentReq.expenseId,
createdDate:new Date(),
deletedComment:false
})
expComment.save((err,commentRes)=>{

  if(err){
       const errorRes={
               "code":"E01",
               "desc":"Unable to create comment"
           }
          return resolve(errorRes);  
  }
 
  else{
  console.log(commentRes);
    return resolve(commentRes);
  }
})
})
},

fetchComments:async (expId)=>{
      const expenseId=Number(expId);
        return new Promise((resolve,reject)=>{
ExpCmnt.find({"expenseId":expenseId,"deletedComment":false},(err,commentRes)=>{

  if(err){
       const errorRes={
               "code":"E01",
               "desc":"Unable to fetch comments"
           }
          return resolve(errorRes);  
  }
 
  else
  return resolve(commentRes);

})
        })
},

deleteComment: (deleteCommentReq)=>{
    
    return new Promise((resolve,reject)=>{
      const expenseId=deleteCommentReq.expenseId;
      const commentId=deleteCommentReq.commentId;
      const modifiedDate=new Date();
      const deletedComment=true;
      const modifiedBy=deleteCommentReq.modifiedBy;
      const modifiedByCustId=deleteCommentReq.modifiedByCustId;

ExpCmnt.updateOne({"expenseId":expenseId,"_id":commentId},{$set:{"deletedComment":deletedComment,modifiedBy:modifiedBy,modifiedByCustId:modifiedByCustId,
modifiedDate:modifiedDate}}).exec((err,deleteCommentRes)=>{

  if(err)
  {
       const errorRes={
               "code":"E01",
               "desc":"Unable to delete comment"
           }
          return resolve(errorRes); 
  }
  
  else
  return resolve(deleteCommentRes);

})
    })
}
}