import React, { useEffect } from "react";
import "./User.css";
const User = ({ name, points, guessedCorrectly }) => {
    return (
        <div
            className={`user ${
                guessedCorrectly == true ? "correct-guessed" : ""
            }`}
            // style={
            //     guessedCorrectly ? { backgroundColor: "rgb(91, 221, 74)" } : {}
            // }
        >
            <span>
                <span style={{ fontWeight: "bold", maxWidth: "100%" }}>
                    {name}
                </span>
            </span>
            <span>Points : {points}</span>
        </div>
    );
};

export default User;
