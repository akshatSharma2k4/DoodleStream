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
} from "../features/gameConditionSlice";

const ScreenLayout = () => {
    const dispatch = useDispatch();
    const socketConn = useContext(SocketContext);
    const myId = useSelector((state) => state.user.id);
    const currentlyDrawing = useSelector(
        (state) => state.gameCondition.currentlyDrawing
    );
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
        });
    }, []);
    useEffect(() => {
        console.log("Currently drawing called", currentlyDrawing, myId);
        if (!currentlyDrawing || currentlyDrawing.id != myId) {
            setAllowChange(false);
        } else {
            setAllowChange(true);
        }
    }, [currentlyDrawing]);

    return (
        <Stack className="background" gap={1}>
            <Header></Header>
            <Stack direction={"row"}>
                <ConnectedUsers></ConnectedUsers>
                {isGameStarted ? (
                    <Gameplay></Gameplay>
                ) : (
                    <CreateGame allowChange={allowChange}></CreateGame>
                )}
                <Chatbox></Chatbox>
            </Stack>
        </Stack>
    );
};

export default ScreenLayout;
