import { useEffect, useState } from "react";
import "./App.css";
import Board from "./components/board/Board";

const CanvasDrawing = () => {
  const [brushColor, setBrushColor] = useState<string>("black");
  const [brushSize, setBrushSize] = useState<number>(5);

  useEffect(() => {
    console.log("CanvasDrawing Brush Size:", brushSize);
  }, [brushSize]);

  return (
    <div className="App">
      <h1>Collaborative Whiteboard</h1>
      <div>
        <Board brushColor={brushColor} brushSize={brushSize} />
        <div className="tools">
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
        </div>
      </div>
    </div>
  );
};

export default CanvasDrawing;
