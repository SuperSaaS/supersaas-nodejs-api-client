(function() {
  var validation  = require("./validation");
  var Form = require("../models/Form");

  module.exports = (function() {
    function Forms(client) {
      this.client = client;
    }

    Forms.prototype.list = function(formId, fromTime, callback) {
      callback = validation.getCallbackFunctionArg(arguments)
      var path = "/forms";
      var query = {form_id: validation.validateId(formId)}
      if (fromTime && fromTime !== callback) {
        query['from'] = validation.validateDatetime(fromTime)
      }
      return this.client.get(path, query, callback ? function(err, data) {
        if (err) {
          callback(err);
        } else {
          var res = data.map (function(attributes) { return new Form(attributes); });
          callback(null, res)
        }
      } : null);
    }

    Forms.prototype.get = function(formId, callback) {
      var path = "/forms"
      var query = {id: validation.validateId(formId)}
      return this.client.get(path, query, callback ? function(err, data) {
        if (err) {
          callback(err);
        } else {
          callback(null, new Form(data));
        }
      } : null);
    }

    return Forms;
  })();

}).call(this);