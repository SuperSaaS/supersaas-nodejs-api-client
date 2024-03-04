(function() {
  const FieldList = function FieldList(attributes) {
    if (!attributes) return;

    for (const key in attributes) {
      if (attributes.hasOwnProperty(key)) {
        this[key] = attributes[key];
      }
    }
  };

  module.exports = FieldList;
}).call(this);
