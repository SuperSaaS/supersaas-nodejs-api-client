var client = require('../src/Client').Instance;

module.exports.listSchedules = function () {
    console.log("listing schedules...")
    client.schedules.list(function(err, data) { 
        console.log(data);
    });
};
