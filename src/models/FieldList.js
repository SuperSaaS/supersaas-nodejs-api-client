(function() {
  const assignAttributes = require('./assignAttributes');

  const FieldList = function FieldList(attributes) {
    assignAttributes(this, attributes);
  };

  module.exports = FieldList;
}).call(this);
