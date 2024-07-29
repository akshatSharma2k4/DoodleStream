import "./CreateGame.css";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import SocketContext from "../context/SocketContext";
import React, { useContext, useEffect, useState } from "react";
import {
    setIsGameStarted,
    setTotalRounds,
} from "../features/gameConditionSlice";
import { useNavigate } from "react-router-dom";

const CreateGame = ({ allowChange }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const roomId = useSelector((state) => state.user.room);
    const name = useSelector((state) => state.user.name);
    const socketConn = useContext(SocketContext);
    const [userWords, setUserWords] = useState("");

    useEffect(() => {
        if (roomId === null) {
            navigate("/");
        }
    }, [roomId, navigate]);

    const handleUserWords = (event) => {
        setUserWords(event.target.value);
    };
    const [gameRules, setGameRules] = useState({
        Players: 2,
        DrawTime: 20,
        Rounds: 1,
        WordCount: 3,
        Hints: 0,
    });
    const handleOnChange = (event) => {
        setGameRules((prev) => {
            const { name, value } = event.target;
            return { ...prev, [name]: value };
        });
    };
    const handleOnClick = () => {
        let wordsArray = userWords.split(",");
        if (wordsArray.length < 10 || wordsArray.length > 100) {
            wordsArray = [];
            if (wordsArray.length != 0)
                toast.error(
                    "Custom words not sent as the words do not follow length constraints"
                );
        }
        if (socketConn) {
            socketConn.emit("set-game-rules", {
                room: roomId,
                userChosenWords: wordsArray,
                gameRules,
            });
            dispatch(setTotalRounds(gameRules.Rounds));
            dispatch(setIsGameStarted(true));
            // setCreatingGame(false);
        } else {
            toast.error("CreateGame:Connection not established.");
            toast.error("CreateGame:Please Try again.");
        }
    };

    return (
        <div
            className={`create-game-container ${
                !allowChange ? "disabled" : ""
            }`}
        >
            <div className="container-item">
                <label htmlFor="Players">Players:</label>
                <select
                    id="Players"
                    name="Players"
                    className="selector"
                    onChange={handleOnChange}
                    disabled={!allowChange}
                >
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                </select>
            </div>
            <div className="container-item">
                <label htmlFor="DrawTime">Draw Time:</label>
                <select
                    id="DrawTime"
                    name="DrawTime"
                    className="selector"
                    onChange={handleOnChange}
                    disabled={!allowChange}
                >
                    <option value="20">20</option>
                    <option value="40">40</option>
                    <option value="60">60</option>
                    <option value="80">80</option>
                    <option value="100">100</option>
                    <option value="120">120</option>
                    <option value="150">150</option>
                    <option value="180">180</option>
                    <option value="240">240</option>
                </select>
            </div>
            <div className="container-item">
                <label htmlFor="Rounds">Rounds:</label>
                <select
                    id="Rounds"
                    name="Rounds"
                    className="selector"
                    onChange={handleOnChange}
                    disabled={!allowChange}
                >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                </select>
            </div>
            <div className="container-item">
                <label htmlFor="WordCount">Word Count:</label>
                <select
                    id="WordCount"
                    name="WordCount"
                    className="selector"
                    onChange={handleOnChange}
                    disabled={!allowChange}
                >
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>
            </div>
            {/* <div className="container-item">
                <label htmlFor="Hints">Hints:</label>
                <select
                    id="Hints"
                    name="Hints"
                    className="selector"
                    onChange={handleOnChange}
                    disabled={!allowChange}
                >
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                </select>
            </div> */}
            <div
                className={`custom-words-contaienr ${
                    !allowChange ? "disabled" : ""
                }`}
                disabled={!allowChange}
            >
                <span>Enter custom words you want to add in the game</span>
                <textarea
                    onChange={handleUserWords}
                    value={userWords}
                    className="custom-words-input"
                    placeholder="Enter minimum 10 word to maximum 100 words seperated by commas(,)"
                />
            </div>
            <button
                className={`room-join-btn ${!allowChange ? "disabled" : ""}`}
                onClick={handleOnClick}
                disabled={!allowChange}
            >
                Create Game!
            </button>
        </div>
    );
};

export default CreateGame;
