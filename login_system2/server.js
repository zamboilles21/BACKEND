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
let message={
    type:'',
    text:"HIBA"
}



// Middlewares
app.use('/js',express.static(path.join(__dirname+'/js')));
app.use('/css',express.static(path.join(__dirname+'/css')));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
// PATHS
app.get('/', (req, res) => {
    ejs.renderFile('views/index.ejs', { config, hiba:message }, (err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(data);
        }
    });
});

app.get('/reg', (req, res) => {
    ejs.renderFile('views/register.ejs', { config,hiba:message }, (err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(data);
        }
    });
});

// new user registration
app.post('/reg', (req, res) => {
    let userdata = {
        name: req.body.username,
        email: req.body.usermail,
        pass1: req.body.userpass1,
        pass2: req.body.userpass2
    }

    let message = {};

    if (userdata.name == null || userdata.email == null || userdata.pass1 == null || userdata.pass2 == null) {
        message.text = 'Nem adtál meg minden kötelező adatot!';
        res.redirect('/reg');
    } else {
        if (userdata.pass1 != userdata.pass2) {
            message = 'A megadott jelszavak nem egyeznek!';
            res.redirect('/reg');
        } else {
            pool.query(`SELECT ID FROM users WHERE email=?`, [userdata.email], (err, results) => {
                if (err) {
                    res.status(500).send(err);
                } else {
                    if (results.length != 0) {
                        message = 'Ez az e-mail cím már regisztrált!';
                        res.redirect('/reg');
                    } else {
                        pool.query(`INSERT INTO users VALUES(null, ?, ?, ?, CURRENT_TIMESTAMP, null, 1)`, [userdata.name, userdata.email, sha1(userdata.pass1)], (err) => {
                            if (err) {
                                res.status(500).send(err);
                            } else {
                                message = 'A regisztráció sikeres!';
                                res.redirect('/');
                            }
                        });
                    }
                }
            });
        }
    }
});
app.listen(port, () => {
    console.log(`életjel ${port}...`);
});