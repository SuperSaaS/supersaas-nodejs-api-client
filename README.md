# SuperSaaS NodeJS SDK

Online bookings/appointments/calendars in NodeJS using the SuperSaaS scheduling platform - https://supersaas.com

The SuperSaaS API provides services that can be used to add online booking and scheduling functionality to an existing website or CRM software.

NOTE: Versions 2+ uses promises instead of callbacks and thus use the old API client or update your code using promises.

## Prerequisites

1. [Register for a (free) SuperSaaS account](https://www.supersaas.com/accounts/new), and
2. get your account name and API key on the [Account Info](https://www.supersaas.com/accounts/edit) page.

##### Dependencies

NodeJS 20.11.1 or greater.

No external packages. Only the native `http`/`https` modules are used.

## Installation

The SuperSaaS NodeJS API Client is available as a module from the NPM Registry and can be included in your project package. Note, the supersaas-api-client may update major versions with breaking changes, so it's recommended to use a major version when expressing the gem dependency. e.g.

    {
        "dependencies": {
            "supersaas-api-client": "^2.0"
        }
    }

    $ npm install supersaas-api-client

## Configuration

Require the module.

    let supersaas = require('supersaas-api-client');
    let Client = supersaas.Client;
    
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
    
    let client = new Client({accountName: 'account', api_key: 'xxxxxxxxxxxxxxxxxxxxxx'});

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

The client returns a Promise, and you can either use `await` in an `async` function:

    let userUrl = await Client.Instance.users.create(attributes, userId, webhook);

Or another option is to use `then`, `catch`, `finally`

    Client.Instance.users.create(attributes).then(userUrl => { })


#### List Schedules

Get all account schedules:

Definition:

    Client.Instance.schedules.list()
    
Example:

    Client.Instance.schedules.list().then(data => { 
        console.log(data); //=> ["Schedule", ...]
    });

#### List Resource

Get all services/resources by `scheduleId`:

Definition:

    Client.Instance.schedules.resources(scheduleId)
    
Example:

    Client.Instance.schedules.resources(12345).then(data => { 
        console.log(data); //=> ["Resource", ...]
    });

_Note: does not work for capacity type schedules._

#### List Fields of a Schedule

Get all the available fields of a schedule by `scheduleId`:

Definition:

    Client.Instance.schedules.resources(scheduleId)

Example

    Client.Instance.schedules.fieldList(12345).then(data => {
        console.log(data); //=> ["FieldList", ...]
    });

#### Create User

Create a user with user attributes params.
If `webhook=true` is present it will trigger any webhooks connected to the account.
To avoid a ‘create’ action from being automatically interpreted as an ‘update’, you can add the parameter `duplicate=raise`, then error `422 Unprocessable Entity` will be raised.
If in your database your user has id 1234 then you can supply a foreign key in format 1234fk in `userId` (optional) which you can use to identify user:
If validation fails for any field then error `422 Unprocessable Entity` will be raised and any additional information will be printed to your log.
Data fields that you can supply can be found [here.](https://www.supersaas.com/info/dev/user_api)

Definition:

    Client.Instance.users.create(attributes, userId = null, webhook = false, duplicate = null)
    
Example:
 
    Client.Instance.users.create({"name": ..., ...}, null, true).then(data => { 
        console.log(data); //=> 'https://www.supersaas.com/api/users/12345678.json
    });

#### Update User

Update a user by `userId` with user attributes params.
If `webhook=true` is present it will trigger any webhooks connected to the account.
To avoid automatically creating a new record, you can add the parameter `notfound=error` or `notfound=ignore` to return a 404 Not Found or 200 OK respectively.
If the `userId` does not exist 404 error will be raised.
You only need to specify the attributes you wish to update:

Definition:

    Client.Instance.users.update((userId, attributes, webhook = null, notFound = null))
    
Example:

    Client.Instance.users.update(12345, {"name": ..., ...}, null).then(data => { 
        console.log(data); //=> null
    });

#### Get User

Get a single user by `userId` , and if the user does not exist 404 error will be raised:

Definition:

    Client.Instance.users.get(userId)
    
Example:

    Client.Instance.users.get(12345).then(data => { 
        console.log(data); //=> "User"
    });

#### List Users

Get all users with optional `form` and `limit`/`offset` pagination params:

Definition:

    Client.Instance.users.list(form = null, limit = null, offset = null)
    
Example:

    Client.Instance.users.list(false, 25, 0).then(data => { 
        console.log(data); //=> ["User", ...]
    });

#### Delete User

Delete a single user by `userId` , and if the user does not exist 404 error will be raised:

Definition:

    Client.Instance.users.delete(userId)
    
Example:

    Client.Instance.users.delete(12345).then(data => { 
        console.log(data); //=> null
    });

#### List Fields of User object

Get all the fields available to user object.

Definition:

    Client.Instance.users.fieldList()

Example:

    Client.instance.users.fieldList().then(data => {
        console.log(data); //=> [FieldList, ...]
    });
    
#### Get Recent Changes

Get recently changed appointments by `scheduleId`, with `from` time, `to` time, `user` user, `slot` view params (see [docs](https://www.supersaas.com/info/dev/appointment_api#recent_changes)),

Definition:

    Client.Instance.appointments.changes(scheduleId, fromTime = null, to = null, slot = false, user = null, limit = null, offset = null)
    
Example:

    Client.Instance.appointments.changes(12345, '2018-01-31 00:00:00', null, true).then(data => { 
        console.log(data); //=> ["Appointment", ...]
    });
    
#### Get list of appointments

Get recently changed appointments by `scheduleId`, with `fromTime` time, `to` time, `user` user, `slot` view params (for more options see [docs](https://www.supersaas.com/info/dev/appointment_api#recent_changes)),

Definition:

    Client.Instance.appointments.range(scheduleId, today = false, fromTime = null, to = null, slot = false, user = null, resourceId = null, serviceId = null, limit = null, offset = null)
    
Example:

    Client.Instance.appointments.range(12345, false, '2018-01-31 00:00:00', '2018-02-31 00:00:00', true).then(data => { 
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

Get available appointments for given schedule by `scheduleId`, with `fromTime`, `lengthMinutes`, `resource`, `full` and  `limit` params ([see](https://www.supersaas.com/info/dev/appointment_api#availability_api):

Definition:

    Client.Instance.appointments.available(scheduleId, fromTime, lengthMinutes = null, resource = null, full = null, limit = null)
    
Example:

    Client.Instance.appointments.available(12345, '2018-01-31 00:00:00', 15, 'My Class').then(data => { 
        console.log(data); //=> ["Appointment", ...]
    });

#### Create Appointment/Booking

Create an appointment with `scheduleId`, and `userId(optional)` (see API documentation on [create new](https://www.supersaas.com/info/dev/appointment_api#bookings_api)) appointment attributes and optional `form` and `webhook` params,

Definition:

    Client.Instance.appointments.create(scheduleId, userId, attributes, form = false, webhook = false)
    
Example:

    Client.Instance.appointments.create(12345, 67890, {"full_name": ...}, true, true).then(data => { 
        console.log(data); //=> 'https://www.supersaas.com/api/bookings/12345678.json
    });

#### Update Appointment/Booking

Update an appointment by `scheduleId` and `appointmentId` with appointment attributes params, see the above link:

Definition:

    Client.Instance.appointments.update(scheduleId, appointmentId, attributes, form = false, webhook = false)
    
Example:

    Client.Instance.appointments.update(12345, 67890, {"full_name": ...}, true, true).then(data => { 
        console.log(data); //=> null
    });

#### Get Appointment/Booking

Get a single appointment by `scheduleId` and `appointmentId`:

Definition:

    Client.Instance.appointments.get(scheduleId, appointmentId)
    
Example:

    Client.Instance.appointments.get(12345, 67890).then(data => { 
        console.log(data); //=> "Appointment"
    });

#### List Appointments/Bookings

Get upcoming appointments by `scheduleId` with `form`, `startTime` and `limit` view params:

Definition:

    Client.Instance.appointments.list(scheduleId, form = null, startTime = null, limit = null)
    
Example:

    Client.Instance.appointments.list(12345, true, '2019-01-31 00:00:00').then(data => { 
        console.log(data); //=> ["Appointment", ...]
    });
    
#### Delete Appointment/Booking

Delete a single appointment by `scheduleId` and `appointmentId`:

Definition:

    Client.Instance.appointments.delete(scheduleId, appointmentId)
    
Example:

    Client.Instance.appointments.delete(12345, 67890).then(data => { 
        console.log(data); //=> null
    });

#### List Template Forms

Get all forms by template `formId`, with `fromTime`, and `user` params ([see](https://www.supersaas.com/info/dev/form_api)):

Definition:

    Client.Instance.forms.list(formId, fromTime = null, user = null)
    
Example:

    Client.Instance.forms.list(12345, '2019-01-31 00:00:00').then(data => { 
        console.log(data); //=> ["Form", ...]
    });

#### Get Form

Get a single form by `formId`, will raise 404 error if not found.

Definition:

    Client.Instance.forms.get(formId)
    
Example:

    Client.Instance.forms.get(12345).then(data=> { 
        console.log(data); //=> "Form"
    });

#### Get a list of SuperForms

Get a list of Form templates (SuperForms).

Definition:

    Client.Instance.forms.forms()

Example:

    Client.Instance.forms.forms().then(data=> {
        console.log(data); //=> [SuperForm, ...]
    });

#### List Promotions

Get a list of promotional coupon codes with pagination parameters `limit` and `offset` (see [docs](https://www.supersaas.com/info/dev/promotion_api)).

Definition:

    Client.Instance.promotions.list(limit = null, offset = null)

Example

    Client.Instance.promotions.list().then(data=> {
        console.log(data); //=> [Promotion, ...]
    });

#### Get a single coupon code

Retrieve information about a single coupon code use with `promotionCode`.

Definition:

    Client.Instance.promotions.promotion(promotionCode)

Example:

    Client.Instance.promotions.promotion(12345).then(data=> {
        console.log(data); //=> Promotion
    })

#### Duplicate promotion code

Duplicate a template promotion by giving (new) `promotionCode` and `templateCode` in that order.

Definition:

    Client.Instance.promotions.duplicatePromotionCode(promotionCode, templateCode)

Example:

    Client.Instance.promotions.duplicatePromotionCode(12345, 94832838).then(data => {
        console.log(data); //=> null
    });

#### List Groups in an account

List Groups in an account ([see](https://www.supersaas.com/info/dev/information_api))

Definition:

    Client.Instance.groups.list()

Example:

    Client.Instance.groups.list().then(data => {
        console.log(data); //=> [Group, ...]
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

The API Client throws errors to indicate success or failure status, use `try-catch`

    try {
        await Client.Instance.appointments.create(12345, 67890, {bad_field_name: ''});
    } catch (error) {
        console.log(error.message); //=> Request failed with status 400
}

Explanation of the error codes returned:

    422 HTTP Request Error: Unprocessable Content, check the parameters are correct
    400 HTTP Request Error: Bad Request, usually a malformed request
    401 HTTP Request Error: Unauthorised, check that you have the rights to make the request
    404 HTTP Request Error: Not Found (non existent user id for example)
    501 Not yet implemented for service type schedule
    403 Unauthorized, check your credentials
    405 Not available for capacity type schedule

## Additional Information

+ [SuperSaaS Registration](https://www.supersaas.com/accounts/new)
+ [Product Documentation](https://www.supersaas.com/info/support)
+ [Developer Documentation](https://www.supersaas.com/info/dev)
+ [Python API Client](https://github.com/SuperSaaS/supersaas-python-api-client)
+ [PHP API Client](https://github.com/SuperSaaS/supersaas-php-api-client)
+ [Ruby API Client](https://github.com/SuperSaaS/supersaas-ruby-api-client)
+ [C# API Client](https://github.com/SuperSaaS/supersaas-csharp-api-client)

Contact: [support@supersaas.com](mailto:support@supersaas.com)

## Releases

The package follows [semantic versioning](https://semver.org/), i.e. MAJOR.MINOR.PATCH 

## License

The SuperSaaS NodeJS API Client is available under the MIT license. See the LICENSE file for more info.
