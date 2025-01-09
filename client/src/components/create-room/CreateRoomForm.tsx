import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";

interface CreateRoomFormProps {
  uuid: () => string;
  socket: Socket;
  setUser: React.Dispatch<React.SetStateAction<string | null>>;
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

    setUser(name);
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
      className="flex flex-col w-[35%] p-4 space-y-4 border border-blue-500"
      onSubmit={handleCreateRoom}
    >
      <h1 className="text-xl font-bold text-blue-700">Create Room</h1>
      <input
        type="text"
        className="w-full px-2 py-1"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <div className="flex space-x-2">
        <input
          type="text"
          value={roomId}
          className="p-1 w-full"
          disabled
          placeholder="Room code"
        />
        <button
          className="border border-blue-500"
          onClick={() => setRoomId(uuid())}
        >
          Generate
        </button>
        <button
          type="button"
          className="border border-blue-500"
          onClick={handleCopyRoomId}
        >
          Copy
        </button>
      </div>
      <button type="submit" className="border border-blue-500">
        Generate Room
      </button>
    </form>
  );
};

export default CreateRoomForm;
