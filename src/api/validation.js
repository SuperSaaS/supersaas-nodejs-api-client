(function() {

  var INTEGER_REGEX = /^[0-9]+$/;
  var DATETIME_REGEX = /^\d{4}-\d{1,2}-\d{1,2}\s\d{1,2}:\d{1,2}:\d{1,2}$/;

  function isDate(date) {
    return Object.prototype.toString.call(date) === '[object Date]'
  }

  module.exports = {
    getCallbackFunctionArg(params) {
      var args = Array.prototype.slice.call(params);
      for (var i = args.length - 1; i >= 0; i--) {
        if (typeof args[i] === "function") {
          return args[i]
        }
      }
    },

    validateId: function(value) {
      if (typeof value === "number") {
        return value;
      } else if (value && isNaN(value) && INTEGER_REGEX.test(value)) {
        return parseInt(value);
      } else {
        throw new Error("Invalid id parameter: " + value + ". Provide a integer value.");
      }
    },

    validateNumber: function(value) {
      return this.validateId(value)
    },

    validateOptions: function(value, options) {
      if (options.includes(value)) {
        return value;
      } else {
        throw new Error("Invalid option parameter: " + value + ". Must be one of " + options.join(', ') + ".")
      }
    },

    validateDatetime: function(value) {
      console.log(value && DATETIME_REGEX.test(value),value)
      if (value && typeof value === "string" && DATETIME_REGEX.test(value)) {
        return value
      } else if (isDate(value)) {
        return value.getFullYear() + "-" + value.getDate() + "-" + (value.getMonth() + 1) + " " + value.getHours() + ":" + value.getMinutes() + ":00"
      } else {
        throw new Error ("Invalid datetime parameter: " + value + ". Provide a Time object or formatted 'YYYY-DD-MM HH:MM:SS' string.")
      }
    },

    validatePresent: function(value) {
      if (typeof value === "string" ? value.length : value ) {
        return value
      } else {
        throw new Error("Required parameter is missing.");
      }
    }
  }
}).call(this);
