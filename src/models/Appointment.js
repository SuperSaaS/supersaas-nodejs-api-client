(function() {
  var Form = require("./Form");
  var Appointment = function(attributes) {
    if (!attributes) return;

    for (var key in attributes) {
      if (attributes.hasOwnProperty(key)) {
        if (key === 'slot') {
          this[key] = new Slot(attributes[key]);
        } else if (key === 'form') {
          this[key] = new Form(attributes[key]);
        } else {
          this[key] = attributes[key];
        }
      }
    }
  };

  var Slot = function(attributes) {
    if (!attributes) return;
    this.bookings = [];
    for (var key in attributes) {
      if (attributes.hasOwnProperty(key)) {
        if (key === 'bookings' && typeof attributes[key] === 'object') {
          for (var i = 0; i < attributes.bookings.length; i++) {
            this.bookings.push(new Appointment(attributes.bookings[i]))
          }
        } else {
          this[key] = attributes[key];
        }
      }
    }
  };

  module.exports = {
    appointment: Appointment,
    slot: Slot
  }

}).call(this);