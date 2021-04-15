const GrpExp=require('../Models/GroupExpenseModel')
module.exports={

fetchRecentActivity:async(recActReq)=>{

    const groupIds=recActReq.groupIds;
   const expDtlsRes= await getExpenseDtlsFrmDb(groupIds);
  return expDtlsRes;

},

getExpenseDtlsFrmDb:(groupIds)=>{
    return new Promise((resolve,reject)=>{
        GrpExp.find({"groupId":{$in:groupIds}}).populate("createdByCustId","custName custEmail").populate("groupId","groupName").exec((err,recentAct)=>{

            if(err) {
                 const errorRes={
               "code":"E01",
               "desc":"Unable to fetch recent avtivity details"
           }
          return resolve(errorRes);
            }
            else
            return resolve(recentAct);
        })
    })
}
}