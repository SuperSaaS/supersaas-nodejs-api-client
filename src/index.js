(function() {
  module.exports = {
    Client: require('./Client'),
    API: {
      Appointments: require('./api/Appointments'),
      Forms: require('./api/Forms'),
      Groups: require('./api/Groups'),
      Promotions: require('./api/Promotions'),
      Schedules: require('./api/Schedules'),
      Users: require('./api/Users'),

    },
    Models: {
      Appointment: require('./models/Appointment'),
      FieldList: require('./models/FieldList'),
      Form: require('./models/Form'),
      Group: require('./models/Group'),
      Promotion: require('./models/Promotion'),
      Resource: require('./models/Resource'),
      Schedule: require('./models/Schedule'),
      SuperForm: require('./models/SuperForm'),
      User: require('./models/User'),

    },
  };
}).call(this);
