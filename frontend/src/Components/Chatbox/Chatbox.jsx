import "./Chatbox.css";
import ChatMessage from "../ChatMessage/ChatMessage";
import SocketContext from "../../context/SocketContext";
import React, { useState, useEffect, useContext } from "react";
import { useSelector } from "react-redux";
const Chatbox = () => {
    const room = useSelector((state) => state.user.room);
    const name = useSelector((state) => state.user.name);
    const socketConnection = useContext(SocketContext);
    const [chats, setChats] = useState([]);
    useEffect(() => {
        if (socketConnection !== null) {
            socketConnection.on("recieve-message", (data) => {
                // console.log(data);
                setChats((prevChats) => [...prevChats, data]);
            });
        }
    }, [socketConnection]);
    const [message, setMessage] = useState("");
    const handleOnChange = (event) => {
        setMessage(event.target.value);
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        socketConnection.emit("message", {
            data: message,
            room: room,
            name: name,
        });
        setMessage("");
    };
    return (
        <div className="chat-box">
            <div className="chat-section">
                {chats.map((chat, id) => {
                    return (
                        <ChatMessage
                            key={id}
                            id={id}
                            name={chat.name}
                            message={chat.message}
                            category={chat.category}
                        ></ChatMessage>
                    );
                })}
            </div>
            <div className="message-section">
                <form onSubmit={handleSubmit}>
                    <input
                        placeholder="What have you guessed?"
                        className="input-tag"
                        type="text"
                        value={message}
                        maxLength={100}
                        onChange={handleOnChange}
                    />
                </form>
            </div>
        </div>
    );
};

export default Chatbox;
