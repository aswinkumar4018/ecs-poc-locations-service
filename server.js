const app = require('koa')();
const router = require('koa-router')();
const db = require('./db.json');
const request = require('request');

// Log requests
app.use(function*(next) {
    const start = new Date;
    yield next;
    const ms = new Date - start;
    console.log('%s %s - %s', this.method, this.url, ms);
});

router.get('/api/locations', function*() {
    this.body = db.locations;
});

async function test() {
    return await request('http://characters.dev/api/characters', { json: true }, (err, res, body) => {
        if (err) { return console.log(err); }
        console.log(body);
        return "body";
    });
}

router.get('/api/locations/getAllCharacters', function*() {
    this.body = yield test();
});


router.get('/api/locations/:id', function*() {
    const id = parseInt(this.params.id, 10);
    this.body = db.locations.find((location) => location.id === id);
});

router.get('/api/', function*() {
    this.body = 'API ready to receive requests';
});

router.get('/', function*() {
    this.body = 'Ready to receive requests';
});

app.use(router.routes());
app.use(router.allowedMethods());

var server = app.listen(80);

process.on('SIGTERM', function() {
    console.log('Shutting down...');
    server.close();
});
