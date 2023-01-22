const Player = require("./Player");
const Card = require("./Card");
const QuestionPack = require("./QuestionPack");
// TODO: separate classes into different files.
class Game {
  constructor(roomID) {
    this.hostName = "";
    this.roomID = roomID;
    this.playerMap = {};
    this.playerCount = 0;
    this.rounds = 0; // current round, not completed
    this.gamestate = "INITIAL";
    this.pointGoal = 0;
    this.hotseatPlayer = "";
    this.questionPack;
    this.settings = {
      numDeterminedQuestions: 3,
      numUndeterminedQuestions: 5,
      chosenCardPacks: ["general"],
      questionTime: 25,
      guessingTime: 25,
      customQuestions: "",
    };
    this.card;
    
  }

  addPlayer = function(clientID, nickname) {
    this.playerMap[nickname] = new Player(clientID, nickname);
    this.playerCount++;
  }

  chooseHotseat = function() {
    const playerNumber = Math.floor(Math.random() * this.playerCount);
    this.hotseatPlayer = Object.keys(this.playerMap)[playerNumber];
  }

  removePlayer = function(nickname) {
    this.playerMap.delete(nickname);
    this.playerCount--;
  }
  
  generateQuestionPack = function() {
    this.questionPack = new QuestionPack(this.settings.chosenCardPacks, this.settings.customQuestions);
  }

  generateCard = function() {
    this.card = new Card(this.settings.numUndeterminedQuestions, this.questionPack);
  }

  setHost = function(nickname) {
    if (this.hostName != "") {
      this.playerMap[this.hostName].status = "member";
    }
    this.hostName = nickname;
    this.playerMap[nickname].status = "host";
  }

}
module.exports = Game;
