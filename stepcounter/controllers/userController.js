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
            let pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
            if (!data.newpass1.match(pattern)) {
                req.app.locals.message = 'The new password is weak!';
                req.app.locals.messagetype = 'danger';
                res.redirect('/passmod');
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
    }

});

router.post('/passmod', (req, res) => {
    let data = {
        oldpass: req.body.oldpass,
        newpass1: req.body.newpass1,
        newpass2: req.body.newpass2
    }

    req.app.locals.isMessage = true;

    if (data.oldpass == '' || data.newpass1 == '' || data.newpass2 == '') {
        req.app.locals.message = 'Some requested fields are empty!';
        req.app.locals.messagetype = 'danger';
        res.redirect('/passmod');
    } else {
        if (data.newpass1 != data.newpass2) {
            req.app.locals.message = 'The new passwords are not same!';
            req.app.locals.messagetype = 'danger';
            res.redirect('/passmod');
        } else {
            if (data.oldpass == data.newpass1) {
                req.app.locals.message = 'The new password equals with old password!';
                req.app.locals.messagetype = 'danger';
                res.redirect('/passmod');
            } else {
                let pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
                if (!data.newpass1.match(pattern)) {
                    req.app.locals.message = 'The new password is weak!';
                    req.app.locals.messagetype = 'danger';
                    res.redirect('/passmod');
                } else {
                    pool.query(`SELECT passwd FROM users WHERE ID=?`, [req.session.loggedUserID], (err, results) => {
                        if (results[0].passwd != sha1(data.oldpass)) {
                            req.app.locals.message = 'The old password is incorrect!';
                            req.app.locals.messagetype = 'danger';
                            res.redirect('/passmod');
                        } else {
                            pool.query(`UPDATE users SET passwd=? WHERE ID=?`, [sha1(data.newpass1), req.session.loggedUserID], (err) => {
                                req.app.locals.message = 'The password was changed!';
                                req.app.locals.messagetype = 'success';
                                res.redirect('/passmod');
                            });
                        }
                    });
                }
            }
        }
    }
});
router.post('/mod-user', (req,res)=>{
    if (req.body.email==''||req.body.name==''||req.body.email==null||req.body.name==null){
        req.app.locals.message = ["Empty fields"];
        req.app.locals.type = "danger";
        res.redirect('/mod-profile')
    }
    else {
        connection.query('select * from users where email=?', [req.body.email], (err,data)=>{
            if (err) res.status(500).send(err.sqlMessage);
            if (data.length>0) {
                if (req.session.loggedemail==data[0].email){
                    connection.query('update users set name=?, email=? where ID=?', [req.body.name, req.body.email, req.session.loggedid], (err)=>{
                        if (err) res.status(500).send(err.sqlMessage);
                        else {
                            req.app.locals.message = ['Successful modification!'];
                            req.app.locals.type='success';
                            req.session.loggedemail = req.body.email;
                            req.session.loggeduser = req.body.name;
                            res.redirect('/mod-profile');
                        }
                    })
                }
                else{
                    req.app.locals.message = ['Someone is already registered with these!'];
                    req.app.locals.type='danger';
                    res.redirect('/mod-profile')
                }
            }
            else {
                connection.query('update users set name=?, email=? where ID=?', [req.body.name, req.body.email, req.session.loggedid], (err)=>{
                    if (err) res.status(500).send(err.sqlMessage);
                    else {
                        req.app.locals.message = ['Successful modification!'];
                        req.app.locals.type='success';
                        req.session.loggedemail = req.body.email;
                        req.session.loggeduser = req.body.name;
                        res.redirect('/mod-profile');
                    }
                })
            }
        })
    }
})
module.exports = router;