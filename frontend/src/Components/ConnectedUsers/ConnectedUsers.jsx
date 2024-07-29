import "./ConnectedUsers.css";
import User from "../User/User";
import SocketContext from "../../context/SocketContext";
import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

const ConnectedUsers = () => {
    const room = useSelector((state) => state.user.room);
    const [users, setUsers] = useState([]);
    const socketConnection = useContext(SocketContext);
    // console.log("ConnectedUsers:Socket", socketConnection);
    useEffect(() => {
        if (socketConnection) {
            socketConnection.emit("get-connected-users", room);
            socketConnection.on("recieve-connected-users", (data) => {
                // console.log(data);
                setUsers(data);
            });
        }
    }, [socketConnection]);
    return (
        <div className="user-box">
            <div className="user-section">
                {users?.map((user, index) => {
                    return (
                        <User
                            key={index}
                            name={user.name}
                            points={user.points}
                            guessedCorrectly={user.guessedCorrectAns}
                        ></User>
                    );
                })}
            </div>
        </div>
    );
};

export default ConnectedUsers;
