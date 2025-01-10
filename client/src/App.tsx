import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import CanvasDrawing from "./components/canvas-drawing/CanvasDrawing";
import { Room } from "./pages/Room";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

type UserJoinedData = {
  success: boolean;
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
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);

  console.log("User: ", user);

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
            path="/:roomId"
            element={
              <CanvasDrawing user={user} socket={socket} users={users} />
            }
          />
          <Route
            path="/room"
            element={<Room uuid={uuid} socket={socket} setUser={setUser} />}
          />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
