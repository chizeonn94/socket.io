const socket = io();

// socket.on("countUpdated", (count) => {
//   console.log("the count has been updated !!", count);
// });

// document.querySelector("#increment").addEventListener("click", () => {
//   socket.emit("increment");
// });

socket.on("message", (msg) => console.log(msg));
socket.on("showMsg", (msg) => console.log("message >> ", msg));

document.querySelector("#message-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const message = e.target.elements.messageInput.value;
  //   console.log("message>>>", message);
  socket.emit("sendMsg", message);
});

document.querySelector("#send-location").addEventListener("click", () => {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported in this browser");
  }
  navigator.geolocation.getCurrentPosition((position) => {
    console.log(position);
    socket.emit("sendLocation", {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });
  });
});
