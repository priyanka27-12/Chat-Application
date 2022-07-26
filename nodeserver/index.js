//node server that will handle socket.io connections
const io = require('socket.io')(8000,{
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  })

const users= {};
//IF ANY NEW USER JOINS,LET OTHER USERS CONNECTED TO THE SERVER KNOW
io.on('connection',socket =>{
    socket.on('new-user-joined', name =>{
        //console.log("new user",name);
        users[socket.id]=name;
        socket.broadcast.emit('user-joined',name);
    });
//IF SOMEONE SENDS A MSG,BROADCAST IT TO OTHERT PEOPLE
    socket.on('send',message =>{
        socket.broadcast.emit('receive',{message:message, name:users[socket.id]})
    });
//IF SOMEONE LEAVES THE CHAT LET OTHERS KNOW--DISCONNECT IS AN INBUILT EVENT UNLIKE OTHERS
    socket.on('disconnect',message =>{
        socket.broadcast.emit('left',users[socket.id])
        delete users[socket.id];
    });
})
