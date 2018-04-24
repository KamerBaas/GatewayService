const express = require('express');
const mongoose = require('mongoose');
const algoliasearch = require('algoliasearch');
const request = require('request');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const https = require('https');
const fs = require('fs');

const client = algoliasearch('8HYBSNX4Q5', '5d225d11ef765b21fb13bc97688801ef');

// Constants
const PORT = 8080;
const SPORT = 4330;
const HOST = '0.0.0.0';

// App
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// API's
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

app.get('/', (req, res) => {
    res.send("ok");
})

//app.listen(PORT, HOST);

const options = {
    cert: fs.readFileSync(__dirname + '/ssl/gateway.kamerbaas.nl/fullchain.pem'),
    key: fs.readFileSync(__dirname + '/ssl/gateway.kamerbaas.nl/privkey.pem'),
    ca: fs.readFileSync(__dirname + '/ssl/gateway.kamerbaas.nl/chain.pem')
};

const httpServer = http.createServer(app);
const httpsServer = https.createServer(options, app);

httpServer.listen(PORT, HOST);
httpsServer.listen(SPORT, HOST);

// Test add
// nieuw
const l = "a";

const f = (r) => {
    return r;
}

console.log(`Running on http://${HOST}:${PORT}`);