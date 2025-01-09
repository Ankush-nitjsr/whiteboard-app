const express = require("express");
const http = require("http");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const socketIO = require("socket.io");

app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Initialize socket.io with CORS configuration
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:5173", // Replace with your frontend's URL
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
});

app.get("/", (req, res) => {
  res.send("server");
});

// socket.io logic
let imageUrl, userRoom;
io.on("connection", (socket) => {
  socket.on("userJoined", (data) => {
    const { userName, userId, roomId, host, presenter } = data;
    userRoom = roomId;
    // const user = userJoin(socket.id, userName, roomId, host, presenter);
    // const roomUsers = getUsers(user.room);
    // socket.join(user.room);
    // socket.emit("message", {
    //   message: "Welcome to ChatRoom",
    // });
    // socket.broadcast.to(user.room).emit("message", {
    //   message: `${user.username} has joined`,
    // });

    // io.to(user.room).emit("users", roomUsers);
    // io.to(user.room).emit("canvasImage", imageUrl);
  });

  socket.on("drawing", (data) => {
    imageUrl = data;
    socket.broadcast.to(userRoom).emit("canvasImage", imageUrl);
  });

  // Uncomment and implement userLeave and getUsers if needed
  // socket.on("disconnect", () => {
  //   const userLeaves = userLeave(socket.id);
  //   const roomUsers = getUsers(userRoom);

  //   if (userLeaves) {
  //     io.to(userLeaves.room).emit("message", {
  //       message: `${userLeaves.username} left the chat`,
  //     });
  //     io.to(userLeaves.room).emit("users", roomUsers);
  //   }
  // });
});

// Serve on port
const PORT = process.env.PORT || 5001;

server.listen(PORT, () =>
  console.log(`server is listening on http://localhost:${PORT}`)
);
