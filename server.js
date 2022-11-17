const QuestionPack = require("./src/QuestionPack")
const Card = require("./src/Card")
const Game = require("./src/Game")
const Player = require("./src/Player")

var express = require('express');

var app = express();
var server = app.listen(3000);

app.use(express.static('public'));

console.log("Server up and running on port 3000!");

var socket = require('socket.io');
var server = socket(server);

const possibleDigits = ["0", "1", "2", "3", "4", "5", "6", 
"7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I",
 "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U",
  "V", "W", "X", "Y", "Z"];


let state = new Game();

let roomMap = {}; // roomID : Game Obj
let userMap = {}; // clientID : Socket Obj

server.on('connection', client => {
  console.log("new client connection: " + client.id);
  userMap[client.id] = client;
  client.emit('connected');

  client.on('joinRoom', data => {
    if (! (data["roomID"] in roomMap)) {
      // TODO: send error emit, room not found; note playerType
      client.emit("roomNotFound");
      console.log(data["nickname"] + " (" + client.id + ") failed to find room " + data["roomID"]);
      return;
    }
    if (false) { // TODO: if not room is joinable, error. eg player limit, nickname dupes
      return;
    }



    const game = roomMap[data["roomID"]];
    game.addPlayer(client.id, data["nickname"]); // TODO: pfp

    client.join(data["roomID"]);
    server.to(data["roomID"]).emit("newPlayerJoined", {game});
    client.emit('successfullyJoinedRoom', {game});
    console.log(data["nickname"] + " (" + client.id + ") joined room " + data["roomID"]);
  });

  client.on('hostRoom', data => {
    let newRoomId = ""; // TODO: Create Among-Us-style room codes (letters and numbers)
    do {
      for (let i = 0; i < 6; i++) {
        let randomIndex = Math.floor(Math.random() * 36);
        newRoomId += possibleDigits[randomIndex];
      }
    } while (newRoomId in roomMap);

    const game = new Game(newRoomId);
    game.addPlayer(client.id, data["nickname"]); // TODO: pfp
    game.setHost(data["nickname"]);
    roomMap[newRoomId] = game;


    console.log(data["nickname"] + " (" + client.id + ") created new room " + newRoomId);
    client.join(newRoomId); // first member in room (host)
    client.emit("roomCreated", {"game" : roomMap[newRoomId]});
    // TODO: emit message for host, successfully hosted room

    // client.on("startGameClicked", data => {
    //   const game = roomMap[data["roomID"]];
    //   game.questionPack = new QuestionPack(data["questionPackNames"], data["customQuestions"]);
    //
    //   // TODO: (not neccesarily here) playercount updates, it's kinda weird
    //   game.chooseHotseat();
    //   numQuestions = 1; // TODO: gameMode changes this
    //   card = new Card(numQuestions, game.questionPack);
    //   server.to(data["roomID"]).emit("newHotseatAndCard", {"game" : game, "card" : card});
    //
    // });

  });

  client.on("startGameClicked", data => {
    console.log("game started at room " + data["roomID"]);
    const game = roomMap[data["roomID"]];
    game.settings = data.settings;
    game.generateQuestionPack();

    game.chooseHotseat();
    game.generateCard();

    server.to(data["roomID"]).emit("startRound", {"game" : game});

  });

  // Disconnect handler
  client.on('disconnect', () => {
    console.log("fuck you guys im gone --" + client.id);
    // userMap.delete(client.id); // TODO: reconnection handling should not instaremove, need map of client ids to rooms/nickname

    // state.removePlayer(client.id); // todo: properly remove player
    //server.emit('playerJoined', state.players);

  });

});
