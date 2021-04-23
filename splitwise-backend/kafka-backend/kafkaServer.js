require('dotenv').config();
const { kafka, topics } = require('../kafka');
const mongodb=require("./database/database")
const loginSignup = require('./services/LoginSignupSvc');
const groupDtls = require('./services/GroupDtlsSvc');
const custGroupDtls = require('./services/CustGrpDtlsSvc');
const profConfigDtls = require('./services/MyProfileDtlsSvc');
const myGroupDtls = require('./services/MyGroupDtlsSvc');
const grpExp = require('./services/GrpExpSvc');
const recAct=require('./services/RecentActSvc');
const dashboard=require('./services/DashboardSvc');
const settleTxn=require('./services/SettledUpSvc');
(async () => {
    const k = await kafka();
    k.subscribe(topics.API_CALL, ({ fn, params, token }) => {
   //      console.log("Kafka server", fn, params, token);
        loginSignup[fn](...params)
            .then(
                (resp) => {
                    k.send(topics.API_RESP, { token, resp, success: true });
                },
                (resp) => {
                    k.send(topics.API_RESP, { token, resp, success: false });
                },
            );
    }, 'Kafka Server');

      k.subscribe(topics.LOGIN_API, ({ fn, params, token }) => {
         console.log("Kafka server", fn, params, token);
        loginSignup[fn](...params)
            .then(
                (resp) => {
                    k.send(topics.LOGIN_RES, { token, resp, success: true });
                },
                (resp) => {
                    console.log(resp);
                    k.send(topics.LOGIN_RES, { token, resp, success: false });
                },
            ).catch(error=>{
                console.log('error',error);
            });
    }, 'Login Response');
    
    k.subscribe(topics.CURRENCY_API, ({ fn, params, token }) => {
         console.log("Kafka server", fn, params, token);
        loginSignup[fn](...params)
            .then(
                (resp) => {
                    k.send(topics.CURRENCY_RES, { token, resp, success: true });
                },
                (resp) => {
                    k.send(topics.CURRENCY_RES, { token, resp, success: false });
                },
            );
    }, 'Currency Details For User');

      k.subscribe(topics.ALL_CUST_API, ({ fn, params, token }) => {
        
        loginSignup[fn](...params)
            .then(
                (resp) => {
                    k.send(topics.ALL_CUST_RES, { token, resp, success: true });
                },
                (resp) => {
                    k.send(topics.ALL_CUST_RES, { token, resp, success: false });
                },
            );
    }, 'Get All Customer Details');

       k.subscribe(topics.CREATE_GRP_API, ({ fn, params, token }) => {
        
        groupDtls[fn](...params)
            .then(
                (resp) => {
                    k.send(topics.CREATE_GRP_RES, { token, resp, success: true });
                },
                (resp) => {
                    k.send(topics.CREATE_GRP_RES, { token, resp, success: false });
                },
            );
    }, 'Create Group');

     k.subscribe(topics.CUST_GRPS_API, ({ fn, params, token }) => {
        
        custGroupDtls[fn](...params)
            .then(
                (resp) => {
                    k.send(topics.CUST_GRPS_RES, { token, resp, success: true });
                },
                (resp) => {
                    k.send(topics.CUST_GRPS_RES, { token, resp, success: false });
                },
            );
    }, 'Fetch Customer Groups');
     k.subscribe(topics.PROF_CONFIG_API, ({ fn, params, token }) => {
        
        profConfigDtls[fn](...params)
            .then(
                (resp) => {
                    k.send(topics.PROF_CONFIG_RES, { token, resp, success: true });
                },
                (resp) => {
                    k.send(topics.PROF_CONFIG_RES, { token, resp, success: false });
                },
            );
    }, 'Fetch Config Details for My Profile');
     k.subscribe(topics.GET_GRP_INV_API, ({ fn, params, token }) => {
        
        myGroupDtls[fn](...params)
            .then(
                (resp) => {
                    k.send(topics.GET_GRP_INV_RES, { token, resp, success: true });
                },
                (resp) => {
                    k.send(topics.GET_GRP_INV_RES, { token, resp, success: false });
                },
            );
    }, 'Fetch Group Invites for Customer');
     k.subscribe(topics.ACC_GRP_INV_API, ({ fn, params, token }) => {
        
        myGroupDtls[fn](...params)
            .then(
                (resp) => {
                    k.send(topics.ACC_GRP_INV_RES, { token, resp, success: true });
                },
                (resp) => {
                    k.send(topics.ACC_GRP_INV_RES, { token, resp, success: false });
                },
            );
    }, 'Accept group invite of customer');

    k.subscribe(topics.EX_GRP_API, ({ fn, params, token }) => {
        
        myGroupDtls[fn](...params)
            .then(
                (resp) => {
                    k.send(topics.EX_GRP_RES, { token, resp, success: true });
                },
                (resp) => {
                    k.send(topics.EX_GRP_RES, { token, resp, success: false });
                },
            );
    }, 'Exit Group');

      k.subscribe(topics.CREATE_EXP_API, ({ fn, params, token }) => {
        
        grpExp[fn](...params)
            .then(
                (resp) => {
                    k.send(topics.CREATE_EXP_RES, { token, resp, success: true });
                },
                (resp) => {
                    k.send(topics.CREATE_EXP_RES, { token, resp, success: false });
                },
            );
    }, 'Create Expense For Group');

      k.subscribe(topics.GROUP_EXP_API, ({ fn, params, token }) => {
        
        grpExp[fn](...params)
            .then(
                (resp) => {
                    k.send(topics.GROUP_EXP_RES, { token, resp, success: true });
                },
                (resp) => {
                    k.send(topics.GROUP_EXP_RES, { token, resp, success: false });
                },
            );
    }, 'Fetch Group Expenses for cust');

      k.subscribe(topics.CREATE_CMNT_API, ({ fn, params, token }) => {
        
        grpExp[fn](...params)
            .then(
                (resp) => {
                    k.send(topics.CREATE_CMNT_RES, { token, resp, success: true });
                },
                (resp) => {
                    k.send(topics.CREATE_CMNT_RES, { token, resp, success: false });
                },
            );
    }, 'Create Comment for expense');

      k.subscribe(topics.FETCH_CMNTS_API, ({ fn, params, token }) => {
        
        grpExp[fn](...params)
            .then(
                (resp) => {
                    k.send(topics.FETCH_CMNTS_RES, { token, resp, success: true });
                },
                (resp) => {
                    k.send(topics.FETCH_CMNTS_RES, { token, resp, success: false });
                },
            );
    }, 'Fetch comments for Expense');

      k.subscribe(topics.DELETE_CMNT_API, ({ fn, params, token }) => {
        
        grpExp[fn](...params)
            .then(
                (resp) => {
                    k.send(topics.DELETE_CMNT_RES, { token, resp, success: true });
                },
                (resp) => {
                    k.send(topics.DELETE_CMNT_RES, { token, resp, success: false });
                },
            );
    }, 'Delete comment for expense');
     k.subscribe(topics.REC_ACT_API, ({ fn, params, token }) => {
        
        recAct[fn](...params)
            .then(
                (resp) => {
                    k.send(topics.REC_ACT_RES, { token, resp, success: true });
                },
                (resp) => {
                    k.send(topics.REC_ACT_RES, { token, resp, success: false });
                },
            );
    }, 'Delete comment for expense');
    k.subscribe(topics.UPDATE_PROF_API, ({ fn, params, token }) => {
        
        profConfigDtls[fn](...params)
            .then(
                (resp) => {
                    k.send(topics.UPDATE_PROF_RES, { token, resp, success: true });
                },
                (resp) => {
                    k.send(topics.UPDATE_PROF_RES, { token, resp, success: false });
                },
            );
    }, 'Update Customer profile details');

    k.subscribe(topics.DASHBOARD_API, ({ fn, params, token }) => {
        
        dashboard[fn](...params)
            .then(
                (resp) => {
                    k.send(topics.DASHBOARD_RES, { token, resp, success: true });
                },
                (resp) => {
                    k.send(topics.DASHBOARD_RES, { token, resp, success: false });
                },
            );
    }, 'Fetch Dashboard Details');
    k.subscribe(topics.SETTLE_UP_API, ({ fn, params, token }) => {
        
        settleTxn[fn](...params)
            .then(
                (resp) => {
                    k.send(topics.SETTLE_UP_RES, { token, resp, success: true });
                },
                (resp) => {
                    k.send(topics.SETTLE_UP_RES, { token, resp, success: false });
                },
            );
    }, 'Settle txn with customer');

    k.subscribe(topics.USR_GRP_API, ({ fn, params, token }) => {
        
        settleTxn[fn](...params)
            .then(
                (resp) => {
                    k.send(topics.USR_GRP_RES, { token, resp, success: true });
                },
                (resp) => {
                    k.send(topics.USR_GRP_RES, { token, resp, success: false });
                },
            );
    }, 'Fetch users for group');
    
})();