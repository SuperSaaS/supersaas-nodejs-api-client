let assert = require('assert')
let SuperSaaS = require('../src/index')
let Client = SuperSaaS.Client

function newClient() {
  return new Client({dryRun: true, accountName: 'Test', api_key: 'xxxxxxxxxxxxxxxxxxxxxx'})
}

function appointmentAttributes() {
  return {
    description: 'Testing.',
    name: 'Test',
    email: 'test@example.com',
    full_name: 'Tester Test',
    address: '123 St, City',
    mobile: '555-5555',
    phone: '555-5555',
    country: 'FR',
    field_1: 'f 1',
    field_2: 'f 2',
    field_1_r: 'f 1 r',
    field_2_r: 'f 2 r',
    super_field: 'sf'
  }
}

describe('Appointments', function() {
    it("gets one", async function() {
      let client = newClient()
      await client.appointments.get(12345, 67890)
      assert.equal(client.lastRequest.path, 'https://www.supersaas.com/api/bookings/67890.json?schedule_id=12345')
    })

    it("gets list", async function() {
      let client = newClient()
      await client.appointments.list(12345, true, new Date(2010, 1, 1))
      assert.equal(client.lastRequest.path, 'https://www.supersaas.com/api/bookings.json?schedule_id=12345&form=true&start=2010-02-01%2000%3A00%3A00')
    })

    it("gets list legacy", function() {
        let client = newClient()
        return client.appointments.list(12345, true, '2010-02-01 00:00:00', 10, '2010-03-01 00:00:00').then(() => {
            assert.equal(client.lastRequest.path, 'https://www.supersaas.com/api/bookings.json?schedule_id=12345&form=true&start=2010-02-01%2000%3A00%3A00&limit=10&finish=2010-03-01%2000%3A00%3A00')
        })
    })

    it("creates appointment", async function() {
      let client = newClient()
        console.log(client)
        await client.appointments.create(12345, 67890, appointmentAttributes(), false, false)
        assert.equal(client.lastRequest.method, 'POST')
        assert.equal(client.lastRequest.path, 'https://www.supersaas.com/api/bookings.json')
        const body = JSON.parse(client.lastRequest.body)
        assert.equal(body.schedule_id, 12345)
        assert.equal(body.user_id, 67890)
        assert.equal(body.booking.full_name, 'Tester Test')
    })

    it("creates appointment with form and webhook", async function() {
        let client = newClient()
        await client.appointments.create(12345, 67890, appointmentAttributes(), true, true)
        const body = JSON.parse(client.lastRequest.body)
        assert.equal(body.form, true)
        assert.equal(body.webhook, 'true')
    })

    it("updates appointment", async function() {
      let client = newClient()
      await client.appointments.update(12345, 67890, appointmentAttributes(), true, false)
      assert.equal(client.lastRequest.method, 'PUT')
      assert.equal(client.lastRequest.path, 'https://www.supersaas.com/api/bookings/67890.json')
      assert.equal(JSON.parse(client.lastRequest.body).form, true)
    })

    it("updates appointment with webhook", async function() {
        let client = newClient()
        await client.appointments.update(12345, 67890, appointmentAttributes(), false, true)
        assert.equal(client.lastRequest.path, 'https://www.supersaas.com/api/bookings/67890.json?webhook=true')
    })

    it("gets agenda", async function() {
      let client = newClient()
      await client.appointments.agenda(12345, 67890, "2010-12-30 09:15:00", true)
      assert.equal(client.lastRequest.path, 'https://www.supersaas.com/api/agenda/12345.json?user=67890&from=2010-12-30%2009%3A15%3A00&slot=true')
    })

    it("gets available", async function() {
      let client = newClient()
      await client.appointments.available(12345, "2010-12-30 09:15:00", 10, 'resname', true, 5)
      assert.equal(client.lastRequest.path, 'https://www.supersaas.com/api/free/12345.json?length=10&from=2010-12-30%2009%3A15%3A00&resource=resname&full=true&maxresults=5')
    })

    it("gets changes", async function() {
      let client = newClient()
      await client.appointments.changes(12345, new Date(2010, 1, 1), null, false, null, null, null)
      assert.equal(client.lastRequest.path, 'https://www.supersaas.com/api/changes/12345.json?from=2010-02-01%2000%3A00%3A00')
    })

    it("gets changes with all params", async function() {
        let client = newClient()
        await client.appointments.changes(12345, '2010-02-01 00:00:00', '2010-03-01 00:00:00', false, 'user', 10, 20)
        assert.equal(client.lastRequest.path, 'https://www.supersaas.com/api/changes/12345.json?from=2010-02-01%2000%3A00%3A00&to=2010-03-01%2000%3A00%3A00&user=user&limit=10&offset=20')
    })

    it("gets changes with slot", async function() {
      let client = newClient()
      await client.appointments.changes(12345, new Date(2010, 1, 1), null, true, null, null, null)
      assert.equal(client.lastRequest.path, 'https://www.supersaas.com/api/changes/12345.json?from=2010-02-01%2000%3A00%3A00&slot=true')
    })

    it("gets a range", async function() {
        let client = newClient()
        await client.appointments.range(12345, false, new Date(2010, 1, 1), null, true, null, null, null, null, null)
        assert.equal(client.lastRequest.path, 'https://www.supersaas.com/api/range/12345.json?from=2010-02-01%2000%3A00%3A00&slot=true')
    })

    it("gets today's range", async function() {
        let client = newClient()
        await client.appointments.range(12345, true, null, null, false, null, 7, 8, 10, 20)
        assert.equal(client.lastRequest.path, 'https://www.supersaas.com/api/range/12345.json?limit=10&offset=20&resource_id=7&service_id=8&today=true')
    })

    it("deletes appointment", async function() {
      let client = newClient()
      await client.appointments.delete(12345, 67890)
      assert.equal(client.lastRequest.method, 'DELETE')
      assert.equal(client.lastRequest.path, 'https://www.supersaas.com/api/bookings/67890.json?schedule_id=12345')
    })

    it("rejects an invalid schedule id", function() {
      let client = newClient()
      assert.throws(() => client.appointments.get('abc', 1), /Invalid id parameter: abc/)
    })
})
