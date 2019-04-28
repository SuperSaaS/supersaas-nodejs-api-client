(function() {
  var validation  = require("./validation");
  var Resource = require("../models/Resource");
  var Schedule = require("../models/Schedule");

  module.exports = (function() {
    function Schedules(client) {
      this.client = client;
    }

    Schedules.prototype.list = function(callback) {
      var path = "/schedules";
      return this.client.get(path, null, callback ? function(err, data) {
        if (err) {
          callback(err);
        } else {
          var res = data.map (function(attributes) { return new Schedule(attributes); });
          callback(null, res)
        }
      } : null);
    }

    Schedules.prototype.resources = function(scheduleId, callback) {
      var path = "/resources";
      var query = {schedule_id: validation.validateId(scheduleId)}
      return this.client.get(path, query, callback ? function(err, data) {
        if (err) {
          callback(err);
        } else {
          var res = data.map (function(attributes) { return new Resource(attributes); });
          callback(null, res)
        }
      } : null);
    }

    return Schedules;
  })();

}).call(this);