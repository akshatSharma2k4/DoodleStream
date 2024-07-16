import { Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SocketContext from "../../context/SocketContext";
import { useContext } from "react";
import "./WaitingPage.css";
const OtherChoosingWord = () => {
    const currentlyDrawing = useSelector(
        (state) => state.gameCondition.currentlyDrawing
    );
    return <Typography>{currentlyDrawing.name} is Choosing a Word!</Typography>;
};

// ========================================================================================
const ChoosingWord = () => {
    const [words, setWords] = useState([]);
    const socketConn = useContext(SocketContext);
    const roomId = useSelector((state) => state.user.room);
    useEffect(() => {
        socketConn.emit("give-words", { room: roomId });
        socketConn.on("send-words", (data) => {
            setWords(data);
        });
    }, []);
    const handleWordSubmit = (event) => {
        if (socketConn) {
            socketConn.emit("send-answer", {
                word: event.target.textContent,
                room: roomId,
            });
        } else {
            toast.error("Retry");
        }
    };
    return (
        <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"center"}
            gap={2}
            sx={{
                width: "650px",
                height: "450px",
                color: "white",
                fontSize: "x-large",
                backgroundColor: "rgb(72,72,72)",
            }}
        >
            {words.map((word, id) => {
                return (
                    <div
                        key={id}
                        data-value={word}
                        className="word-item"
                        onClick={handleWordSubmit}
                    >
                        {word}
                    </div>
                );
            })}
        </Stack>
    );
};

const WaitingPage = ({ category }) => {
    return (
        <Stack
            sx={{ width: "100%", height: "100%" }}
            alignItems={"center"}
            justifyContent={"center"}
        >
            {(() => {
                switch (category) {
                    case "choosing-word":
                        return <ChoosingWord></ChoosingWord>;
                    case "drawer-choosing-word":
                        return <OtherChoosingWord></OtherChoosingWord>;
                    default:
                        return <div>Waiting</div>;
                }
            })()}
        </Stack>
    );
};

export default WaitingPage;
