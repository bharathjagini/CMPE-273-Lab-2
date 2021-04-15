const Currency=require('../Models/CurrencyModel')
const Language=require('../Models/LanguageModel')
const Timezone=require('../Models/TimezoneModel')

exports.fetchProfDtls=async (req,res)=>{

    
    
   const currencyDtlsList= await fetchCurrDtls();
    const langDetailsList= await fetchLangDtls();
     const timezoneDetailsList= await fetchTimezoneDtls();
   

    
    const configDtls={
        currencyDtlsList:currencyDtlsList,
        langDetailsList:langDetailsList,
        timezoneDetailsList:timezoneDetailsList
    }
    console.log('return res')
    res.status(200).send(configDtls);

}
fetchCurrDtls=()=>{
    return new Promise((resolve,reject)=>{
         Currency.find({},(err,currDtls)=>{
    if(err) {
  return reject('unable to fetch currency list')
}
else{

    return resolve(currDtls);
}
    })
        })
}
fetchLangDtls=()=>{
    return new Promise((resolve,reject)=>{
         Language.find({},(err,langDtls)=>{
    if(err) {
  return reject('unable to fetch languages list')
}
else{

    return resolve(langDtls);
}
    })
        })
}
fetchTimezoneDtls=()=>{
    return new Promise((resolve,reject)=>{
         Timezone.find({},(err,timezoneDtls)=>{
    if(err) {
  return reject('unable to fetch timezone list')
}
else{

    return resolve(timezoneDtls);
}
    })
        })
}