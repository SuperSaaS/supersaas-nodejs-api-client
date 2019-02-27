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
    
    var client = new Client({accountName: 'accnt', api_key: 'xxxxxxxxxxxxxxxxxxxxxx'});

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

Method with the last argument after optional `form` and `webhook` arguments:

    Client.Instance.users.create(attributes, form, webhook, function(err, data){});

Method without optional arguments:

    Client.Instance.users.create(attributes, function(err, data){});

#### List Schedules

Get all account schedules:

    Client.Instance.schedules.list(function(err, data) { 
        console.log(data); //=> ["Schedule", ...]
    });

#### List Resource

Get all services/resources by `scheduleId`:

    Client.Instance.schedules.resources(12345, function(err, data) { 
        console.log(data); //=> ["Resource", ...]
    });

_Note: does not work for capacity type schedules._

#### Create User

Create a user with user attributes params:

    Client.Instance.users.create({"name": ..., ...}, null, true, function(err, data) { 
        console.log(data); //=> "User"
    });

#### Update User

Update a user by `userId` with user attributes params:

    Client.Instance.users.update(12345, {"name": ..., ...}, null, true, function(err, data) { 
        console.log(data); //=> "object"
    });
    
#### Delete User

Delete a single user by `userId`:

    Client.Instance.users.delete(12345, function(err, data) { 
        console.log(data); //=> "object"
    });
    
#### Get User

Get a single user by `userId`:

    Client.Instance.users.get(12345, function(err, data) { 
        console.log(data); //=> "User"
    });

#### List Users

Get all users with optional `form` and `limit`/`offset` pagination params:

    Client.Instance.users.list(false, 25, 0, function(err, data) { 
        console.log(data); //=> ["User", ...]
    });

#### Create Appointment/Booking

Create an appointment by `scheduleId` and `userId` with appointment attributes and `form` and `webhook` params:

    Client.Instance.appointments.create(12345, 67890, {"full_name": ...}, true, true, function(err, data) { 
        console.log(data); //=> "Appointment"
    });

#### Update Appointment/Booking

Update an appointment by `scheduleId` and `appointmentId` with appointment attributes params:

    Client.Instance.appointments.update(12345, 67890, {"full_name": ...}, function(err, data) { 
        console.log(data); //=> "object"
    });

#### Delete Appointment/Booking

Delete a single appointment by `scheduleId` and `appointmentId`:

    Client.Instance.appointments.delete(12345, 67890, function(err, data) { 
        console.log(data); //=> "object"
    });

#### Get Appointment/Booking

Get a single appointment by `scheduleId` and `appointmentId`:

    Client.Instance.appointments.get(12345, 67890, function(err, data) { 
        console.log(data); //=> ["Appointment", ...]
    });

#### List Appointments/Bookings

Get agenda (upcoming) appointments by `scheduleId` and `userId`, with `form` and `slot` view params:

    Client.Instance.appointments.list(12345, 67890, true, true, function(err, data) { 
        console.log(data); //=> ["Appointment", ...]
    });

#### Get Agenda

Get agenda (upcoming) appointments by `scheduleId` and `userId`, with `form` and `slot` view params:

    Client.Instance.appointments.agenda(12345, 67890, true, true, function(err, data) { 
        console.log(data); //=> ["Appointment", ...]
    });

#### Get Available Appointments/Bookings

Get available appointments by `scheduleId`, with `from` time and `lengthMinutes` and `resource` params:

    Client.Instance.appointments.available(12345, '2018-1-31 00:00:00', 15, 'My Class', function(err, data) { 
        console.log(data); //=> ["Appointment", ...]
    });

#### Get Recent Changes

Get recently changed appointments by `scheduleId`, with `from` time and `slot` view params:

    Client.Instance.appointments.changes(12345, '2018-1-31 00:00:00', true, function(err, data) { 
        console.log(data); //=> ["Appointment", ...]
    });

#### List Template Forms

Get all forms by template `superformId`, with `from` time param:

    Client.Instance.forms.list(12345, '2018-1-31 00:00:00', function(err, data) { 
        console.log(data); //=> ["Form", ...]
    });

#### Get Form

Get a single form by `form_id`:

    Client.Instance.forms.get(12345, function(err, data) { 
        console.log(data); //=> "Form"
    });

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
