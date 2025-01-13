import { useRef, useState } from "react";
import "./style.css";
import { NewBoard } from "../board/NewBoard";
import { Socket } from "socket.io-client";
import User from "../../../types/user";
import { Users } from "../../../types/users";
import Element from "../../../types/element";
import { Tools } from "./Tools";

interface CanvasDrawingProps {
  user: User;
  socket: Socket;
  users: Users;
}

const CanvasDrawing = ({ user, socket, users }: CanvasDrawingProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  console.log("User: ", user);
  console.log("Users: ", users);

  const [tool, setTool] = useState("pencil");
  const [brushColor, setBrushColor] = useState<string>("#000000");
  const [brushSize, setBrushSize] = useState<number>(2);
  const [elements, setElements] = useState<Element[]>([]);
  const [history, setHistory] = useState<Element[]>([]);
  const [openedUserTab, setOpenedUserTab] = useState<boolean>(false);

  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    ctx?.clearRect(
      0,
      0,
      canvasRef.current?.width || 0,
      canvasRef.current?.height || 0
    );
    setElements([]);
  };

  const undo = () => {
    setHistory((prev) => [...prev, elements[elements.length - 1]]);
    setElements((prev) => prev.slice(0, -1));
  };

  const redo = () => {
    setElements((prev) => [...prev, history[history.length - 1]]);
    setHistory((prev) => prev.slice(0, -1));
  };

  return (
    <>
      <button
        className="fixed top-4 left-4 bg-blue-500 text-white px-4 py-2 rounded-md"
        onClick={() => setOpenedUserTab(true)}
      >
        Users Online: {users.length}
      </button>

      {openedUserTab && (
        <div className="user-tab">
          <button className="close-btn" onClick={() => setOpenedUserTab(false)}>
            Close
          </button>
          {users.map((usr, idx) => (
            <p key={idx}>
              {usr.name} {user.userId === usr.userid && "(You)"}
            </p>
          ))}
        </div>
      )}

      <div className="canvas-drawing">
        <h1 className="font-bold text-3xl mt-8 text-white mb-8">
          Collaborative Whiteboard
        </h1>
        <div>
          {user && user.presenter && (
            <Tools
              tool={tool}
              setTool={setTool}
              brushColor={brushColor}
              setBrushColor={setBrushColor}
              brushSize={brushSize}
              setBrushSize={setBrushSize}
              elements={elements}
              undo={undo}
              redo={redo}
              handleClearCanvas={handleClearCanvas}
            />
          )}

          {/* White board canvas */}
          <NewBoard
            canvasRef={canvasRef}
            ctxRef={ctxRef}
            elements={elements}
            setElements={setElements}
            tool={tool}
            color={brushColor}
            brushSize={brushSize}
            user={user}
            socket={socket}
          />
        </div>
      </div>
    </>
  );
};

export default CanvasDrawing;
