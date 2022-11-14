const joinBtn = document.getElementById("join-btn");
const hostBtn = document.getElementById("host-btn");
const startBtn = document.getElementById("start-btn");
const nickname = document.getElementById("username-input");
const htmlPlayerList = document.getElementById("player-list");

nickname.value = localStorage.getItem('nickname') ? JSON.parse(localStorage.getItem('nickname')) : '';

joinBtn.onclick = joinRoomClicked;
hostBtn.onclick = createRoomClicked;
startBtn.onclick = startGameClicked;

let playerType;
let playerIcon;
let game;
let gamestate;
let roomID;

// function setVisibility(id, isVisible) {
//   if (isVisible) document.getElementById(id).style.visibility = "visible";
//   else document.getElementById(id).style.visibility = "hidden";
// }

function selectIcon() {

}

function setPage(pageID) {
  gamestate = pageID;
  const pages = document.querySelectorAll('.page');
  for (let i = 0; i < pages.length - 1; i++) {
    pages[i].style.visibility = "hidden";
    pages[i].style.height = "0vh";
  }
  let current = document.getElementById(pageID);
  current.style.visibility = "visible";
  current.style.height = "100vh";
}

function init() {
  setPage("client-lobby");
  playertype = null;
  // var audio = new Audio('shitty.mp3');
  // audio.play();
}

init();

let socket;

// TODO: host button clicked

function joinRoomClicked() {
  if (/\S/.test(nickname.value)) {
    playerType = "member";
    localStorage.setItem('nickname', JSON.stringify(nickname.value));
    setPage("loading");

    // const audio = new Audio("https://www.youtube.com/watch?v=QKgcdV3vykU)");
    // audio.volume = 0.2;
    // audio.play();

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

function startGameClicked() {
  // get dict elements, for now we have defaults:
  questionPackNames = ["general"];
  customQuestions = []

  /* list of settings:
    - Question packs enabled
    - Custom questionsList
    - Points needed to win
    - Question Timer
    - Guessing Timer
  */

  socket.emit("startGameClicked", {
    "roomID" : game.roomID,
    "questionPackNames" : questionPackNames,
    "customQuestions" : customQuestions
  });

  setPage("loading");

  // TODO: fix location of this block
  socket.on("newHotseatAndCard", data => {
    console.log("new card");
    game = data["game"];
    gameUpdate();

    card = data["card"];
    // TODO: front-end, update card-display html stuff (consider card.questionList)
    setPage("card-display");
  });
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
