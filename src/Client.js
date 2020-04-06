(function() {
  const url = require("url");
  const http = require("http");
  const https = require("https");
  const querystring = require('querystring');
  const Appointments = require("./api/Appointments");
  const Forms = require("./api/Forms");
  const Schedules = require("./api/Schedules");
  const Users = require("./api/Users");

  var DEFAULT_HOST = 'https://www.supersaas.com';

  var Client = function Client(configuration) {
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
  }
  Client.API_VERSION = '1';
  Client.VERSION = '1.2.1';

  Client.prototype.get = function(path, query, callback) {
    return this.request('GET', path, null, query, callback);
  }

  Client.prototype.post = function(path, params, query, callback) {
    return this.request('POST', path, params, query, callback);
  }

  Client.prototype.put = function(path, params, query, callback) {
    return this.request('PUT', path, params, query, callback);
  }

  Client.prototype.delete = function(path, params, query, callback) {
    return this.request('DELETE', path, params, query, callback);
  }

  Client.prototype.request = function(httpMethod, path, params, query, callback) {
    params = params || {};
    query = query || {};
    if (!this.accountName) {
      throw new Error("Account name not configured. Call `Client.configure`.");
    }
    if (!this.api_key) {
      throw new Error("Account API key not configured. Call `Client.configure`.");
    }

    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': this._userAgent(),
      'Authorization': 'Basic ' + new Buffer.from(this.accountName + ':' + this.api_key).toString('base64')
    }

    if (!['GET', 'POST', 'PUT', 'DELETE'].includes(httpMethod)) {
      throw new Error("Invalid HTTP Method: " + httpMethod + ". Only `GET`, `POST`, `PUT`, `DELETE` supported.");
    }

    var parsedUrl = this.host + "/api" + path + ".json";
    if (query) {
      var parsedQuery = this._parseParams(query)
      var qs = querystring.stringify(parsedQuery)
      parsedUrl += qs ? ("?" + qs) : '';
    }
    parsedUrl = url.parse(parsedUrl);

    var parsedParams = this._parseParams(params)

    var options = {
      method: httpMethod,
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.path,
      headers: headers
    };


    if (this.dryRun) {
      this.lastRequest = options;
      if (callback) {
        callback(null, [])
      }
      return {};
    }

    var req = this._requestModule(parsedUrl).request(options);
    var verboseLogging = this.verbose;

    req.on("response", function(res) {
      var location = (res.statusCode == 201 && httpMethod == 'POST') ? res.headers.location : null
      res.setEncoding('utf8');
      var body = "";

      res.on("data", function(data) {
        return body += data.toString();
      });
      return res.on("end", function() {
        if (verboseLogging) {
          console.log("Response:");
          console.log(body);
          console.log("==============================");
        }
        if (callback) {
          try {
            var obj = location || (body && body.length ? JSON.parse(body) : "");
            if (obj.errors) {
              callback(obj);
            } else {
              callback(null, obj);
            }
          } catch (e) {
            callback({errors: [{title: e.message}]});
          }
        }
      });
    })
    req.on('error', function(e) {
      console.log('ERRRRRRRR',e)
      if (callback) {
        callback(e)
      }
    });

    if (verboseLogging) {
      console.log("### SuperSaaS Client Request:");
      console.log(httpMethod + " " + parsedUrl.host + parsedUrl.path);
      console.log(params);
      console.log("------------------------------");
    }

    var hasParamData = Object.keys(parsedParams).length > 0;
    if (hasParamData) {
      var paramData = JSON.stringify(parsedParams);
      req.write(paramData, 'utf8');
    }

    this.lastRequest = req;
    return req.end();
  }
  Client.prototype._requestModule = function(url) {
    return url.protocol === 'https' ? https : http
  }
  Client.prototype._userAgent = function() {
    return "SSS/" + Client.VERSION + " Node/" + process.version + " API/" + Client.API_VERSION;
  }
  Client.prototype._parseParams = function(params) {
    var parsed = {}
    Object.keys(params).forEach(function (key) {
      if (params[key] !== null && params[key] !== '') {
        parsed[key] = params[key]
      }
    })
    return parsed
  }

  var config = {
    accountName: process.env['SSS_API_ACCOUNT_NAME'],
    api_key: process.env['SSS_API_KEY'],
    host: DEFAULT_HOST,
    dryRun: false,
    verbose: false
  }
  Client.Instance = new Client(config);
  Client.configure = function (configuration) {
    for (var key in config) {
      if (configuration[key]) {
        Client.Instance[key] = configuration[key]
      }
    }
  }

  module.exports = Client;
}).call(this);