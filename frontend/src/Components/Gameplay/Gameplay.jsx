import { Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useContext } from "react";
import SocketContext from "../../context/SocketContext";
import { useDispatch, useSelector } from "react-redux";
import WaitingPage from "../WaitingPage/WaitingPage";
import Canvas from "../Canvas/Canvas";
const Gameplay = () => {
    const dispatch = useDispatch();
    const socketConn = useContext(SocketContext);
    const myId = useSelector((state) => state.user.id);
    const currentlyDrawing = useSelector(
        (state) => state.gameCondition.currentlyDrawing
    );
    const waiting = useSelector(
        (state) => state.gameCondition.showWaitingScreen
    );
    const [waitingCategory, setWaitingCategory] = useState("");
    useEffect(() => {
        if (waiting) {
            if (!currentlyDrawing || currentlyDrawing.id != myId) {
                setWaitingCategory("drawer-choosing-word");
            } else {
                setWaitingCategory("choosing-word");
            }
        }
    }, [currentlyDrawing]);
    return (
        <Stack>
            {waiting ? (
                <WaitingPage category={waitingCategory}></WaitingPage>
            ) : (
                <Canvas />
            )}
        </Stack>
    );
};

export default Gameplay;
