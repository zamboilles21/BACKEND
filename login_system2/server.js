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
const port = config.appconfig.port;
var pool = mysql.createPool(config.dbconfig);



// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// PATHS

app.get('/',(req,res)=>{
    ejs.renderFile('views/index.ejs',{config}, (err,data)=>{
        if (err) {
            res.status(500).send(err);
        }else{
            res.status(200).send(data);
        }
    })
})


app.listen(port, () => {
    console.log(`életjel ${port}...`);
});