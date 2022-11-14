
class Player {
  constructor(clientID, name) {
    this.id = clientID;
    this.name = name;
    this.status = "member";
    this.points = 0;
    this.profilePicture = 0;
  }

}

module.exports = Player;
