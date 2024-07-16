import React from "react";
import "./ChatMessage.css";
// category == "message"
//                     ? `chat ${id % 2 == 0 ? "white" : "gray"}`
//                     : `${category}`
const ChatMessage = ({ name, id, message, category }) => {
    return (
        <div className={`chat chat-message ${category}`}>
            <span>
                <span key={id} style={{ fontWeight: "bold", maxWidth: "100%" }}>
                    {name}
                </span>{" "}
                : {message}
            </span>
        </div>
    );
};

export default ChatMessage;
