const assert = require('assert');
const {postExpense} = require("./test");

var chai = require('chai');
chaiHttp = require('chai-http');
chai.use(chaiHttp);
var expect = chai.expect;
describe("Create Expense", function() {
        it("should get the success response", function(done) {
              createExpense=   {
    "groupId": 4,
        "custId": 8,
        "expenseDesc":"snacks",
        "amount":200,
        "custName":"dev3",
        "custIds":[9]
}

            chai
            .request('http://localhost:3002')
            .post('/users/createExpense')
            .set({'authorization':'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjkxLCJjdXN0RW1haWwiOiJkZXYxMjNAdGVzdC5jb20iLCJpYXQiOjE2MTkxMjkxNjUsImV4cCI6MTYyMDEzNzE2NX0.2zpUxXin7c1zx_nTghXL5giT4_utBPHMjWPJgw5aEdk'})
            .send(createExpense)
            .end(function (err, res) {
                console.log(res.status);
                expect(res.status).to.equal(201);
                done();
            });
        });

    });
