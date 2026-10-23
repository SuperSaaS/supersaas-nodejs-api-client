let client = require('../src/Client').Instance;

function setupClient(client) {
    client.accountName = 'YOUR_ACCOUNT';
    client.api_key = 'YOUR_API_KEY';
    client.verbose = false; //you can get more information by setting this to true
    client.host = 'https://www.supersaas.com';
}

// Slots only work on capacity type schedules
const SCHEDULE_ID = 12345;

async function slots() {
    console.log("listing slots...");
    const list = await client.slots.list(SCHEDULE_ID);
    console.log(list);

    console.log("creating slot...");
    const location = await client.slots.create(SCHEDULE_ID, {
        start: '2030-01-02 10:00:00',
        finish: '2030-01-02 11:00:00',
        title: 'Test slot',
        capacity: 10,
    });
    console.log(location);
    const slotId = location.match(/slots\/(\d+)/)[1];

    console.log("getting slot...");
    console.log(await client.slots.get(SCHEDULE_ID, slotId));

    console.log("updating slot...");
    await client.slots.update(SCHEDULE_ID, slotId, {title: 'Updated slot', capacity: '-'});

    console.log("deleting slot...");
    await client.slots.delete(SCHEDULE_ID, slotId);
}

setupClient(client);
slots().then(() => { console.log("Done examples"); });
