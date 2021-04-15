const Customer = require('../Models/CustomerModel');
const Curr=require('../Models/CurrencyModel')
const autoSeq=require('./AutoSeq.controller');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
var { secret } = require("../database/config");
const { auth } = require("../passport/passport");
auth();
 const saltRounds = 10;

exports.createCustomer= async (req,res)=>{


    const custIdValue=await autoSeq.getSequenceValue('customer');

    console.log('custid value::',custIdValue)
    let customer=new Customer({
    _id:custIdValue,
    custName:req.body.custName,
    custEmail:req.body.custEmail,
    custPasswd:req.body.custPassword,
    createdBy:req.body.custName,
    currencyId:101,
    timezoneId:1001,
    languageId:1001,
    createdDate:new Date()
    })
  Customer.findOne({ custEmail: req.body.custEmail }, (error, oldCustomer) => {
        if (error) {
    
            res.writeHead(500, {
                'Content-Type': 'text/plain'
            })
            res.end();
        }
        if (oldCustomer) {
            res.writeHead(400, {
                'Content-Type': 'text/plain'
            })
            res.end("Email already exists");
        }
        else {
            console.log('non exist cust')
            bcrypt.hash(customer.custPasswd, saltRounds, (err, hash)=> {
            customer.custPasswd = hash; 
            customer.save((error, data) => {
                if (error) {    
                    res.writeHead(500, {
                        'Content-Type': 'text/plain'
                    })
                    res.end();
                }
                else {
                      const payload = { _id: data._id, custEmail: data.custEmail};
                     const token = jwt.sign(payload, secret, {
                expiresIn: 1008000
            });
            data.token="JWT "+token;
            console.log("data:",data);
                    res.status(201).send(data);
                }
            });
        });
        }
    });
}
exports.checkLogin=(req,res)=>{
    Customer.findOne({ custEmail: req.body.loginUserId },(err,existingCust)=>{
  if (err) {  
    res.writeHead(500, {
     'Content-Type': 'text/plain'
    })
            res.end();
        }
      else{
          bcrypt.compare(req.body.loginPassword, existingCust.custPasswd)
          .then(response=>{
              console.log(response)
                const payload = { _id: existingCust._id, custEmail: existingCust.custEmail};
         console.log('payload',payload)
            const token = jwt.sign(payload, secret, {
                expiresIn: 1008000
            });
           // console.log("token:"+token)
            existingCust.token="JWT "+token;
            console.log('existing cust',existingCust)
                    res.status(200).send(existingCust);
        }).catch(error=>{
                 res.writeHead(500, {
                        'Content-Type': 'text/plain'
                    })
                    res.end("Invalid Credentials");
            })
      }
    })
}
exports.getCurrencyDtls=(req,res)=>{
    const currencyId=Number(req.params.currencyId);
    console.log('currencyid:',currencyId)
Curr.findOne({_id:currencyId},(err,currencyDtls)=>{
    if (err) {  
    res.writeHead(500, {
     'Content-Type': 'text/plain'
    })
            res.end("Invalid Currency Id");
        }
        else
        {
            // console.log(currencyDtls);
            // console.log('')
            const currencyValue=currencyDtls.currencyValue;
            res.status(200).send(currencyValue);
        }
})
}
exports.getAllCustomers=(req,res)=>{
Customer.find({},(err,customerDtls)=>{
    if(err){
    res.writeHead(500, {
     'Content-Type': 'text/plain'
    })
            res.end("Invalid Currency Id");
        }
        else{
              res.status(200).send(customerDtls);
        }
})
}