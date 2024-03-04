let assert = require('assert')
let SuperSaaS = require('../src/index')
let Client = SuperSaaS.Client

function newClient() {
    return new Client({dryRun: true, accountName: 'Test', api_key: 'testing123'})
}

describe('Promotions', function() {
    it("gets promotions with promotion code", function(done) {
        let client = newClient()
        client.promotions.promotion("12345").then( (data) => {
            assert.equal(client.lastRequest.path, 'https://www.supersaas.com/api/promotions.json?promotion_code=12345')
            done()
        })
    })

    it("lists promotions", function(done) {
        let client = newClient()
        client.promotions.list(10, 5).then( (data) => {
            assert.equal(client.lastRequest.path, 'https://www.supersaas.com/api/promotions.json?limit=10&offset=5')
            done()
        })
    })

    it("duplicates promotion", function(done) {
        let client = newClient()
        client.promotions.duplicatePromotionCode("12345", "aabbcc").then( (data) => {
            assert.equal(client.lastRequest.path, 'https://www.supersaas.com/api/promotions.json?id=12345&template_code=aabbcc')
            done()
        })
    })
})