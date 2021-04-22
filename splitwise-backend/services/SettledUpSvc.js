const CustGrpExp=require('../Models/CustGrpExpModel');
const activityLogSvc=require('./ActivityLogSvc');
const ActivityLog=require('../Models/ActivityLogModel')
const autoSeq=require('../controller/AutoSeq.controller');
module.exports={

    settleUp : async (settleUpReq) => {
        // Validate request
       console.log("settleUpReq",settleUpReq)
        const settleUpCustId=Number(settleUpReq.settleUpCustId);
        const loggedInCustId=Number(settleUpReq.loggedInCustId);
       
         //  const groupId=await module.exports.getGroupId(settleUpReq.settleUpCustId,settleUpReq.loggedInCustId)
        const custIds=[settleUpCustId,loggedInCustId];
        console.log('custids:',custIds)
        const settleUpResponse=await module.exports.settleTxnDb(custIds);

        const actLogId=await autoSeq.getSequenceValue('activityLog');
      const activity=new ActivityLog({
        _id:actLogId,
        createdBy:settleUpReq.custName,
        createdDate:new Date(),
        createdByCustId:settleUpReq.loggedInCustId,
        activityType:'settled',
        settledWithCustId:settleUpReq.settleUpCustId             
      }) 
      const activityLogRes=await activityLogSvc.saveActivity(activity)
        
        return settleUpResponse;
      
      },
      
      settleTxnDb:(custIds)=>{


        CustGrpExp.updateMany({'$and':[{"paidByCustId":{$in:custIds}},{"oweByCustId":{$in:custIds}}]},
        {"settledUp":true},{multi:true}).exec((err,res)=>{
            if(err)
            {
console.log(err);
            }
            else
            {
                return res;
            }
        })
  

      },
      getGroupId:()=>{
return new Promise((resolve,reject)=>{
    3
})
      },
     
}