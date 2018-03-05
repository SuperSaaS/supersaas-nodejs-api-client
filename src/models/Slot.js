(function() {
  var Appointment = require("./Appointment");

  var Slot = function Slot(attributes) {
    if (!attributes) return

    this.bookings = []
    for (var key in attributes) {
      if (attributes.hasOwnProperty(key)) {
        if (key === 'bookings' && typeof attributes[key] === 'array') {
          for (var i = 0; i < attributes.bookings.length; i++) {
            this.booking.push(new Appointment(attributes.bookings[i]))
          }
        } else {
            this[key] = attributes[key];
        }
      }
    }
  };

  module.exports = Slot;

}).call(this);