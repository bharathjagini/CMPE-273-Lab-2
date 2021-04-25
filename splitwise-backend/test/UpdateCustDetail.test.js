const assert = require('assert');
const {postExpense} = require("./test");

var chai = require('chai');
chaiHttp = require('chai-http');
chai.use(chaiHttp);
var expect = chai.expect;

describe("Update Customer Details", function() {
        it("should get the success response", function(done) {
              
        const profDtls=    {
    "custName": "test123",
    "custEmail": "test123@test.com",
    "custPhnNmbr": "7326937561",
    "currencyId": 101,
    "timezoneId": 105,
    "languageId": 101
}
const updateCustDetails={
    profDtls:JSON.stringify(profDtls),
    file:null
}
            chai
            .request('http://localhost:3002')
            .post('/users/updateProfDtls/8')
            .set({'authorization':'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjkxLCJjdXN0RW1haWwiOiJkZXYxMjNAdGVzdC5jb20iLCJpYXQiOjE2MTkxMjkxNjUsImV4cCI6MTYyMDEzNzE2NX0.2zpUxXin7c1zx_nTghXL5giT4_utBPHMjWPJgw5aEdk'})
            .send(updateCustDetails)
            .end(function (err, res) {
                console.log(res.status);
                expect(res.status).to.equal(200);
                done();
            });
        });

    });
