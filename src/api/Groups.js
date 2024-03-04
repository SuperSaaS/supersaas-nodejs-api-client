(function() {
  const Group = require('../models/Group');

  module.exports = (function() {
    function Groups(client) {
      this.client = client;
    }

    Groups.prototype.list = function() {
      const path = '/groups';

      return new Promise((resolve, reject) => {
        this.client.get(path, null, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(new Group(data));
          }
        });
      });
    };
    return Groups;
  })();
}).call(this);
