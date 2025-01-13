import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import CanvasDrawing from "./components/canvas-drawing/CanvasDrawing";
import { Room } from "./pages/Room";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Users } from "../types/users";
import User from "../types/user";

type UserJoinedData = {
  success: boolean;
  users: Users;
};

const server = "http://localhost:5001";
const connectionOptions = {
  "force new connection": true,
  reconnectionAttempts: Infinity,
  timeout: 10000,
  transports: ["websocket"],
};

const socket = io(server, connectionOptions);

const App = () => {
  const [user, setUser] = useState<User>(() => {
    // Retrieve user from localStorage or initialize it
    const savedUser = localStorage.getItem("user");
    return savedUser
      ? JSON.parse(savedUser)
      : {
          name: "",
          userId: "",
          roomId: "",
          socketId: "",
          host: false,
          presenter: false,
        };
  });

  const [users, setUsers] = useState<Users>([]);

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    const userJoinedHandler = (data: UserJoinedData) => {
      if (data.success) {
        console.log("userJoined");
        setUsers(data.users);
      } else {
        console.log("userJoined error");
      }
    };

    socket.on("userIsJoined", userJoinedHandler);

    socket.on("allUsers", (data) => {
      setUsers(data);
    });

    // Handle connection errors
    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    return () => {
      socket.off("userIsJoined", userJoinedHandler);
    };
  }, []);

  // Generate random uuid for room number
  const uuid = () => {
    const S4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (
      S4() +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      S4() +
      S4()
    );
  };

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            path="/"
            element={<Room uuid={uuid} socket={socket} setUser={setUser} />}
          />
          <Route
            path="/:roomId"
            element={
              <CanvasDrawing user={user} socket={socket} users={users} />
            }
          />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
