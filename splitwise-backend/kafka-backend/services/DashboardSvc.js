const CustGroup=require('../Models/CustomerGroupModel')
const CustGrpExp=require('../Models/CustGrpExpModel');
module.exports={

grpDashboardAmountDetails : async (customerId) => {
    
  console.log("customerId",customerId)
    
    let groupIds = [];
       
        const custId = Number(customerId);
      
       
         const grpDtls=  await module.exports.getGroupDtlsForCust(custId);
       
      
         
         if (grpDtls.length > 0) {
          grpDtls.map(group => {
            groupIds.push(group.groupId._id);
          });
        }
        if(groupIds.length>0){
            const custGrpDtlsList=await module.exports.getCustDetails(groupIds);
            console.log("custGrpDtlsList",custGrpDtlsList)
            const custDetailsList = [...new Set(custGrpDtlsList.map(custGroup => custGroup.custId))];
            console.log("custDetailsList",custDetailsList)
        const custMemberTxnList =  await module.exports.getAllGroupsExp(groupIds);
        //===============
        

        //===============
      //  console.log('custMemberTxnList',custMemberTxnList);
        const loggedinCustTotalOweDtls = await  module.exports.getLoggedInCustAmountdtls(custMemberTxnList, custId);
        let allGrpMemOweList = [];
        let grpMemOweList=[];
        let eachCustOweList=[];
        //let eachCustOweList1=[];
        for (const grpDtl of grpDtls) {
       //     console.log('grpDtl:',grpDtl);
          const grpMemOweTxnList = custMemberTxnList.filter(
            txn => txn.groupId._id === grpDtl.groupId._id
          );
       
          const loggedInCustPaidTxnList = grpMemOweTxnList.filter(
            paidTxn => paidTxn.paidByCustId === custId
          );
    
          const loggedInCustGrpOweDtls =  await module.exports.getLoggedInCustAmountdtls(grpMemOweTxnList, custId);
          loggedInCustGrpOweDtls.groupId=grpDtl.groupId._id;
          
          loggedInCustGrpOweDtls.groupName=grpDtl.groupId.groupName;
          console.log(loggedInCustGrpOweDtls);
          grpMemOweList.push(loggedInCustGrpOweDtls)
       
          const noTxnByCustList= await module.exports.noTxnPaidByLoggedInCust(loggedInCustPaidTxnList,grpMemOweTxnList,grpDtl,custId,custDetailsList);
          if(noTxnByCustList.length>0)
          {
           // eachCustOweList.push(noTxnByCustList)
           noTxnByCustList.map(txn=>{
            const prevOweIndex= eachCustOweList.findIndex(eachCust=>eachCust.custId===txn.custId);
            if(prevOweIndex>-1)
            eachCustOweList[prevOweIndex].amount=eachCustOweList[prevOweIndex].amount+txn.amount;
            else
           // eachCustOweList.push(eactCustOweDtls)
            eachCustOweList.push(txn)
           })
          //x  eachCustOweList=noTxnByCustList;
           // eachCustOweList1.push(eachCustOweList)
            continue;
      
     
          }
         // console.log('67',noTxnByCustList)
         let oweDtls=  await module.exports.getOtherGrpMemOwePaidDtls(
           loggedInCustPaidTxnList,
           grpMemOweTxnList,grpDtl,
           custDetailsList,
           eachCustOweList
         );
         
         otherCustGrpPayList=oweDtls.otherCustGrpPayList;
         eachCustOweList=[...oweDtls.eachCustOweList,...noTxnByCustList]
       
         
         console.log('eachCustOweList::',eachCustOweList)
       //  console.log('74',otherCustGrpPayList);
        
        if(otherCustGrpPayList.length>0)
         allGrpMemOweList.push(otherCustGrpPayList);
       }
   
       let dashboardDtls={
         loggedInCustPaidAmount:loggedinCustTotalOweDtls.loggedInCustPaidAmount,
         loggedInCustOweAmount:loggedinCustTotalOweDtls.loggedInCustOweAmount,
        allGrpMemOweList:allGrpMemOweList,
        grpMemOweList:grpMemOweList,
        eachCustOweList:eachCustOweList
       }
       return new Promise((resolve,reject)=>{
        return resolve(dashboardDtls)
    })
     }
     else
   {
     let dashboardDtls={
         loggedInCustPaidAmount:0,
         loggedInCustOweAmount:0,
        allGrpMemOweList:[],
        grpMemOweList:[],
        eachCustOweList:[]
       }
       return new Promise((resolve,reject)=>{
        return resolve(dashboardDtls)
    })
    }
   
           
    

},
getCustDetails:groupIds=>{
return new Promise((resolve,reject)=>{
    CustGroup.find({"groupId":{$in:groupIds}}).populate("custId","custName").exec((err,response)=>{
        if(err){

        }
        else{
            return resolve(response);
        }
    })
})
},
 getGroupDtlsForCust:(custId)=>{
    return new Promise((resolve, reject) => {
     
    CustGroup.find({"custId":custId,"removedMember":false,"inviteAccepted":true}).populate('custId','custName').populate('groupId','groupName').exec((err,result)=>{
        if(err) {
    const errorRes={
               "code":"E01",
               "desc":"Unable to fetch groups for customer"
           }
            return reject(errorRes);
        }
        else{
         return  resolve(result);
        }
    })
  
   })
},
getAllGroupsExp :groupIds => {
    return new Promise((resolve,reject)=>{
        CustGrpExp.find({"groupId":{$in:groupIds},settledUp:false}).populate('groupId','groupName').exec((err,custGroupExpenses)=>{
            if(err) {
           const errorRes={
                "code":"E01",
                "desc":"Unable to fetch txns for group"
            }
           return resolve(errorRes);  
     } 
            else{
             return resolve(custGroupExpenses)
            }
        })
     })
    },
getLoggedInCustAmountdtls:(custMemberTxnList, custId) => {
        return new Promise((resolve, reject) => {
          const loggedInCustPaidTxnList = custMemberTxnList.filter(
            paidTxn => paidTxn.paidByCustId === custId
          );
         
          const loggedInCustOweTxnList = custMemberTxnList.filter(
            oweTxn => oweTxn.oweByCustId === custId
          );
      
          const loggedInCustPaidAmount = loggedInCustPaidTxnList
            .map(txn => txn.amount)
            .reduce((prev, curr) => prev + curr, 0);
          const loggedInCustOweAmount = loggedInCustOweTxnList
            .map(txn => txn.amount)
            .reduce((prev, curr) => prev + curr, 0);
          let loggedInCustPaymentDtls = {
            loggedInCustPaidAmount: loggedInCustPaidAmount.toFixed(2),
            loggedInCustOweAmount: loggedInCustOweAmount.toFixed(2)
          };
          console.log(loggedInCustPaymentDtls);
          return resolve(loggedInCustPaymentDtls);
        });
      },
      
       noTxnPaidByLoggedInCust:(loggedInCustPaidTxnList,grpMemOweTxnList,custGrpDtls,custId,custDetailsList)=>{
        return new Promise((resolve,reject)=>{
         let  noTxnList=[];
         let eachPersonCustId;
          const existTxns= [...new Set(loggedInCustPaidTxnList.map(txn=>txn.oweByCustId))]
            console.log(existTxns)
             let noTxn= grpMemOweTxnList.filter(oweTxn=>oweTxn.oweByCustId===custId);
              for(const txnCustId of existTxns)
              {
               noTxn=noTxn.filter(txn=>txn.paidByCustId!==txnCustId)
              }
              console.log('no txn::',noTxn);
              const otherTxns= [...new Set(noTxn.map(txn=>txn.paidByCustId))]
        
              for(const otherTxn of otherTxns)
              {
                console.log('other txn:',otherTxn)
              const eachPerson=  noTxn.filter(txn=>txn.paidByCustId===otherTxn);
           //   console.log('each person',eachPerson)
              const amount=eachPerson.map(txn => txn.amount)
              .reduce((prev, curr) => prev + curr, 0); 
              if(eachPerson.length>0)
              eachPersonCustId=eachPerson[0].paidByCustId;
              const custName=module.exports.getCustName(eachPersonCustId,custDetailsList)
              let oweTxn=  {
                    custId: eachPersonCustId,
                    custName: custName,
                    amount:-amount 
                }
                noTxnList.push(oweTxn);
              }
         return resolve(noTxnList);
        })
        },
        getOtherGrpMemOwePaidDtls : async (
            loggedInCustPaidTxnList,
            custGrpMemberTxnList,grpDtl,
            custDetailsList,
            prevOweList
          ) => {
            let otherCustGrpPayList = [];
            let dummy;
            let checkDuplicateTxn = [];
           let eachCustOweList=[];
           console.log('prevOweList',prevOweList)
            for (const txnDtls of loggedInCustPaidTxnList) {
            //    let otherCustGrpMemDtls;
              dummy = {
                paidCustId: txnDtls.paidByCustId,
                oweCustId: txnDtls.oweByCustId
              };
              checkDuplicateTxn.push(dummy);
          
              const res = checkDuplicateTxn.filter(
                duplicate =>
                  duplicate.paidCustId === txnDtls.paidByCustId &&
                  duplicate.oweCustId === txnDtls.oweByCustId 
              );
              //console.log(res);
              if (res.length > 1) continue;
             
              console.log('before asdf')
             const otherCustGrpMemDtls= await module.exports.getAllOtherGrpMemPaidDtls(
                txnDtls,
                custGrpMemberTxnList,
                otherCustGrpPayList,
                grpDtl,
                custDetailsList
              );
           
       

              console.log(otherCustGrpMemDtls)
              if(eachCustOweList.length>0)
              {
                const eachCustIndex=eachCustOweList.findIndex(eachCust=>eachCust.custId===otherCustGrpMemDtls.custId);
                if(eachCustIndex>-1)
                eachCustOweList[eachCustIndex]=eachCustOweList[eachCustIndex].amount+otherCustGrpMemDtls.amount;
                else{
                let eactCustOweDtls={
                custId:otherCustGrpMemDtls.custId,
                custName:otherCustGrpMemDtls.custName,
                amount:otherCustGrpMemDtls.amount
              }
              const prevOweIndex= prevOweList.findIndex(prevOwe=>prevOwe.custId===otherCustGrpMemDtls.custId);
              if(prevOweIndex>-1)
              prevOweList[prevOweIndex].amount=prevOweList[prevOweIndex].amount+otherCustGrpMemDtls.amount;
              else
              prevOweList.push(eactCustOweDtls)
               eachCustOweList.push(eactCustOweDtls);
              }
            }
              else{
             //     console.log('otherCustGrpMemDtls',otherCustGrpMemDtls.custId);
              let eactCustOweDtls={
                custId:otherCustGrpMemDtls.custId,
                custName:otherCustGrpMemDtls.custName,
                amount:otherCustGrpMemDtls.amount
              } 
              console.log('eactCustOweDtls:',eactCustOweDtls)
              const prevOweIndex= prevOweList.findIndex(prevOwe=>prevOwe.custId===otherCustGrpMemDtls.custId);
              if(prevOweIndex>-1)
              prevOweList[prevOweIndex].amount=prevOweList[prevOweIndex].amount+otherCustGrpMemDtls.amount;
              else
              prevOweList.push(eactCustOweDtls)
              eachCustOweList.push(eactCustOweDtls);
            }
            }
            console.log("eachCustOweList:",eachCustOweList)
            let oweDtls={
          otherCustGrpPayList:otherCustGrpPayList,
          eachCustOweList:prevOweList
            }
            return oweDtls;
          },
          getAllOtherGrpMemPaidDtls :(
            txnDtls,
            custGrpMemberTxnList,
            otherCustGrpPayList,grpDtl,
            custDetailsList
          ) => {
            return new Promise((resolve, reject) => {
              const otherCustGrpMemPaidAmount = custGrpMemberTxnList
                .filter(txn1 => txn1.paidByCustId == txnDtls.oweByCustId)
                .filter(txn2 => txn2.oweByCustId === txnDtls.paidByCustId)
                .map(txn => txn.amount)
                .reduce((prev, curr) => prev + curr, 0);
              console.log( txnDtls)
              //console.log('after',custGrpMemberTxnList)
              //console.log('check',otherCustGrpMemPaidAmount);
              let amnt = 0;
          //    if (otherCustGrpMemPaidAmount > 0) {
                amnt = custGrpMemberTxnList
                  .filter(
                    txn =>
                      txn.paidByCustId === txnDtls.paidByCustId &&
                      txn.oweByCustId === txnDtls.oweByCustId
                  )
                  .map(otherTxn => otherTxn.amount)
                  .reduce((prev, curr) => prev + curr, 0);
            //  }
              //console.log("amnt", amnt);
              let otherCustGrpMemDtls;
              const otherCustGrpMemPayableAmnt = amnt - otherCustGrpMemPaidAmount;
              //console.log("qwer", otherCustGrpMemPayableAmnt);
             const custName=module.exports.getCustName(txnDtls.oweByCustId,custDetailsList);
              if (otherCustGrpMemPayableAmnt !== 0) {
                otherCustGrpMemDtls = {
                  custId: txnDtls.oweByCustId,
                  custName: custName,
                  amount: Number(otherCustGrpMemPayableAmnt.toFixed(2)),
                  groupName:grpDtl.groupId.groupName,
                  groupId:txnDtls.groupId._id
          
                };
                console.log("inside ", otherCustGrpMemDtls);
              } else {
          
                otherCustGrpMemDtls = {
                  custId: txnDtls.oweByCustId,
                 custName: custName,
                  amount: Number(otherCustGrpMemPayableAmnt),
                  groupName:grpDtl.groupId.groupName,
                  groupId:txnDtls.groupId._id
                };
              }
              otherCustGrpPayList.push(otherCustGrpMemDtls);
              //    console.log(otherCustDtls);
              return resolve(otherCustGrpMemDtls);
              // return resolve(null);
            });
          },
        getCustName:(custId,custDetailsList)=>{
 
           const custIndex= custDetailsList.findIndex(custDetail=>custDetail._id===custId);
           console.log(custIndex)
           if(custIndex>-1)
           return custDetailsList[custIndex].custName;
            
           
            
            }
            
          


   
}