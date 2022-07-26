const socket = io('http://localhost:8000');

//GET DOM ELEMENTS IN RESPECTIVE JS VARIABLES
const form = document.getElementById('send-container');
const messageinput = document.getElementById('msginp')
const messagecontainer = document.querySelector(".container")

//PLAYS AUDIO ON GETTING A MESSAGE
var audio = new Audio('Message notification.mp3');

//FUNCTION WHICH WILL APPEND EVENT INFO THE CONTAINER
const append =(message,position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerText=message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messagecontainer.append(messageElement);
    if(position == 'left'){
      audio.play();
    }

}

//ASK NEW USER HIS/HER NAME AND LET THE SERVER KNOW
const name = prompt("Enter your name to join");
socket.emit('new-user-joined', name);

//IF A NEW USER JOINS RECEIVES EVENT FROM THE SERVER
socket.on('user-joined',name =>{
append(`${name} joined the chat`,'right')
 })

//IF A SERVER SENDS A MSG RECEIVE IT
socket.on('receive',data =>{
append(`${data.name}:${data.message}`,'left')
 })

//IF A USER LEAVES THE CHAT APPEND THE INFO TO THE CONTAINER
socket.on('left',name =>{
append(`${name} left the chat`,'right')
 })

//IF FORM GETS SUBMITTED SEND SERVER THE MSG
form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const message= messageinput.value;
    append(`You: ${message}`,'right');
    socket.emit('send',message);
    messageinput.value='';
})