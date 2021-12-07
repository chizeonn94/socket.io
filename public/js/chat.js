const socket = io();
const $messageForm = document.querySelector("#message-form");
const $messages = document.querySelector("#messages");

const $messageTemplate = document.querySelector("#message-template").innerHTML;
const $locationTemplate =
  document.querySelector("#location-template").innerHTML;

// socket.on("countUpdated", (count) => {
//   console.log("the count has been updated !!", count);
// });

// document.querySelector("#increment").addEventListener("click", () => {
//   socket.emit("increment");
// });

socket.on("message", (msg) => console.log(msg));
socket.on("showMsg", (msg) => {
  console.log("message >> ", msg);
  const html = Mustache.render($messageTemplate, { message: msg });
  $messages.insertAdjacentHTML("beforeend", html);
});
socket.on("locationMessage", (location) => {
  console.log("locationMessage >> ", location);
  const html = Mustache.render($locationTemplate, { url: location });
  $messages.insertAdjacentHTML("beforeend", html);
});
$messageForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const message = e.target.elements.messageInput.value;
  //   console.log("message>>>", message);
  socket.emit("sendMsg", message, (err) => {
    if (err) {
      return console.log(err);
    }
    console.log("message delivered");
  });
});

document.querySelector("#send-location").addEventListener("click", () => {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported in this browser");
  }
  navigator.geolocation.getCurrentPosition((position) => {
    console.log(position);
    socket.emit(
      "locationMessage",
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      () => {
        console.log("location has sent!");
      }
    );
  });
});
