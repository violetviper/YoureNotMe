const Player = require("./Player");
// TODO: separate classes into different files.
class Game {
  constructor(roomID) {
    this.hostName = "";
    this.roomID = roomID;
    this.playerMap = {};
    this.playerCount = 0;
    this.gamestate = "INITIAL";
    this.pointGoal = 0;
    this.hotseatPlayer = 0;
    this.questionPack;
    this.gamepack = "";
  }

  addPlayer = function(clientID, nickname) {
    this.playerMap[nickname] = new Player(clientID, nickname);
    this.playerCount++;
  }

  chooseHotseat = function() {
    this.hotseatPlayer = Math.floor(Math.random() * this.playerCount);
  }

  removePlayer = function(nickname) {
    this.playerMap.delete(nickname);
    this.playerCount--;
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
