(function() {
  var Schedule = function Schedule(attributes) {
    if (!attributes) return

    for (var key in attributes) {
      if (attributes.hasOwnProperty(key)) {
        this[key] = attributes[key];
      }
    }
  };

  module.exports = Schedule;

}).call(this);