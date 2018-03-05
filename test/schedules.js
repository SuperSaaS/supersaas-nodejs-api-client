var assert = require('assert');
var SuperSaaS = require('../src/index');
var Client = SuperSaaS.Client;

function newClient() {
  return new Client({dryRun: true, accountName: 'Test', password: 'testing123'})
}

describe('Schedules', function() {
    it("lists schedules", function(done) {
      var client = newClient();
      client.schedules.list(function(err, data) {
        assert.equal(client.lastRequest.path, '/api/schedules.json')
        done()
      })
    })

    it("lists resources", function(done) {
      var client = newClient();
      client.schedules.resources(12345, function(err, data) {
        assert.equal(client.lastRequest.path, '/api/resources.json?schedule_id=12345')
        done()
      })
    })
});