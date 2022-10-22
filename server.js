

var express = require('express');

var app = express();
var server = app.listen(3000);

app.use(express.static('public'));

console.log("Server up and running!");

var socket = require('socket.io');
var io = socket(server);

io.on('connection', socket => {
  console.log("new connection: " + socket.id);
});
