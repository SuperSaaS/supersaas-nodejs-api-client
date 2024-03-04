let assert = require('assert')
let SuperSaaS = require('../src/index')
let Client = SuperSaaS.Client

function newClient() {
    return new Client({dryRun: true, accountName: 'Test', api_key: 'testing123'})
}

describe('Groups', function() {
    it("list groups", function(done) {
        let client = newClient()
        client.groups.list().then( (data) => {
            assert.equal(client.lastRequest.path, 'https://www.supersaas.com/api/groups.json')
            done()
        })
    })
});