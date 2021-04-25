const assert = require('assert');
const {postExpense} = require("./test");

var chai = require('chai');
chaiHttp = require('chai-http');
chai.use(chaiHttp);
var expect = chai.expect;
describe("Create Group", function() {
        it("should get the group id as Number", function(done) {
              createGroup=   {
            "groupName": "sample-101",
 // "groupMembers": [ { "id": 1, "name": "zvb", "email": "test123@test.com" } ],
  "custIds":[11],
  "createdCustId": 7,
  "createdCustName": "Rakesh"
}
            chai
            .request('http://localhost:3002')
            .post('/users/createGroup')
            .set({'authorization':'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjkxLCJjdXN0RW1haWwiOiJkZXYxMjNAdGVzdC5jb20iLCJpYXQiOjE2MTkxMjkxNjUsImV4cCI6MTYyMDEzNzE2NX0.2zpUxXin7c1zx_nTghXL5giT4_utBPHMjWPJgw5aEdk'})
            .send(createGroup)
            .end(function (err, res) {
                expect(res.status).to.equal(201);
                expect(res.body._id).to.be.a('number')
                done();
            });
        });

    });
