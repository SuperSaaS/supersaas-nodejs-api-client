(function() {
  const assignAttributes = require('./assignAttributes');

  const Promotion = function Promotion(attributes) {
    assignAttributes(this, attributes);
  };

  module.exports = Promotion;
}).call(this);
