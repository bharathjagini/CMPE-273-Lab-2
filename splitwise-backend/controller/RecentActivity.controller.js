const GrpExp=require('../Models/GroupExpenseModel')

exports.fetchRecentActivity=async(req,res)=>{

    const groupIds=req.body.groupIds;
   const expDtlsRes= await getExpenseDtlsFrmDb(groupIds);
   res.status(200).send(expDtlsRes);

}

getExpenseDtlsFrmDb=(groupIds)=>{
    return new Promise((resolve,reject)=>{
        GrpExp.find({"groupId":{$in:groupIds}}).populate("createdByCustId","custName custEmail").populate("groupId","groupName").exec((err,recentAct)=>{

            if(err) return reject('Unable to fetch recent avtivity details');
            else
            return resolve(recentAct);
        })
    })
}