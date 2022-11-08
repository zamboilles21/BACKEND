const users=[];

function userJoin(id,username, room){
    const user={
        id,username,room
    }
    users.push(user);
    console.log(users)
    return user;
};

function userLeave(id){
    const idx=users.findIndex(user=>user.id===id);
    if (idx !=-1) {
        users.splice(idx,1)
    }
};

function getCurrentUser(){};

function getRoomUsers(){
    return users.filter(user=> {user.room===room})
};

module.exports={userJoin,userLeave,getCurrentUser,getRoomUsers};