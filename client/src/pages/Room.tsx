import CreateRoomForm from "../components/create-room/CreateRoomForm";
import { JoinRoomForm } from "../components/join-room/JoinRoomForm";
import { Socket } from "socket.io-client";

interface RoomProps {
  uuid: () => string;
  socket: Socket;
  setUser: (user: string) => void;
}

export const Room = ({ uuid, socket, setUser }: RoomProps) => {
  return (
    <div className="flex justify-evenly gap-4 w-full">
      <CreateRoomForm uuid={uuid} socket={socket} setUser={setUser} />
      <JoinRoomForm />
    </div>
  );
};
