const activityLog=require('../Models/ActivityLogModel')

module.exports={

    saveActivity:(activity)=>{

        activityLog.create(activity,(err,res)=>{
            if(err){}
            else{
                console.log('res',res);
                return res;
            }
        })
    }
}