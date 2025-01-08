export const JoinRoomForm = () => {
  return (
    <form className="flex flex-col w-[35%] p-4 space-y-4 border border-blue-500">
      <h1 className="text-xl font-bold text-blue-700">Join Room</h1>
      <input type="text" className="px-2 py-1" placeholder="Enter name" />
      <input type="text" className="px-2 py-1" placeholder="Room Id" />
      <button className="border border-blue-500">Join Room</button>
    </form>
  );
};
