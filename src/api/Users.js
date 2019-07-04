(function() {
  var validation  = require("./validation");
  var User = require("../models/User");

  module.exports = (function() {
    function Users(client) {
      this.client = client;
    }

    Users.prototype.list = function(form, limit, offset, callback) {
      callback = validation.getCallbackFunctionArg(arguments)
      var path = this._userPath();
      var query = {
        form: form && form !== callback ? true : null,
        limit: limit && limit !== callback ? validation.validateNumber(limit) : null,
        offset: offset && offset !== callback ? validation.validateNumber(offset) : null
      }
      return this.client.get(path, query, callback ? function(err, data) {
        if (err) {
          callback(err);
        } else {
          var res = data.map (function(attributes) { return new User(attributes); });
          callback(null, res);
        }
      } : null);
    }

    Users.prototype.get = function(userId, callback) {
      var path = this._userPath(userId);
      return this.client.get(path, null, callback ? function(err, data) {
        if (err) {
          callback(err);
        } else {
          callback(null, new User(data));
        }
      } : null);
    }

    Users.prototype.create = function(attributes, userId, webhook, callback) {
      callback = validation.getCallbackFunctionArg(arguments)
      var path = this._userPath(userId);
      var query = {webhook: webhook && webhook !== callback ? 'true' : null};
      var params = {
        user: {
          name: validation.validatePresent(attributes['name']),
          email: attributes['email'],
          password: attributes['password'],
          full_name: attributes['full_name'],
          address: attributes['address'],
          mobile: attributes['mobile'],
          phone: attributes['phone'],
          country: attributes['country'],
          field_1: attributes['field_1'],
          field_2: attributes['field_2'],
          super_field: attributes['super_field'],
          credit: attributes['credit'],
          role: attributes['role']
        }
      }
      return this.client.post(path, params, query, callback ? function(err, data) {
        if (err) {
          callback(err);
        } else {
          callback(null, {location: data});
        }
      } : null);
    }

    Users.prototype.update = function(userId, attributes, webhook, callback) {
      callback = validation.getCallbackFunctionArg(arguments)
      var path = this._userPath(userId);
      var query = {webhook: webhook && webhook !== callback ? 'true' : null};
      var params = {
        user: {
          name: attributes['name'],
          email: attributes['email'],
          password: attributes['password'],
          full_name: attributes['full_name'],
          address: attributes['address'],
          mobile: attributes['mobile'],
          phone: attributes['phone'],
          country: attributes['country'],
          field_1: attributes['field_1'],
          field_2: attributes['field_2'],
          super_field: attributes['super_field'],
          credit: attributes['credit'],
          role: attributes['role']
        }
      }
      return this.client.put(path, params, query, callback ? function(err, data) {
        if (err) {
          callback(err);
        } else {
          callback(null, new User(params.user));
        }
      } : null);
    }

    Users.prototype.delete = function(userId, callback) {
      var path = this._userPath(userId);
      return this.client.delete(path, null, null, callback);
    }

    Users.prototype._userPath = function(userId, callback) {
      if (!userId || userId === '') {
        return "/users";
      } else {
        return "/users/" + userId;
      }
    }

    return Users;
  })();

}).call(this);