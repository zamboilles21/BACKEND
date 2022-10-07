const express = require('express');
const path = require('path');
const fs = require('fs');
var mysql = require('mysql');
const moment = require('moment');
const config = require('./config.js');
const sha1 = require('sha1');
const app = express();
var session = require('express-session');
const port = config.appconfig.port;
var pool = mysql.createPool(config.dbconfig);



// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
});