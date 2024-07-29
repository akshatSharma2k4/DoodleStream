import "./Header.css";
import { useSelector } from "react-redux";
import SocketContext from "../../context/SocketContext";
import React, { useContext, useEffect, useRef } from "react";
import { Stack } from "@mui/material";

const Header = ({ children }) => {
    const room = useSelector((state) => state.user.room);
    const currentWordLength = useSelector(
        (state) => state.gameCondition.currentWordLength
    );
    const timerRef = useRef(null);
    const intervalRef = useRef(null); // Ref to hold the interval ID
    const socketConnection = useContext(SocketContext);
    const totalDrawTime = useSelector(
        (state) => state.gameCondition.totalDrawTime
    );
    const gameCondition = useSelector((state) => state.gameCondition);

    useEffect(() => {
        if (socketConnection && timerRef.current) {
            const startTimer = (time) => {
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                }
                let currentTime = time;
                timerRef.current.innerHTML = currentTime;
                intervalRef.current = setInterval(() => {
                    currentTime--;
                    timerRef.current.innerHTML = currentTime;
                    if (currentTime <= 0) {
                        clearInterval(intervalRef.current);
                        intervalRef.current = null;
                    }
                }, 1000);
            };

            const handleStartTimer = () => {
                startTimer(totalDrawTime);
            };

            const handleStartTimerLate = (data) => {
                startTimer(Math.floor(data));
            };

            const handleClearTimeout = () => {
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                }
                timerRef.current.innerHTML = 0;
            };

            socketConnection.on("start-timer", handleStartTimer);
            socketConnection.on("start-timer-late", handleStartTimerLate);
            socketConnection.on("clear-timeout", handleClearTimeout);

            return () => {
                // socketConnection.off("start-timer", handleStartTimer);
                // socketConnection.off("start-timer-late", handleStartTimerLate);
                // socketConnection.off("clear-timeout", handleClearTimeout);
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                }
            };
        }
    }, [socketConnection, totalDrawTime]);

    return (
        <div className="header">
            <Stack direction={"row"} alignItems={"center"} gap={2}>
                <div ref={timerRef} className="timer">
                    0
                </div>
                <span className="display-round">
                    <span className="responsive-round-text">{"Round "} </span>
                    {gameCondition.currentRound} of {gameCondition.totalRounds}
                </span>
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
            <div style={{ fontWeight: "bold" }}>Room : {room}</div>
        </div>
    );
};

export default Header;
