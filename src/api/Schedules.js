(function() {
  const validation = require('./validation');
  const Resource = require('../models/Resource');
  const Schedule = require('../models/Schedule');
  const FieldList = require('../models/FieldList');


  module.exports = (function() {
    function Schedules(client) {
      this.client = client;
    }

    Schedules.prototype.list = function() {
      const path = '/schedules';

      return new Promise((resolve, reject) => {
        this.client.get(path, null, (err, data) => {
          if (err) {
            reject(err);
          } else {
            const res = data.map(function(attributes) {
              return new Schedule(attributes);
            });
            resolve(res);
          }
        });
      });
    };

    Schedules.prototype.resources = function(scheduleId) {
      const path = '/resources';
      const query = {schedule_id: validation.validateId(scheduleId)};

      return new Promise((resolve, reject) => {
        this.client.get(path, query, (err, data) => {
          if (err) {
            reject(err);
          } else {
            const res = data.map(function(attributes) {
              return new Resource(attributes);
            });
            resolve(res);
          }
        });
      });
    };

    Schedules.prototype.fieldList = function(scheduleId) {
      const path = '/field_list';
      const query = {schedule_id: validation.validateId(scheduleId)};

      return new Promise((resolve, reject) => {
        this.client.get(path, query, (err, data) => {
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

    return Schedules;
  })();
}).call(this);
