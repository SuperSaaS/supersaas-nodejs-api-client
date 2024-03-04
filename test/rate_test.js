let assert = require('assert')
let SuperSaaS = require('../src/index')
let Client = SuperSaaS.Client

function newClient() {
  return new Client({ dryRun: true, accountName: 'Test', api_key: 'xxxxxxxxxxxxxxxxxxxxxx' })
}

describe('Throttle functionality', function () {

  if (process.env.RUN_RATE_LIMITER_TEST !== 'true') {
    console.log('Rate limiter test skipped. Set RUN_RATE_LIMITER_TEST=true to run the test.')
    assert.ok(true)
    return
  }

  // Set a higher timeout for the entire test suite
  this.timeout(10000) // 10 seconds

  it('should take at least 5 seconds for 25 requests', async function () {
    const client = newClient()

    // Record the start time
    const startTime = Date.now()

    // Make 21 requests
    for (let i = 0; i < 25; i++) {
      await client.request('GET', '/test')
    }

    // Record the end time
    const endTime = Date.now()

    // Ensure that the elapsed time is greater than or equal to 5.0 seconds
    const elapsedTimeInSeconds = (endTime - startTime) / 1000
    assert.ok(elapsedTimeInSeconds >= 5.0, `Elapsed time: ${elapsedTimeInSeconds} seconds`)
  });
});