const Currency=require('../Models/CurrencyModel')
const Language=require('../Models/LanguageModel')
const Timezone=require('../Models/TimezoneModel')
const customer=require("../Models/CustomerModel")
const AWS = require('aws-sdk');

module.exports={
   

profConfigDetails:async ()=>{
  
    const currencyDtlsList= await module.exports.fetchCurrDtls();
    const langDetailsList= await module.exports.fetchLangDtls();
    const timezoneDetailsList= await module.exports.fetchTimezoneDtls();
   
    const configDtls={
        currencyDtlsList:currencyDtlsList,
        langDetailsList:langDetailsList,
        timezoneDetailsList:timezoneDetailsList
    }
  return configDtls;

},
fetchCurrDtls:()=>{
    return new Promise((resolve,reject)=>{
         Currency.find({},(err,currDtls)=>{
    if(err) {
  const errorRes={
               "code":"E01",
               "desc":"Unable to fetch currency details list"
           }
          return resolve(errorRes);
}
else{

    return resolve(currDtls);
}
    })
        })
},
fetchLangDtls:()=>{
    return new Promise((resolve,reject)=>{
         Language.find({},(err,langDtls)=>{
    if(err) {
  const errorRes={
               "code":"E01",
               "desc":"Unable to fetch language details list"
           }
          return resolve(errorRes);
}
else{

    return resolve(langDtls);
}
    })
        })
},
fetchTimezoneDtls:()=>{
    return new Promise((resolve,reject)=>{
         Timezone.find({},(err,timezoneDtls)=>{
    if(err) {
   const errorRes={
               "code":"E01",
               "desc":"Unable to fetch timezone details list"
           }
          return resolve(errorRes);
}
else{

    return resolve(timezoneDtls);
}
    })
        })
},

updateProfDtls:async (updateProfDtlsReq)=>{
    return new Promise((resolve,reject)=>{
    console.log(updateProfDtlsReq)
    const updateProfDtls=JSON.parse(updateProfDtlsReq.profDtls)
    //var s3 = new AWS.S3();
   var base64data1 = new Buffer(updateProfDtlsReq.image.buffer, 'binary');
    const base64data = updateProfDtlsReq.image.buffer.toString('base64');
    const s3 = new AWS.S3({
        accessKeyId: 'AKIAT3AUC24POWXUFANN',
        secretAccessKey: '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'
    });
    //const fileContent = fs.readFileSync(fileName);
    const params = {
        Bucket: 'splitwise-images-bharath',
        Key: 'splitwise/'+updateProfDtls.custId+"_"+updateProfDtlsReq.image.originalname, // File name you want to save as in S3
        Body: base64data1
    };
    s3.upload(params, function (err, data) {
        //handle error
        if (err) {
          console.log("Error", err);
        }
        console.log('File uploaded successfully.',data.Location);
        customer.findByIdAndUpdate(updateProfDtls.custId, { custPhoneNumber:updateProfDtls.custPhoneNumber,
            currencyId:updateProfDtls.currencyId,timezoneId:updateProfDtls.timezoneId,languageId:updateProfDtls.languageId,custName:updateProfDtls.custName,
        image:data.Location },{new: true},
        function (err, updatedCustomer) {
if (err){
console.log(err)
}
else{
console.log("Updated User : ", updatedCustomer);
return resolve(updatedCustomer)
}
});
    



})
})
}

}