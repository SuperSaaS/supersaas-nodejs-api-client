(function() {
  const assignAttributes = require('./assignAttributes');

  const Group = function Group(attributes) {
    assignAttributes(this, attributes);
  };

  module.exports = Group;
}).call(this);
