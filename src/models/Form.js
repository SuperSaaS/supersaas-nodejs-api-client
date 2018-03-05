(function() {
  var Form = function Form(attributes) {
    if (!attributes) return

    for (var key in attributes) {
      if (attributes.hasOwnProperty(key)) {
        this[key] = attributes[key];
      }
    }
  };

  module.exports = Form;

}).call(this);