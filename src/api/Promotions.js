(function() {
  const Promotion = require('../models/Promotion');
  const validation = require('./validation');

  module.exports = (function() {
    function Promotions(client) {
      this.client = client;
    }

    Promotions.prototype.list = function(limit = null, offset = null) {
      const path = '/promotions';
      const query = {};
      if (limit !== null) query.limit = validation.validateNumber(limit);
      if (offset !== null) query.offset = validation.validateNumber(offset);

      return new Promise((resolve, reject) => {
        this.client.get(path, query, (err, data) => {
          if (err) {
            reject(err);
          } else {
            const res = data.map(function(attributes) {
              return new Promotion(attributes);
            });
            resolve(res);
          }
        });
      });
    };

    Promotions.prototype.promotion = function(promotionCode) {
      const path = '/promotions';
      const query = {promotion_code: validation.validatePromotion(promotionCode)};

      return new Promise((resolve, reject) => {
        this.client.get(path, query, (err, data) => {
          if (err) {
            reject(err);
          } else {
            const res = data.map(function(attributes) {
              return new Promotion(attributes);
            });
            resolve(res);
          }
        });
      });
    };

    Promotions.prototype.duplicatePromotionCode = function(promotionCode, templateCode) {
      const path = '/promotions';
      const query = {
        id: validation.validatePromotion(promotionCode),
        template_code: validation.validatePromotion(templateCode),
      };

      return new Promise((resolve, reject) => {
        this.client.post(path, null, query, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    };

    return Promotions;
  })();
}).call(this);
