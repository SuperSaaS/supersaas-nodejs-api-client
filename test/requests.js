const assert = require('assert');
const {Client} = require('../src/index');

function newClient() {
  return new Client({dryRun: true, accountName: 'Test', api_key: 'testing123'});
}

describe('Verbose logging', function() {
  const realFetch = global.fetch;
  const realLog = console.log;
  const realError = console.error;
  let logged;
  beforeEach(function() {
    logged = [];
    console.log = (...args) => logged.push(args);
    console.error = (...args) => logged.push(args);
  });
  afterEach(function() {
    global.fetch = realFetch;
    console.log = realLog;
    console.error = realError;
  });

  function verboseClient() {
    return new Client({accountName: 'Test', api_key: 'testing123', verbose: true});
  }

  it('redacts the Authorization header but still sends it', async function() {
    let sentAuthorization;
    global.fetch = async (url, init) => {
      sentAuthorization = init.headers.Authorization;
      return new Response('[]', {status: 200, headers: {'Content-Type': 'application/json', 'Content-Length': '2'}});
    };
    await verboseClient().schedules.list();
    assert.equal(sentAuthorization, 'Basic ' + Buffer.from('Test:testing123').toString('base64'));
    const output = JSON.stringify(logged);
    assert.ok(!output.includes(sentAuthorization), 'credentials were logged');
    assert.ok(output.includes('[REDACTED]'));
  });

  it('does not log a stream object for failed requests', async function() {
    global.fetch = async () => new Response('{}', {status: 404, statusText: 'Not Found', headers: {'Content-Type': 'application/json'}});
    await assert.rejects(verboseClient().schedules.list());
    const output = logged.map((args) => args.join(' ')).join('\n');
    assert.ok(!output.includes('[object ReadableStream]'), output);
    assert.ok(output.includes('Failed request 404, Not Found'), output);
  });
});

