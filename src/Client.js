(function() {
  const http = require('http');
  const https = require('https');
  const querystring = require('querystring');
  const Appointments = require('./api/Appointments');
  const Forms = require('./api/Forms');
  const Schedules = require('./api/Schedules');
  const Users = require('./api/Users');
  const Promotions = require('./api/Promotions');
  const Groups = require('./api/Groups');

  const DEFAULT_HOST = 'https://www.supersaas.com';

  const Client = function Client(configuration) {
    this.accountName = configuration.accountName;
    this.api_key = configuration.api_key;
    this.host = configuration.host || DEFAULT_HOST;
    this.dryRun = configuration.dryRun;
    this.verbose = configuration.verbose;
    this.lastRequest = null;

    this.appointments = new Appointments(this);
    this.forms = new Forms(this);
    this.schedules = new Schedules(this);
    this.users = new Users(this);
    this.groups = new Groups(this);
    this.promotions = new Promotions(this);
    this.q = new Array(MAX_PER_WINDOW);
  };
  Client.API_VERSION = '3';
  Client.VERSION = '2.0.0';

  Client.prototype.get = function(path, query, callback) {
    return this.request('GET', path, null, query, callback);
  };

  Client.prototype.post = function(path, params, query, callback) {
    return this.request('POST', path, params, query, callback);
  };

  Client.prototype.put = function(path, params, query, callback) {
    return this.request('PUT', path, params, query, callback);
  };

  Client.prototype.delete = function(path, params, query, callback) {
    return this.request('DELETE', path, params, query, callback);
  };

  const WINDOW_SIZE = 1000;
  const MAX_PER_WINDOW = 4;
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  Client.prototype.throttle = async function() {
    return new Promise( async (resolve) => {
      this.q.push(Date.now());
      const oldestRequest = this.q.shift();
      const remainingTime = Date.now() - oldestRequest;
      if (oldestRequest && remainingTime < WINDOW_SIZE) {
        await sleep(WINDOW_SIZE - remainingTime);
      }
      // Resolve the promise after the sleep or immediately if no throttling is needed
      resolve();
    });
  };

  Client.prototype.request = async function(httpMethod, path, params, query, callback) {
    try {
      await this.throttle();
      params = params || {};
      query = query || {};
      if (!this.accountName) {
        throw new Error('Account name not configured. Call `Client.configure`.');
      }
      if (!this.api_key) {
        throw new Error('Account API key not configured. Call `Client.configure`.');
      }

      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': this._userAgent(),
        'Authorization': 'Basic ' + new Buffer.from(this.accountName + ':' + this.api_key).toString('base64'),
      };

      if (!['GET', 'POST', 'PUT', 'DELETE'].includes(httpMethod)) {
        throw new Error('Invalid HTTP Method: ' + httpMethod + '. Only `GET`, `POST`, `PUT`, `DELETE` supported.');
      }

      let parsedUrl = this.host + '/api' + path + '.json';
      if (query) {
        const parsedQuery = this._parseParams(query);
        const qs = querystring.stringify(parsedQuery);
        parsedUrl += qs ? ('?' + qs) : '';
      }
      parsedUrl = new URL(parsedUrl);
      const parsedParams = this._parseParams(params);

      const requestBody = {};
      requestBody.path = parsedUrl.href;
      if (httpMethod) {
        requestBody.method = httpMethod;
      }
      if (headers) {
        requestBody.headers = headers;
      }

      if (Object.keys(parsedParams).length > 0) {
        requestBody.body = JSON.stringify(parsedParams);
      }

      if (this.dryRun) {
        this.lastRequest = requestBody;
        if (callback) {
          callback(null, []);
        }
        return {};
      }

      const verboseLogging = this.verbose;
      if (verboseLogging) {
        console.log(requestBody);
      }
      const response = await fetch(requestBody.path, requestBody);

      if (!response.ok) {
        if (verboseLogging) {
          console.error(`Failed request ${response.status}, ${response.body}`);
        }
        throw new Error(`Request failed with status ${response.status}`);
      }

      const contentType = response.headers.get('Content-Type');
      let body;

      if (contentType.includes('application/json')) {
        if (response.headers.get('Content-Length') > 0) {
          body = await response.json();
        }
      } else if (contentType.includes('text/plain')) {
        if (response.headers.get('Content-Length') > 0) {
          body = await response.text();
        }
      } else {
        console.log('Unsupported content type:', contentType);
        throw new Error(`Unsupported content type: ${contentType}`);
      }

      if (callback) {
        try {
          if (response.status === 201 && httpMethod === 'POST') {
            body = response.headers.get('location');
          }
          if (verboseLogging) {
            console.log("httpMethod: ", httpMethod, ", status: ", response.status);
            console.log(body);
          }
          callback(null, body);
        } catch (error) {
          callback({errors: [{title: error.message}]}, null);
        }
      } else {
        if (response.status === 201 && httpMethod === 'POST') {
          body = response.headers.get('location');
        }
        return body;
      }
    } catch (error) {
      console.log(error);
      if (callback) {
        callback(error, null);
      } else {
        throw error;
      }
    }
  };

  Client.prototype._requestModule = function(url) {
    return url.protocol === 'https' ? https : http;
  };
  Client.prototype._userAgent = function() {
    return 'SSS/' + Client.VERSION + ' Node/' + process.version + ' API/' + Client.API_VERSION;
  };
  Client.prototype._parseParams = function(params) {
    const parsed = {};
    Object.keys(params).forEach(function(key) {
      if (params[key] !== null && params[key] !== '') {
        parsed[key] = params[key];
      }
    });
    return parsed;
  };

  const config = {
    accountName: process.env['SSS_API_ACCOUNT_NAME'],
    api_key: process.env['SSS_API_KEY'],
    host: DEFAULT_HOST,
    dryRun: false,
    verbose: false,
  };
  Client.Instance = new Client(config);
  Client.configure = function(configuration) {
    for (const key in config) {
      if (configuration[key]) {
        Client.Instance[key] = configuration[key];
      }
    }
  };

  module.exports = Client;
}).call(this);
