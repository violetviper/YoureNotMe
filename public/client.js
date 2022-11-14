const joinBtn = document.getElementById("join-btn");
const hostBtn = document.getElementById("host-btn");
const nickname = document.getElementById("username-input");
const htmlPlayerList = document.getElementById("player-list");

nickname.value = localStorage.getItem('nickname') ? JSON.parse(localStorage.getItem('nickname')) : '';

joinBtn.onclick = joinRoomClicked;
hostBtn.onclick = createRoomClicked;

let playerType;
let playerIcon;
let game;
let gamestate;

// function setVisibility(id, isVisible) {
//   if (isVisible) document.getElementById(id).style.visibility = "visible";
//   else document.getElementById(id).style.visibility = "hidden";
// }

function selectIcon() {

}

function setPage(pageID) {
  gamestate = pageID;
  const list = document.querySelectorAll('.page');
  for (let i = 0; i < list.length - 1; i++) {
    list[i].style.visibility = "hidden";
  }
  document.getElementById(pageID).style.visibility = "visible";
}

function init() {
  setPage("client-lobby");
  playertype = null;
}

window.addEventListener("DOMContentLoaded", event => {
  const audio = document.getElementById("sample");
});

init();

let socket;

// TODO: host button clicked

function joinRoomClicked() {
  if (/\S/.test(nickname.value)) {
    playerType = "member";
    localStorage.setItem('nickname', JSON.stringify(nickname.value));
    setPage("loading");

    console.log("Request connect");
    socket = io.connect("http://localhost:3000"); // change to server with rooms
    socket.on('connected', () => {
      socketConnected();
      const roomID = document.getElementById("room-code-input").value; // TODO: CHANGE LATER
      console.log("requesting join room " + roomID);
      socket.emit("joinRoom", {"roomID" : roomID, "nickname" : nickname.value}); // todo: data add pfp and room code

      socket.on("successfullyJoinedRoom", data => {
        setPage("room-lobby");
        game = data["game"];
        console.log("Congrats, you've joined room " + game.roomID + "! :)")
        gameUpdate();
      });
      socket.on("roomNotFound", data => {
        console.log("Room ID " + roomID + " does not exist )):");
        setPage("client-lobby");
      })
    });
    // todo: regulate times joined to one; hide html join form
  }
}

function createRoomClicked() {
  if (/\S/.test(nickname.value)) {
    playerType = "host";
    setPage("loading");

    console.log("Request connect");
    socket = io.connect("http://localhost:3000"); // change to server with rooms

    socket.on('connected', () => {
      socketConnected();
      console.log("Requesting to host room");
      socket.emit("hostRoom", {"nickname" : nickname.value}); // todo: data add pfp and room code

      socket.on("roomCreated", data => {
        setPage("room-lobby");
        game = data["game"];
        console.log("Congrats, you're hosting room " + game.roomID + "! :D");
        gameUpdate();
      });

    });

  }
}

function gameUpdate() {
  document.getElementById("join-link-text").innerHTML = "RoomID: " + game.roomID;
  if (gamestate == "room-lobby") {
    playerListUpdate();
  }
}

function playerListUpdate() {
  htmlPlayerList.innerHTML = "";
  for(const [nickname, playerObj] of Object.entries(game.playerMap)) {
    const userHTML = document.createElement("li");
    userHTML.innerHTML = nickname;
    if (playerObj.status == "host") {
      userHTML.innerHTML += "👑";
    }
    htmlPlayerList.appendChild(userHTML);

  }
}

function socketConnected() {
  console.log("connected to server");
  socket.on("disconnect",() => {
    socket.disconnect();

    console.log("Disconnected from server.");
    init();
  });
  socket.on("newPlayerJoined", data => {
    game = data["game"];
    playerListUpdate();
  });
}
