const express = require('express');
const app = express();
const db=require('./models');
const port=3000;
async()=>{
    await db.sequelize.sync();
};

app.get('/users',(req,res)=>{
    db.models.User.findAll().then(users=>{
        res.send(users);
    })
});
app.get('/users/new',(req,res)=>{
    db.models.User.create(
        {
            firstName:"jane",
            LastName:"Doe",
            age:25
        }
    ).then(()=>{
        res.send('Record inserted!')
    }
        
    )
})
app.listen(port, () => {
    console.log(`Életjel ${port}...`);
});