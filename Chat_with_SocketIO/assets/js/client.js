var socket = io();
socket.emit('JoinRoom');

socket.on('message',(usr,msg) =>{
    outputMessage(usr,msg);
});

socket.on('roomUsers', data=>{
    updateUsers(data.users)
})

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

function updateUsers(users){
    usersList=document.querySelector('.userList');
    usersList.innerHTML='';
    users.forEach(user => {
        const li=document.createElement('li');
        li.innerHTML=`<li><i class="bi bi-person--fill"><"`
    });
}