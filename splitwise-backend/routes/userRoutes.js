require('dotenv').config();
const customer = require("../controller/CustDtls1.controller");
const group = require("../controller/GroupDtls.controller");
const custGroup = require("../controller/CustGrpDtls.controller");
const myGroup= require("../controller/MyGroup.controller");
const myProf= require("../controller/MyProfile.controller");
const grpExp= require("../controller/GrpExp.controller");
const recAct= require("../controller/RecentActivity.controller");
var router = require("express").Router();
const multer = require('multer');
var upload = multer();

const { checkAuth } = require("../passport/passport");
const {kafka} = require('../kafka');

(async()=>{
const k=await kafka();
    callAndWait=await k.callAndWait;
    checkLogin=await k.checkLogin;
    currencyDtl=await k.currencyDtl;
    allCustomers=await k.allCustomers;
    createGroup=await k.createGroup;
    getCustGroups=await k.getCustGroups;
    profConfigDetails=await k.profConfigDetails;
    fetchGroupInvitesForCust=await k.fetchGroupInvitesForCust;
    acceptGrpInvite=await k.acceptGrpInvite;
    exitGroup=await k.exitGroup;
    createExpense=await k.createExpense;
    grpExpDtls=await k.grpExpDtls;
    createComment=await k.createComment;
    fetchComments=await k.fetchComments;
    deleteComment=await k.deleteComment;
    recentActivity=await k.recentActivity;
    updateProfDtls=await k.updateProfDtls;
    dashboardDtls=await k.dashboardDtls;
    settleUp=await k.settleUp;
})();


router.post("/signup", async (req,res)=>{
const response= await callAndWait('createCustomer', req.body);
  
  res.status(201).send(response);
  });

  router.post("/login", async (req,res)=>{
    try{
const response= await checkLogin('checkLogin', req.body);
 console.log('response:',response);
  res.status(200).send(response);
 
  }
catch(error){
  console.log('error:',error);
  res.status(500).send(error);
 
}
});

  router.get("/currency/:currencyId",checkAuth,async (req,res)=>{
const response= await currencyDtl('currencyValue', req.params.currencyId);
  res.status(200).send(response);
  });

router.get("/allCustomers",checkAuth,async (req,res)=>{
const response= await allCustomers('allCustomers', {});

  res.status(200).send(response);

  });
router.post("/createGroup",checkAuth ,async (req,res)=>{
const response= await createGroup('createGroup', req.body);
  
  res.status(201).send(response);
  });
//router.post("/createCustGroup", custGroup.createCustGroup);
router.get("/custGroup/:custId", checkAuth,async (req,res)=>{
const response= await getCustGroups('custGroups', req.params.custId);
  res.status(200).send(response);

  });
  router.get("/configDtls",checkAuth,async (req,res)=>{
const response= await profConfigDetails('profConfigDetails', {});
  res.status(200).send(response);

  });

router.get("/groupInvites/:custId",checkAuth,async (req,res)=>{
const response= await fetchGroupInvitesForCust('groupInvites', req.params.custId);
  res.status(200).send(response);

  });

router.put("/acceptInvite",checkAuth,async (req,res)=>{
const response= await acceptGrpInvite('acceptInvite', req.body);
  res.status(200).send(response);

  });
router.put("/exitGroup",checkAuth,async (req,res)=>{
const response= await exitGroup('exitGroup', req.body);
  res.status(200).send(response);

  });

router.post("/createExpense",checkAuth,async (req,res)=>{
const response= await createExpense('createExpense', req.body);
  res.status(201).send(response);

  });

  
router.get("/grpExpDtls",checkAuth,async (req,res)=>{
const response= await grpExpDtls('grpMemOweDetails',req.query.groupId);
  res.status(200).send(response);

  });
router.post("/createComment",checkAuth,async (req,res)=>{
const response= await createComment('createComment', req.body);
  res.status(201).send(response);

  });
router.get("/comments/:expenseId",checkAuth,async (req,res)=>{
const response= await fetchComments('fetchComments', req.params.expenseId);
  res.status(200).send(response);

  });
router.delete("/deleteComment",checkAuth,async (req,res)=>{
const response= await deleteComment('deleteComment', req.body);
  res.status(200).send(response);

  });
router.post("/recentActivity",checkAuth,async (req,res)=>{
const response= await recentActivity('recentActivity', req.body);
  res.status(200).send(response);

  });

  router.post("/updateProfDtls/:custId",upload.single('file'), async (req,res)=>{
    const profileUpdateReq={
      image:req.file,
      profDtls:req.body.profDtls
    }
    console.log('body:',JSON.stringify(req.body.profDtls))
    const response= await updateProfDtls('updateProfDtls', profileUpdateReq);
      res.status(200).send(response);
    
      });

      router.get("/dashboardDtls/:custId", async (req,res)=>{
       
        const response= await dashboardDtls('grpDashboardAmountDetails', req.params.custId);
          res.status(200).send(response);
        
          });

      router.post("/settleup", async (req,res)=>{
       
            const response= await settleUp('settleUp', req.body);
              res.status(200).send(response);
            
              });
    



  








module.exports = router;