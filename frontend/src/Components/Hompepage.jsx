import "../App.css";
import "./Homepage.css";
import React from "react";
import toast from "react-hot-toast";
import { Stack } from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import generateUniqueId from "generate-unique-id";
import SocketContext from "../context/SocketContext";
import { useState, useEffect, useContext } from "react";
import getRandomUsername from "../helpers/getRandomUsername";
import { setRoomOwner } from "../features/gameConditionSlice";
import { addRoom, addName, addId } from "../features/userSlice";
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";
const Hompepage = () => {
    const generateRoomCode = () => {
        return generateUniqueId({
            length: 8,
            useLetters: true,
        });
    };
    const dispatch = useDispatch();
    const socketService = useContext(SocketContext);

    useEffect(() => {
        if (socketService.getConnectionStatus()) {
            // console.log("Socket connected:", socketService.socket);
        } else {
            // console.log("Socket not connected yet");
            const handleConnect = () => {
                // console.log("Socket connected:", socketService.socket);
            };

            socketService.socket?.on("connect", handleConnect);

            return () => {
                socketService.socket?.off("connect", handleConnect);
            };
        }
    }, [socketService]);

    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [room, setRoom] = useState("");
    const handleRandomName = () => {
        setUsername(getRandomUsername());
    };
    const handleRoomId = (event) => {
        setRoom(event.target.value);
    };
    const handleCreatePrivateRoom = () => {
        const roomId = generateRoomCode();
        // console.log("RoomId", roomId);
        if (!socketService) {
            toast.error("Connection not established");
            return;
        }
        if (username == "") {
            const uname = getRandomUsername();
            socketService.emit("create-room", {
                name: uname,
                room: roomId,
            });
            dispatch(addName(uname));
            dispatch(setRoomOwner(socketService.socket.id));
        } else {
            socketService.emit("create-room", {
                name: username,
                room: roomId,
            });
            dispatch(addName(username));
            dispatch(setRoomOwner(socketService.socket.id));
        }

        dispatch(addRoom(roomId));
        dispatch(addId(socketService.socket.id));

        navigate(`/create-game`);
    };
    const handleRoomJoin = () => {
        if (room === "") {
            toast.error("Enter Room Id to join room");
            return;
        }

        if (!socketService) {
            toast.error("Connection not established");
            return;
        }
        if (username == "") {
            const uname = getRandomUsername();
            socketService.emit("join-room", { name: uname, room: room });
            dispatch(addName(uname));
        } else {
            socketService.emit("join-room", { name: username, room: room });
            dispatch(addName(username));
        }
        dispatch(addRoom(room));
        dispatch(addId(socketService.socket.id));
        navigate(`/create-game/`);
    };
    return (
        <Stack
            className="homepage"
            sx={{
                width: "100vw",
                height: "100vh",
            }}
        >
            <div className="user-info">
                <div className="name-input-box">
                    <input
                        type="text"
                        placeholder="Enter your name"
                        className="name-input"
                        value={username}
                        onChange={(event) => {
                            setUsername(event.target.value);
                        }}
                    />
                    <button
                        className="random-name-btn"
                        onClick={handleRandomName}
                    >
                        <GiPerspectiveDiceSixFacesRandom size={24}/>
                    </button>
                </div>
                <button
                    className="pvt-room-btn"
                    onClick={handleCreatePrivateRoom}
                >
                    Create Private Room
                </button>
                <div className="room-input-box">
                    <input
                        value={room}
                        type="text"
                        placeholder="Enter Room id"
                        className="room-input"
                        onChange={handleRoomId}
                    />
                    <button className="room-join-btn" onClick={handleRoomJoin}>
                        Join!
                    </button>
                </div>
            </div>
        </Stack>
    );
};

export default Hompepage;
