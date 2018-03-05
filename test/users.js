var assert = require('assert');
var SuperSaaS = require('../src/index');
var Client = SuperSaaS.Client;

function newClient() {
  return new Client({dryRun: true, accountName: 'Test', password: 'testing123'})
}

function userAttributes() {
  return {
    name: 'Test',
    email: 'test@example.com',
    password: 'pass123',
    full_name: 'Tester Test',
    address: '123 St, City',
    mobile: '555-5555',
    phone: '555-5555',
    country: 'FR',
    field_1: 'f 1',
    field_2: 'f 2',
    super_field: 'sf',
    credit: 10,
    role: 3
  }
}

describe('Users', function() {
    it("gets one", function(done) {
      var client = newClient();
      client.users.get(12345, function(err, data) {
        assert.equal(client.lastRequest.path, '/api/users/12345.json')
        done()
      })
    })

    it("gets one by fk", function(done) {
      var client = newClient();
      client.users.get('12345fk', function(err, data) {
        assert.equal(client.lastRequest.path, '/api/users/12345fk.json')
        done()
      })
    })

    it("gets list", function(done) {
      var client = newClient();
      client.users.list(true, 10, function(err, data) {
        assert.equal(client.lastRequest.path, '/api/users.json?form=true&limit=10')
        done()
      })
    })

    it("creates user", function(done) {
      var client = newClient();
      client.users.create(userAttributes(), null, true, function(err, data) {
        assert.equal(client.lastRequest.path, '/api/users.json?webhook=true')
        done()
      })
    })

    it("creates user by fk", function(done) {
      var client = newClient();
      client.users.create(userAttributes(), '12345fk', function(err, data) {
        assert.equal(client.lastRequest.path, '/api/users/12345fk.json')
        done()
      })
    })

    it("updates user", function(done) {
      var client = newClient();
      client.users.update(12345, userAttributes(), true, function(err, data) {
        assert.equal(client.lastRequest.path, '/api/users/12345.json?webhook=true')
        done()
      })
    })

    it("deletes user", function(done) {
      var client = newClient();
      client.users.delete(12345, function(err, data) {
        assert.equal(client.lastRequest.path, '/api/users/12345.json')
        done()
      })
    })
});