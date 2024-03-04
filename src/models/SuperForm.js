(function() {
  const SuperForm = function SuperForm(attributes) {
    if (!attributes) return;

    for (const key in attributes) {
      if (attributes.hasOwnProperty(key)) {
        this[key] = attributes[key];
      }
    }
  };

  module.exports = SuperForm;
}).call(this);
