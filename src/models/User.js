(function() {
  const Form = require('./Form');

  const User = function User(attributes) {
    if (!attributes) return;

    for (const key in attributes) {
      if (attributes.hasOwnProperty(key)) {
        if (key === 'form') {
          this[key] = new Form(attributes[key]);
        } else {
          this[key] = attributes[key];
        }
      }
    }
  };

  User.prototype.ROLES = [3, 4, -1];

  module.exports = User;
}).call(this);
