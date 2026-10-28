let assert = require('assert')
let SuperSaaS = require('../src/index')
let Client = SuperSaaS.Client

function newClient() {
  return new Client({dryRun: true, accountName: 'Test', api_key: 'xxxxxxxxxxxxxxxxxxxxxx'})
}

function slotAttributes() {
  return {
    start: '2030-01-02 10:00:00',
    finish: new Date(2030, 0, 2, 11, 0, 0),
    title: 'Yoga',
    description: 'Testing.',
    location: 'Room 1',
    capacity: 12,
    price: 9.5,
    color: '#ff0000',
    ignored: 'x',
  }
}

describe('Slots', function() {
  it("gets one", async function() {
    let client = newClient()
    await client.slots.get(12345, 67890)
    assert.equal(client.lastRequest.method, 'GET')
    assert.equal(client.lastRequest.path, 'https://www.supersaas.com/api/slots/67890.json?schedule_id=12345')
  })

  it("gets list", async function() {
    let client = newClient()
    await client.slots.list(12345)
    assert.equal(client.lastRequest.path, 'https://www.supersaas.com/api/slots.json?schedule_id=12345')
  })

  it("gets list with filters", async function() {
    let client = newClient()
    await client.slots.list(12345, '2030-01-01 00:00:00', '2030-02-01 00:00:00', 50, 10)
    assert.equal(client.lastRequest.path, 'https://www.supersaas.com/api/slots.json?schedule_id=12345&start=2030-01-01%2000%3A00%3A00&finish=2030-02-01%2000%3A00%3A00&limit=50&offset=10')
  })

  it("creates slot", async function() {
    let client = newClient()
    await client.slots.create(12345, slotAttributes())
    assert.equal(client.lastRequest.method, 'POST')
    assert.equal(client.lastRequest.path, 'https://www.supersaas.com/api/slots.json?schedule_id=12345')
    assert.deepEqual(JSON.parse(client.lastRequest.body), {slot: {
      start: '2030-01-02 10:00:00', finish: '2030-01-02 11:00:00', title: 'Yoga', description: 'Testing.',
      location: 'Room 1', capacity: 12, price: 9.5, color: '#ff0000'}})
  })

  it("updates slot", async function() {
    let client = newClient()
    await client.slots.update(12345, 67890, {title: 'New', capacity: '-'})
    assert.equal(client.lastRequest.method, 'PUT')
    assert.equal(client.lastRequest.path, 'https://www.supersaas.com/api/slots/67890.json?schedule_id=12345')
    assert.deepEqual(JSON.parse(client.lastRequest.body), {slot: {title: 'New', capacity: '-'}})
  })

  it("does not send null attributes", async function() {
    let client = newClient()
    await client.slots.update(12345, 67890, {title: 'New', capacity: null, price: null, start: null})
    assert.deepEqual(JSON.parse(client.lastRequest.body), {slot: {title: 'New'}})
  })

  it("deletes slot", async function() {
    let client = newClient()
    await client.slots.delete(12345, 67890)
    assert.equal(client.lastRequest.method, 'DELETE')
    assert.equal(client.lastRequest.path, 'https://www.supersaas.com/api/slots/67890.json?schedule_id=12345')
  })

  it("rejects invalid ids and datetimes", async function() {
    let client = newClient()
    assert.throws(() => client.slots.get('abc', 1))
    assert.throws(() => client.slots.get(1, 'abc'))
    assert.throws(() => client.slots.create(1, {start: 'tomorrow'}))
    // falsy but not null, so still validated
    assert.throws(() => client.slots.create(1, {start: ''}))
    assert.throws(() => client.slots.update(1, 2, {finish: 0}))
  })
})
