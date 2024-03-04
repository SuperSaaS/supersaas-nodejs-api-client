let assert = require('assert')
let SuperSaaS = require('../src/index')
let Client = SuperSaaS.Client

function newClient() {
  return new Client({dryRun: true, accountName: 'Test', api_key: 'testing123'})
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
      let client = newClient()
      client.users.get(12345).then( (data) => {
          assert.equal(client.lastRequest.path, 'https://www.supersaas.com/api/users/12345.json')
          done()
      })
    })

    it("gets one by fk", function(done) {
      let client = newClient()
      client.users.get('12345fk').then( (data) => {
        assert.equal(client.lastRequest.path, 'https://www.supersaas.com/api/users/12345fk.json')
        done()
      })
    })

    it("gets list", function(done) {
      let client = newClient()
      client.users.list(true, 10, 10).then( (data) => {
        assert.equal(client.lastRequest.path, 'https://www.supersaas.com/api/users.json?form=true&limit=10&offset=10')
        done()
      })
    })

    it("creates user", function(done) {
      let client = newClient()
      client.users.create(userAttributes(), null, true, null).then( (data) => {
        assert.equal(client.lastRequest.path, 'https://www.supersaas.com/api/users.json?webhook=true')
        done()
      })
    })

    it("creates user by fk", function(done) {
      let client = newClient()
      client.users.create(userAttributes(), '12345fk', false, null).then( (data) => {
        assert.equal(client.lastRequest.path, 'https://www.supersaas.com/api/users/12345fk.json')
        done()
      })
    })

    it("updates user", function(done) {
      let client = newClient()
      client.users.update(12345, userAttributes(), true, null).then( (data) => {
        assert.equal(client.lastRequest.path, 'https://www.supersaas.com/api/users/12345.json?webhook=true')
        done()
      })
    })

    it("deletes user", function(done) {
      let client = newClient()
      client.users.delete(12345).then( (data) => {
        assert.equal(client.lastRequest.path, 'https://www.supersaas.com/api/users/12345.json')
        done()
      })
    })

    it("lists user's fields", function(done) {
        let client = newClient()
        client.users.fieldList().then( (data) => {
            assert.equal(client.lastRequest.path, 'https://www.supersaas.com/api/field_list.json')
            done()
        })
    })
})