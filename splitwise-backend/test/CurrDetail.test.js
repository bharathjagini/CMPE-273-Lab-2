const assert = require('assert');
const {postExpense} = require("./test");

var chai = require('chai');
chaiHttp = require('chai-http');
chai.use(chaiHttp);
var expect = chai.expect;
describe("Get Currency Value", function() {
        it("should get the valid currency on passing currencyId", function(done) {
            chai
            .request('http://localhost:3002')
            .get('/users/currency/101')
            .set({'authorization':'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjkxLCJjdXN0RW1haWwiOiJkZXYxMjNAdGVzdC5jb20iLCJpYXQiOjE2MTkxMjkxNjUsImV4cCI6MTYyMDEzNzE2NX0.2zpUxXin7c1zx_nTghXL5giT4_utBPHMjWPJgw5aEdk'})
            .send()
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.text).to.deep.equals('USD');
                done();
            });
        });

    });
