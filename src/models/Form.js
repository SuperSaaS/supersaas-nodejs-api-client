(function() {
  const assignAttributes = require('./assignAttributes');

  const Form = function Form(attributes) {
    assignAttributes(this, attributes);
  };

  module.exports = Form;
}).call(this);
