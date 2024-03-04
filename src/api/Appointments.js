(function() {
  const validation = require('./validation');
  const Appointment = require('../models/Appointment');

  module.exports = (function() {
    function mapSlotsOrBookings(obj, slot = false) {
      if (Array.isArray(obj) && slot) {
        return obj.map((attributes) => new Appointment.slot(attributes));
      } else if (Array.isArray(obj)) {
        return obj.map((attributes) => new Appointment.appointment(attributes));
      } else if (obj['slots']) {
        return (obj['slots'] || []).map(function(attributes) {
          return new Appointment.slot(attributes);
        });
      } else if (obj['bookings']) {
        return (obj['bookings'] || obj || []).map(function(attributes) {
          return new Appointment.appointment(attributes);
        });
      } else {
        return [];
      }
    }

    function buildParam(params, fromTime, to, slot, user, limit, offset, resourceId = null, serviceId = null) {
      if (fromTime) params.from = validation.validateDatetime(fromTime);
      if (to) params.to = validation.validateDatetime(to);
      if (slot) params.slot = true;
      if (user || user === 0) params.user = validation.validateUser(user);
      if (limit) params.limit = validation.validateNumber(limit);
      if (offset) params.offset = validation.validateNumber(offset);
      if (resourceId) params.resource_id = validation.validateId(resourceId);
      if (serviceId) params.service_id = validation.validateId(serviceId);
      return params;
    }

    function Appointments(client) {
      this.client = client;
    }

    Appointments.prototype.agenda = function(scheduleId, userId, fromTime = null, slot = false) {
      const path = '/agenda/' + validation.validateId(scheduleId);
      const query = {
        user: userId,
        from: fromTime ? validation.validateDatetime(fromTime) : null,
        slot: slot ? true : null,
      };
      return new Promise((resolve, reject) => {
        this.client.get(path, query, (err, data) => {
          if (err) {
            reject(err);
          } else {
            const res = mapSlotsOrBookings(data);
            resolve(new Appointment.appointment(res));
          }
        });
      });
    };

    Appointments.prototype.available = function(scheduleId, fromTime, lengthMinutes = null, resource = null, full = null, limit = null) {
      const path = '/free/' + validation.validateId(scheduleId);
      const query = {
        length: lengthMinutes ? validation.validateNumber(lengthMinutes) : null,
        from: fromTime ? validation.validateDatetime(fromTime) : null,
        resource: resource ? resource : null,
        full: full ? true : null,
        maxresults: limit ? validation.validateNumber(limit) : null,
      };

      return new Promise((resolve, reject) => {
        this.client.get(path, query, (err, data) => {
          if (err) {
            reject(err);
          } else {
            const res = mapSlotsOrBookings(data);
            resolve(res);
          }
        });
      });
    };

    Appointments.prototype.list = function(scheduleId, form = null, startTime = null, limit = null) {
      const path = '/bookings';
      const query = {
        schedule_id: validation.validateId(scheduleId),
        form: form ? true : null,
        start: startTime ? validation.validateDatetime(startTime) : null,
        limit: limit ? validation.validateNumber(limit) : null,
      };

      return new Promise((resolve, reject) => {
        this.client.get(path, query, (err, data) => {
          if (err) {
            reject(err);
          } else {
            const res = mapSlotsOrBookings(data);
            resolve(res);
          }
        });
      });
    };

    Appointments.prototype.get = function(scheduleId, appointmentId) {
      const query = {schedule_id: validation.validateId(scheduleId)};
      const path = '/bookings/' + validation.validateId(appointmentId);

      return new Promise((resolve, reject) => {
        this.client.get(path, query, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(new Appointment.appointment(data));
          }
        });
      });
    };

    Appointments.prototype.create = function(scheduleId, userId, attributes, form = false, webhook = false) {
      const path = '/bookings';
      const params = {
        schedule_id: validation.validateId(scheduleId),
        webhook: webhook ? 'true' : null,
        form: form ? true : null,
        user_id: validation.validateId(userId),
        booking: {
          start: attributes['start'],
          finish: attributes['finish'],
          name: attributes['name'],
          email: attributes['email'],
          full_name: attributes['full_name'],
          address: attributes['address'],
          mobile: attributes['mobile'],
          phone: attributes['phone'],
          country: attributes['country'],
          field_1: attributes['field_1'],
          field_2: attributes['field_2'],
          field_1_r: attributes['field_1_r'],
          field_2_r: attributes['field_2_r'],
          super_field: attributes['super_field'],
          resource_id: attributes['resource_id'],
          slot_id: attributes['slot_id'],
        },
      };

      Object.keys(params.booking).forEach((key) => {
        if (params.booking[key] === null) {
          delete params.booking[key];
        }
      });

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

    Appointments.prototype.update = function(scheduleId, appointmentId, attributes, form = false, webhook = false) {
      const path = '/bookings/' + validation.validateId(appointmentId);
      const query = {webhook: webhook ? true : null};
      const params = {
        schedule_id: validation.validateId(scheduleId),
        form: form ? true : null,
        booking: {
          start: attributes['start'],
          finish: attributes['finish'],
          name: attributes['name'],
          email: attributes['email'],
          full_name: attributes['full_name'],
          address: attributes['address'],
          mobile: attributes['mobile'],
          phone: attributes['phone'],
          country: attributes['country'],
          field_1: attributes['field_1'],
          field_2: attributes['field_2'],
          field_1_r: attributes['field_1_r'],
          field_2_r: attributes['field_2_r'],
          super_field: attributes['super_field'],
          resource_id: attributes['resource_id'],
          slot_id: attributes['slot_id'],
        },
      };

      Object.keys(params.booking).forEach((key) => {
        if (params.booking[key] === null) {
          delete params.booking[key];
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

    Appointments.prototype.delete = function(scheduleId, appointmentId) {
      const query = {schedule_id: validation.validateId(scheduleId)};
      const path = '/bookings/' + validation.validateId(appointmentId);

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

    Appointments.prototype.range = function(scheduleId, today = false, fromTime = null, to = null, slot = false, user = null, resourceId = null, serviceId = null, limit = null, offset = null) {
      const path = '/range/' + validation.validateId(scheduleId);
      const query = buildParam({}, fromTime, to, slot, user, limit, offset, resourceId, serviceId);
      if (today) query.today = true;
      return new Promise((resolve, reject) => {
        this.client.get(path, query, (err, data) => {
          if (err) {
            reject(err);
          } else {
            const res = mapSlotsOrBookings(data);
            resolve(res);
          }
        });
      });
    };

    Appointments.prototype.changes = function(scheduleId, fromTime = null, to = null, slot = false, user = null, limit = null, offset = null) {
      const path = '/changes/' + validation.validateId(scheduleId);
      const query = buildParam({}, fromTime, to, slot, user, limit, offset, null, null);
      return new Promise((resolve, reject) => {
        this.client.get(path, query, (err, data) => {
          if (err) {
            reject(err);
          } else {
            const res = mapSlotsOrBookings(data);
            resolve(res);
          }
        });
      });
    };

    return Appointments;
  })();
}).call(this);
