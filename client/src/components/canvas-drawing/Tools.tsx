import Element from "../../../types/element";
import "./style.css";

interface ToolsProps {
  tool: string;
  setTool: (tool: string) => void;
  brushColor: string;
  setBrushColor: (tool: string) => void;
  brushSize: number;
  setBrushSize: (brushSize: number) => void;
  elements: Element[];
  undo: () => void;
  redo: () => void;
  handleClearCanvas: () => void;
}

export const Tools = ({
  tool,
  setTool,
  brushColor,
  setBrushColor,
  brushSize,
  setBrushSize,
  elements,
  undo,
  redo,
  handleClearCanvas,
}: ToolsProps) => {
  return (
    <div className="tools">
      {/* Pencil / Line / Rectangle */}
      <div className="flex-1 flex justify-between w-full p-1 md:p-2">
        <label className="flex items-center">
          <input
            type="radio"
            value="pencil"
            checked={tool === "pencil"}
            onChange={(e) => setTool(e.target.value)}
          />
          <span className="text-sm">Pencil</span>
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            value="line"
            checked={tool === "line"}
            onChange={(e) => setTool(e.target.value)}
          />
          <span className="text-sm">Line</span>
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            value="rectangle"
            checked={tool === "rectangle"}
            onChange={(e) => setTool(e.target.value)}
          />
          <span className="text-sm">Rectangle</span>
        </label>
      </div>

      {/* Color and Brush size */}
      <div className="flex-1 flex justify-between space-x-4 w-full p-1 md:p-2 ml-2">
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
          <span className="text-base">{brushSize}</span>
        </div>
        <label className="flex justify-center items-center">
          <span className="text-sm">Color: </span>
          <input
            type="color"
            value={brushColor}
            onChange={(e) => setBrushColor(e.target.value)}
          />
        </label>
      </div>

      {/* Buttons: Undo, Redo and Clear canvas */}
      <div className="flex-1 flex justify-around w-full">
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
    </div>
  );
};
