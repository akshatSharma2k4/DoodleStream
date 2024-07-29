import "./Canvas.css";
import { useDispatch, useSelector } from "react-redux";
import ColorPallete from "../ColorPallete/ColorPallete";
import SocketContext from "../../context/SocketContext";
import React, { useContext, useEffect, useRef, useState } from "react";

const Canvas = () => {
    // Data from redux
    const roomId = useSelector((state) => state.user.room);
    const myId = useSelector((state) => state.user.id);
    const gameConditions = useSelector((state) => state.gameCondition);
    const socketConnection = useContext(SocketContext);

    // page states
    const canvasRef = useRef(null);
    const isMyTurn = Boolean(myId === gameConditions.currentlyDrawing.id);
    // console.log("Is my turn", isMyTurn);
    const [canvasCtx, setCanvasCtx] = useState(null);
    const [drawing, setDrawing] = useState(false);
    const [brushState, setBrushState] = useState({
        lineWidth: 2,
        strokeStyle: "black",
    });

    // useEffect for brushState
    useEffect(() => {
        if (socketConnection) {
            socketConnection.on("recieve-updated-brush-state", (data) => {
                setBrushState(data);
            });
        }
    }, []);

    // useEffects for setting canvas context
    useEffect(() => {
        if (canvasRef.current !== null) {
            const canvasContext = canvasRef.current.getContext("2d");
            setCanvasCtx(canvasContext);
        }
    }, [canvasRef.current]);

    useEffect(() => {
        if (canvasCtx) {
            canvasCtx.lineWidth = brushState.lineWidth;
            canvasCtx.strokeStyle = brushState.strokeStyle;
        }
    }, [canvasCtx, brushState]);

    // useEffect for collaborated drawing
    useEffect(() => {
        // console.log(canvasCtx);
        // console.log(socketConnection);
        if (canvasCtx && socketConnection) {
            socketConnection.on("draw-on-screen", ({ x, y }) => {
                drawRecievedData(x, y);
            });
            socketConnection.on("clear", () => {
                canvasCtx.clearRect(
                    0,
                    0,
                    canvasCtx.canvas.width || 1024,
                    canvasCtx.canvas.height || 1024
                );
                canvasCtx.closePath();
            });
            socketConnection.on("handle-mouse-down", ({ x, y }) => {
                canvasCtx.beginPath();
                canvasCtx.moveTo(x, y);
            });
            socketConnection.on("handle-mouse-up", () => {
                canvasCtx.closePath();
            });
        }
    }, [canvasCtx, socketConnection]);

    // Drawing events
    const getRelativeCoords = (event) => {
        const rect = canvasRef.current.getBoundingClientRect();
        return {
            clientX: event.clientX - rect.left,
            clientY: event.clientY - rect.top,
        };
    };
    const handleOnClick = (event) => {
        // console.log("CanvasCtx", canvasCtx);
        if (isMyTurn && canvasCtx) {
            // console.log("Clicked for drawing");
            const { clientX, clientY } = getRelativeCoords(event);
            canvasCtx.beginPath();
            canvasCtx.moveTo(clientX, clientY);
            setDrawing(true);
            socketConnection.emit("mouse-down", {
                x: clientX,
                y: clientY,
                room: roomId,
            });
        }
    };
    const handleMouseMove = (event) => {
        if (drawing && isMyTurn && canvasCtx) {
            // console.log("Drawing");
            const { clientX, clientY } = getRelativeCoords(event);
            canvasCtx.lineTo(clientX, clientY);
            canvasCtx.stroke();
            socketConnection.emit("drawing-data", {
                x: clientX,
                y: clientY,
                room: roomId,
            });
        }
    };
    const handleMouseUp = () => {
        if (isMyTurn && canvasCtx) {
            // console.log("Mouse up");
            canvasCtx.closePath();
            socketConnection.emit("mouse-up", {
                room: roomId,
            });
            setDrawing(false);
        }
    };

    const drawRecievedData = (clientX, clientY) => {
        canvasCtx.lineTo(clientX, clientY);
        canvasCtx.stroke();
    };
    return (
        <div className="canvas-container">
            <canvas
                className="canvas"
                onMouseDown={handleOnClick}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                ref={canvasRef}
                width={650}
                height={550}
            ></canvas>

            {gameConditions?.currentlyDrawing?.id !== myId ? (
                <></>
            ) : (
                <>
                    <ColorPallete
                        className="color-pallete"
                        brushState={brushState}
                        setBrushState={setBrushState}
                        room={roomId}
                        canvasCtx={canvasCtx}
                    ></ColorPallete>
                </>
            )}
        </div>
    );
};

export default Canvas;
