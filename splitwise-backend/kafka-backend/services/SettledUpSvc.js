const CustGrpExp=require('../Models/CustGrpExpModel');
const activityLogSvc=require('./ActivityLogSvc');
const ActivityLog=require('../Models/ActivityLogModel')
module.exports={

    settleUp : async (settleUpReq) => {
        // Validate request
       
        const settleUpCustId=Number(settleUpReq.settleUpCustId);
        const loggedInCustId=Number(settleUpReq.loggedInCustId);
        
        const custIds=[settleUpCustId,loggedInCustId];
        const settleUpResponse=await module.exports.settleTxnDb(custIds);

        const actLogId=await autoSeq.getSequenceValue('activityLog');
      const activity=new ActivityLog({
        _id:actLogId,
        createdBy:settleUpReq.custName,
        createdDate:new Date(),
        createdByCustId:ettleUpReq.loggedInCustId,
        activityType:'settled',
        settledWithCustId:settleUpReq.settleUpCustId             
      }) 
      const activityLogRes=await activityLogSvc.saveActivity(activity)
        
        return settleUpResponse;
      
      },
      
      settleTxnDb:(custIds)=>{


        CustGrpExp.updateMany({"paidByCustId":{$in:custIds},"oweByCustId":{$in:custIds}},
        {"settledUp":true},{multi:true}).exec((err,res)=>{
            if(err)
            {

            }
            else
            {
                return res;
            }
        })
  

      },
     
}