(function() {
  const assignAttributes = require('./assignAttributes');
  const Form = require('./Form');

  const User = function User(attributes) {
    assignAttributes(this, attributes, (key, value) => key === 'form' ? new Form(value) : value);
  };

  User.prototype.ROLES = [3, 4, -1];

  module.exports = User;
}).call(this);
