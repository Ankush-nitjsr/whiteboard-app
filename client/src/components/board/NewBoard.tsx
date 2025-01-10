import { useEffect, useState, RefObject, useLayoutEffect } from "react";
import rough from "roughjs";
import { Socket } from "socket.io-client";
import User from "../../../types/user";
import Element from "../../../types/element";

interface NewBoardProps {
  canvasRef: RefObject<HTMLCanvasElement>;
  ctxRef: React.MutableRefObject<CanvasRenderingContext2D | null>;
  elements: Element[];
  setElements: React.Dispatch<React.SetStateAction<Element[]>>;
  tool: string;
  color: string;
  brushSize: number;
  user: User;
  socket: Socket;
}

const roughGenerator = rough.generator();

export const NewBoard = ({
  canvasRef,
  ctxRef,
  elements,
  setElements,
  tool,
  color,
  brushSize,
  user,
  socket,
}: NewBoardProps) => {
  const [img, setImg] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Whiteboard dimensions (same for both presenters and non-presenters)
  const whiteboardWidth = 900;
  const whiteboardHeight = 400;

  // Listen for whiteboard updates from the server
  useEffect(() => {
    socket.on("whiteboardDataResponse", (data) => {
      setImg(data.imgURL);
    });

    return () => {
      socket.off("whiteboardDataResponse");
    };
  }, [socket]);

  // Initialize the canvas context
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.strokeStyle = color;
        ctx.lineWidth = brushSize;
        ctx.lineCap = "round";
        ctxRef.current = ctx;
      } else {
        console.error("Failed to get 2d context.");
      }
    } else {
      console.error("Canvas element not available.");
    }
  }, [canvasRef, ctxRef, color, brushSize]);

  // Render the elements on the canvas
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const roughCanvas = rough.canvas(canvasRef.current);

      if (elements.length > 0) {
        ctxRef.current?.clearRect(
          0,
          0,
          canvasRef.current?.width || 0,
          canvasRef.current?.height || 0
        );
      }

      elements.forEach((element) => {
        if (element.type === "rectangle") {
          roughCanvas.draw(
            roughGenerator.rectangle(
              element.offsetX,
              element.offsetY,
              element.width || 0,
              element.height || 0,
              {
                stroke: element.stroke,
                strokeWidth: 2,
                roughness: 0,
              }
            )
          );
        } else if (element.type === "line") {
          roughCanvas.draw(
            roughGenerator.line(
              element.offsetX,
              element.offsetY,
              element.width || 0,
              element.height || 0,
              {
                stroke: element.stroke,
                strokeWidth: 2,
                roughness: 0,
              }
            )
          );
        } else if (element.type === "pencil" && element.path) {
          roughCanvas.linearPath(element.path, {
            stroke: element.stroke,
            strokeWidth: 2,
            roughness: 0,
          });
        }
      });

      const canvasImage = canvasRef.current?.toDataURL();
      socket.emit("whiteboardData", {
        imgUrl: canvasImage,
        roomId: user.roomId,
      });
    }
  }, [elements, canvasRef, ctxRef, socket, user.roomId]);

  // If the user is not the presenter, display the shared image
  if (!user?.presenter) {
    return (
      <div
        className="border border-black flex justify-center items-center"
        style={{
          width: whiteboardWidth,
          height: whiteboardHeight,
          backgroundColor: "white",
        }}
      >
        {img ? (
          <img
            src={img}
            alt="Real-time whiteboard image"
            className="h-full w-full object-contain"
          />
        ) : (
          <p>Waiting for the presenter to share the whiteboard...</p>
        )}
      </div>
    );
  }

  // Handle mouse events for drawing
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = e.nativeEvent;

    if (tool === "pencil") {
      setElements([
        ...elements,
        {
          type: "pencil",
          offsetX,
          offsetY,
          path: [[offsetX, offsetY]],
          stroke: color,
        },
      ]);
    } else if (tool === "line") {
      setElements([
        ...elements,
        {
          type: "line",
          offsetX,
          offsetY,
          width: offsetX,
          height: offsetY,
          stroke: color,
        },
      ]);
    } else if (tool === "rectangle") {
      setElements([
        ...elements,
        {
          type: "rectangle",
          offsetX,
          offsetY,
          width: 0,
          height: 0,
          stroke: color,
        },
      ]);
    }
    setIsDrawing(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = e.nativeEvent;

    if (isDrawing) {
      if (tool === "pencil") {
        const { path } = elements[elements.length - 1];

        if (
          path &&
          Array.isArray(path) &&
          path.every((p) => Array.isArray(p) && p.length === 2)
        ) {
          const newPath: [number, number][] = [...path, [offsetX, offsetY]];
          setElements((prevElements: Element[]) =>
            prevElements.map((ele: Element, idx) => {
              if (idx === elements.length - 1) {
                return {
                  ...ele,
                  path: newPath,
                };
              } else {
                return ele;
              }
            })
          );
        }
      } else if (tool === "line") {
        setElements((prevElements: Element[]) =>
          prevElements.map((ele: Element, idx) => {
            if (idx === elements.length - 1) {
              return {
                ...ele,
                width: offsetX,
                height: offsetY,
              };
            } else {
              return ele;
            }
          })
        );
      } else if (tool === "rectangle") {
        setElements((prevElements: Element[]) =>
          prevElements.map((ele: Element, idx) => {
            if (idx === elements.length - 1) {
              return {
                ...ele,
                width: offsetX - ele.offsetX,
                height: offsetY - ele.offsetY,
              };
            } else {
              return ele;
            }
          })
        );
      }
    }
  };

  const handleMouseUp = () => setIsDrawing(false);

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      width={whiteboardWidth}
      height={whiteboardHeight}
      style={{
        backgroundColor: "white",
        border: "1px solid #ccc",
        display: "block",
      }}
    />
  );
};
