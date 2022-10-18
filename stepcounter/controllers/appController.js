const express=require('express');
const router=express.Router();
var mysql = require('mysql');
const ejs=require('ejs');
const config = require('../config.js');

router.get('/',(req,res)=>{
    ejs.renderFile('views/index.ejs',{app:config.appconfig}, (err,data)=>{
        res.send(data)
    });
});

router.get('/reg',(req,res)=>{
    ejs.renderFile('views/registration.ejs',{app:config.appconfig}, (err,data)=>{
        res.send(data)
    });
});
router.get('/logout',(req,res)=>{
    ejs.renderFile('views/index.ejs',{app:config.appconfig}, (err,data)=>{
        res.send(data)
    });
});

module.exports=router;