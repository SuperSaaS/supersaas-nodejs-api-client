(function() {
  const assignAttributes = require('./assignAttributes');

  const Schedule = function Schedule(attributes) {
    assignAttributes(this, attributes);
  };

  module.exports = Schedule;
}).call(this);
