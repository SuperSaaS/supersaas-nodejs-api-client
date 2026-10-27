(function() {
  const assignAttributes = require('./assignAttributes');
  const Form = require('./Form');
  const Appointment = function(attributes) {
    assignAttributes(this, attributes, (key, value) => {
      if (key === 'slot') return new Slot(value);
      if (key === 'form') return new Form(value);
      return value;
    });
  };

  const Slot = function(attributes) {
    if (!attributes) return;
    this.bookings = [];
    for (const key in attributes) {
      if (attributes.hasOwnProperty(key)) {
        if (key === 'bookings' && typeof attributes[key] === 'object') {
          for (let i = 0; i < attributes.bookings.length; i++) {
            this.bookings.push(new Appointment(attributes.bookings[i]));
          }
        } else {
          this[key] = attributes[key];
        }
      }
    }
  };

  module.exports = {
    appointment: Appointment,
    slot: Slot,
  };
}).call(this);
