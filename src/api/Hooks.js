(function() {
  const validation = require('./validation');

  module.exports = (function() {
    function Hooks(client) {
      this.client = client;
    }

    // Lists the webhooks of the account.
    Hooks.prototype.list = function() {
      const path = '/hooks';

      return new Promise((resolve, reject) => {
        this.client.get(path, null, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    };

    // `event` is a trigger letter (U, M, N, C, R, F, S, O, H, P); `parentId` is the schedule or super form id.
    // Resolves to `{id, parent_id}`.
    Hooks.prototype.create = function(targetUrl, event, parentId) {
      const path = '/hooks';
      const params = {
        target_url: targetUrl,
        event: event,
        parent_id: validation.validateId(parentId),
      };

      return new Promise((resolve, reject) => {
        this.client.post(path, params, null, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    };

    Hooks.prototype.delete = function(hookId, parentId) {
      const path = '/hooks';
      const query = {
        id: validation.validateId(hookId),
        parent_id: validation.validateId(parentId),
      };

      return new Promise((resolve, reject) => {
        this.client.delete(path, null, query, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    };

    return Hooks;
  })();
}).call(this);
