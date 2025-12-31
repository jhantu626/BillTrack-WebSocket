const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(express.json());

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());

io.on("connection", (socket) => {
  const { user } = socket.handshake.auth;
  socket.join(user);
  console.log("user Connected", user, new Date().toLocaleTimeString());

  socket.on("logout",(data)=>{
    console.log("user logout", user);
  })

  socket.on("disconnect", () => {
    console.log("user Disconnected", user);
    socket.leave(user);
  });
});

app.get("/logout", (req, res) => {
  const { user, status } = req.query;
  io.to(user).emit("logout", status);
  res.json({ message: "logout", status: true });
});

app.post("/logout", (req, res) => {
  const { roomId, devices } = req.body;
  io.to(roomId).emit("logout", devices);
  res.json({ message: "logout", status: true });
});

server.listen(4000, "0.0.0.0", () => {
  console.log("Server running on 4000");
});

