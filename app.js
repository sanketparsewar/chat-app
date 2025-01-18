const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 8000;
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.resolve("./public")));
app.get("/", (req, res) => {
  res.sendFile("/public/index.html");
});

let socketsConnected = new Set();
// this is from server to client and server side
io.on("connection", onConnected);

function onConnected(socket) {
  console.log(socket.id);
  socketsConnected.add(socket.id);

  io.emit("clients-total", socketsConnected.size);

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    socketsConnected.delete(socket.id);
    io.emit("clients-total", socketsConnected.size);
  });

  // this we are wrtiting to handle the message event and emit the data to all the clients except the one who is sending the message
  socket.on("message", (data) => {
    socket.broadcast.emit("chat-message", data);
  });

  socket.on("feedback", (data) => {
    socket.broadcast.emit("feedback", data);
  });

}
server.listen(PORT, () => {
  console.log("server started at", PORT);
});


