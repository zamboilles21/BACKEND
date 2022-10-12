const express=require('express');
const router=express.Router();
var mysql = require('mysql');
const ejs=require('ejs');
const config = require('../config.js');

router.get('/',(req,res)=>{
    ejs.renderFile('views/index.js', (data)=>{
        res.send(data)
    })
});

module.exports=router;