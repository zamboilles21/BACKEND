const express = require('express');

const path = require('path');
const ejs = require('ejs');
const server=require('http').createServer(app);
const socket=require('socket.io')(server);
const config = require('./config.js');
const app = express();


app.get('/', (req, res) => {
    ejs.renderFile('views/index.ejs', { config, hiba:message }, (err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(data);
        }
    });
});



// Middlewares
app.use('/assets', express.static(path.join(__dirname + '/assets')));
app.use('/views', express.static(path.join(__dirname + '/views')));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.locals.message = '';
app.locals.messagetype = 'danger';
app.locals.isMessage = false;



app.listen(config.appconfig.port, () => {
    console.log(`Server listening on port ${config.appconfig.port}...`);
});