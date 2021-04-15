const Customer = require('./Models/CustomerModel');
const autoSeq=require('./controller/AutoSeq.controller');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
var { secret } = require("./database/config");
const { auth } = require("./passport/passport");

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
    createdDate:new Date()
    })
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
          return resolve(errorRes);
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
}
   
}