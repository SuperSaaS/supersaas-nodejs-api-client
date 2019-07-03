(function() {
  module.exports = {
    Client: require("./Client"),
    API: {
      Appointments: require("./api/Appointments"),
      Forms: require("./api/Forms"),
      Schedules: require("./api/Schedules"),
      Users: require("./api/Users")
    },
    Models: {
      Appointment: require("./models/Appointment"),
      Form: require("./models/Form"),
      Resource: require("./models/Resource"),
      Schedule: require("./models/Schedule"),
      User: require("./models/User")
    }
  };

}).call(this);