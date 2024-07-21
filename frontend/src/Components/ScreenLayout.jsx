import "./style.css";
import { Stack } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Chatbox from "./Chatbox/Chatbox";
import ConnectedUsers from "./ConnectedUsers/ConnectedUsers";
import { useContext } from "react";
import SocketContext from "../context/SocketContext";
import { useDispatch, useSelector } from "react-redux";
import CreateGame from "./CreateGame";
import Gameplay from "./Gameplay/Gameplay";
import Header from "./Header/Header";
import Results from "./Results/Results";
import VideoCall from "./VideoCall";

import {
    resetGameConditions,
    setCurrentRound,
    setCurrentWordLength,
    setCurrentlyDrawing,
    setTotalDrawTime,
    setTotalRounds,
    setWordChosen,
    setRoomOwner,
    setIsGameStarted,
    setShowWaitingScreen,
    setShowResults,
} from "../features/gameConditionSlice";

const ScreenLayout = () => {
    // video call data

    // game content
    const [resultData, setResultData] = useState([]);
    const dispatch = useDispatch();
    const socketConn = useContext(SocketContext);
    const myId = useSelector((state) => state.user.id);
    const room = useSelector((state) => state.user.room);
    const currentlyDrawing = useSelector(
        (state) => state.gameCondition.currentlyDrawing
    );
    const roomOwner = useSelector((state) => state.gameCondition.roomOwner);
    const showResults = useSelector((state) => state.gameCondition.showResults);
    const isGameStarted = useSelector(
        (state) => state.gameCondition.isGameStarted
    );
    const [allowChange, setAllowChange] = useState(false);
    useEffect(() => {
        socketConn.on("update-game-conditions", (data) => {
            dispatch(setWordChosen(data.wordChosen));
            dispatch(setCurrentlyDrawing(data.currentlyDrawing));
            dispatch(setCurrentRound(data.currentRound));
            dispatch(setTotalRounds(data.totalRounds));
            dispatch(setTotalDrawTime(data.totalDrawTime));
            dispatch(setCurrentWordLength(data.currentWordLength));
            dispatch(setRoomOwner(data.roomOwner));
            dispatch(setIsGameStarted(data.isGameStarted));
            dispatch(setShowWaitingScreen(data.showWaitingScreen));
            dispatch(setShowResults(data.showingResults));
        });
        socketConn.on("game-over", (data) => {
            dispatch(setShowResults(true));
            setResultData(data);
        });
    }, []);
    useEffect(() => {
        if (!roomOwner || roomOwner != myId) {
            setAllowChange(false);
        } else {
            setAllowChange(true);
        }
    }, [roomOwner]);

    return (
        <Stack className="background" gap={1}>
            <Header></Header>
            <Stack direction={"row"}>
                <ConnectedUsers></ConnectedUsers>
                {showResults && <Results users={resultData}></Results>}
                {!showResults &&
                    (isGameStarted ? (
                        <Gameplay></Gameplay>
                    ) : (
                        <CreateGame allowChange={allowChange}></CreateGame>
                    ))}
                <Chatbox></Chatbox>
                <Stack id="video-call-users" style={{ width: "400px" }}>
                    <VideoCall
                        appId={"0f81aa4f413b4daa829eaa46323cfea4"}
                        channel={room}
                        token={""}
                    ></VideoCall>
                </Stack>
            </Stack>
        </Stack>
    );
};

export default ScreenLayout;
