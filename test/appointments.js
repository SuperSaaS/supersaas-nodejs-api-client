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
    it("gets one", function(done) {
      let client = newClient()
      client.appointments.get(12345, 67890).then( (data) => {
        console.log(client)
        assert.equal(client.lastRequest.path, 'https://www.supersaas.com/api/bookings/67890.json?schedule_id=12345')
        done()
      })
    })

    it("gets list", function(done) {
      let client = newClient()
        console.log(client)
        client.appointments.list(12345, true, new Date(2010,1,1)).then( (data) => {
        assert.equal(client.lastRequest.path, 'https://www.supersaas.com/api/bookings.json?schedule_id=12345&form=true&start=2010-1-2%200%3A0%3A00')
        done()
      })
    })

    it("gets list legacy", function(done) {
        let client = newClient()
        console.log(client)
        client.appointments.list(12345, true, new Date(2010,1,1)).then( (data) => {
            assert.equal(client.lastRequest.path, 'https://www.supersaas.com/api/bookings.json?schedule_id=12345&form=true&start=2010-1-2%200%3A0%3A00')
            done()
        })
    })

    it("creates appointment", function(done) {
      let client = newClient()
        console.log(client)
        client.appointments.create(12345, 67890, appointmentAttributes(), false, false).then( (data) => {
        assert.equal(client.lastRequest.path, 'https://www.supersaas.com/api/bookings.json?schedule_id=12345')
        done()
      })
    })

    it("creates appointment legacy", function(done) {
        let client = newClient()
        console.log(client)
        client.appointments.create(12345, 67890, appointmentAttributes()).then( (data) => {
            assert.equal(client.lastRequest.path, 'https://www.supersaas.com/api/bookings.json?schedule_id=12345')
            done()
        })
    })


    it("updates appointment", function(done) {
      let client = newClient()
      client.appointments.update(12345, 67890, appointmentAttributes(), true, false).then( (data) => {
        assert.equal(client.lastRequest.path, 'https://www.supersaas.com/api/bookings/67890.json')
        done()
      })
    })

    it("updates appointment legacy", function(done) {
        let client = newClient()
        client.appointments.update(12345, 67890, appointmentAttributes(), true).then( (data) => {
            assert.equal(client.lastRequest.path, 'https://www.supersaas.com/api/bookings/67890.json')
            done()
        })
    })

    it("gets agenda", function(done) {
      let client = newClient()
      client.appointments.agenda(12345, 67890, "2010-12-30 09:15:00", 10, 'resname', true, 5).then( (data) => {
        assert.equal(client.lastRequest.path, 'https://www.supersaas.com/api/agenda/12345.json?user=67890&from=2010-12-30%2009%3A15%3A00&slot=true')
        done()
      })
    })

    it("gets available", function(done) {
      let client = newClient()
      client.appointments.available(12345, "2010-12-30 09:15:00", 10, 'resname', true, 5).then( (data) => {
        assert.equal(client.lastRequest.path, 'https://www.supersaas.com/api/free/12345.json?length=10&from=2010-12-30%2009%3A15%3A00&resource=resname&full=true&maxresults=5')
        done()
      })
    })

    it("gets changes", function(done) {
      let client = newClient()
      client.appointments.changes(12345, new Date(2010, 1, 1), null, false, null, null, null).then( (data) => {
        assert.equal(client.lastRequest.path, 'https://www.supersaas.com/api/changes/12345.json?from=2010-1-2%200%3A0%3A00')
        done()
      })
    })

    it("gets changes legacy", function(done) {
        let client = newClient()
        client.appointments.changes(12345, new Date(2010, 1, 1)).then( (data) => {
            assert.equal(client.lastRequest.path, 'https://www.supersaas.com/api/changes/12345.json?from=2010-1-2%200%3A0%3A00')
            done()
        })
    })

    it("gets changes with slot", function(done) {
      let client = newClient()
      client.appointments.changes(12345, new Date(2010, 1, 1), true, null, null, null, null).then( (data) => {
        assert.equal(client.lastRequest.path, 'https://www.supersaas.com/api/changes/12345.json?from=2010-1-2%200%3A0%3A00&slot=true')
        done()
      })
    })

    it("gets changes with slot legacy", function(done) {
        let client = newClient()
        client.appointments.changes(12345, new Date(2010, 1, 1), true).then( (data) => {
            assert.equal(client.lastRequest.path, 'https://www.supersaas.com/api/changes/12345.json?from=2010-1-2%200%3A0%3A00&slot=true')
            done()
        })
    })

    it("gets a range", function(done) {
        let client = newClient()
        client.appointments.range(12345, false, new Date(2010, 1, 1), null,true, null, null, null, null, null).then( (data) => {
            assert.equal(client.lastRequest.path, 'https://www.supersaas.com/api/range/12345.json?from=2010-1-2%200%3A0%3A00&slot=true')
            done()
        })
    })

    it("deletes appointment", function(done) {
      let client = newClient()
      client.appointments.delete(12345, 67890).then( (data) => {
        assert.equal(client.lastRequest.path, 'https://www.supersaas.com/api/bookings/67890.json?schedule_id=12345')
        done()
      })
    })
})