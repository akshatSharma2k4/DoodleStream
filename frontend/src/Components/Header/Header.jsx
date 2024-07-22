import "./Header.css";
import { useSelector } from "react-redux";
import SocketContext from "../../context/SocketContext";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Stack } from "@mui/material";

const Header = ({ children }) => {
    const currentWordLength = useSelector(
        (state) => state.gameCondition.currentWordLength
    );
    const [timer, setTimer] = useState(false);
    const timerRef = useRef(null);
    const socketConnection = useContext(SocketContext);
    let totalDrawTime = useSelector(
        (state) => state.gameCondition.totalDrawTime
    );
    const gameCondition = useSelector((state) => state.gameCondition);
    // console.log("Total rounds", gameCondition.totalRounds);
    useEffect(() => {
        console.log("Timer Ref", timerRef);
        if (socketConnection && timerRef.current && totalDrawTime) {
            socketConnection.on("start-timer", () => {
                // if (interval) clearInterval(interval);
                if (timerRef.current != null) {
                    let currentTime = totalDrawTime;
                    timerRef.current.innerHTML = currentTime;
                    const interval = setInterval(() => {
                        currentTime--;
                        timerRef.current.innerHTML = currentTime;
                        if (currentTime <= 0) {
                            clearInterval(interval);
                        }
                    }, 1000);
                }
            });
            socketConnection.on("start-timer-late", (data) => {
                if (timerRef.current != null) {
                    let currentTime = Math.floor(data);
                    timerRef.current.innerHTML = currentTime;
                    const interval = setInterval(() => {
                        currentTime--;
                        timerRef.current.innerHTML = currentTime;
                        if (currentTime <= 0) {
                            clearInterval(interval);
                        }
                    }, 1000);
                }
            });
        }
    }, [socketConnection, totalDrawTime, timerRef.current]);
    return (
        <div className="header">
            <Stack direction={"row"} alignItems={"center"} gap={2}>
                <div ref={timerRef} className="timer">
                    0
                </div>
                <span className="display-round">
                    <span className="responsive-round-text">{"Round "} </span>
                    {gameCondition.currentRound} of {gameCondition.totalRounds}
                </span>{" "}
            </Stack>

            {children}
            <div className="guess-box">
                <span className="responsive-guess-text">GUESS THIS</span>
                <div className="word-length-guess">
                    {Array.from({ length: currentWordLength }).map(
                        (_, index) => (
                            <span key={index}>_ </span>
                        )
                    )}
                    <sup>{currentWordLength}</sup>
                </div>
            </div>
            <div>
                <button>V</button>
                <button>V</button>
            </div>
        </div>
    );
};

export default Header;
