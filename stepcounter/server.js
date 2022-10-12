const express = require('express');
const path = require('path');
const fs = require('fs');
var mysql = require('mysql');
const ejs=require('ejs');
const moment = require('moment');
const config = require('./config.js');
const sha1 = require('sha1');
const app = express();
var session = require('express-session');
const { text } = require('express');
const port = config.appconfig.port;
var pool = mysql.createPool(config.dbconfig);

const appController=require('./controllers/appController.js')
const userController=require('./controllers/userController.js');
const stepdataController=require('./controllers/stepdataController.js');


app.use('/assets',express.static(path.join(__dirname+'assets')));
app.use('/views',express.static(path.join(__dirname+'views')));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use('/', appController)
app.use('/users',userController);
app.use('/stepdatas',stepdataController);

app.listen(port, () => {
    console.log(`életjel ${port}...`);
});