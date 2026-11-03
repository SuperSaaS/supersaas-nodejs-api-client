let assert = require('assert');
let SuperSaaS = require('../src/index');
let Client = SuperSaaS.Client;

function newClient() {
  return new Client({dryRun: true, accountName: 'Test', api_key: 'xxxxxxxxxxxxxxxxxxxxxx'})
}

describe('Client', function() {
  it("initializes apis", function() {
    let client = new Client({test: true})
    assert.equal(typeof client.appointments, 'object')
    assert.equal(typeof client.forms, 'object')
    assert.equal(typeof client.users, 'object')
  })

  it("performs request", function() {
    let client = newClient()
    assert.ok(client.request('GET', '/test'))
  })

  it("performs get", function(done) {
    let client = newClient()
    client.get('/test', {test: true}, function (err, data) {
      assert.equal(client.lastRequest.method, 'GET')
      assert.equal(client.lastRequest.path, 'https://www.supersaas.com/api/test.json?test=true')
      assert.equal(client.lastRequest.headers['Accept'], 'application/json')
      assert.equal(client.lastRequest.headers['Content-Type'], 'application/json')

      let auth = Buffer.from(client.accountName + ':' + client.api_key).toString('base64')
      assert.equal(client.lastRequest.headers['Authorization'], 'Basic ' + auth)
      done()
    })
  })

  it("performs post", function(done) {
    let client = newClient()
    client.post('/test', {test: true}, null, function (err, data) {
      assert.equal(client.lastRequest.method, 'POST')
      done()
    })
  })

  it("performs put", function(done) {
    let client = newClient()
    client.put('/test', {test: true}, {q: 1}, function (err, data) {
      assert.equal(client.lastRequest.method, 'PUT')
      done()
    });
  })

  it("performs delete", function(done) {
    let client = newClient()
    client.delete('/test', {test: true}, {}, function (err, data) {
      assert.equal(client.lastRequest.method, 'DELETE')
      done()
    });
  })

  it("configures instance", function() {
    Client.configure({
      accountName: 'account',
      api_key: 'xxxxxxxxxxxxxxxxxxxxxx',
      host: 'http://test',
      dryRun: true,
      verbose: true
    })
    assert.equal(Client.Instance.accountName, 'account')
    assert.equal(Client.Instance.api_key, 'xxxxxxxxxxxxxxxxxxxxxx')
    assert.equal(Client.Instance.host, 'http://test')
    assert.equal(Client.Instance.dryRun, true)
    assert.equal(Client.Instance.verbose, true)
  })

  it("pings", async function() {
    let client = newClient()
    assert.strictEqual(await client.ping(), true)
    assert.equal(client.lastRequest.method, 'GET')
    assert.equal(client.lastRequest.path, 'https://www.supersaas.com/api/ping.json')
  })

  describe('responses', function() {
    const realFetch = global.fetch
    const realLog = console.log
    afterEach(function() {
      global.fetch = realFetch
      console.log = realLog
    })

    function liveClient() {
      return new Client({accountName: 'Test', api_key: 'xxxxxxxxxxxxxxxxxxxxxx'})
    }
    function stub(status, body, headers) {
      global.fetch = async () => new Response(body, {status: status, headers: headers})
      console.log = () => {}
    }

    it("keeps the error message and adds status and errors", async function() {
      stub(404, '{"errors":[{"status":"404","title":"Not found"}]}', {'Content-Type': 'application/json'})
      await assert.rejects(liveClient().users.get(1), (err) => {
        assert.equal(err.message, 'Request failed with status 404')
        assert.equal(err.status, 404)
        assert.deepEqual(err.errors, [{status: '404', title: 'Not found'}])
        return true
      })
    })

    it("sets empty errors for empty and non-JSON bodies", async function() {
      stub(422, '')
      await assert.rejects(liveClient().users.get(1), (err) => {
        assert.equal(err.message, 'Request failed with status 422')
        assert.equal(err.status, 422)
        assert.deepEqual(err.errors, [])
        return true
      })
      stub(500, '<html>Oops</html>', {'Content-Type': 'text/html'})
      await assert.rejects(liveClient().users.get(1), (err) => {
        assert.equal(err.message, 'Request failed with status 500')
        assert.equal(err.status, 500)
        assert.deepEqual(err.errors, [])
        return true
      })
    })

    it("resolves ping on 204 without content type", async function() {
      global.fetch = async () => new Response(null, {status: 204})
      assert.strictEqual(await liveClient().ping(), true)
    })

    it("returns the Location header of a created resource", async function() {
      stub(201, '{"id":1}', {'Content-Type': 'application/json', 'Location': 'https://www.supersaas.com/api/users/1.json'})
      assert.equal(await liveClient().users.create({name: 'a'}), 'https://www.supersaas.com/api/users/1.json')
    })

    it("returns the body of a created resource without Location (hooks)", async function() {
      stub(201, '{"id":123,"parent_id":456}', {'Content-Type': 'application/json'})
      assert.deepEqual(await liveClient().hooks.create('https://www.example.com/hook', 'U', 456), {id: 123, parent_id: 456})
    })
  })
});
