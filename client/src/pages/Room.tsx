import CreateRoomForm from "../components/create-room/CreateRoomForm";
import { JoinRoomForm } from "../components/join-room/JoinRoomForm";
import { Socket } from "socket.io-client";
import User from "../../types/user";

interface RoomProps {
  uuid: () => string;
  socket: Socket;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}

export const Room = ({ uuid, socket, setUser }: RoomProps) => {
  return (
    <>
      <h1 className="font-bold text-3xl mt-10 text-blue-600">
        Collaborative Whiteboard
      </h1>
      <div className="flex justify-evenly w-full mt-16">
        <CreateRoomForm uuid={uuid} socket={socket} setUser={setUser} />
        <JoinRoomForm uuid={uuid} socket={socket} setUser={setUser} />
      </div>
    </>
  );
};
