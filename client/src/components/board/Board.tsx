import { useRef, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface MyBoard {
  brushColor: string;
  brushSize: number;
}

const Board = ({ brushColor, brushSize }: MyBoard) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [windowSize, setWindowSize] = useState([
    window.innerWidth,
    window.innerHeight,
  ]);

  // Initialize Socket.IO connection
  useEffect(() => {
    const newSocket = io("http://localhost:5001");
    console.log("Connected to socket:", newSocket);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      console.log("Socket disconnected");
    };
  }, []);

  // Receive and render canvas data from the server
  useEffect(() => {
    if (!socket) return;

    const handleCanvasImage = (data: string) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (canvas && ctx) {
        const image = new Image();
        image.src = data;
        image.onload = () => ctx.drawImage(image, 0, 0);
      }
    };

    socket.on("canvasImage", handleCanvasImage);

    return () => {
      socket.off("canvasImage", handleCanvasImage);
    };
  }, [socket]);

  // Drawing functionality
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx) {
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = brushSize;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    }

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    const startDrawing = (e: MouseEvent) => {
      isDrawing = true;
      const rect = canvas?.getBoundingClientRect();
      if (rect) {
        lastX = e.clientX - rect.left;
        lastY = e.clientY - rect.top;
      }
    };

    const draw = (e: MouseEvent) => {
      if (!isDrawing || !canvas || !ctx) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.stroke();

      lastX = x;
      lastY = y;
    };

    const endDrawing = () => {
      if (!isDrawing) return;

      if (canvas && socket) {
        //Get the data URL of the canvas content
        const dataURL = canvas.toDataURL();

        // Send the dataURL or imgae data to the socket
        socket.emit("canvasImage", dataURL);
        console.log("Drawing ended and sent to server");
      }
      isDrawing = false;
    };

    if (canvas) {
      canvas.addEventListener("mousedown", startDrawing);
      canvas.addEventListener("mousemove", draw);
      canvas.addEventListener("mouseup", endDrawing);
      canvas.addEventListener("mouseout", endDrawing);
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener("mousedown", startDrawing);
        canvas.removeEventListener("mousemove", draw);
        canvas.removeEventListener("mouseup", endDrawing);
        canvas.removeEventListener("mouseout", endDrawing);
      }
    };
  }, [brushColor, brushSize, socket]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize([window.innerWidth, window.innerHeight]);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={windowSize[0] > 600 ? 600 : 300}
      height={windowSize[1] > 400 ? 400 : 200}
      style={{ backgroundColor: "white", border: "1px solid #ccc" }}
    />
  );
};

export default Board;
