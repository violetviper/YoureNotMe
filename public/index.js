const joinBtn = document.getElementById("join-btn");
const hostBtn = document.getElementById("host-btn");
const nickname = document.getElementById("username-input");

joinBtn.onclick = joinRoomClicked;
hostBtn.onclick = createRoomClicked;

let playerType;

// function setVisibility(id, isVisible) {
//   if (isVisible) document.getElementById(id).style.visibility = "visible";
//   else document.getElementById(id).style.visibility = "hidden";
// }

function setPage(pageId) {
  const list = document.querySelectorAll('.page')
  for (let i = 0; i < list.length - 1; i++) {
    list[i].style.visibility = "hidden";
  }
  document.getElementById(pageId).style.visibility = "visible";
}

function init() {
  setPage("client-lobby");
}

init();

let socket;

// TODO: host button clicked

function joinRoomClicked() {
  if (/\S/.test(nickname.value)) {
    playerType = "member";
    // socket.emit('join', {username:nickname.value});
    //
    //
    //
    console.log("Request connect");
    socket = io.connect("http://localhost:3000"); // change to server with rooms
    socket.on('connected', () => {
      console.log("connected, now requesting join room");
      const roomID = "room123"; // TODO: CHANGE LATER
      socket.emit("joinRoom", {"roomID" : roomID, "nickname" : nickname.value}); // todo: data add pfp and room code
    })
    // todo: regulate times joined to one; hide html join form
  }
}
function createRoomClicked() {
  if (/\S/.test(nickname.value)) {
    playerType = "host";
    console.log("Request connect");
    socket = io.connect("http://localhost:3000"); // change to server with rooms
    socket.on('connected', () => {
      console.log("connected, now requesting host room");
      socket.emit("hostRoom", {"nickname" : nickname.value}); // todo: data add pfp and room code
    })
  }
}


socket.on('connected', () => {
  console.log("connected to server huzzah: ");
  setPage("loading-page");
});


socket.on('playerJoined', playerDict => {
  console.log(playerDict);
  for([key, val] of Object.entries(playerDict)) {
    const user = document.createElement("li");
    user.innerHTML = val.name;
    // TODO: add profile pic
    user.id = key;
    document.getElementById("player-list").appendChild(user);
  }
});
