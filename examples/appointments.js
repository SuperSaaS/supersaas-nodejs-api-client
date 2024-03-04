let client = require('../src/Client').Instance;

function setupClient(client) {
    client.accountName = 'YOUR_ACCOUNT';
    client.api_key = 'YOUR_API_KEY';
    client.verbose = false; //you can get more information by setting this to true
    client.host = 'https://www.supersaas.com';
}

// helper function to create a test booking
function bookingAttributes(start = null, finish = null, resource_id = null, slot_id = null) {
    return {
        start: start,
        finish: finish,
        name: 'test name',
        email: 'testing@testing.com',
        full_name: 'Hello World',
        address: 'Rue la vie',
        mobile: '666666',
        phone: '555555',
        country: 'NL',
        super_field: 'Test super_field',
        resource_id: resource_id,
        slot_id: slot_id,
    };
}

// appointments need a user, this is helper function to create one
function userAttributes(name = 'test-api') {
    const email = `${name.replace(/\s+/g, '').toLowerCase()}@example.com`;

    return {
        name: email,
        email: email,
        password: 'pass123',
        full_name: 'Tester Test',
        address: '123 St, City',
        mobile: '555-5555',
        phone: '555-5555',
        country: 'NL',
        field_1: 'f 1',
        field_2: 'f 2',
        super_field: 'sf',
        credit: 10,
        role: 3,
    };
}

// helper function to create a booking for next Monday (bookings can be closed on weekends, adjust to what ever day service is open
function nextMonday(h, min) {
    const now = new Date();
    // Reset the current time to the specified hour and minute to compare against the current time accurately
    const targetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, min, 0);
    // Calculate the number of days to add to get to the next Monday
    let daysToAdd = (1 - targetTime.getDay()) % 7;
    // If it's Sunday (getDay() == 0), set daysToAdd to 1 to get to the next day (Monday)
    if (targetTime.getDay() === 0) {
        daysToAdd = 1;
    }
    // If daysToAdd is 0, it means it's currently Monday, but we need to check the time
    if (daysToAdd === 0 || now > targetTime) {
        daysToAdd = 7; // Ensure we move to the next Monday if it's already past the target time on Monday
    }

    // Create the date for the next Monday with the specified hour and minute
    const nextMonday = new Date(targetTime);
    nextMonday.setDate(nextMonday.getDate() + daysToAdd);

    return nextMonday;
}

async function appointments() {
    let schedule_id = "INSERT_SCHEDULE_ID";

    //you can either create a new user here for testing or comment these out and give user id
    await client.users.create( userAttributes('test4'), '123fk', true, 'ignore');
    const usersList = await client.users.list();
    const lastUserID = usersList[usersList.length - 1].id;
    //let lastUserID = "INSERT_USER_ID";

    console.log("get availability...");
    let now = new Date();
    let availability = await client.appointments.available(schedule_id, now);
    console.log(availability);

    console.log("create a new booking...");
    let appointment = await client.appointments.create(schedule_id, lastUserID, bookingAttributes(nextMonday(13, 0), nextMonday(14, 0)), null, null);
    console.log(appointment);

    console.log("list appointments...");
    let appointmentsList = await client.appointments.list(schedule_id);
    console.log(appointmentsList);

    console.log("list users agenda...");
    const agenda = await client.appointments.agenda(schedule_id, lastUserID, null);
    console.log(agenda);

    console.log("list changes...");
    const changes = await client.appointments.changes(schedule_id, null, null, false);
    console.log(changes);

    console.log("get one appointment");
    let bookingId = appointment.match(/bookings\/(\d+)\.json/)[1];
    let appointmentOne = await client.appointments.get(schedule_id, bookingId);
    console.log(appointmentOne);

    console.log("update appointment");
    await client.appointments.update(schedule_id, bookingId, {'full_name': 'Mr Hello World.'});

    console.log("get a range of appointments, see docs for options");
    let range = await client.appointments.range(schedule_id);
    console.log(range);

    // be careful not to delete actual appointments
    console.log("delete appointment");
    await client.appointments.delete(schedule_id, bookingId);
}

setupClient(client);
appointments().then(data=>{console.log("Done examples")});