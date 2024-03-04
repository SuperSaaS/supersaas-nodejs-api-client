(function() {
  const Promotion = function Promotion(attributes) {
    if (!attributes) return;

    for (const key in attributes) {
      if (attributes.hasOwnProperty(key)) {
        this[key] = attributes[key];
      }
    }
  };

  module.exports = Promotion;
}).call(this);
