let client = require('../src/Client').Instance;

// Get these from your SuperSaaS account settings
function setupClient(client) {
  client.accountName = 'YOUR_ACCOUNT';
  client.api_key = 'YOUR_API_KEY';
  client.verbose = false; //you can get more information by setting this to true
  client.host = 'https://supersaas.com';
}

async function schedules() {
    console.log("listing schedules...")
    let schedules = await client.schedules.list();
    console.log(schedules);

    console.log("getting resources...");
    let schedule_id = "INSERT_SCHEDULE_ID" //get this from your supersaas page or check from the list above
    let resources = await client.schedules.resources(schedule_id);
    console.log(resources);


    console.log("available fields...");
    let available_fields = await client.schedules.fieldList(schedule_id);
    console.log(available_fields);
}

setupClient(client);
schedules().then(data=>{console.log("Done examples")});