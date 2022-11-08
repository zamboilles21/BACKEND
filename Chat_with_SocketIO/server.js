const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const ejs = require('ejs');
const session=require('express-session');
const {userJoin,userLeave,getCurrentUser,getRoomUsers}=require('./utils/users.js')


app.use(express.static('assets'));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
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
        session.userName=user.nickname;
        session.roomName=user.roomname;
        ejs.renderFile('views/chat.ejs', { user }, (err, data) => {
            if (err) throw err;
            res.send(data);
        })
    }
})

io.on('connection', (socket) => {
    
    socket.on('JoinRoom', ()=>{
        console.log(session.userName + ' Joined to '+ session.roomName);
        const user=userJoin(socket.id,session.userName,session.roomName);
    
        socket.join(session.roomName);

        socket.emit('message', 'RendszerUzi',`Üdv a ${session.roomName} szobában! Nem fog fájni!`);

        socket.broadcast.to(session.roomName).emit('message', 'RendszerUzi',`${session.userName} szobában! Nem fog fájni!`);

        const users=getRoomUsers(session.roomName);
        io.to(session.roomName).emit('roomUsers',{
            room:session.roomName,
            users:getCurrentUser
        });

    })
    
    console.log('Websocket connected!' + socket.id);

    

    socket.on('send', (message) => {
        socket.broadcast.emit('msg', message);
    });

    socket.on('disconnect', () => {
        userLeave(socket.id);
        socket.broadcast.to(session.roomName).emit('message', 'RendszerUzi',`${session.userName} szobában!Fájni fog`);
        console.log('socket disconnected');

    });
});

server.listen(3000);