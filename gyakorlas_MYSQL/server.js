const express=require('express');
const res = require('express/lib/response');
const req = require('express/lib/request');
const path=require('path');
const app=express();
var mysql = require('mysql');
const port=8081;

app.use(express.urlencoded({extended: true}))

app.get('/modphone', (req, res) => {
    res.status(200).sendFile(path.join(__dirname + '/modPhone.html'))
})


var pool  = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'root',
    password        : '',
    database        : '2/14SZFT_mobiltelefonok'
  });

app.get(function(err) {
    if (err) throw err;
    console.log("Connected!");
    var sql = "INSERT INTO keszulekek (ID,gyarto, tipus,memoria,tarhely,oprendszer,processzor,garancia,ar,szin) VALUES ('1', 'Samsung','S22','12','256','Android','Exynos 888','4','250000','Kék')";
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
    });
  });

  app.get('/phones', (req, res) => {
    pool.query('SELECT * FROM keszulekek', (err, results) => {
        if (err) res.status(500).send(err)
        else res.status(200).send(results)
    })
})

app.listen(port, ()=>{
    console.log(`Életjel ${port}`)
})