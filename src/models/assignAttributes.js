(function() {
  /**
   * Copies the own enumerable properties of an API response object onto a model instance.
   *
   * @param {Object} model The model instance to fill.
   * @param {Object} attributes The attributes returned by the API; nothing is copied when falsy.
   * @param {function(string, *): *} [convert] Optional mapper applied to each value, e.g. to wrap nested objects.
   */
  module.exports = function assignAttributes(model, attributes, convert) {
    if (!attributes) return;

    for (const key in attributes) {
      if (attributes.hasOwnProperty(key)) {
        model[key] = convert ? convert(key, attributes[key]) : attributes[key];
      }
    }
  };
}).call(this);
