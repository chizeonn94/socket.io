const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");
const Filter = require("bad-words");

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
  socket.on("sendMsg", (msg, callback) => {
    const filter = new Filter();
    if (filter.isProfane(msg)) {
      return callback("profanity is not allowed ");
    }
    io.emit("showMsg", msg);
    callback();
  });

  socket.on("disconnect", () => {
    io.emit("message", "A user left!");
  });

  socket.on("locationMessage", (position, callback) => {
    console.log(position);
    io.emit(
      "locationMessage",
      `https://google.com/maps?q=${position.latitude},${position.longitude}`
    );
    callback();
  });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}!`);
});
