const express = require('express');
const app = express();
const port = 3000;
const db = require('./models')


db.sequelize.sync();


app.get('/users',(req,res)=>{
    // SELECT * FROM users
    db.models.User.findAll().then(users => {
        res.send(users);
    });
})


app.get('/users/new',(req,res)=>{
    db.models.User.create({
        firsName:"Jane",
        lastName:"Doe",
        age:25
    }).then(()=>{
        res.send('Record saved')
    })
})
app.get('/products',(req,res)=>{
    // SELECT * FROM users
    db.models.Product.findAll().then(products => {
        res.send(products);
    });
})


app.get('/products/new',(req,res)=>{
    db.models.Product.create({
        category:"Jane",
        produtname:"Doe",
        age:25
    }).then(()=>{
        res.send('Record saved')
    })
})

app.listen(port,()=>{
    console.log(`Server is listening on ${port}`)
});