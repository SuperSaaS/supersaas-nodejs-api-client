let assert = require('assert')
let SuperSaaS = require('../src/index')
let Client = SuperSaaS.Client

function newClient() {
  return new Client({dryRun: true, accountName: 'Test', api_key: 'xxxxxxxxxxxxxxxxxxxxxx'})
}

describe('Schedules', function() {
    it("lists schedules", function(done) {
      let client = newClient()
      client.schedules.list().then( (data) => {
        assert.equal(client.lastRequest.path, 'https://www.supersaas.com/api/schedules.json')
        done()
      })
    })

    it("lists resources", function(done) {
      let client = newClient()
      client.schedules.resources(12345).then( (data) => {
        assert.equal(client.lastRequest.path, 'https://www.supersaas.com/api/resources.json?schedule_id=12345')
        done()
      })
    })

    it("lists resource fields", function(done) {
        let client = newClient()
        client.schedules.fieldList(12345).then( (data) => {
            assert.equal(client.lastRequest.path, 'https://www.supersaas.com/api/field_list.json?schedule_id=12345')
            done()
        })
    })
})