require('dotenv').config();
const express = require('express');
const app = express();
<<<<<<< HEAD
const path = require('path');
const ejs = require('ejs');
const server=require('http').createServer(app);
const socket=require('socket.io')(server);
const config = require('./config.js');



app.get('/', (req, res) => {
    ejs.renderFile('/assets/views/index.ejs',(err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(data);
        }
    });
});



// Middlewares
=======
const ejs = require('ejs');
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = 3000;

>>>>>>> 191cfbd7ab18982ddec68a3ad96390fa9f47a7fb
app.use('/assets', express.static(path.join(__dirname + '/assets')));
app.use(express.urlencoded({ extended: true }));
<<<<<<< HEAD


app.locals.message = '';
app.locals.messagetype = 'danger';
app.locals.isMessage = false;

=======
>>>>>>> 191cfbd7ab18982ddec68a3ad96390fa9f47a7fb

app.get('/', (req, res) => {
    ejs.renderFile('views/index.ejs', (err, data) => {
        res.send(data);
    })
})

app.post('/chat', (req, res) => {
    let user = {
        nickname: req.body.nickname,
        roomname: req.body.roomname
    }

    if (user.nickname == '' || user.roomname == '') {
        res.redirect('/');
    } else {
        ejs.renderFile('views/chat.ejs', { user }, (err, data) => {
            res.send(data);
        })
    }
})

io.on('connection', (socket) => {
    console.log(socket.id)
});

app.listen(port, () => {
    console.log("Server running...");
})