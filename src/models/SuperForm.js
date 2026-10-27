(function() {
  const assignAttributes = require('./assignAttributes');

  const SuperForm = function SuperForm(attributes) {
    assignAttributes(this, attributes);
  };

  module.exports = SuperForm;
}).call(this);
