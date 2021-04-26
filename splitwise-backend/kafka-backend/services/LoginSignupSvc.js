const Customer = require('../Models/CustomerModel');
//const mongoose=require('mongoose')

const Curr=require('../Models/CurrencyModel')
const autoSeq=require('../controller/AutoSeq.controller');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
var { secret } = require("../database/config");
const { auth } = require("../passport/passport");

auth();
 const saltRounds = 10;
module.exports = {
    createCustomer: async (createCust) => {

      //  console.log('createCust',createCust);
       const custIdValue=await autoSeq.getSequenceValue('customer');
    //    console.log('inside create customer');
return new Promise((resolve,reject)=>{
         

    console.log('custid value::',custIdValue)
    let customer=new Customer({
    _id:custIdValue,
    custName:createCust.custName,
    custEmail:createCust.custEmail,
    custPasswd:createCust.custPassword,
    createdBy:createCust.custName,
    currencyId:101,
    timezoneId:1001,
    languageId:1001,
    createdDate:new Date(),
    image:''
    })
    console.log('customer',customer)
  Customer.findOne({ custEmail: createCust.custEmail }, (error, oldCustomer) => {
        if (error) {
    console.log(error);
            // res.writeHead(500, {
            //     'Content-Type': 'text/plain'
            // })
            // res.end();
        }
        if (oldCustomer) {
           const errorRes={
               "code":"E01",
               "desc":"Email already exists"
           }
          return reject(errorRes);
        }
        else {
        //    console.log('non exist cust',customer)
            bcrypt.hash(customer.custPasswd, saltRounds, (err, hash)=> {
             //   console.log('hash:',hash)
            customer.custPasswd = hash; 
            customer.save((error, data) => {
                if (error) {    
                   console.log(error);
                }
                else {
                      const payload = { _id: data._id, custEmail: data.custEmail};
                     const token = jwt.sign(payload, secret, {
                expiresIn: 1008000
            });
            data.token="JWT "+token;
            data.code="S01";
            console.log("data:",data);
                   return resolve(data);
                }
            });
        });
        }
    });
     });
},
 

checkLogin:async(loginDetails)=>{

    return new Promise((resolve,reject)=>{
    Customer.findOne({ custEmail: loginDetails.loginUserId },(err,existingCust)=>{
  if (err) {  
   const errorRes={
               "code":"E01",
               "desc":"Something went wrong.Please try again"
           }
          return resolve(errorRes);
        }
      else{
        console.log('existing cust',existingCust);
        if(existingCust!==null){
          bcrypt.compare(loginDetails.loginPassword, existingCust.custPasswd)
          .then(response=>{
            console.log('response:',response);
            if(response){
                const payload = { _id: existingCust._id, custEmail: existingCust.custEmail};
         console.log('payload',payload)
            const token = jwt.sign(payload, secret, {
                expiresIn: 1008000
            });
           // console.log("token:"+token)
            existingCust.token="JWT "+token;
            existingCust.code="S01";
            console.log('existing cust',existingCust)
            return resolve(existingCust);
          }
          else{
            const errorRes={
              "code":"E01",
              "desc":"Password is incorrect"
          }
         return reject(errorRes);
          }
           //  return resolve(existingCust);
        }).catch(error=>{
                 const errorRes={
               "code":"E01",
               "desc":"Password is incorrect"
           }
          return reject(errorRes);
            })
          }
          else
          {
            const errorRes={
              "code":"E01",
              "desc":"User Not found"
          }
          return reject(errorRes);
          }
      }
    })
    })
},

currencyValue:async (currency)=>{
    const currencyId=Number(currency);
    console.log('currencyid:',currencyId);

    return new Promise((resolve,reject)=>{
Curr.findOne({_id:currencyId},(err,currencyDtls)=>{
    if (err) {  
   const errorRes={
               "code":"E01",
               "desc":"Invalid Currency Id"
           }
          return resolve(errorRes);
 
         
        }
        else
        {
         
            const currencyValue=currencyDtls.currencyValue;
          return resolve(currencyValue);
        }
})
})
},
allCustomers:async()=>{
       return new Promise((resolve,reject)=>{
Customer.find({},(err,customerDtls)=>{
    if(err){
  const errorRes={
               "code":"E01",
               "desc":"Unable to fetch all customer details"
           }
          return resolve(errorRes);
        }
        else{
             return resolve(customerDtls);
        }
})
       })
},
customersByName:async(custName)=>{
  return new Promise((resolve,reject)=>{
    const name="/^"+custName+"/";
    Customer.find({custName:{"$regex":custName}},(err,custDtls)=>{
      if(err){
        const errorRes={
                     "code":"E01",
                     "desc":"Unable to fetch  customer details"
                 }
                return resolve(errorRes);
              }
              else{
                   return resolve(custDtls);
              }
      })
             
    })
  
}


}