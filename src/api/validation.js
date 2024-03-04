(function() {
  const INTEGER_REGEX = /^[0-9]+$/;
  const DATETIME_REGEX = /^\d{4}-\d{1,2}-\d{1,2}\s\d{1,2}:\d{1,2}:\d{1,2}$/;
  const PROMOTION_REGEX = /^[0-9a-zA-Z]+$/;

  function isDate(date) {
    return Object.prototype.toString.call(date) === '[object Date]';
  }

  module.exports = {
    validateId: function(value) {
      if (typeof value === 'number') {
        return value;
      } else if (value && !isNaN(value) && INTEGER_REGEX.test(value)) {
        return parseInt(value);
      } else {
        throw new Error('Invalid id parameter: ' + value + '. Provide a integer value.');
      }
    },

    validateUser(value) {
      if (value === null || value === undefined) {
        return;
      }

      if (typeof value !== 'number' && typeof value !== 'string') {
        throw new Error(`Invalid user id parameter: ${value}.`);
      }

      return value;
    },

    validatePromotion: function(value) {
      if (typeof value !== 'string' || !value.length || !PROMOTION_REGEX.test(value)) {
        throw new Error('Required parameter promotional code not found or contains other than alphanumeric characters.');
      }

      return value;
    },

    validateDuplicate: function(value) {
      if (typeof value !== 'string') {
        throw new Error('Required parameter duplicate must be a string.');
      }

      // Allowed Values Check
      const allowedValues = ['ignore', 'raise'];
      if (!allowedValues.includes(value)) {
        throw new Error('Required parameter duplicate can only be \'ignore\' or \'raise\'.');
      }

      // Return the valid value
      return value;
    },

    validateNotFound: function(value) {
      if (typeof value !== 'string') {
        throw new Error('Required parameter duplicate must be a string.');
      }

      // Allowed Values Check
      const allowedValues = ['ignore', 'error'];
      if (!allowedValues.includes(value)) {
        throw new Error('Required parameter notfound can only be \'error\' or \'ignore\'.');
      }

      // Return the valid value
      return value;
    },

    validateNumber: function(value) {
      return this.validateId(value);
    },

    validateOptions: function(value, options) {
      if (options.includes(value)) {
        return value;
      } else {
        throw new Error('Invalid option parameter: ' + value + '. Must be one of ' + options.join(', ') + '.');
      }
    },

    validateDatetime: function(value) {
      if (value && typeof value === 'string' && DATETIME_REGEX.test(value)) {
        return value;
      } else if (isDate(value)) {
        return value.getFullYear() + '-' +
            ('0' + (value.getMonth() + 1)).slice(-2) + '-' + // Months are 0-based
            ('0' + value.getDate()).slice(-2) + ' ' +
            ('0' + value.getHours()).slice(-2) + ':' +
            ('0' + value.getMinutes()).slice(-2) + ':' +
            ('0' + value.getSeconds()).slice(-2);
      } else {
        throw new Error('Invalid datetime parameter: ' + value + '. Provide a Time object or formatted \'YYYY-MM-DD HH:MM:SS\' string.');
      }
    },

    validatePresent: function(value) {
      if (typeof value === 'string' ? value.length : value ) {
        return value;
      } else {
        throw new Error('Required parameter is missing.');
      }
    },
  };
}).call(this);
