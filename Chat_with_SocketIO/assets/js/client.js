var socket = io();
socket.emit('JoinRoom');
socket.on('message',(usr,msg) =>{
    outputMessage(usr,msg);
});

function outputMessage(usr,msg){
    const div=document.createElement('div');
    const p=document.createElement('p');
    p.innerText= usr;

    div.appendChild(p);
    const p2=document.createElement('p');
    p2.innerText= msg;
    div.appendChild(p2);

    document.querySelector('.chat-message').appendChild(div);

}