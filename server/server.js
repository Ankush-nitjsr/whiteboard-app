require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const socketIO = require("socket.io");

const userServices = require("./services/users");

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:5173",q
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
});

app.use(cors());
app.use(express.json());

// Root endpoint
app.get("/", (req, res) => {
  res.send("Server is running...");
});

let imageUrlGlobal = null; // Global whiteboard image

io.on("connection", (socket) => {
  console.log(`New connection: ${socket.id}`);

  // When a user joins a room
  socket.on("userJoined", async (data) => {
    const { name, userId, roomId, host, presenter } = data;
    await userServices.addUser({
      name,
      userId,
      roomId,
      host,
      presenter,
      socketId: socket.id,
    });

    const usersInRoom = await userServices.getUsersInRoom(roomId);
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);

    socket.emit("userIsJoined", { success: true, users: usersInRoom });
    socket.broadcast.to(roomId).emit("allUsers", usersInRoom);

    if (imageUrlGlobal) {
      socket.emit("whiteboardDataResponse", { imgURL: imageUrlGlobal });
    }
  });

  // Whiteboard data broadcasting
  socket.on("whiteboardData", (data) => {
    const { imgUrl, roomId } = data;
    imageUrlGlobal = imgUrl;
    socket.broadcast
      .to(roomId)
      .emit("whiteboardDataResponse", { imgURL: imgUrl });
    console.log(`Whiteboard updated for room: ${roomId}`);
  });

  // When a user disconnects
  socket.on("disconnect", async () => {
    console.log(`User disconnected: ${socket.id}`);
    const user = await userServices.getUser(socket.id);
    if (user) {
      await userServices.removeUser(user.userId);
      const usersInRoom = await userServices.getUsersInRoom(user.roomId);
      socket.broadcast.to(user.roomId).emit("allUsers", usersInRoom);
    }
  });
});

// Start server
const PORT = process.env.PORT || 5001;

server.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
