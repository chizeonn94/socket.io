const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));

//let count = 0;
const welcomeMsg = "welcome!";
io.on("connection", (socket) => {
  console.log("New WebSocket connection");
  //   socket.emit("countUpdated", count);
  //   socket.on("increment", () => {
  //     count++;
  //     //socket.emit("countUpdated", count);
  //     io.emit("countUpdated", count);
  //   });
  socket.broadcast.emit("message", "A new user joined!");
  socket.emit("message", welcomeMsg);
  socket.on("sendMsg", (msg) => {
    io.emit("showMsg", msg);
  });

  socket.on("disconnect", () => {
    io.emit("message", "A user left!");
  });

  socket.on("sendLocation", (position) => {
    console.log(position);
    io.emit(
      "message",
      `Location : ${position.latitude + " " + position.longitude}`
    );
  });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}!`);
});
