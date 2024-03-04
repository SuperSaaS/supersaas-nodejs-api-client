(function() {
  const validation = require('./validation');
  const User = require('../models/User');
  const FieldList = require('../models/FieldList');

  module.exports = (function() {
    function Users(client) {
      this.client = client;
    }

    Users.prototype.list = function(form = false, limit = null, offset = null) {
      const path = this._userPath();
      const query = {
        form: form ? true : null,
        limit: limit ? validation.validateNumber(limit) : null,
        offset: offset ? validation.validateNumber(offset) : null,
      };

      return new Promise((resolve, reject) => {
        this.client.get(path, query, (err, data) => {
          if (err) {
            reject(err);
          } else {
            const users = data.map((attributes) => new User(attributes));
            resolve(users);
          }
        });
      });
    };

    Users.prototype.get = function(userId) {
      const path = this._userPath(userId);

      return new Promise((resolve, reject) => {
        this.client.get(path, null, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(new User(data));
          }
        });
      });
    };

    Users.prototype.create = function(attributes, userId = null, webhook = false, duplicate = null) {
      const path = this._userPath(userId);
      const query = {webhook: webhook ? 'true' : null};
      if (duplicate) query.duplicate = validation.validateDuplicate(duplicate);
      const params = {
        user: {
          name: validation.validatePresent(attributes['name']),
          email: attributes['email'],
          password: attributes['password'],
          full_name: attributes['full_name'],
          address: attributes['address'],
          mobile: attributes['mobile'],
          phone: attributes['phone'],
          country: attributes['country'],
          timezone: attributes['timezone'],
          field_1: attributes['field_1'],
          field_2: attributes['field_2'],
          super_field: attributes['super_field'],
        },
      };
      if (attributes['credit']) params.user.credit = validation.validateNumber(attributes['credit']);
      if (attributes['role']) params.user.role = validation.validateOptions(attributes['role'], User.prototype.ROLES);

      return new Promise((resolve, reject) => {
        this.client.post(path, params, query, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    };

    Users.prototype.update = function(userId, attributes, webhook = null, notFound = null) {
      const path = this._userPath(userId);
      const query = {webhook: webhook ? 'true' : null};
      if (notFound) query.notfound = validation.validateNotFound(notFound);
      const params = {
        user: {
          name: attributes['name'],
          email: attributes['email'],
          password: attributes['password'],
          full_name: attributes['full_name'],
          address: attributes['address'],
          mobile: attributes['mobile'],
          phone: attributes['phone'],
          country: attributes['country'],
          timezone: attributes['timezone'],
          field_1: attributes['field_1'],
          field_2: attributes['field_2'],
          super_field: attributes['super_field'],
        },
      };
      if (attributes['credit']) params.user.credit = validation.validateNumber(attributes['credit']);
      if (attributes['role']) params.user.role = validation.validateOptions(attributes['role'], User.prototype.ROLES);
      Object.keys(params.user).forEach((key) => {
        if (params.user[key] === null) {
          delete params.user[key];
        }
      });

      return new Promise((resolve, reject) => {
        this.client.put(path, params, query, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    };

    Users.prototype.delete = function(userId) {
      const path = this._userPath(userId);
      return new Promise((resolve, reject) => {
        this.client.delete(path, null, null, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    };

    Users.prototype.fieldList = function() {
      const path = '/field_list';

      return new Promise((resolve, reject) => {
        this.client.get(path, null, (err, data) => {
          if (err) {
            reject(err);
          } else {
            const res = data.map(function(attributes) {
              return new FieldList(attributes);
            });
            resolve(res);
          }
        });
      });
    };

    Users.prototype._userPath = function(userId) {
      if (!userId || userId === '') {
        return '/users';
      } else {
        return '/users/' + userId;
      }
    };

    return Users;
  })();
}).call(this);
