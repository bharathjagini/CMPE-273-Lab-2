require('dotenv').config();
const {Kafka, logLevel} = require('kafkajs');
const crypto = require('crypto');
const chalk = require('chalk');

const allTopics = {
    API_CALL: 'api-call-3',
    API_RESP: 'api-resp-3',
    LOGIN_API:'login-check',
    LOGIN_RES:'login-res',
    CURRENCY_API:'currency-user',
    CURRENCY_RES:'currency-user-res',
    ALL_CUST_API:'all-customers',
    ALL_CUST_RES:'all-customers-res',
    CREATE_GRP_API:'create-group',
    CREATE_GRP_RES:'create-group-res',
    CUST_GRPS_API:'cust-groups',
    CUST_GRPS_RES:'cust-groups-res',
    PROF_CONFIG_API:'prof-config',
    PROF_CONFIG_RES:'prof-config-res',
    GET_GRP_INV_API:'get-group-invites',
    GET_GRP_INV_RES:'get-group-invites-res',
    ACC_GRP_INV_API:'accept-group-invite',
    ACC_GRP_INV_RES:'accept-group-invite-res',
    EX_GRP_API:'exit-group',
    EX_GRP_RES:'exit-group-res',
    CREATE_EXP_API:'create-expense',
    CREATE_EXP_RES:'create-expense-res',
    GROUP_EXP_API:'group-expenses',
    GROUP_EXP_RES:'group-expenses-res',
    CREATE_CMNT_API:'create-comment',
    CREATE_CMNT_RES:'create-comment-res',
    FETCH_CMNTS_API:'fetch-comments',
    FETCH_CMNTS_RES:'fetch-comments-res',
    DELETE_CMNT_API:'delete-comment',
    DELETE_CMNT_RES:'delete-comment-res',
    REC_ACT_API:'recent-activity',
    REC_ACT_RES:'recent-activity-res',
    UPDATE_PROF_API:'update-profile',
    UPDATE_PROF_RES:'update-profile-res',
    DASHBOARD_API:'dashboard',
    DASHBOARD_RES:'dashboard-res',
    SETTLE_UP_API:'settle-up',
    SETTLE_UP_RES:'settle-up-res',
    USR_GRP_API:'settle-user-group',
    USR_GRP_RES:'settle-user-group-res'
};

// Example usage
// (async () => {
// const k = await kafka();
// k.subscribe(allTopics.API_CALL, console.log);
// k.send(allTopics.API_CALL, {message:'m1'});
// const s = await k.callAndWait('sum', 1, 2);
// })();

const k = new Kafka({
    logLevel: logLevel.INFO,
    clientId: 'splitwise-kafka',
    brokers: process.env.KAFKA_BROKERS.split(','),
});

async function kafka() {
    const producer = k.producer();
    const groupId = process.env.GROUP;
    // App wide consumer group
    const consumer = k.consumer({groupId, fromBeginning: false});
    // Topics need to be defined before staring the server
    const topics = Object.values(allTopics);
    const subscriptions = {};
    await producer.connect();
    await consumer.connect();
    console.log('topic::',topics);
    await Promise.all(topics.map((topic) => consumer.subscribe({topic})));

    const send = async (topic, msg) => {
          console.log('inside send::',topic,msg)
        const messages = [{value: JSON.stringify(msg)}]
        // console.log(`Sending messages to topic ${topic}`, messages);
        producer.send({topic, messages});
    }

    const subscribe = (topic, callback, name = null) => {
        //   console.log('inside subscribe::',topic)
        if (!subscriptions.hasOwnProperty(topic)) {
            subscriptions[topic] = [];
        }
        subscriptions[topic].push((...args) => callback(...args, name));
    };
    console.log(`Still connecting to consumer group ${groupId} ...`);
    await consumer.run({
        eachMessage: async ({topic, partition, message}) => {
            if (subscriptions.hasOwnProperty(topic)) {
                subscriptions[topic].forEach((callback) => {
                    callback(JSON.parse(message.value.toString()), new Date(parseInt(message.timestamp)));
                });
            }
        },
    });

    console.info(chalk.green(`Connected consumer group ${groupId}`));

    const awaitCallbacks = {};
    subscribe(allTopics.API_RESP, ({token, resp, success}) => {
        // console.log(`Received message from topic ${allTopics.API_RESP}`, resp);
        // awaitCallbacks can be lost on restart, or in kafka server mode
        if (awaitCallbacks.hasOwnProperty(token)) {
            awaitCallbacks[token][success ? 0 : 1](resp);
            delete awaitCallbacks[token];
        }
    });

    subscribe(allTopics.LOGIN_RES, ({token, resp, success}) => {
        // console.log(`Received message from topic ${allTopics.API_RESP}`, resp);
        // awaitCallbacks can be lost on restart, or in kafka server mode
        if (awaitCallbacks.hasOwnProperty(token)) {
            awaitCallbacks[token][success ? 0 : 1](resp);
            delete awaitCallbacks[token];
        }
    });
     subscribe(allTopics.CURRENCY_RES, ({token, resp, success}) => {
        // console.log(`Received message from topic ${allTopics.API_RESP}`, resp);
        // awaitCallbacks can be lost on restart, or in kafka server mode
        if (awaitCallbacks.hasOwnProperty(token)) {
            awaitCallbacks[token][success ? 0 : 1](resp);
            delete awaitCallbacks[token];
        }
    });

      subscribe(allTopics.ALL_CUST_RES, ({token, resp, success}) => {
        if (awaitCallbacks.hasOwnProperty(token)) {
            awaitCallbacks[token][success ? 0 : 1](resp);
            delete awaitCallbacks[token];
        }
    });
      subscribe(allTopics.CREATE_GRP_RES, ({token, resp, success}) => {
        if (awaitCallbacks.hasOwnProperty(token)) {
            awaitCallbacks[token][success ? 0 : 1](resp);
            delete awaitCallbacks[token];
        }
    });
     subscribe(allTopics.CUST_GRPS_RES, ({token, resp, success}) => {
        if (awaitCallbacks.hasOwnProperty(token)) {
            awaitCallbacks[token][success ? 0 : 1](resp);
            delete awaitCallbacks[token];
        }
    });
     subscribe(allTopics.PROF_CONFIG_RES, ({token, resp, success}) => {
        if (awaitCallbacks.hasOwnProperty(token)) {
            awaitCallbacks[token][success ? 0 : 1](resp);
            delete awaitCallbacks[token];
        }
    });
    subscribe(allTopics.GET_GRP_INV_RES, ({token, resp, success}) => {
        if (awaitCallbacks.hasOwnProperty(token)) {
            awaitCallbacks[token][success ? 0 : 1](resp);
            delete awaitCallbacks[token];
        }
    });
     subscribe(allTopics.ACC_GRP_INV_RES, ({token, resp, success}) => {
        if (awaitCallbacks.hasOwnProperty(token)) {
            awaitCallbacks[token][success ? 0 : 1](resp);
            delete awaitCallbacks[token];
        }
    });
    subscribe(allTopics.EX_GRP_RES, ({token, resp, success}) => {
        if (awaitCallbacks.hasOwnProperty(token)) {
            awaitCallbacks[token][success ? 0 : 1](resp);
            delete awaitCallbacks[token];
        }
    });
     subscribe(allTopics.CREATE_EXP_RES, ({token, resp, success}) => {
        if (awaitCallbacks.hasOwnProperty(token)) {
            awaitCallbacks[token][success ? 0 : 1](resp);
            delete awaitCallbacks[token];
        }
    });
     subscribe(allTopics.GROUP_EXP_RES, ({token, resp, success}) => {
        if (awaitCallbacks.hasOwnProperty(token)) {
            awaitCallbacks[token][success ? 0 : 1](resp);
            delete awaitCallbacks[token];
        }
    });
     subscribe(allTopics.CREATE_CMNT_RES, ({token, resp, success}) => {
        if (awaitCallbacks.hasOwnProperty(token)) {
            awaitCallbacks[token][success ? 0 : 1](resp);
            delete awaitCallbacks[token];
        }
    });
     subscribe(allTopics.FETCH_CMNTS_RES, ({token, resp, success}) => {
        if (awaitCallbacks.hasOwnProperty(token)) {
            awaitCallbacks[token][success ? 0 : 1](resp);
            delete awaitCallbacks[token];
        }
    });
     subscribe(allTopics.DELETE_CMNT_RES, ({token, resp, success}) => {
        if (awaitCallbacks.hasOwnProperty(token)) {
            awaitCallbacks[token][success ? 0 : 1](resp);
            delete awaitCallbacks[token];
        }
    });
      subscribe(allTopics.REC_ACT_RES, ({token, resp, success}) => {
        if (awaitCallbacks.hasOwnProperty(token)) {
            awaitCallbacks[token][success ? 0 : 1](resp);
            delete awaitCallbacks[token];
        }
    });
    subscribe(allTopics.UPDATE_PROF_RES, ({token, resp, success}) => {
        if (awaitCallbacks.hasOwnProperty(token)) {
            awaitCallbacks[token][success ? 0 : 1](resp);
            delete awaitCallbacks[token];
        }
    });
    subscribe(allTopics.DASHBOARD_RES, ({token, resp, success}) => {
            if (awaitCallbacks.hasOwnProperty(token)) {
                awaitCallbacks[token][success ? 0 : 1](resp);
                delete awaitCallbacks[token];
            }
    });
    subscribe(allTopics.SETTLE_UP_RES, ({token, resp, success}) => {
        if (awaitCallbacks.hasOwnProperty(token)) {
            awaitCallbacks[token][success ? 0 : 1](resp);
            delete awaitCallbacks[token];
        }
    });
    subscribe(allTopics.USR_GRP_RES, ({token, resp, success}) => {
        if (awaitCallbacks.hasOwnProperty(token)) {
            awaitCallbacks[token][success ? 0 : 1](resp);
            delete awaitCallbacks[token];
        }
    });

    return {
        send,
        subscribe,
        callAndWait: (fn, ...params) => new Promise((resolve, reject) => {
            const token = crypto.randomBytes(64).toString('hex');
            console.log('token::,fn,params',token,fn,params)
            awaitCallbacks[token] = [resolve, reject];
            send(allTopics.API_CALL, {fn, params, token});
        }),

        checkLogin: (fn, ...params) => new Promise((resolve, reject) => {
            const token = crypto.randomBytes(64).toString('hex');
            console.log('token::,fn,params',token,fn,params)
            awaitCallbacks[token] = [resolve, reject];
            send(allTopics.LOGIN_API, {fn, params, token});
        }),

         currencyDtl: (fn, ...params) => new Promise((resolve, reject) => {
            const token = crypto.randomBytes(64).toString('hex');
            console.log('token::,fn,params',token,fn,params)
            awaitCallbacks[token] = [resolve, reject];
            send(allTopics.CURRENCY_API, {fn, params, token});
        }),
         allCustomers: (fn, ...params) => new Promise((resolve, reject) => {
            const token = crypto.randomBytes(64).toString('hex');
            console.log('token::,fn,params',token,fn,params)
            awaitCallbacks[token] = [resolve, reject];
            send(allTopics.ALL_CUST_API, {fn, params, token});
        }),
         createGroup: (fn, ...params) => new Promise((resolve, reject) => {
            const token = crypto.randomBytes(64).toString('hex');
            console.log('token::,fn,params',token,fn,params)
            awaitCallbacks[token] = [resolve, reject];
            send(allTopics.CREATE_GRP_API, {fn, params, token});
        }),
         getCustGroups: (fn, ...params) => new Promise((resolve, reject) => {
            const token = crypto.randomBytes(64).toString('hex');
            console.log('token::,fn,params',token,fn,params)
            awaitCallbacks[token] = [resolve, reject];
            send(allTopics.CUST_GRPS_API, {fn, params, token});
        }),
         profConfigDetails: (fn, ...params) => new Promise((resolve, reject) => {
            const token = crypto.randomBytes(64).toString('hex');
            console.log('token::,fn,params',token,fn,params)
            awaitCallbacks[token] = [resolve, reject];
            send(allTopics.PROF_CONFIG_API, {fn, params, token});
        }),
        
           fetchGroupInvitesForCust: (fn, ...params) => new Promise((resolve, reject) => {
            const token = crypto.randomBytes(64).toString('hex');
            console.log('token::,fn,params',token,fn,params)
            awaitCallbacks[token] = [resolve, reject];
            send(allTopics.GET_GRP_INV_API, {fn, params, token});
        }),
        acceptGrpInvite: (fn, ...params) => new Promise((resolve, reject) => {
            const token = crypto.randomBytes(64).toString('hex');
            console.log('token::,fn,params',token,fn,params)
            awaitCallbacks[token] = [resolve, reject];
            send(allTopics.ACC_GRP_INV_API, {fn, params, token});
        }),
         exitGroup: (fn, ...params) => new Promise((resolve, reject) => {
            const token = crypto.randomBytes(64).toString('hex');
            console.log('token::,fn,params',token,fn,params)
            awaitCallbacks[token] = [resolve, reject];
            send(allTopics.EX_GRP_API, {fn, params, token});
        }),
         createExpense: (fn, ...params) => new Promise((resolve, reject) => {
            const token = crypto.randomBytes(64).toString('hex');
            console.log('token::,fn,params',token,fn,params)
            awaitCallbacks[token] = [resolve, reject];
            send(allTopics.CREATE_EXP_API, {fn, params, token});
        }),
         grpExpDtls: (fn, ...params) => new Promise((resolve, reject) => {
            const token = crypto.randomBytes(64).toString('hex');
            console.log('token::,fn,params',token,fn,params)
            awaitCallbacks[token] = [resolve, reject];
            send(allTopics.GROUP_EXP_API, {fn, params, token});
        }),
         createComment: (fn, ...params) => new Promise((resolve, reject) => {
            const token = crypto.randomBytes(64).toString('hex');
            console.log('token::,fn,params',token,fn,params)
            awaitCallbacks[token] = [resolve, reject];
            send(allTopics.CREATE_CMNT_API, {fn, params, token});
        }),
         fetchComments: (fn, ...params) => new Promise((resolve, reject) => {
            const token = crypto.randomBytes(64).toString('hex');
            console.log('token::,fn,params',token,fn,params)
            awaitCallbacks[token] = [resolve, reject];
            send(allTopics.FETCH_CMNTS_API, {fn, params, token});
        }),
         deleteComment: (fn, ...params) => new Promise((resolve, reject) => {
            const token = crypto.randomBytes(64).toString('hex');
            console.log('token::,fn,params',token,fn,params)
            awaitCallbacks[token] = [resolve, reject];
            send(allTopics.DELETE_CMNT_API, {fn, params, token});
        }),
         recentActivity: (fn, ...params) => new Promise((resolve, reject) => {
            const token = crypto.randomBytes(64).toString('hex');
            console.log('token::,fn,params',token,fn,params)
            awaitCallbacks[token] = [resolve, reject];
            send(allTopics.REC_ACT_API, {fn, params, token});
        }),
        updateProfDtls: (fn, ...params) => new Promise((resolve, reject) => {
            const token = crypto.randomBytes(64).toString('hex');
            console.log('token::,fn,params',token,fn,params)
            awaitCallbacks[token] = [resolve, reject];
            send(allTopics.UPDATE_PROF_API, {fn, params, token});
        }),
        dashboardDtls: (fn, ...params) => new Promise((resolve, reject) => {
            const token = crypto.randomBytes(64).toString('hex');
            console.log('token::,fn,params',token,fn,params)
            awaitCallbacks[token] = [resolve, reject];
            send(allTopics.DASHBOARD_API, {fn, params, token});
        }),
        settleUp: (fn, ...params) => new Promise((resolve, reject) => {
            const token = crypto.randomBytes(64).toString('hex');
            console.log('token::,fn,params',token,fn,params)
            awaitCallbacks[token] = [resolve, reject];
            send(allTopics.SETTLE_UP_API, {fn, params, token});
        }),
        userGrpDtls: (fn, ...params) => new Promise((resolve, reject) => {
            const token = crypto.randomBytes(64).toString('hex');
            console.log('token::,fn,params',token,fn,params)
            awaitCallbacks[token] = [resolve, reject];
            send(allTopics.USR_GRP_API, {fn, params, token});
        }),
        
    };
}

module.exports = {kafka, topics: allTopics};