const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const ejs = require('ejs');

app.use(express.static('assets'));
app.use(express.urlencoded({ extended: true }));

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
            if (err) throw err;
            res.send(data);
        })
    }
})

io.on('connection', (socket) => {
    console.log('Websocket connected!' + socket.id);

    socket.on('send', (message) => {
        socket.broadcast.emit('msg', message);
    });

    socket.on('disconnect', () => {
        console.log('socket disconnected');
    });
});

server.listen(3000);