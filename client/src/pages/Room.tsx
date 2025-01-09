import CreateRoomForm from "../components/create-room/CreateRoomForm";
import { JoinRoomForm } from "../components/join-room/JoinRoomForm";
import { Socket } from "socket.io-client";

interface RoomProps {
  uuid: () => string;
  socket: Socket;
  setUser: React.Dispatch<React.SetStateAction<string | null>>;
}

export const Room = ({ uuid, socket, setUser }: RoomProps) => {
  return (
    <div className="flex justify-evenly gap-4 w-full">
      <CreateRoomForm uuid={uuid} socket={socket} setUser={setUser} />
      <JoinRoomForm uuid={uuid} socket={socket} setUser={setUser} />
    </div>
  );
};
