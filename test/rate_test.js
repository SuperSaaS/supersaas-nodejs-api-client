// Checks the client-side throttle (one request per second per client). It uses dryRun, so no request
// reaches the network, but it takes about 5 seconds and is therefore opt-in: npm run test:rate
const assert = require('assert');
const {Client} = require('../src/index');

function newClient() {
  return new Client({dryRun: true, accountName: 'Test', api_key: 'xxxxxxxxxxxxxxxxxxxxxx'});
}

const describeRate = process.env.RUN_RATE_LIMITER_TEST === 'true' ? describe : describe.skip;

describeRate('Throttle functionality (set RUN_RATE_LIMITER_TEST=true to run)', function() {
  this.timeout(10000);

  it('takes at least 5 seconds for 6 requests', async function() {
    const client = newClient();
    const startTime = Date.now();

    // The first request goes out immediately, each following one waits for the 1 second window.
    for (let i = 0; i < 6; i++) {
      await client.request('GET', '/test');
    }

    const elapsedTimeInSeconds = (Date.now() - startTime) / 1000;
    assert.ok(elapsedTimeInSeconds >= 5.0, `Elapsed time: ${elapsedTimeInSeconds} seconds`);
  });
});
