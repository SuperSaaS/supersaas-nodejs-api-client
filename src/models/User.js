(function() {
  var Form = require("./Form");

  var User = function User(attributes) {
    if (!attributes) return

    for (var key in attributes) {
      if (attributes.hasOwnProperty(key)) {
        if (key === 'form') {
          this[key] = new Form(attributes[key]);
        } else {
          this[key] = attributes[key];
        }
      }
    }
  };

  module.exports = User;

}).call(this);