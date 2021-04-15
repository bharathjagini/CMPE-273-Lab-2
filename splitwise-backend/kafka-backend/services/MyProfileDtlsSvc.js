 const Currency=require('../Models/CurrencyModel')
const Language=require('../Models/LanguageModel')
const Timezone=require('../Models/TimezoneModel')
module.exports={
   

profConfigDetails:async ()=>{
  
   const currencyDtlsList= await fetchCurrDtls();
    const langDetailsList= await fetchLangDtls();
     const timezoneDetailsList= await fetchTimezoneDtls();
   
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
}
}