(function() {
  var Resource = function Resource(attributes) {
    if (!attributes) return

    for (var key in attributes) {
      if (attributes.hasOwnProperty(key)) {
        this[key] = attributes[key];
      }
    }
  };

  module.exports = Resource;

}).call(this);