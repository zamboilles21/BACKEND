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

// PATHS

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
        message = 'Nem adtál meg minden kötelező adatot!';
        res.status(206).send(message);
    } else {
        if (userdata.pass1 != userdata.pass2) {
            message = 'A megadott jelszavak nem egyeznek!';
            res.status(206).send(message);
        } else {
            pool.query(`SELECT ID FROM users WHERE email=?`, [userdata.email], (err, results) => {
                if (err) {
                    res.status(500).send(err);
                } else {
                    if (results.length != 0) {
                        message = 'Ez az e-mail cím már regisztrált!';
                        res.status(206).send(message);
                    } else {
                        pool.query(`INSERT INTO users VALUES(null, ?, ?, ?, CURRENT_TIMESTAMP, null, 1)`, [userdata.name, userdata.email, sha1(userdata.pass1)], (err) => {
                            if (err) {
                                res.status(500).send(err);
                            } else {
                                message = 'A regisztráció sikeres!';
                                res.status(200).send(message);
                            }
                        });
                    }
                }
            });
        }
    }
});

// user login
app.post('/login', (req, res) => {
    console.log(req.session.loggedin)
    if (!req.session.loggedin) {

        let userdata = {
            email: req.body.usermail,
            passwd: req.body.userpass
        }

        let message = '';

        if (userdata.email == null || userdata.passwd == null) {
            message = 'Nem adtál meg minden kötelező adatot!';
            res.status(206).send(message);
        } else {
            pool.query(`SELECT * FROM users WHERE email=? AND passwd=?`, [userdata.email, sha1(userdata.passwd)], (err, results) => {
                if (err) {
                    res.status(500).send(err);
                } else {
                    if (results.length == 0) {
                        message = 'Hibás bejelentkezési adatok!';
                        res.status(206).send(message);
                    } else {
                        if (results[0].status == 0) {
                            message = 'Tiltott felhasználó!';
                            res.status(206).send(message);
                        } else {
                            let userdata = results[0];
                            console.log(userdata.ID)
                            pool.query(`UPDATE users SET last=? WHERE ID=?`, [moment(new Date()).format('YYYY-MM-DD H:m:s'), userdata.ID], (err, results) => {
                                if (err) {
                                    res.status(500).send(err);
                                } else {
                                    // létrehozzuk a munkamenet változókat
                                    req.session.loggedin = true;
                                    console.log(req.session.loggedin)

                                    message = 'Sikeres bejelentkezés!';
                                    res.status(200).send(message);
                                }
                            });
                        }
                    }
                }
            });
        }
    } else {
        message = 'Már be vagy jelentkezve!';
        res.status(203).send(message);
    }
});

// user logout
app.post('/logout', (req, res) => {
    if (req.session.loggedin) {
        req.session.loggedin = false;
        message = 'Sikeres kijelentkezés!';
        res.status(200).send(message);
    } else {
        message = 'Nem vagy bejelentkezve!';
        res.status(203).send(message);
    }
});

// SERVER LISTENING
app.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
});