import { useEffect, useRef, useState } from "react";
import "./style.css";
import Board from "../board/Board";
import { NewBoard } from "../board/NewBoard";

const CanvasDrawing = ({ user, socket, users }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef(null);

  console.log("User", user);

  const [tool, setTool] = useState("pencil");
  const [brushColor, setBrushColor] = useState<string>("#000000");
  const [brushSize, setBrushSize] = useState<number>(5);
  const [elements, setElements] = useState([]);
  const [history, setHistory] = useState([]);
  const [openedUserTab, setOpenedUserTab] = useState(false);

  useEffect(() => {
    console.log("CanvasDrawing Brush Size:", brushSize);
  }, [brushSize]);

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
    setHistory((prevHistory) => [
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
        className="bg-black text-white absolute top-[12%] left-[5%] w-32 h-10"
        onClick={() => setOpenedUserTab(true)}
      >
        Users
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
                {usr.name}
                {user && user.userId === usr.userId && "(You)"}
              </p>
            ))}
          </div>
        </div>
      )}
      <div className="canvas-drawing">
        <h1>
          Collaborative Whiteboard <span>[Users Online : {users.length}]</span>
        </h1>
        {user && user.presenter && (
          <div className="tools">
            <div>
              <label>
                <span>Pencil: </span>
                <input
                  type="radio"
                  value="pencil"
                  checked={tool === "pencil"}
                  onChange={(e) => setTool(e.target.value)}
                />
              </label>
            </div>
            <div>
              <label>
                <span>Line: </span>
                <input
                  type="radio"
                  value="line"
                  checked={tool === "line"}
                  onChange={(e) => setTool(e.target.value)}
                />
              </label>
            </div>
            <div>
              <label>
                <span>Rectangle: </span>
                <input
                  type="radio"
                  value="rectangle"
                  checked={tool === "rectangle"}
                  onChange={(e) => setTool(e.target.value)}
                />
              </label>
            </div>
            <div>
              <label>
                <span>Color: </span>
                <input
                  type="color"
                  value={brushColor}
                  onChange={(e) => setBrushColor(e.target.value)}
                />
              </label>
            </div>
            <div>
              <label>
                <span>Size: </span>
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
              <button disabled={elements.length === 0} onClick={undo}>
                Undo
              </button>
              <button disabled={history.length < 1} onClick={redo}>
                Redo
              </button>
            </div>
            <div>
              <button onClick={handleClearCanvas}>Clear Canvas</button>
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
          user={user}
          socket={socket}
        />
      </div>
    </>
  );
};

export default CanvasDrawing;
