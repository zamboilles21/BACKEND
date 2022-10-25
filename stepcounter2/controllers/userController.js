const express = require('express');
const config = require('../config.js');
const ejs = require('ejs');
const sha1 = require('sha1');
var mysql = require('mysql');
const router = express.Router();

var pool = mysql.createPool(config.dbconfig);

router.post('/login', (req, res) => {
    let userdata = {
        usermail: req.body.usermail,
        userpass: req.body.userpass
    }

    req.app.locals.isMessage = true;

    if (userdata.usermail == '' || userdata.userpass == '') {
        req.app.locals.message = 'Some requested fields are empty!';
        req.app.locals.messagetype = 'danger';
        res.redirect('/');
    } else {
        pool.query(`SELECT * FROM users WHERE email=? AND passwd=?`, [userdata.usermail, sha1(userdata.userpass)], (err, results) => {
            if (results.length == 0) {
                req.app.locals.message = 'This account is not exits!';
                req.app.locals.messagetype = 'danger';
                res.redirect('/');
            } else {
                if (results[0].status == 0) {
                    req.app.locals.message = 'This account is banned!';
                    req.app.locals.messagetype = 'danger';
                    res.redirect('/');
                } else {
                    req.session.loggedIn = true;
                    req.session.loggedUserID = results[0].ID;
                    req.session.loggedUser = results[0].name;
                    req.session.loggedUserMail = results[0].email;
                    req.app.locals.message = 'You are successfully loged in!';
                    req.app.locals.messagetype = 'success';
                    res.redirect('/main');
                }
            }
        });
    }
});

router.post('/reg', (req, res) => {
    let userdata = {
        username: req.body.username,
        usermail: req.body.usermail,
        userpass1: req.body.userpass1,
        userpass2: req.body.userpass2
    }

    req.app.locals.isMessage = true;

    if (userdata.usermail == '' || userdata.username == '' || userdata.userpass1 == '' || userdata.userpass2 == '') {
        req.app.locals.message = 'Some requested fields are empty!';
        req.app.locals.messagetype = 'danger';

        res.redirect('/reg');
    } else {
        if (userdata.userpass1 != userdata.userpass2) {
            req.app.locals.message = 'The passwords are not same!';
            req.app.locals.messagetype = 'danger';
            res.redirect('/reg');
        } else {
            pool.query(`SELECT ID FROM users WHERE email=?`, [userdata.usermail], (err, results) => {
                if (results.length > 0) {
                    req.app.locals.message = 'This email address already registered!';
                    req.app.locals.messagetype = 'danger';
                    res.redirect('/reg');
                } else {
                    pool.query(`INSERT INTO users VALUES(null, ?, ?, ?, CURRENT_TIMESTAMP, null, 1)`, [userdata.username, userdata.usermail, sha1(userdata.userpass1)], (err) => {
                        req.app.locals.message = 'You are succesfully registered!';
                        req.app.locals.messagetype = 'success';
                        res.redirect('/');
                    });
                }
            });
        }
    }

});

router.post('/passmod', (req, res) => {
    // TODO: passmod
});

module.exports = router;