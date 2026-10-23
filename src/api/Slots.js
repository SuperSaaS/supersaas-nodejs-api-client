(function() {
  const validation = require('./validation');
  const Slot = require('../models/Slot');

  module.exports = (function() {
    const SLOT_ATTRIBUTES = ['start', 'finish', 'title', 'description', 'location', 'capacity', 'price', 'color'];

    // Only attributes that are present are sent, so `capacity: null` (or '-') explicitly means unlimited.
    function slotParams(scheduleId, attributes) {
      attributes = attributes || {};
      const slot = {};
      SLOT_ATTRIBUTES.forEach((key) => {
        if (attributes.hasOwnProperty(key) && attributes[key] !== undefined) slot[key] = attributes[key];
      });
      if (slot.start) slot.start = validation.validateDatetime(slot.start);
      if (slot.finish) slot.finish = validation.validateDatetime(slot.finish);
      return {slot: slot};
    }

    function Slots(client) {
      this.client = client;
    }

    Slots.prototype.list = function(scheduleId, startTime = null, finish = null, limit = null, offset = null) {
      const path = '/slots';
      const query = {
        schedule_id: validation.validateId(scheduleId),
        start: startTime ? validation.validateDatetime(startTime) : null,
        finish: finish ? validation.validateDatetime(finish) : null,
        limit: limit ? validation.validateNumber(limit) : null,
        offset: offset ? validation.validateNumber(offset) : null,
      };

      return new Promise((resolve, reject) => {
        this.client.get(path, query, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve((data || []).map((attributes) => new Slot(attributes)));
          }
        });
      });
    };

    Slots.prototype.get = function(scheduleId, slotId) {
      const query = {schedule_id: validation.validateId(scheduleId)};
      const path = '/slots/' + validation.validateId(slotId);

      return new Promise((resolve, reject) => {
        this.client.get(path, query, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(new Slot(data));
          }
        });
      });
    };

    Slots.prototype.create = function(scheduleId, attributes) {
      const path = '/slots';
      const query = {schedule_id: validation.validateId(scheduleId)};
      const params = slotParams(scheduleId, attributes);

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

    Slots.prototype.update = function(scheduleId, slotId, attributes) {
      const path = '/slots/' + validation.validateId(slotId);
      const query = {schedule_id: validation.validateId(scheduleId)};
      const params = slotParams(scheduleId, attributes);

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

    Slots.prototype.delete = function(scheduleId, slotId) {
      const query = {schedule_id: validation.validateId(scheduleId)};
      const path = '/slots/' + validation.validateId(slotId);

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

    return Slots;
  })();
}).call(this);
