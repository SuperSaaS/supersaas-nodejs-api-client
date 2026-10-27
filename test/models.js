const assert = require('assert');
const {Models} = require('../src/index');

describe('Models', function() {
  it('copies attributes onto plain models', function() {
    for (const name of ['FieldList', 'Form', 'Group', 'Promotion', 'Resource', 'Schedule', 'SuperForm']) {
      const model = new Models[name]({id: 1, name: 'x'});
      assert.ok(model instanceof Models[name]);
      assert.deepStrictEqual({...model}, {id: 1, name: 'x'});
    }
  });

  it('leaves the model empty without attributes', function() {
    assert.deepStrictEqual({...new Models.Schedule(null)}, {});
    assert.deepStrictEqual({...new Models.User(undefined)}, {});
  });

  it('wraps the form of a user', function() {
    const user = new Models.User({id: 1, form: {content: 'c'}});
    assert.ok(user.form instanceof Models.Form);
    assert.equal(user.form.content, 'c');
    assert.deepStrictEqual(Models.User.prototype.ROLES, [3, 4, -1]);
  });

  it('wraps the form and slot of an appointment', function() {
    const appointment = new Models.Appointment.appointment({id: 1, form: {id: 2}, slot: {id: 3, bookings: [{id: 4}]}});
    assert.ok(appointment.form instanceof Models.Form);
    assert.ok(appointment.slot instanceof Models.Appointment.slot);
    assert.ok(appointment.slot.bookings[0] instanceof Models.Appointment.appointment);
    assert.equal(appointment.slot.bookings[0].id, 4);
  });
});
