const express = require('express');
const router = express.Router();
const ejs = require('ejs');
const config = require('../config.js');

router.get('/', (req, res) => {
    if (!req.app.locals.isMessage) {
        req.app.locals.message = '';
    }
    ejs.renderFile('views/index.ejs', { app: config.appconfig, err: req.app.locals }, (err, data) => {
        req.app.locals.isMessage = false;
        res.send(data);
    });
});

router.get('/reg', (req, res) => {
    if (!req.app.locals.isMessage) {
        req.app.locals.message = '';
    }
    ejs.renderFile('views/registration.ejs', { app: config.appconfig, err: req.app.locals }, (err, data) => {
        req.app.locals.isMessage = false;
        res.send(data)
    });
});

router.get('/main', (req, res) => {
    if (req.session.loggedIn) {
        if (!req.app.locals.isMessage) {
            req.app.locals.message = '';
        }

        ejs.renderFile('views/main.ejs', { app: config.appconfig, err: req.app.locals, user: req.session }, (err, data) => {
            req.app.locals.isMessage = false;
            res.send(data)
        });
    } else {
        res.redirect('/');
    }
});

router.get('/passmod', (req, res) => {
    if (req.session.loggedIn) {
        if (!req.app.locals.isMessage) {
            req.app.locals.message = '';
        }

        ejs.renderFile('views/passmod.ejs', { app: config.appconfig, err: req.app.locals, user: req.session }, (err, data) => {
            req.app.locals.isMessage = false;
            res.send(data)
        });
    } else {
        res.redirect('/');
    }
});


router.get('/logout', (req, res) => {
    req.app.locals.message = 'You are logged out!';
    req.app.locals.messagetype = 'success';
    req.session.loggedIn = false;
    req.session.loggedUserID = null;
    req.session.loggedUser = null;
    req.session.loggedUserMail = null;
    ejs.renderFile('views/index.ejs', { app: config.appconfig, err: req.app.locals }, (err, data) => {
        res.send(data)
    });
});

module.exports = router;