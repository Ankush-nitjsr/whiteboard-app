import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import User from "../../../types/user";

interface JoinRoomFormProps {
  uuid: () => string;
  socket: Socket;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}

export const JoinRoomForm = ({ uuid, socket, setUser }: JoinRoomFormProps) => {
  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");

  const navigate = useNavigate();

  const handleJoinRoom = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const roomData = {
      name,
      roomId,
      userId: uuid(),
      host: false,
      presenter: false,
    };

    setUser(roomData);
    navigate(`/${roomId}`);
    console.log(roomData);

    socket.emit("userJoined", roomData);
  };

  return (
    <form
      className="flex flex-col w-full max-w-md p-6 space-y-6 bg-white shadow-md rounded-lg border border-gray-200"
      onSubmit={handleJoinRoom}
    >
      <h1 className="text-2xl font-bold text-blue-600 text-center">
        Join a Room
      </h1>

      {/* Name Input */}
      <div>
        <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
          Your Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoComplete="on"
        />
      </div>

      {/* Room ID Input */}
      <div>
        <label
          htmlFor="roomId"
          className="block text-gray-700 font-medium mb-2"
        >
          Room ID
        </label>
        <input
          id="roomId"
          name="roomId"
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          required
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-2 bg-blue-500 text-white font-medium rounded-lg shadow hover:bg-blue-600 transition"
      >
        Join Room
      </button>
    </form>
  );
};
