const http = require('http');
//const axios=require("axios");

const getCustomers = (url) => {
    return new Promise((resolve, reject) => {
        http.get(url, (resp) => {
            let data = '';
         //   console.log(resp);
            resp.on('data', chunk => data += chunk);
            resp.on('end', () => {
                resolve(JSON.parse(data));
            });
        }).on("error", reject);
    })
}

const postExpense = (url,req) => {
    return new Promise((resolve, reject) => {
        axios.post(url, (resp) => {
            let data = '';
            console.log(resp);
            resp.on('data', chunk => data += chunk);
            resp.on('end', () => {
                resolve(JSON.parse(data));
            });
        }).on("error", reject);
    })
}


module.exports = {getCustomers,postExpense}

