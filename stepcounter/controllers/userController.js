const express=require('express');
const config = require('../config.js');
var mysql = require('mysql');
const ejs=require('ejs');
const router=express.Router();

var pool = mysql.createPool(config.dbconfig);


router.post('/login',(req,res) => {
    ejs.renderFile('views/main.ejs', {app:config.appconfig}, (err,data)=>{
        res.send(data)
    });
    
})

module.exports=router;