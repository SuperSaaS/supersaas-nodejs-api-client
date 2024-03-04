let assert = require('assert')
let SuperSaaS = require('../src/index')
let Client = SuperSaaS.Client

function newClient() {
  return new Client({dryRun: true, accountName: 'Test', api_key: 'testing123'})
}

describe('Forms', function() {
    it("gets one", function(done) {
      let client = newClient()
      client.forms.get(12345).then( (data) => {
        assert.equal(client.lastRequest.path, 'https://www.supersaas.com/api/forms.json?id=12345')
        done()
      })
    })

    it("gets list", function(done) {
      let client = newClient()
      client.forms.list(12345, new Date(2010,1,1), null).then( (data) => {
        assert.equal(client.lastRequest.path, 'https://www.supersaas.com/api/forms.json?form_id=12345&from=2010-1-2%200%3A0%3A00')
        done()
      })
    })

    it("list of super forms", function(done) {
       let client = newClient()
       client.forms.forms().then( (data) => {
           assert.equal(client.lastRequest.path, 'https://www.supersaas.com/api/super_forms.json')
           done()
       })
    })
});