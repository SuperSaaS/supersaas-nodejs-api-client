let client = require('../src/Client').Instance;

function setupClient(client) {
    client.accountName = 'YOUR_ACCOUNT';
    client.api_key = 'YOUR_API_KEY';
    client.verbose = false; //you can get more information by setting this to true
    client.host = 'https://www.supersaas.com';
}

async function forms() {
    console.log("listing super forms...");
    const formsAll = await client.forms.forms();
    console.log(formsAll);

    console.log("listing forms...");
    let formsList = await client.forms.list(formsAll[0].id, new Date('2015-01-24 00:00:00'));
    console.log(formsList);

    console.log("get one form...")
    let form = await client.forms.get(formsList[0].id);
    console.log(form)
}

setupClient(client);
forms().then(data=>{console.log("Done examples")});