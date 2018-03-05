var assert = require('assert');
var SuperSaaS = require('../src/index');
var Client = SuperSaaS.Client;

function newClient() {
  return new Client({dryRun: true, accountName: 'Test', password: 'testing123'})
}

describe('Forms', function() {
    it("gets one", function(done) {
      var client = newClient();
      client.forms.get(12345, function(err, data) {
        assert.equal(client.lastRequest.path, '/api/forms.json?id=12345')
        done()
      })
    })

    it("gets list", function(done) {
      var client = newClient();
      client.forms.list(12345, new Date(2010,1,1), function(err, data) {
        assert.equal(client.lastRequest.path, '/api/forms.json?form_id=12345&from=2010-1-2%200%3A0%3A00')
        done()
      })
    })
});