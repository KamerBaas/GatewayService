const express = require('express');
const mongoose = require('mongoose');
const algoliasearch = require('algoliasearch');
const request = require('request');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const https = require('https');

const client = algoliasearch('8HYBSNX4Q5', '5d225d11ef765b21fb13bc97688801ef');

// Constants
const PORT = 8080;
const SPORT = 4330;
const HOST = '0.0.0.0';

// App
const app = express();
app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

app.get('/search', (req, res) => {
    request('http://kb-search/search?term=' + req.query.term).pipe(res);
});

app.post('/auth', (req, res) => {
    // Expects req.body.idtoken: console.log(req.body.idtoken);
    request.post({ url: 'http://kb-auth/handler.php', json: { idtoken: req.body.idtoken }}).pipe(res);
});

app.post('/profile', (req, res) => {
    // if(!req.body.profile || !req.body.profile.objectID){
    //     res.status(400).send('Please provide req.body.profile with property objectID');
    // }
    // const profile = req.body.profile;
    // client.initIndex('profiles').partialUpdateObject();
    console.log(req.body);
    request.post({ url: 'http://kb-search/profile', json: req.body }).pipe(res);
});

app.get('/ping', (req, res) => {
    res.send('Healthy');
});

const approveDomains = (opts, certs, cb) => {
    if (certs) {
      opts.domains = certs.altnames;
    } else {
      opts.email = 'info@weijland.it';
      opts.agreeTos = true;
    }
   
    cb(null, { options: opts, certs: certs });
}

const lex = require('greenlock-express').create({
    server: 'staging',
    challenges: { 'http-01': require('le-challenge-fs').create({ webrootPath: '/tmp/acme-challenges' }) },
    store: require('le-store-certbot').create({ webrootPath: '/tmp/acme-challenges' }),
    approveDomains: ['gateway.kamerbaas.nl']//approveDomains
});

// handles acme-challenge and redirects to https
http.createServer(lex.middleware(require('redirect-https')())).listen(PORT, HOST, function () {
    console.log("Listening for ACME http-01 challenges on", this.address());
});
   
// handles your app
https.createServer(lex.httpsOptions, lex.middleware(app)).listen(SPORT, HOST, function () {
    console.log("Listening for ACME tls-sni-01 challenges and serve app on", this.address());
});

//app.listen(PORT, HOST);

//console.log(`Running on http://${HOST}:${PORT}`);