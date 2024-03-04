let client = require('../src/Client').Instance;

//helper method to create user
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

function setupClient(client) {
    client.accountName = 'YOUR_ACCOUNT';
    client.api_key = 'YOUR_API_KEY';
    client.verbose = false; //you can get more information by setting this to true
    client.host = 'https://supersaas.com';
}

async function users() {
    const regexPattern = /users\/(\d+)\.json/;

    console.log("listing schedules...")
    let users = await client.users.list();
    console.log(users);

    // create a new user with key and extract the userId
    console.log("create new user...")
    let createUser = await client.users.create(userAttributes('test4'),'123fk',true);
    let match = createUser.match(regexPattern);

    let newUserId = match[1];
    console.log("new userId: ", newUserId);

    // update the phone number
    await client.users.update(newUserId, {phone: '12345678', country: 'FR', address: 'Rue 1'});

    // get information about the user
    console.log("getting user information...");
    let userInfo = await client.users.get(newUserId);
    console.log(userInfo);

    //get field list for user
    console.log("getting user fields...")
    let userFields = await client.users.fieldList();
    console.log(userFields);

    //delete user, BE CAREFUL THAT YOU DO NOT DELETE REAL USERS
    console.log("deleting user...")
    await client.users.delete(newUserId);
}

setupClient(client);
users().then(data=>{console.log("Done examples")});