import React, { useEffect, useState } from "react";
import "./ColorPallete.css";
import SocketContext from "../../context/SocketContext";
import { useContext } from "react";
import { MdDeleteForever } from "react-icons/md";

const ColorPallete = ({ brushState, setBrushState, room, canvasCtx }) => {
    const brushSizes = [2, 4, 8, 12, 16];
    const [brushSizeStyle, setBrushSizeStyle] = useState({
        width: 5,
        height: 5,
    });
    const socketConnection = useContext(SocketContext);
    const handleBrushColor = (event) => {
        const color = event.target.getAttribute("data-value");
        setBrushState((prev) => {
            return { ...prev, strokeStyle: color };
        });
        if (socketConnection) {
            socketConnection.emit("update-brush-state", {
                data: {
                    lineWidth: brushState.lineWidth,
                    strokeStyle: color,
                },
                room,
            });
        }
    };
    const handleBrushSize = (event) => {
        const index = brushSizes.indexOf(brushState.lineWidth);
        const newIndex = (index + 1) % brushSizes.length;
        setBrushSizeStyle({
            width: 5 * (newIndex + 1),
            height: 5 * (newIndex + 1),
        });
        setBrushState((prev) => {
            return { ...prev, lineWidth: brushSizes[newIndex] };
        });
        if (socketConnection) {
            socketConnection.emit("update-brush-state", {
                data: {
                    lineWidth: brushSizes[newIndex],
                    strokeStyle: brushState.strokeStyle,
                },
                room,
            });
        }
    };
    const handleDeleteDrawing = () => {
        socketConnection.emit("clear-clicked", {
            room: room,
        });
        canvasCtx.clearRect(
            0,
            0,
            canvasCtx.canvas.width || 1024,
            canvasCtx.canvas.height || 1024
        );
        // console.log("Canvas ctx from color pallete", canvasCtx);
    };

    return (
        <div className="color-pallete">
            <div
                className="selected-color-box"
                style={{ backgroundColor: `${brushState.strokeStyle}` }}
            ></div>
            <div className="color-selection-box">
                <div
                    onClick={handleBrushColor}
                    className="grid-item-top"
                    data-value={"rgb(255, 255, 255)"}
                    style={{
                        backgroundColor: "rgb(255, 255, 255)",
                        borderRadius: "4px 0px 0px 0px",
                    }}
                ></div>
                <div
                    onClick={handleBrushColor}
                    className="grid-item-top"
                    data-value={"rgb(193, 193, 193)"}
                    style={{ backgroundColor: "rgb(193, 193, 193)" }}
                ></div>
                <div
                    onClick={handleBrushColor}
                    className="grid-item-top"
                    data-value={"rgb(239, 19, 11)"}
                    style={{ backgroundColor: "rgb(239, 19, 11)" }}
                ></div>
                <div
                    onClick={handleBrushColor}
                    className="grid-item-top"
                    data-value={"rgb(255, 113, 0)"}
                    style={{ backgroundColor: "rgb(255, 113, 0)" }}
                ></div>
                <div
                    onClick={handleBrushColor}
                    className="grid-item-top"
                    data-value={"rgb(255, 228, 0)"}
                    style={{ backgroundColor: "rgb(255, 228, 0)" }}
                ></div>
                <div
                    onClick={handleBrushColor}
                    className="grid-item-top"
                    data-value={"rgb(0, 204, 0)"}
                    style={{ backgroundColor: "rgb(0, 204, 0)" }}
                ></div>
                <div
                    onClick={handleBrushColor}
                    className="grid-item-top"
                    data-value={"rgb(0, 255, 145)"}
                    style={{ backgroundColor: "rgb(0, 255, 145)" }}
                ></div>
                <div
                    onClick={handleBrushColor}
                    className="grid-item-top"
                    data-value={"rgb(0, 178, 255)"}
                    style={{ backgroundColor: "rgb(0, 178, 255)" }}
                ></div>
                <div
                    onClick={handleBrushColor}
                    className="grid-item-top"
                    data-value={"rgb(35, 31, 211)"}
                    style={{ backgroundColor: "rgb(35, 31, 211)" }}
                ></div>
                <div
                    onClick={handleBrushColor}
                    className="grid-item-top"
                    data-value={"rgb(163, 0, 186)"}
                    style={{ backgroundColor: "rgb(163, 0, 186)" }}
                ></div>
                <div
                    onClick={handleBrushColor}
                    className="grid-item-top"
                    data-value={"rgb(223, 105, 167)"}
                    style={{ backgroundColor: "rgb(223, 105, 167)" }}
                ></div>
                <div
                    onClick={handleBrushColor}
                    className="grid-item-top"
                    data-value={"rgb(255, 172, 142)"}
                    style={{ backgroundColor: "rgb(255, 172, 142)" }}
                ></div>
                <div
                    onClick={handleBrushColor}
                    className="grid-item-top"
                    data-value={"rgb(160, 82, 45)"}
                    style={{
                        backgroundColor: "rgb(160, 82, 45)",
                        borderRadius: "0px 4px 0px 0px",
                    }}
                ></div>
                <div
                    onClick={handleBrushColor}
                    className="grid-item-bottom"
                    data-value={"rgb(0, 0, 0)"}
                    style={{
                        backgroundColor: "rgb(0, 0, 0)",
                        borderRadius: "0px 0px 0px 4px",
                    }}
                ></div>
                <div
                    onClick={handleBrushColor}
                    className="grid-item-bottom"
                    data-value={"rgb(80, 80, 80)"}
                    style={{ backgroundColor: "rgb(80, 80, 80)" }}
                ></div>
                <div
                    onClick={handleBrushColor}
                    className="grid-item-bottom"
                    data-value={"rgb(116, 11, 7)"}
                    style={{ backgroundColor: "rgb(116, 11, 7)" }}
                ></div>
                <div
                    onClick={handleBrushColor}
                    className="grid-item-bottom"
                    data-value={"rgb(194, 56, 0)"}
                    style={{ backgroundColor: "rgb(194, 56, 0)" }}
                ></div>
                <div
                    onClick={handleBrushColor}
                    className="grid-item-bottom"
                    data-value={"rgb(232, 162, 0)"}
                    style={{ backgroundColor: "rgb(232, 162, 0)" }}
                ></div>
                <div
                    onClick={handleBrushColor}
                    className="grid-item-bottom"
                    data-value={"rgb(0, 70, 25)"}
                    style={{ backgroundColor: "rgb(0, 70, 25)" }}
                ></div>
                <div
                    onClick={handleBrushColor}
                    className="grid-item-bottom"
                    data-value={"rgb(0, 120, 93)"}
                    style={{ backgroundColor: "rgb(0, 120, 93)" }}
                ></div>
                <div
                    onClick={handleBrushColor}
                    className="grid-item-bottom"
                    data-value={"rgb(0, 86, 158)"}
                    style={{ backgroundColor: "rgb(0, 86, 158)" }}
                ></div>
                <div
                    onClick={handleBrushColor}
                    className="grid-item-bottom"
                    data-value={"rgb(14, 8, 101)"}
                    style={{ backgroundColor: "rgb(14, 8, 101)" }}
                ></div>
                <div
                    onClick={handleBrushColor}
                    className="grid-item-bottom"
                    data-value={"rgb(85, 0, 105)"}
                    style={{ backgroundColor: "rgb(85, 0, 105)" }}
                ></div>
                <div
                    onClick={handleBrushColor}
                    className="grid-item-bottom"
                    data-value={"rgb(135, 53, 84)"}
                    style={{ backgroundColor: "rgb(135, 53, 84)" }}
                ></div>
                <div
                    onClick={handleBrushColor}
                    className="grid-item-bottom"
                    data-value={"rgb(204, 119, 77)"}
                    style={{ backgroundColor: "rgb(204, 119, 77)" }}
                ></div>
                <div
                    onClick={handleBrushColor}
                    className="grid-item-bottom"
                    data-value={"rgb(99, 48, 13)"}
                    style={{
                        backgroundColor: "rgb(99, 48, 13)",
                        borderRadius: "0px 0px 4px 0px",
                    }}
                ></div>
            </div>
            <div className="selected-color-box" onClick={handleBrushSize}>
                <div
                    style={{
                        backgroundColor: "black",
                        borderRadius: "50%",
                        ...brushSizeStyle,
                    }}
                ></div>
            </div>
            <div className="delete-drawing-box">
                <button
                    onClick={handleDeleteDrawing}
                    className="delete-drawing-btn"
                    style={{
                        
                    }}
                >
                    <MdDeleteForever size={32} />
                </button>
            </div>
        </div>
    );
};

export default ColorPallete;
