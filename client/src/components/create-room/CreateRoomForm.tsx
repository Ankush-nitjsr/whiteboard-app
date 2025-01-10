import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import User from "../../../types/user";

interface CreateRoomFormProps {
  uuid: () => string;
  socket: Socket;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}

const CreateRoomForm = ({ uuid, socket, setUser }: CreateRoomFormProps) => {
  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState(uuid());

  const navigate = useNavigate();

  const handleCreateRoom = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const roomData = {
      name,
      roomId,
      userId: uuid(),
      host: true,
      presenter: true,
    };

    setUser(roomData);
    navigate(`/${roomId}`);
    console.log(roomData);

    socket.emit("userJoined", roomData);
  };

  const handleCopyRoomId = () => {
    navigator.clipboard.writeText(roomId).then(
      () => alert("Room ID copied to clipboard!"),
      () => alert("Failed to copy Room ID.")
    );
  };

  return (
    <form
      className="flex flex-col w-full max-w-md p-6 space-y-6 bg-white shadow-md rounded-lg border border-gray-200"
      onSubmit={handleCreateRoom}
    >
      <h1 className="text-2xl font-bold text-blue-600 text-center">
        Create a Room
      </h1>

      {/* Name Input */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">
          Your Name
        </label>
        <input
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      {/* Room ID Section */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">Room ID</label>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={roomId}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-gray-100 text-gray-500 cursor-not-allowed"
            disabled
            placeholder="Room code"
          />
          <button
            type="button"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
            onClick={() => setRoomId(uuid())}
          >
            Generate
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
            onClick={handleCopyRoomId}
          >
            Copy
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-2 bg-blue-500 text-white font-medium rounded-lg shadow hover:bg-blue-600 transition"
      >
        Create Room
      </button>
    </form>
  );
};

export default CreateRoomForm;
