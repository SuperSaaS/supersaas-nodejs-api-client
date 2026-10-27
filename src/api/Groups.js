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
            resolve(data.map((attributes) => new Group(attributes)));
          }
        });
      });
    };
    return Groups;
  })();
}).call(this);
