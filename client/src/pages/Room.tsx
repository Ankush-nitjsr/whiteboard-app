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
      <h1 className="font-bold text-3xl mt-10 text-blue-600 text-center">
        Collaborative Whiteboard
      </h1>
      <div className="flex flex-col lg:flex-row justify-center items-center lg:justify-evenly w-full mt-8 mb-8 md:mt-16 space-y-8 lg:space-y-0">
        <CreateRoomForm uuid={uuid} socket={socket} setUser={setUser} />
        <JoinRoomForm uuid={uuid} socket={socket} setUser={setUser} />
      </div>
    </>
  );
};
