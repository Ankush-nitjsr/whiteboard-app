require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const helmet = require("helmet");
const socketIO = require("socket.io");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const path = require("path");

const userServices = require("./services/users");
const whiteboardServices = require("./services/whiteboard");
//const roomsRouter = require("./routes/rooms");
const usersRouter = require("./routes/users");
const whiteboardRouter = require("./routes/whiteboard");

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "REMOVE"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
});

// Middleware setup
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));

// Rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: "Too many requests, please try again later." },
});
app.use(apiLimiter);

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Whiteboard API",
      version: "1.0.0",
      description: "API documentation for the Whiteboard app",
    },
    servers: [
      {
        url: process.env.SERVER_URL || "http://localhost:5001",
      },
    ],
  },
  apis: ["./routes/*.js"],
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Default route
app.get("/", (req, res) => res.redirect("/api-docs"));

// API routes
//app.use("/rooms", roomsRouter);
app.use("/users", usersRouter);
app.use("/whiteboards", whiteboardRouter);

// Health check route
app.get("/health", (req, res) =>
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() })
);

// WebSocket setup
io.on("connection", (socket) => {
  console.log(`New connection: ${socket.id}`);
  // When a user joins a room
  socket.on("userJoined", async (data) => {
    try {
      const { name, userId, roomId, socketId, host, presenter } = data;
      console.log("User joining room:", data);

      await userServices.addUser({
        name,
        userId,
        roomId,
        socketId,
        host,
        presenter,
      });

      const usersInRoom = await userServices.getUsersInRoom(roomId);
      if (!usersInRoom || usersInRoom.length === 0)
        throw new Error("No users found in room");

      socket.join(roomId);
      socket.emit("userIsJoined", { success: true, users: usersInRoom });
      socket.broadcast.to(roomId).emit("allUsers", usersInRoom);

      const whiteboard = await whiteboardServices.getWhiteboard(roomId);
      if (whiteboard) {
        socket.emit("whiteboardDataResponse", { data: whiteboard });
      }
    } catch (error) {
      console.error("Error in userJoined:", error.message);
      socket.emit("error", { message: "Failed to join room" });
    }
  });

  socket.on("whiteboardData", async (data) => {
    try {
      const { imageUrl, roomId } = data;

      await whiteboardServices.updateWhiteboard({ roomId, imageUrl });
      socket.broadcast
        .to(roomId)
        .emit("whiteboardDataResponse", { imgURL: imageUrl });
      console.log(`Whiteboard updated for room: ${roomId}`);
    } catch (error) {
      console.error("Error in whiteboardData:", error.message);
      socket.emit("error", { message: "Failed to update whiteboard" });
    }
  });

  socket.on("disconnect", async () => {
    try {
      const user = await userServices.getUserBySocketId(socket.id);
      if (!user) {
        console.warn(`No user associated with socket ID: ${socket.id}`);
        return;
      }

      await userServices.removeUser(user.userId);
      const usersInRoom = await userServices.getUsersInRoom(user.roomId);
      socket.broadcast.to(user.roomId).emit("allUsers", usersInRoom);
    } catch (error) {
      console.error("Error in disconnect:", error.message);
    }
  });
});

// Error handling
app.use((req, res) => res.status(404).json({ error: "Route not found" }));

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ error: "Internal Server Error" });
});

// Server setup
const PORT = process.env.PORT || 5001;
server.listen(PORT, () =>
  console.log(
    `Server running on ${process.env.SERVER_URL || `http://localhost:${PORT}`}`
  )
);
