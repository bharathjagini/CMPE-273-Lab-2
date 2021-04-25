const assert = require('assert');
const {getCustomers} = require("./test");
describe('GET All customers Count API call', () => {

    it('should return correct customers registered count ', async () => {
        const response = await getCustomers('http://localhost:3002/users/allCustomers');
        console.log(response.length);
        assert.strictEqual(response.length, 32);
    });

});