const express = require('express');
const mongoose = require('mongoose');
const algoliasearch = require('algoliasearch');
const request = require('request');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const https = require('https');
const fs = require('fs');
var crypto = require('crypto'),
    key = 'Waar komt het vandaan? In tegenstelling tot wat algemeen aangenomen ';

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

app.get('/search/stress', (req, res) => {
    request('http://kb-search/stress').pipe(res);
});

app.get('/stress', (req, res) => {
    var text = "Waar komt het vandaan? In tegenstelling tot wat algemeen aangenomen wordt is Lorem Ipsum niet zomaar willekeurige tekst. het heeft zijn wortels in een stuk klassieke latijnse literatuur uit 45 v.Chr. en is dus meer dan 2000 jaar oud. Richard McClintock, een professor latijn aan de Hampden-Sydney College in Virginia, heeft één van de meer obscure latijnse woorden, consectetur, uit een Lorem Ipsum passage opgezocht, en heeft tijdens het zoeken naar het woord in de klassieke literatuu de onverdachte bron ontdekt. Lorem Ipsum komt uit de secties 1.10.32 en 1.10.33 van (De uitersten van goed en kwaad) door Cicero, geschreven in 45 v.Chr. Dit boek is een verhandeling over de theorie der ethiek, erg populair tijdens de renaissance. De eerste regel van Lorem Ipsum, Lorem ipsum dolor sit amet.. , komt uit een zin in sectie 1.10.32.";
    var i = 0;

    var response = "";
    while(i < 400){
        // create hahs
        var hash = crypto.createHmac('sha512', key)
        hash.update(text)
        var value = hash.digest('hex')

        i++;
        // print result
        response += value;
    }
    res.send(response);
})

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

app.get('/profile/:id/', (req, res) => {
    // if(!req.body.profile || !req.body.profile.objectID){
    //     res.status(400).send('Please provide req.body.profile with property objectID');
    // }
    // const profile = req.body.profile;
    // client.initIndex('profiles').partialUpdateObject();
    const url = 'http://kb-profile/profile/' + req.params.id + '/?idtoken=' + req.query.idtoken;
    console.log('entered gateway profile id: ' + url);
    request.get({ url: url, json: req.body }).pipe(res);
});

app.get('/ping', (req, res) => {
    res.send('Healthy 3');
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