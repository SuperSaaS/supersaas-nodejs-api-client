(function() {
  var Form = require("./Form");
  var Slot = require("./Slot");

  var Appointment = function Appointment(attributes) {
    if (!attributes) return

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

  module.exports = Appointment;

}).call(this);