const joinBtn = document.getElementById("join-btn");
const nickname = document.getElementById("username-input");

joinBtn.onclick = joinClicked;

let socket;
function joinClicked() {
  if (/\S/.test(nickname.value)) {
    socket.emit('join', {username:nickname.value});

    console.log("profile submitted")
    // todo: regulate times joined to one; hide html join form
  }
}


socket = io.connect("http://localhost:3000");

socket.on('connected', data => {
  console.log("connected to server huzzah: " + data['name']);
});



socket.on('playerJoined', playerDict => {
  console.log(playerDict);
  for([key, val] of Object.entries(playerDict)) {
    const user = document.createElement("li");
    user.innerHTML = val.name;
    // todo: add profile pic
    user.id = key;
    document.getElementById("player-list").appendChild(user);
  }
});
