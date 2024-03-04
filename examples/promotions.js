let client = require('../src/Client').Instance;

function setupClient(client) {
    client.accountName = 'YOUR_ACCOUNT';
    client.api_key = 'YOUR_API_KEY';
    client.verbose = false; //you can get more information by setting this to true
    client.host = 'https://www.supersaas.com';
}

async function promotions() {
    console.log("listing promotions...")
    let promotions = await client.promotions.list();
    console.log(promotions);

    console.log("getting promotion...");
    const promotion = await client.promotions.promotion(promotions[0].code);
    console.log(promotion);

    // trying out duplication is recommended on a test db
    // console.log("duplicate promotion...");
    // await client.promotions.duplicatePromotionCode('ANOTHERs22', promotion[0].code);
}

setupClient(client);
promotions().then(data=>{console.log("Done examples")});