(function() {
  const assignAttributes = require('./assignAttributes');

  const Resource = function Resource(attributes) {
    assignAttributes(this, attributes);
  };

  module.exports = Resource;
}).call(this);
