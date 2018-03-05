var assert = require('assert');
var SuperSaaS = require('../src/index');
var Client = SuperSaaS.Client;

function newClient() {
  return new Client({dryRun: true, accountName: 'Test', password: 'testing123'})
}

describe('Client', function() {
  it("initializes apis", function() {
    var client = new Client({test: true})
    assert.equal(typeof client.appointments, 'object')
    assert.equal(typeof client.forms, 'object')
    assert.equal(typeof client.users, 'object')
  })

  it("performs request", function() {
    var client = newClient()
    assert.ok(client.request('GET', '/test'))
  })

  it("performs get", function(done) {
    var client = newClient()
    var res = client.get('/test', {test: true}, function (err, data) {
      assert.equal(client.lastRequest.method, 'GET')
      assert.equal(client.lastRequest.path, '/api/test.json?test=true')
      assert.equal(client.lastRequest.headers['Accept'], 'application/json')
      assert.equal(client.lastRequest.headers['Content-Type'], 'application/json')
      assert.equal(client.lastRequest.headers['Authorization'], 'Basic VGVzdDp0ZXN0aW5nMTIz')
      done()
    });
  })

  it("performs post", function(done) {
    var client = newClient()
    var res = client.post('/test', {test: true}, null, function (err, data) {
      assert.equal(client.lastRequest.method, 'POST')
      done()
    });
  })

  it("performs put", function(done) {
    var client = newClient()
    var res = client.put('/test', {test: true}, {q: 1}, function (err, data) {
      assert.equal(client.lastRequest.method, 'PUT')
      done()
    });
  })

  it("performs delete", function(done) {
    var client = newClient()
    var res = client.delete('/test', {test: true}, {}, function (err, data) {
      assert.equal(client.lastRequest.method, 'DELETE')
      done()
    });
  })

  it("configures instance", function() {
    Client.configure({
      accountName: 'account',
      password: 'password',
      userName: 'user',
      host: 'http://test',
      dryRun: true,
      verbose: true
    })
    assert.equal(Client.Instance.accountName, 'account')
    assert.equal(Client.Instance.password, 'password')
    assert.equal(Client.Instance.host, 'http://test')
    assert.equal(Client.Instance.dryRun, true)
    assert.equal(Client.Instance.verbose, true)
  })
});