let client = require('../src/Client').Instance;

function setupClient(client) {
    client.accountName = 'YOUR_ACCOUNT';
    client.api_key = 'YOUR_API_KEY';
    client.verbose = false; //you can get more information by setting this to true
    client.host = 'https://www.supersaas.com';
}

async function groups() {
    console.log("listing goup...")
    let groups = await client.groups.list();
    console.log(groups);
}

setupClient(client);
groups().then(data=>{console.log("Done examples")});