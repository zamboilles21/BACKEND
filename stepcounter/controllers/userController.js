const express=require('express');
const config = require('../config.js');
var mysql = require('mysql');
const router=express.Router();

var pool = mysql.createPool(config.dbconfig);


router.get('/',(req,res)=>{
    pool.query(`SELECT * FROM users`,(err,result)=>{
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(result)
        }
    })
})

module.exports=router;