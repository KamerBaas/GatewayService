const express = require('express');
const mongoose = require('mongoose');
const algoliasearch = require('algoliasearch');
const request = require('request');
const cors = require('cors');
const bodyParser = require('body-parser');

const client = algoliasearch('8HYBSNX4Q5', '5d225d11ef765b21fb13bc97688801ef');

// Constants
const PORT = 8080;
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
    request.post({ url: 'http://kb-search/profile', json: req.body }).pipe(res);
});

app.get('/ping', (req, res) => {
    res.send('Healthy');
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);