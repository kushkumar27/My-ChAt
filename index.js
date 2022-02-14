
const express = require("express");
const http = require("http");

const app = express();

app.use(express.static(__dirname+"/public"))

const {Server}= require("socket.io");
const server = http.createServer(app)
const io = new Server(server)

var users ={};
//when ever a  connection made ts fire a callback function
io.on('connection', socket => {
	console.log("connected");
	//when we deal with a particular connection
	socket.on('new-user-joined', name => {
		
		console.log('new user',name);
		users[socket.id] = name; // store new useer as id in users as key and name as value

		socket.broadcast.emit('usre-joined', name); // jo joun kiya hai usko chor k sbko show krega user joined
	});

	socket.on('send', (message) => {
		// when some user send a message then start event 'send'
		socket.broadcast.emit('recieve', { message: message, name: users[socket.id] }); // shows every other user that message
	});


	socket.on('disconnect',()=>{

		socket.broadcast.emit('left',users[socket.id]);
		delete users[socket.id];
	})


});
app.get("/",(req,res)=>{
	res.sendFile(__dirname+"/public");
})

let port = process.env.PORT || 8000
server.listen(port,function(){console.log("this is my server")});