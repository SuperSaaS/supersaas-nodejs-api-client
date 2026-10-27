const assert = require('assert');
const {Client, Models} = require('../src/index');

// Responses are faked by replacing global.fetch; nothing is sent over the network.
describe('Response handling', function() {
  const realFetch = global.fetch;
  afterEach(function() {
    global.fetch = realFetch;
  });

  function liveClient() {
    return new Client({accountName: 'Test', api_key: 'xxxxxxxxxxxxxxxxxxxxxx'});
  }

  function respond(status, json) {
    const body = JSON.stringify(json);
    global.fetch = async () => new Response(body, {
      status: status,
      headers: {'Content-Type': 'application/json', 'Content-Length': String(body.length)},
    });
  }

  it('maps bookings to appointments', async function() {
    respond(200, {bookings: [{id: 1}, {id: 2}]});
    const result = await liveClient().appointments.range(12345);
    assert.equal(result.length, 2);
    assert.ok(result[0] instanceof Models.Appointment.appointment);
    assert.equal(result[1].id, 2);
  });

  it('maps slots with their bookings', async function() {
    respond(200, {slots: [{id: 1, bookings: [{id: 3}]}]});
    const result = await liveClient().appointments.range(12345, false, null, null, true);
    assert.ok(result[0] instanceof Models.Appointment.slot);
    assert.ok(result[0].bookings[0] instanceof Models.Appointment.appointment);
  });

  it('maps a plain array to appointments', async function() {
    respond(200, [{id: 1}]);
    const result = await liveClient().appointments.available(12345, '2020-01-01 10:00:00');
    assert.ok(result[0] instanceof Models.Appointment.appointment);
  });

  it('rejects with the status in the message', async function() {
    respond(404, {errors: [{title: 'Not found'}]});
    await assert.rejects(liveClient().schedules.list(), {message: 'Request failed with status 404'});
  });
});
