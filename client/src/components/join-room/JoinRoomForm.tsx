import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";

interface JoinRoomFormProps {
  uuid: () => string;
  socket: Socket;
  setUser: React.Dispatch<React.SetStateAction<string | null>>;
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

    setUser(name);
    navigate(`/${roomId}`);
    console.log(roomData);

    socket.emit("userJoined", roomData);
  };
  return (
    <form
      className="flex flex-col w-[35%] p-4 space-y-4 border border-blue-500"
      onSubmit={handleJoinRoom}
    >
      <h1 className="text-xl font-bold text-blue-700">Join Room</h1>
      <input
        type="text"
        className="px-2 py-1"
        placeholder="Enter name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        className="px-2 py-1"
        placeholder="Room Id"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <button type="submit" className="border border-blue-500">
        Join Room
      </button>
    </form>
  );
};
