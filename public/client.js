
  
let htmlElems = {};
let pageElems = {};
document.querySelectorAll('.page').forEach((pageElem) => pageElems[pageElem.id] = pageElem);

function addHtmlElems(elemIDs) {
  for (let elemID in elemIDs) {
    htmlElems[elemID] = document.getElementById(elemID);
  }
}
[ 'start-btn', 
  'username-input', 
  'player-list', 
  'card-question-list',
  'host-btn', 
  'join-btn', 
  'join-link-text', 
  'room-code-input'].forEach((id) => htmlElems[id] = document.getElementById(id));

htmlElems["username-input"].value = localStorage.getItem('nickname') ? JSON.parse(localStorage.getItem('nickname')) : '';

htmlElems["join-btn"].onclick = joinRoomClicked;
htmlElems["host-btn"].onclick = createRoomClicked;
htmlElems["start-btn"].onclick = startGameClicked;

let player = {
  type: "",
  icon: "",
  nickname: htmlElems["username-input"].value,
}

let playerType;
let playerIcon;
let game;
let gamestate;
let roomID;

function setPage(pageID) {
  gamestate = pageID;
  const pages = document.querySelectorAll('.page');
  Object.keys(pageElems).forEach((key) => {
    if (key == pageID) pageElems[key].style.display = "block";
    else pageElems[key].style.display = "none";
  });
}

function init() {
  setPage("client-lobby");
  player.type = null;
  // var audio = new Audio('shitty.mp3');
  // audio.play();
}

window.addEventListener("DOMContentLoaded", event => {
  const audio = document.getElementById("sample");
});

init();

let socket;

// TODO: host button clicked

function joinRoomClicked() {
  if (/\S/.test(htmlElems["username-input"].value)) {
    player.type = "member";
    localStorage.setItem('nickname', JSON.stringify(htmlElems["username-input"].value));
    setPage("loading");

    // const audio = new Audio("https://www.youtube.com/watch?v=QKgcdV3vykU)");
    // audio.volume = 0.2;
    // audio.play();

    console.log("Request connect");
    socket = io.connect("http://localhost:3000"); // change to server with rooms
    socket.once('connected', () => {
      socketConnected();
      const roomID = htmlElems["room-code-input"].value; // TODO: CHANGE LATER
      console.log("requesting join room " + roomID);
      socket.emit("joinRoom", {"roomID" : roomID, "nickname" : htmlElems["username-input"].value}); // todo: data add pfp and room code

      socket.once("successfullyJoinedRoom", data => {
        setPage("room-lobby");
        game = data["game"];
        console.log("Congrats, you've joined room " + game.roomID + "! :)")
        gameUpdate();

      });

      socket.once("roomNotFound", data => {
        console.log("Room ID " + roomID + " does not exist )):");
        setPage("client-lobby");
      })
    });
    // todo: regulate times joined to one; hide html join form
  }
}

function createRoomClicked() {
  if (/\S/.test(htmlElems["username-input"].value)) {
    player.type = "host";
    setPage("loading");

    console.log("Request connect");
    socket = io.connect("http://localhost:3000"); // change to server with rooms

    socket.once('connected', () => {
      socketConnected();
      console.log("Requesting to host room");
      socket.emit("hostRoom", {"nickname" : htmlElems["username-input"].value}); // todo: data add pfp and room code

      socket.once("roomCreated", data => {
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
    settings: game.settings,
    roomID : game.roomID
  });

  setPage("loading");

  // TODO: repeat location of this line
  socket.once("startRound", startRound);
}

function startRound(data) {
  console.log("Round started, new card");
  game = data["game"];
  gameUpdate();
  const isHotseatPlayer = player.nickname === game.hotseatPlayer  ;
  
  for(const q of Object.entries(game.card.questionList)) {
    const questionInput = document.createElement("input");
    questionInput.type = "checkbox";
    questionInput.style.display = "inline";
    if (!isHotseatPlayer) {
      questionInput.disabled = true;
    }

    const questionHTML = document.createElement("p");
    questionHTML.innerHTML = q;
    questionHTML.style.display = "inline";

    const questionContainer = document.createElement("li");
    questionContainer.appendChild(questionInput);
    questionContainer.appendChild(questionHTML);

    htmlElems["card-question-list"].appendChild(questionContainer);

  }
  
  if (game.settings.numDeterminedQuestions 
    === game.settings.numUndeterminedQuestions) {
    // skip undetermined
  } else {

    if (isHotseatPlayer) {
      
    }
    
  }

  card = data["card"];
  // TODO: front-end, update card-display html stuff (consider card.questionList)
  setPage("card-display");
}

function gameUpdate() {
  htmlElems["join-link-text"].innerHTML = "RoomID: " + game.roomID;
  if (gamestate == "room-lobby") {
    playerListUpdate();
  }
}

function playerListUpdate() {
  htmlElems["player-list"].innerHTML = "";
  for(const [nickname, playerObj] of Object.entries(game.playerMap)) {
    const userHTML = document.createElement("li");
    userHTML.innerHTML = nickname;
    if (playerObj.status == "host") {
      userHTML.innerHTML += "👑";
    }
    htmlElems["player-list"].appendChild(userHTML);

  }
}

function socketConnected() {
  player.nickname = htmlElems["username-input"].value;
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
