(function() {
  const validation = require('./validation');
  const Form = require('../models/Form');
  const SuperForm = require('../models/SuperForm');

  module.exports = (function() {
    function Forms(client) {
      this.client = client;
    }

    Forms.prototype.list = function(formId, fromTime = null, user = null, limit = null, offset = null) {
      const path = '/forms';
      const query = {form_id: validation.validateId(formId)};

      if (fromTime !== null) {
        query.from = validation.validateDatetime(fromTime);
      }
      if (user !== null) {
        query.user = validation.validateUser(user);
      }
      if (limit !== null) query.limit = validation.validateNumber(limit);
      if (offset !== null) query.offset = validation.validateNumber(offset);
      return new Promise((resolve, reject) => {
        this.client.get(path, query, (err, data) => {
          if (err) {
            reject(err);
          } else {
            const res = data.map(function(attributes) {
              return new Form(attributes);
            });
            resolve(res);
          }
        });
      });
    };

    Forms.prototype.get = function(formId) {
      const path = '/forms';
      const query = {id: validation.validateId(formId)};
      return new Promise((resolve, reject) => {
        this.client.get(path, query, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(new Form(data));
          }
        });
      });
    };

    Forms.prototype.forms = function() {
      const path = '/super_forms';
      return new Promise((resolve, reject) => {
        this.client.get(path, null, (err, data) => {
          if (err) {
            reject(err);
          } else {
            const res = data.map(function(attributes) {
              return new SuperForm(attributes);
            });
            resolve(res);
          }
        });
      });
    };

    return Forms;
  })();
}).call(this);
