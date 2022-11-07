var express = require('express');

var app = express();
var server = app.listen(3000);

app.use(express.static('public'));

console.log("Server up and running on port 3000!");

var socket = require('socket.io');
var server = socket(server);




// TODO: separate classes into different files.
class Game {
  constructor(hostID) {
    this.hostID = hostID;
    this.players = {};
    this.playerCount = 0;
    this.gamestate = "INITIAL";
    this.pointGoal = 0;
    this.hotseatPlayer = 0;
    this.gamepack = "";
  }

  addPlayer = function(id, username) {
    this.players[id] = new Player(username, 0, id);
    this.playerCount++;
  }

  chooseHotseat = function() {
    this.hotseatPlayer = Math.floor(Math.random() * playerCount);
  }

  removePlayer = function(id) {
    this.players.delete(id);
    this.playerCount--;
  }
}

class Player {
  constructor(name, points, id) {
    this.name = name;
    this.points = points;
    this.profilePicture = 0;
    this.id = id;
  }
}


let state = new Game();

let rooms = {};

server.on('connection', client => {
  console.log("new connection: " + client.id);
  client.emit('connected');

  client.on('joinRoom', data => {
    console.log(data["roomID"] + "  |  " + rooms);
    if (! data["roomID"] in rooms) {
      // TODO: send error emit, room not found; note playerType
      return;
    }
    if (false) { // TODO: if not room is joinable, error eg player limit
      return;
    }

    const game = rooms[data["roomID"]];
    game.addPlayer(client.id, data["username"]) // TODO: pfp

    client.emit('successfullyJoinedRoom', game);
    server.emit('playerListUpdate', game) // TODO: maybe
  });

  client.on('hostRoom', data=> {
    let newRoomId; // TODO: Create Among-Us-style room codes (letters and numbers)
    do {
      newRoomId = "room" + parseSparseInt(Math.random() * 1000);
    } while (!(newRoomId in rooms));
    rooms[newRoomId] = new Game(client.id);
    // TODO: emit message for host, successfully hosted room
  });

  // Disconnect handler
  client.on('disconnect', () => {
    console.log("fuck you guys im gone --" + client.id);
    //state.removePlayer(client.id); // todo: properly remove player
    //server.emit('playerJoined', state.players);

  });

});


class QuestionPack {
  constructor(name, questions) {
      this.name = name;
      this.questions = questions;
  }

  pickRandom = function(numQuestions) { // fixme im slow
    // assert n <= questions.length
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numQuestions);
  }
  // func ... [Math.floor(Math.random()*questionPack..length)]
}

class Card {
  constructor(numQuestions, questionPack) {
    this.questionList = questionPack.pickRandom(numQuestions);
  }
}

generalQuestions =
  [
    "If you could be a different person who would it be?",
    "What fictional world would you want to be magically transported to?",
    "What would you do if you won the lottery?",
    "If you were a superhero, what powers would you have?",
    "Who would you want to be stranded with on a deserted island?",
    "What three items would you bring with you if you got stranded on a deserted island?",
    "What harsh truths do you prefer to ignore?",
    "What is the meaning of life?",
    "What is the line between art and garbage?",
    "What should be the goal of humanity?",
    "Is intelligence or wisdom more useful?",
    "There is a runaway trolley barreling down the railway tracks. Ahead, on the tracks, there are five people tied up and unable to move. The trolley is headed straight for them. You are standing some distance off in the train yard, next to a lever. If you pull this lever, the trolley will switch to a different set of tracks but you notice there is one person on the side track. What do you do?",
    "What would you do if you had an extra hour everyday?",
    "How much wood can a woodchuck really chuck if a woodchuck could chuck wood?",
    "Who does Sally sell her seashells to?",
    "Can a digital model of a human brain feel real emotions?",
    "If humanity was put on trial by an advanced race of aliens, how would you defend humanity and argue for its continued existence?",
    "If you could press a button and receive a million dollars, but one stranger would die, would you press the button? And if so, how many times?",
    "What is your definition of evil?",
    "You meet your younger self, what do you tell them?",
    "Would you rather it always be hot or cold?",
    "Would you rather go blind or go deaf?",
    "Would you rather become a monkey or become rich?",
    "Would you rather know you are going to die beforehand or die suddenly without warning?",
    "What is a conspiracy theory that you believe?",
    "What is your biggest fear?",
    "What makes you really angry?",
    "What is your proudest achievement?",
    "What is your favorite book?",
    "What makes you laugh the most",
    "What did you want to be when you were a kid?",
    "List two pet peeves.",
    "Who is your personal hero?",
    "What is your favorite movie of all time?",
    "What is your nickname?",
    "What is your favorite TV show of all time?",
    "What is your favorite video game of all time?",
    "What was your first job?",
    "What is your favorite snack?",
    "What are some of your favorite hobbies?",
    "Who is your favorite content creator?",
    "What is your favorite ice cream flavor?",
    "What is your favorite music genre?",
    "What is your favorite song?",
    "Who is your favorite music artist?",
    "Who was your first crush?",
    "What was the last book you read?",
    "What is your favorite holiday?",
    "What is your favorite fast food restaurant?",
    "What is your favorite quote?",
    "What emoji best describes you?",
    "What is your spirit animal?",
    "What is your claim to fame?",
    "What quirks do you have?",
    "What website do you visit the most often?",
    "What movie title best describes your life?",
    "What is your worst personality characteristic?",
    "What is the worst movie you’ve ever watched?",
    "What is the best way to start the day?",
    "What mystery do you wish you knew the answer to?",
    "How old were you when you found out that Santa Claus was’t real?",
    "What fad or trend do you hope comes back?",
    "What age do you wish you could permanently be?",
    "What are you most likely to become famous for?",
    "What is the most wholesome thing you’ve ever seen?",
    "What popular TV or movie do you refuse to watch?",
    "What is your favorite unpopular opinion?",
    "What is the most impressive thing you know how to do?",
    "What is the luckiest thing that has happened to you?",
    "What are you interested in that most people haven’t heard of?",
    "What are you most looking forward to in the next 10 years?",
    "What is the most annoying question that people ask you regularly?",
    "What could you give a 40-minute presentation on with absolutely no preparation?",
    "What amazing thing did you do that no one was around to see?",
    "What is your favorite high-school subject?",
    "What is something on your bucket list?",
    "What is something you think everyone should do at least once in their lives?",
    "What is your favorite number?",
    "If you were dictator of a small island nation, what crazy dictator stuff would you do?",
    "If all jobs had the same pay and hours, what job would you like to have?",
    "What would be your first question after waking up from being cryogenically frozen for 100 years?",
    "What piece of entertainment do you wish you could erase from your mind so that you could experience it for the first time again?",
    "What is the best thing about you?",
    "What would a mirror opposite of yourself be like?",
    "What would be your spirit animal?",
    "What was the best compliment you’ve received?",
    "What is the most immature thing that you do?",
    "What is the strangest thing you have come across?",
    "If you were to go for a world record, which one would it be?"
  ]

nsfwQuestions =
  [
    "What is your biggest turn-on?",
    "Toes?",
    "What's the dumbest thing you did while under the influence?"
  ]

berkeleyQuestions =
  [
    "How do you feel about Oski?",
    "What is your favorite place on campus?",
    "What is the best restauraunt on Telegraph?",
    "Who is the worst professor at Cal?",
    "Who is your favorite professor at Cal",
    "Who is the most memorable person you've met in college?"
  ]

let generalQuestionPack = new QuestionPack("general", generalQuestions);
let nsfwQuestionPack = new QuestionPack("nsfw", nsfwQuestions);
let berkeleyQuestionPack = new QuestionPack("berkeley", berkeleyQuestions);
