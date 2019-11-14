# SuperSaaS NodeJS SDK

Online bookings/appointments/calendars in NodeJS using the SuperSaaS scheduling platform - https://supersaas.com

The SuperSaaS API provides services that can be used to add online booking and scheduling functionality to an existing website or CRM software.

## Prerequisites

1. [Register for a (free) SuperSaaS account](https://www.supersaas.com/accounts/new), and
2. get your account name and API key on the [Account Info](https://www.supersaas.com/accounts/edit) page.

##### Dependencies

NodeJS 6 or greater.

No external packages. Only the native `http`/`https` modules are used.

## Installation

The SuperSaaS NodeJS API Client is available as a module from the NPM Registry and can be included in your project package. Note, the supersaas-api-client may update major versions with breaking changes, so it's recommended to use a major version when expressing the gem dependency. e.g.

    {
        "dependencies": {
            "supersaas-api-client": "^1.0"
        }
    }

    $ npm install supersaas-api-client

## Configuration

Require the module.

    var supersaas = require('supersaas-api-client');
    var Client = supersaas.Client;
    
The `Client` can be used either (1) through the singleton `Instance` property, e.g.
    
    Client.configure({
      accountName: 'account',
      api_key: 'xxxxxxxxxxxxxxxxxxxxxx',
      host: 'http://test',
      dryRun: true,
      verbose: true
    })
    Client.Instance.accountName; //=> 'account'
    
Or else by (2) simply creating a new client instance manually, e.g.
    
    var client = new Client({accountName: 'account', api_key: 'xxxxxxxxxxxxxxxxxxxxxx'});

> Note, ensure that `configure` is called before `Instance`, otherwise the client will be initialized with configuration defaults.

If the client isn't configured explicitly, it will use default `ENV` variables for the account name, api key, and user name.

    process.env.SSS_API_ACCOUNT_NAME = 'your-env-supersaas-account-name';
    process.env.SSS_API_KEY = 'your-supersaas-account-api-key';
    SuperSaaS.Client.Instance.accountName; //=> 'your-env-supersaas-account-name';
    SuperSaaS.Client.Instance.api_key; //=> 'your-env-supersaas-account-name';
    
All configuration options can be individually set on the client.

    SuperSaaS.Client.Instance.api_key = 'xxxxxxxxxxxxxxxxxxxxxx';
    SuperSaaS.Client.Instance.verbose = true;
    ...

## API Methods

Details of the data structures, parameters, and values can be found on the developer documentation site:

https://www.supersaas.com/info/dev

All API methods accept an optional error-first callback with a signature of `function(err, data)`. The callback function should always be the last argument in the call.

> Note, methods with optional arguments can accept a callback as the final argument for any of those arguments. For example:

Method with the last argument after optional `userId` and `webhook` arguments:

    Client.Instance.users.create(attributes, userId, webhook, function(err, data){});

Method without optional arguments:

    Client.Instance.users.create(attributes, function(err, data){});

#### List Schedules

Get all account schedules:

Definition:

    Client.Instance.schedules.list(callback)
    
Example:

    Client.Instance.schedules.list(function(err, data) { 
        console.log(data); //=> ["Schedule", ...]
    });

#### List Resource

Get all services/resources by `scheduleId`:

Definition:

    Client.Instance.schedules.resources(scheduleId, callback)
    
Example:

    Client.Instance.schedules.resources(12345, function(err, data) { 
        console.log(data); //=> ["Resource", ...]
    });

_Note: does not work for capacity type schedules._

#### Create User

Create a user with user attributes params:

Definition:

    Client.Instance.users.create(attributes, userId, webhook, callback)
    
Example:
 
    Client.Instance.users.create({"name": ..., ...}, null, true, function(err, data) { 
        console.log(data); //=> {location: 'https://www.supersaas.com/api/users/12345678.json}
    });

#### Update User

Update a user by `userId` with user attributes params:

Definition:

    Client.Instance.users.update(userId, attributes, webhook, callback)
    
Example:

    Client.Instance.users.update(12345, {"name": ..., ...}, null, function(err, data) { 
        console.log(data); //=> "object"
    });
    

#### Get User

Get a single user by `userId`:

Definition:

    Client.Instance.users.get(userId, callback)
    
Example:

    Client.Instance.users.get(12345, function(err, data) { 
        console.log(data); //=> "User"
    });

#### List Users

Get all users with optional `form` and `limit`/`offset` pagination params:

Definition:

    Client.Instance.users.list(form, limit, offset, callback)
    
Example:

    Client.Instance.users.list(false, 25, 0, function(err, data) { 
        console.log(data); //=> ["User", ...]
    });

#### Delete User

Delete a single user by `userId`:

Definition:

    Client.Instance.users.delete(userId, callback)
    
Example:

    Client.Instance.users.delete(12345, function(err, data) { 
        console.log(data); //=> "object"
    });
    
#### Get Recent Changes

Get recently changed appointments by `scheduleId`, with `fromTime` and `slot` view params:

Definition:

    Client.Instance.appointments.changes(scheduleId, fromTime, slot, callback)
    
Example:

    Client.Instance.appointments.changes(12345, '2018-01-31 00:00:00', true, function(err, data) { 
        console.log(data); //=> ["Appointment", ...]
    });
    
#### Get list of appointments

Get list of appointments by `schedule_id`, with `today`,`from` time, `to` time and `slot` view param:
     
Definition:

    Client.Instance.appointments.range(scheduleId, today, fromTime, to, slot, callback)
    
Example:

    Client.Instance.appointments.range(12345, false, '2018-01-31 00:00:00', '2018-02-31 00:00:00', true, function(err, data) { 
        console.log(data); //=> ["Appointment", ...]
    });

#### Get Agenda

Get agenda (upcoming) appointments of a single user by `scheduleId` and `userId`, with `fromTime` and `slot` view params:

Definition:

    Client.Instance.appointments.agenda(scheduleId, userId, fromTime, slot, callback)
    
Example:

    Client.Instance.appointments.agenda(12345, 54321, '2019-01-31 00:00:00', true, function(err, data) { 
        console.log(data); //=> ["Appointment", ...]
    });

#### Get Available Appointments/Bookings

Get available appointments for given schedule by `scheduleId`, with `fromTime`, `lengthMinutes`, `resource`, `full` and  `limit` params:

Definition:

    Client.Instance.appointments.available(scheduleId, fromTime, lengthMinutes, resource, full, limit, callback)
    
Example:

    Client.Instance.appointments.available(12345, '2018-01-31 00:00:00', 15, 'My Class', function(err, data) { 
        console.log(data); //=> ["Appointment", ...]
    });

#### Create Appointment/Booking

Create an appointment by `scheduleId` and `userId` with appointment attributes and `form` and `webhook` params:

Definition:

    Client.Instance.appointments.create(scheduleId, userId, attributes, form, webhook, callback)
    
Example:

    Client.Instance.appointments.create(12345, 67890, {"full_name": ...}, true, true, function(err, data) { 
        console.log(data); //=> {location: 'https://www.supersaas.com/api/bookings/12345678.json}
    });

#### Update Appointment/Booking

Update an appointment by `scheduleId` and `appointmentId` with appointment attributes params:

Definition:

    Client.Instance.appointments.update(scheduleId, appointmentId, attributes, form, webhook, callback)
    
Example:

    Client.Instance.appointments.update(12345, 67890, {"full_name": ...}, true, true, function(err, data) { 
        console.log(data); //=> "object"
    });

#### Get Appointment/Booking

Get a single appointment by `scheduleId` and `appointmentId`:

Definition:

    Client.Instance.appointments.get(scheduleId, appointmentId, callback)
    
Example:

    Client.Instance.appointments.get(12345, 67890, function(err, data) { 
        console.log(data); //=> ["Appointment", ...]
    });

#### List Appointments/Bookings

Get upcoming appointments by `scheduleId` with `form`, `startTime` and `limit` view params:

Definition:

    Client.Instance.appointments.list(scheduleId, form, startTime, limit, callback)
    
Example:

    Client.Instance.appointments.list(12345, true, '2019-01-31 00:00:00', function(err, data) { 
        console.log(data); //=> ["Appointment", ...]
    });
    
#### Delete Appointment/Booking

Delete a single appointment by `scheduleId` and `appointmentId`:

Definition:

    Client.Instance.appointments.delete(scheduleId, appointmentId, callback)
    
Example:

    Client.Instance.appointments.delete(12345, 67890, function(err, data) { 
        console.log(data); //=> "object"
    });

#### List Template Forms

Get all forms by template `formId`, with `fromTime` param:

Definition:

    Client.Instance.forms.list(formId, fromTime, callback)
    
Example:

    Client.Instance.forms.list(12345, '2019-01-31 00:00:00', function(err, data) { 
        console.log(data); //=> ["Form", ...]
    });

#### Get Form

Get a single form by `formId`:

Definition:

    Client.Instance.forms.get(formId, callback)
    
Example:

    Client.Instance.forms.get(12345, function(err, data) { 
        console.log(data); //=> "Form"
    });

## Examples

The ./examples folder contains npm executable scripts demonstrating how to use the API Client for common requests.

The examples will require your account name and api key. These can be set as environment variables. e.g.

    SSS_API_KEY=xxxxxxxxxxxxxxxxxxxxxx && SSS_API_ACCOUNT_NAME=myaccountname && npm run schedules

## Testing

The HTTP requests can be stubbed by configuring the client with the `dryRun` option, e.g.

    Client.Instance.dryRun = true;

Note, stubbed requests always invoke callbacks with an empty Array.

The `Client` also provides a `lastRequest` attribute containing the options object from the last performed request, e.g. 

    Client.Instance.lastRequest; //=> {"method": ..., "headers": ..., "path": ...}

The headers, body, path, etc. of the last request can be inspected for assertion in tests, or for troubleshooting failed API requests.

For additional troubleshooting, the client can be configured with the `verbose` option, which will log any JSON contents in the request and response to the console, e.g.

    Client.Instance.verbose = true;

## Error Handling

The API Client uses error-first callbacks to indicate success or failure status; if the `err` parameter is not null, then it will contain an array of error message object, e.g.

      Client.Instance.appointments.create(12345, 67890, {bad_field_name: ''}, function(err, data) {
        if (err) {
            console.log(err); //=> => [{"status":"400","title":"Bad request: unknown attribute 'bad_field_name' for Booking."}]
        }
      });

## Additional Information

+ [SuperSaaS Registration](https://www.supersaas.com/accounts/new)
+ [Product Documentation](https://www.supersaas.com/info/support)
+ [Developer Documentation](https://www.supersaas.com/info/dev)
+ [Python API Client](https://github.com/SuperSaaS/supersaas-python-api-client)
+ [PHP API Client](https://github.com/SuperSaaS/supersaas-php-api-client)
+ [Ruby API Client](https://github.com/SuperSaaS/supersaas-ruby-api-client)
+ [C# API Client](https://github.com/SuperSaaS/supersaas-csharp-api-client)
+ [Objective-C API Client](https://github.com/SuperSaaS/supersaas-objc-api-client)
+ [Go API Client](https://github.com/SuperSaaS/supersaas-go-api-client)

Contact: [support@supersaas.com](mailto:support@supersaas.com)

## Releases

The package follows [semantic versioning](https://semver.org/), i.e. MAJOR.MINOR.PATCH 

## License

The SuperSaaS NodeJS API Client is available under the MIT license. See the LICENSE file for more info.
