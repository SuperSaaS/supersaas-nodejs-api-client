(function() {
  const Form = function Form(attributes) {
    if (!attributes) return;

    for (const key in attributes) {
      if (attributes.hasOwnProperty(key)) {
        this[key] = attributes[key];
      }
    }
  };

  module.exports = Form;
}).call(this);
