require('dotenv').config();
const express=require('express');
const app=express();
var mysql=require('mysql');
const port=process.env.PORT;

var pool=mysql.createPool({
    connectionLimit: process.env.DBLIMIT,
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASS,
    database: process.env.DBNAME
})
app.use(express.urlencoded({extended: true}));
//get all records
app.get('/:table',(req,res)=>{
    var table=req.params.table;
    pool.query(`SELECT * FROM ${table}`,(err,result)=>{
        if (err) {
            res.status(500).send(err);
        }else{
            res.status(200).send(result);
        }
    })
});
//get one records
app.get('/:table/:id',(req,res)=>{
    var table=req.params.table;
    var id=req.params.id;
    pool.query(`SELECT * FROM ${table} WHERE id=${id}`,(err,result)=>{
        if (err) {
            res.status(500).send(err);
        }else{
            res.status(200).send(result);
        }
    })
});
//INSERT RECORD
app.post('/:table',(req,res)=>{
    var table=req.params.table;
    var records=req.body;
    var str='null';
    var str2='ID';
    var fields=Object.keys(records);
    var values=Object.values(records);
    
    
    values.forEach(value=>{
        str += ",'" + value + "'"
    })
    fields.forEach(field=>{
        str2 +="," + field
    })
    //"INSERT INTO ${table} VALUES(${null, 'name', 'email', 'passwd')"
    pool.query(`INSERT INTO ${table} (${str2}) VALUES(${str})`,(err,result)=>{
        if (err) {
            res.status(500).send(err);
        }else{
            res.status(200).send(result);
        }
    })

});

//UPDATE RECORD
app.patch('/:table/:id',(req,res)=>{
    var table=req.params.table;
    var records=req.body;
    var id=req.params.id;
    var str='null';
    
    var fields=Object.keys(records);
    var values=Object.values(records);
    
    for (let i = 0; i < fields.length; i++) {
        str+=fields[i]+"='"+values[i]+"'";
        if (i!=fields.length-1) {
            str+=",";
        }
        
    }
    fields.forEach(item=>{
        str += ",'" + item + "'"
    })
    pool.query(`UPDATE ${table} SET ${str}  WHERE ID=${id}`,(err,result)=>{
        if (err) {
            res.status(500).send(err);
        }else{
            res.status(200).send(result);
        }
    })
});

//DELETE ALL RECORDS
app.delete('/:table/:id',(req,res)=>{
    var table=req.params.table;
    var id=req.params.id;
    pool.query(`DELETE FROM ${table} WHERE id=${id}`,(err,result)=>{
        if (err) {
            res.status(500).send(err);
        }else{
            res.status(200).send(result);
        }
    })
});

//DELETE ONE RECORD
app.post('',(req,res)=>{});

app.listen(3000, ()=>{
    console.log(`életjel ${port}`)
})
