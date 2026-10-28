let assert = require('assert')
let SuperSaaS = require('../src/index')
let Client = SuperSaaS.Client

function newClient() {
  return new Client({dryRun: true, accountName: 'Test', api_key: 'xxxxxxxxxxxxxxxxxxxxxx'})
}

describe('Hooks', function() {
  it("creates hook", async function() {
    let client = newClient()
    await client.hooks.create('https://www.example.com/hook', 'U', 12345)
    assert.equal(client.lastRequest.method, 'POST')
    assert.equal(client.lastRequest.path, 'https://www.supersaas.com/api/hooks.json')
    assert.deepEqual(JSON.parse(client.lastRequest.body), {target_url: 'https://www.example.com/hook', event: 'U', parent_id: 12345})
  })

  it("deletes hook", async function() {
    let client = newClient()
    await client.hooks.delete(111, 12345)
    assert.equal(client.lastRequest.method, 'DELETE')
    assert.equal(client.lastRequest.path, 'https://www.supersaas.com/api/hooks.json?id=111&parent_id=12345')
  })

  it("lists hooks", async function() {
    let client = newClient()
    await client.hooks.list()
    assert.equal(client.lastRequest.method, 'GET')
    assert.equal(client.lastRequest.path, 'https://www.supersaas.com/api/hooks.json')
  })

  it("rejects invalid ids", function() {
    let client = newClient()
    assert.throws(() => client.hooks.create('https://www.example.com/hook', 'U', 'abc'))
    assert.throws(() => client.hooks.delete('abc', 1))
  })

  it("rejects a missing target url or event", function() {
    let client = newClient()
    assert.throws(() => client.hooks.create('', 'U', 12345), /Required parameter is missing/)
    assert.throws(() => client.hooks.create(null, 'U', 12345), /Required parameter is missing/)
    assert.throws(() => client.hooks.create('https://www.example.com/hook', '', 12345), /Required parameter is missing/)
    assert.throws(() => client.hooks.create('https://www.example.com/hook', undefined, 12345), /Required parameter is missing/)
  })
})
