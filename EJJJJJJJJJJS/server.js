const express=require('express');
const config=require('./config.js');
var mysql=require('mysql');
const path=require('path');
const ejs=require('ejs');
const port=config.appconfig.port;
var pool=mysql.createPool(config.dbconfig);
const app=express();

app.listen(port, ()=>{
    console.log(`{port}`)
})