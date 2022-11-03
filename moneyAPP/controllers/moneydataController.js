const express = require('express');
const config = require('../config.js');
const ejs = require('ejs');
var mysql = require('mysql');
const moment = require('moment');
const router = express.Router();

var pool = mysql.createPool(config.dbconfig);

router.post('/newdata', (req, res) => {
    let data = {
        date: req.body.date,
        outgoings:req.body.kiadas,
        income:req.body.bevetel
    }

    req.app.locals.isMessage = true;
    pool.query(`SELECT ID FROM moneydata WHERE date=? AND userID=?`, [data.date, req.session.loggedUserID], (err, results) => {
        if (results.length == 0) {
            pool.query(`INSERT INTO moneydata VALUES(null, ?, ?, ?)`, [req.session.loggedUserID, data.date, data.outgoings,data.income], (err) => {
                req.app.locals.message = 'Successfully added outgoings!';
                req.app.locals.messagetype = 'success';
                res.redirect('/newdata');
            });
        } else {
            pool.query(`UPDATE moneydata SET outgoings = outgoings + ? AND  WHERE date=? AND userID=?`, [data.outgoings, data.date, req.session.loggedUserID], (err) => {
                req.app.locals.message = 'Successfully modified outgoings!';
                req.app.locals.messagetype = 'success';
                res.redirect('/newdata');
            });
        }
    });
    pool.query(`SELECT ID FROM moneydata WHERE date=? AND userID=?`, [data.date, req.session.loggedUserID], (err, results) => {
        if (results.length == 0) {
            pool.query(`INSERT INTO moneydata VALUES(null, ?, ?, ?)`, [req.session.loggedUserID, data.date, data.outgoings,data.income], (err) => {
                req.app.locals.message = 'Successfully added income!';
                req.app.locals.messagetype = 'success';
                res.redirect('/newdata');
            });
        } else {
            pool.query(`UPDATE moneydata SET income = income + ? AND  WHERE date=? AND userID=?`, [data.income, data.date, req.session.loggedUserID], (err) => {
                req.app.locals.message = 'Successfully modified income!';
                req.app.locals.messagetype = 'success';
                res.redirect('/newdata');
            });
        }
    });




});

module.exports = router;