import { useRef, useState } from "react";
import "./style.css";
import { NewBoard } from "../board/NewBoard";
import { Socket } from "socket.io-client";
import User from "../../../types/user";
import { Users } from "../../../types/users";
import Element from "../../../types/element";

interface CanvasDrawingProps {
  user: User;
  socket: Socket;
  users: Users;
}

const CanvasDrawing = ({ user, socket, users }: CanvasDrawingProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

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
    setHistory((prevHistory: Element[]) => [
      ...prevHistory,
      elements[elements.length - 1],
    ]);
    setElements((prevElements) =>
      prevElements.slice(0, prevElements.length - 1)
    );
  };

  const redo = () => {
    setElements((prevElements) => [
      ...prevElements,
      history[history.length - 1],
    ]);
    setHistory((prevHistory) => prevHistory.slice(0, prevHistory.length - 1));
  };

  return (
    <>
      <button
        className="fixed top-[12%] left-[5%] flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white font-normal rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 w-36 h-18 py-2"
        onClick={() => setOpenedUserTab(true)}
      >
        <span className="text-base">Users Online</span>
        <span className="text-sm">{users.length}</span>
        <span className="text-xs italic opacity-80">Click to expand</span>
      </button>

      {openedUserTab && (
        <div className="fixed top-0 h-[100vh] text-white bg-black w-[250px] left-0 p-4">
          <button
            className="w-[100%] mt-5 bg-white text-black"
            onClick={() => setOpenedUserTab(false)}
          >
            Close
          </button>
          <div className="mt-5 w-[100%] pt-5">
            {users.map((usr, idx) => (
              <p key={idx * 999} className="my-2 w-[100%] text-center">
                {usr.name} {user && user.userId === usr.userid && "( You)"}
              </p>
            ))}
          </div>
        </div>
      )}
      <div className="canvas-drawing">
        <h1 className="font-bold text-3xl">Collaborative Whiteboard</h1>
        <div>
          {user && user.presenter && (
            <div className="tools">
              <div className="flex space-x-2">
                <div>
                  <label>
                    <input
                      type="radio"
                      value="pencil"
                      checked={tool === "pencil"}
                      onChange={(e) => setTool(e.target.value)}
                    />
                    <span className="text-sm">Pencil</span>
                  </label>
                </div>
                <div>
                  <label>
                    <input
                      type="radio"
                      value="line"
                      checked={tool === "line"}
                      onChange={(e) => setTool(e.target.value)}
                    />
                    <span className="text-sm">Line</span>
                  </label>
                </div>
                <div>
                  <label>
                    <input
                      type="radio"
                      value="rectangle"
                      checked={tool === "rectangle"}
                      onChange={(e) => setTool(e.target.value)}
                    />
                    <span className="text-sm">Rectangle</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="flex justify-center items-center">
                  <span className="text-sm">Color: </span>
                  <input
                    type="color"
                    value={brushColor}
                    onChange={(e) => setBrushColor(e.target.value)}
                  />
                </label>
              </div>
              <div className="flex justify-center items-center">
                <label className="flex justify-center items-center">
                  <span className="text-sm">Size: </span>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={brushSize}
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                  />
                </label>
                <span>{brushSize}</span>
              </div>
              <div className="space-x-2">
                <button
                  disabled={elements.length === 0}
                  onClick={undo}
                  className="text-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white px-2 py-1 rounded-lg"
                >
                  Undo
                </button>
                <button
                  disabled={history.length < 1}
                  onClick={redo}
                  className="text-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white px-2 py-1 rounded-lg"
                >
                  Redo
                </button>
              </div>
              <div>
                <button
                  onClick={handleClearCanvas}
                  className="text-sm bg-red-400 px-2 py-1 rounded-lg"
                >
                  Clear Canvas
                </button>
              </div>
            </div>
          )}

          {/* <Board brushColor={brushColor} brushSize={brushSize} /> */}
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
