const express = require("express");
const app = express();
const { Server } = require("socket.io");
const http = require("http");
const cors = require("cors");
const getWords = require("../helper/getWords.js");
app.use(
    cors({
        origin: "*",
    })
);
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

const calcuatePointsForGuess = () => {
    return 1;
};
const calculatePointsForDraw = () => {
    return 1;
};

const roomMembers = {};

// {roomId:[{name,id,points,guessedCorrectAns}]}

const roomConditions = {};

//initial room conditions
//                 wordChosen: false,
//                 players: null,
//                 rounds: null,
//                 currentRound: null,
//                 words: null,
//                 drawTime: null,
//                 hints: [],
//                 currentlyDrawing: null,
//                 correctAns: null,
//                 roomOwner: socket.id,
//                 isGameStarted: false,
//                 timerStartTime: null,
/*
{
   wordChosen: false,
   players:count of max possible players in room,
   rounds:max possible rounds,
   currentRound:marks the current round
   words:no of words to be sent to drawer
   hints:count of max possible hints to be given
   drawTime: total time to draw the word
   currentlyDrawing:index of the currently drawing room member
   correctAns:correct ans of the drawing
   roomOwner:id of room owner
   isGameStarted:false
   showWaitingScreen:false
   showingResults:false
}
*/

io.on("connection", (socket) => {
    console.log(`Socket ${socket.id} connected here`);
    socket.on("create-room", ({ room, name }) => {
        try {
            // created new room entry in roomMembers object
            roomMembers[room] = [
                {
                    name: name,
                    id: socket.id,
                    points: 0,
                    guessedCorrectAns: false,
                },
            ];
            // creating an entry for room conditons for newly created room
            roomConditions[room] = {
                wordChosen: false,
                players: null,
                rounds: null,
                currentRound: null,
                words: null,
                drawTime: null,
                hints: [],
                currentlyDrawing: 1,
                correctAns: null,
                roomOwner: socket.id,
                isGameStarted: false,
                timerStartTime: null,
                showWaitingScreen: false,
                showingResults: false,
            };
            // joining the socket to room
            socket.join(room);
            // console.log("CreateRoom : RoomMembers", roomMembers[room]);
            // console.log("CreateRoom : RoomConditions", roomConditions[room]);
            // Updating room conditions
            const whoIsDrawing =
                roomMembers[room][roomConditions[room]?.currentlyDrawing - 1];
            socket.emit("update-game-conditions", {
                wordChosen: roomConditions[room]?.wordChosen,
                currentlyDrawing: whoIsDrawing,
                totalRounds: roomConditions[room]?.rounds,
                totalDrawTime: roomConditions[room]?.drawTime,
                currentRound: roomConditions[room]?.currentRound,
                currentWordLength:
                    roomConditions[room]?.correctAns?.length || 0,
                roomOwner: roomConditions[room].roomOwner,
                isGameStarted: roomConditions[room].isGameStarted,
                showWaitingScreen: roomConditions[room].showWaitingScreen,
                showingResults: roomConditions[room].showingResults,
            });
        } catch (err) {
            // console.log("CreateRoom : Error", err);
            socket.emit("error", err.message);
        }
    });

    socket.on("join-room", ({ name, room }) => {
        try {
            if (!roomMembers[room] || !roomConditions[room]) {
                throw new Error("Room doesn't exist");
            }
            // adding new member to the room
            roomMembers[room].push({
                name: name,
                id: socket.id,
                points: 0,
                guessedCorrectAns: false,
            });
            // joinig the room
            socket.join(room);

            // notifying everyone that someone joined
            io.to(room).emit("recieve-message", {
                name: name,
                category: "joined",
                message: "joined the room",
            });

            // updating room conditions to late joinees
            const whoIsDrawing =
                roomMembers[room][roomConditions[room]?.currentlyDrawing - 1];

            // updating game condtition for the joinee when a user joins the game
            socket.emit("update-game-conditions", {
                wordChosen: roomConditions[room]?.wordChosen,
                currentlyDrawing: whoIsDrawing,
                totalRounds: roomConditions[room]?.rounds,
                totalDrawTime: roomConditions[room]?.drawTime,
                currentRound: roomConditions[room]?.currentRound,
                currentWordLength:
                    roomConditions[room]?.correctAns?.length || 0,
                roomOwner: roomConditions[room].roomOwner,
                isGameStarted: roomConditions[room].isGameStarted,
                showWaitingScreen: roomConditions[room].showWaitingScreen,
                showingResults: roomConditions[room].showingResults,
            });
            if (
                roomConditions[room].isGameStarted === true &&
                roomConditions[room].timerStartTime != null
            ) {
                console.log("Sending timer for late guys");
                const timeLeft =
                    roomConditions[room].drawTime -
                    (Date.now() - roomConditions[room].timerStartTime) / 1000;
                socket.emit("start-timer-late", timeLeft);
            }
            // console.log("JoinRoom: Room Members", roomMembers[room]);
        } catch (err) {
            console.log("Error occured");
            // socket.emit("error", { message: err.message });
        }
    });

    socket.on("set-game-rules", ({ room, gameRules }) => {
        // console.log("Set Game Rules:Setting game rules");
        roomConditions[room] = {
            ...roomConditions[room],
            wordChosen: false,
            players: gameRules.Players,
            rounds: gameRules.Rounds,
            currentRound: 1,
            words: gameRules.WordCount,
            drawTime: gameRules.DrawTime,
            hints: gameRules.Hints,
            currentlyDrawing: 1,
            correctAns: null,
            isGameStarted: true,
            showWaitingScreen: true,
        };
        if (!roomMembers[room]) {
            console.log("Room DNE");
            return;
        }
        for (let i = 0; i < roomMembers[room].length; i++) {
            roomMembers[room][i].points = 0;
        }
        const whoIsDrawing =
            roomMembers[room][roomConditions[room]?.currentlyDrawing - 1];
        // this is update after room owner has created the room
        io.to(room).emit("update-game-conditions", {
            wordChosen: roomConditions[room].wordChosen,
            currentlyDrawing: whoIsDrawing,
            totalRounds: roomConditions[room].rounds,
            totalDrawTime: roomConditions[room].drawTime,
            currentRound: roomConditions[room].currentRound,
            currentWordLength: roomConditions[room]?.correctAns?.length || 0,
            roomOwner: roomConditions[room]?.roomOwner,
            isGameStarted: true,
            showWaitingScreen: roomConditions[room]?.showWaitingScreen,
            waitScreenMessage: "round",
            showingResults: roomConditions[room].showingResults,
        });
        io.emit("recieve-connected-users", roomMembers[room]);
        if (roomConditions[room]) {
            const myWord = getWords(roomConditions[room]?.words);
            socket.emit("send-words", myWord);
        } else {
            console.log("Set Game Rules:error");
            socket.emit("error", { message: "Unexpected error occured" });
        }
    });
    // sending words to choose
    socket.on("give-words", ({ room }) => {
        console.log("I have been called");
        if (roomConditions[room]) {
            const myWord = getWords(roomConditions[room]?.words);
            socket.emit("send-words", myWord);
        } else {
            socket.emit("error", { message: "Unexpected error occured" });
        }
    });

    socket.on("send-answer", ({ room, word }) => {
        if (room && roomConditions[room] && roomConditions[room]) {
            //settting up room conditions
            // console.log("Correct ans", word);
            roomConditions[room].correctAns = word;
            roomConditions[room].wordChosen = true;
            roomConditions[room].isGameStarted = true;
            roomConditions[room].showWaitingScreen = false;
            const whoIsDrawing =
                roomMembers[room][roomConditions[room]?.currentlyDrawing - 1];
            // sending updated room conditions to all users
            io.to(room).emit("update-game-conditions", {
                wordChosen: true, //This is what i have to change other things are as it is
                currentlyDrawing: whoIsDrawing,
                totalRounds: roomConditions[room].rounds,
                totalDrawTime: roomConditions[room].drawTime,
                currentRound: roomConditions[room].currentRound,
                currentWordLength:
                    roomConditions[room]?.correctAns?.length || 0,
                isGameStarted: true,
                showWaitingScreen: false,
                showingResults: roomConditions[room].showingResults,
            });
            // sending message for timer
            io.to(room).emit("start-timer");
            io.to(room).emit("show-round");
            // setting a timer to accept answers
            roomConditions[room].timerStartTime = Date.now();

            // Timer
            const timer = setTimeout(() => {
                if (!roomConditions[room]) {
                    console.log("Room conditions are undefined");
                    return;
                }

                let roundChanged = false;
                io.to(room).emit("recieve-message", {
                    // iss part main problem hai
                    message: `Correct answer was ${roomConditions[room]?.correctAns}`,
                    category: "correct-ans",
                });
                roomConditions[room].showWaitingScreen = true;
                roomConditions[room].timerStartTime = null;
                roomConditions[room].correctAns = null;
                roomConditions[room].wordChosen = false;
                for (let i = 0; i < roomMembers[room].length; i++) {
                    roomMembers[room][i].guessedCorrectAns = false;
                }

                // setting everyone's brush state to original
                io.to(room).emit("recieve-updated-brush-state", {
                    lineWidth: 2,
                    strokeStyle: "black",
                });
                //

                const membersSize = roomMembers[room].length;
                const currentlyDrawingIndex =
                    roomConditions[room]?.currentlyDrawing;
                if (currentlyDrawingIndex == membersSize) {
                    const currentRoundValue =
                        roomConditions[room]?.currentRound;
                    // game over condition
                    {
                        //    wordChosen: false,
                        //    players:count of max possible players in room,
                        //    rounds:max possible rounds,
                        //    currentRound:marks the current round
                        //    words:no of words to be sent to drawer
                        //    hints:count of max possible hints to be given
                        //    drawTime: total time to draw the word
                        //    currentlyDrawing:index of the currently drawing room member
                        //    correctAns:correct ans of the drawing
                        //    roomOwner:id of room owner
                        //    isGameStarted:false
                        //    showWaitingScreen:false
                    }

                    if (currentRoundValue == roomConditions[room]?.rounds) {
                        console.log("game over");

                        io.to(room).emit("game-over", roomMembers[room]);
                        roomConditions[room].showingResults = true;
                        setTimeout(() => {
                            console.log("Timeout has been called");
                            roomConditions[room].showingResults = false;
                            roomConditions[room] = {
                                wordChosen: false,
                                players: null,
                                rounds: null,
                                currentRound: null,
                                words: null,
                                drawTime: null,
                                hints: [],
                                currentlyDrawing: 1,
                                correctAns: null,
                                roomOwner: roomConditions[room].roomOwner,
                                isGameStarted: false,
                                timerStartTime: null,
                                showWaitingScreen: false,
                                showingResults:
                                    roomConditions[room].showingResults,
                            };
                            const whoIsDrawing =
                                roomMembers[room][
                                    roomConditions[room]?.currentlyDrawing - 1
                                ];
                            io.to(room).emit("update-game-conditions", {
                                wordChosen: roomConditions[room]?.wordChosen,
                                currentlyDrawing: whoIsDrawing,
                                totalRounds: roomConditions[room]?.rounds,
                                totalDrawTime: roomConditions[room]?.drawTime,
                                currentRound:
                                    roomConditions[room]?.currentRound,
                                currentWordLength:
                                    roomConditions[room]?.correctAns?.length ||
                                    0,
                                roomOwner: roomConditions[room].roomOwner,
                                isGameStarted:
                                    roomConditions[room].isGameStarted,
                                showWaitingScreen:
                                    roomConditions[room].showWaitingScreen,
                                showingResults:
                                    roomConditions[room].showingResults,
                            });
                        }, 5000);
                        return;
                    } else {
                        console.log("Changing the round");
                        roomConditions[room].currentRound =
                            roomConditions[room]?.currentRound + 1;
                        roomConditions[room].currentlyDrawing = 1;
                        roundChanged = true;
                    }
                } else {
                    console.log("Changing the currently drawer");
                    roomConditions[room].currentlyDrawing =
                        roomConditions[room].currentlyDrawing + 1;
                }
                const whoIsDrawing =
                    roomMembers[room][
                        roomConditions[room]?.currentlyDrawing - 1
                    ];
                // console.log("Room conditions", roomConditions[room]);

                io.to(room).emit("recieve-connected-users", roomMembers[room]);

                io.to(room).emit("update-game-conditions", {
                    wordChosen: false, //This is what i have to change other things are as it is
                    currentlyDrawing: whoIsDrawing,
                    totalRounds: roomConditions[room].rounds,
                    totalDrawTime: roomConditions[room].drawTime,
                    currentRound: roomConditions[room].currentRound,
                    currentWordLength:
                        roomConditions[room]?.correctAns?.length || 0,
                    showWaitingScreen: roomConditions[room].showWaitingScreen, //true
                    isGameStarted: roomConditions[room].isGameStarted,
                    showingResults: roomConditions[room].showingResults,
                });

                clearTimeout(timer);
            }, roomConditions[room].drawTime * 1000);
        } else {
            socket.emit("error", { message: "Unexpected error occured" });
        }
    });

    //getting all connected users
    socket.on("get-connected-users", (room) => {
        if (roomMembers[room]) {
            io.to(room).emit("recieve-connected-users", roomMembers[room]);
        } else {
            console.log("error here");
            socket.emit("error", { message: "Error finding the room" });
        }
    });

    // handling chats
    socket.on("message", ({ data, room, name }) => {
        if (roomConditions[room].wordChosen) {
            if (data == roomConditions[room]?.correctAns) {
                const index = roomMembers[room].findIndex((member) => {
                    return member.id == socket.id;
                });
                if (
                    socket.id !=
                        roomMembers[room][
                            roomConditions[room].currentlyDrawing - 1
                        ].id &&
                    index != undefined &&
                    roomMembers[room][index].guessedCorrectAns == false
                ) {
                    roomMembers[room][index].points =
                        roomMembers[room][index].points +
                        calcuatePointsForGuess();
                    roomMembers[room][index].guessedCorrectAns = true;
                    io.to(room).emit("recieve-message", {
                        name: name,
                        message: "Guessed the correct answer",
                        category: "correct-ans",
                    });
                    // console.log(roomMembers[room]);
                    io.to(room).emit(
                        "recieve-connected-users",
                        roomMembers[room]
                    );
                } else {
                    socket.emit("recieve-message", {
                        name: name,
                        message: data,
                        category: "message",
                    });
                }
            } else {
                io.to(room).emit("recieve-message", {
                    name: name,
                    message: data,
                    category: "message",
                });
            }
        } else {
            io.to(room).emit("recieve-message", {
                name: name,
                message: data,
                category: "message",
            });
        }
    });

    // drawing events
    socket.on("drawing-data", ({ x, y, room }) => {
        io.to(room).emit("draw-on-screen", { x: x, y: y });
    });
    socket.on("clear-clicked", ({ room }) => {
        console.log("Clear clicked");
        io.to(room).emit("clear", null);
    });
    socket.on("mouse-down", ({ x, y, room }) => {
        io.to(room).emit("handle-mouse-down", { x: x, y: y });
    });
    socket.on("mouse-up", ({ room }) => {
        io.to(room).emit("handle-mouse-up", null);
    });

    socket.on("update-brush-state", ({ data, room }) => {
        io.to(room).emit("recieve-updated-brush-state", data);
    });

    // disconnect
    socket.on("disconnect", () => {
        console.log(`Socket ${socket.id} disconnected `);
        for (const room in roomMembers) {
            const memberIndex = roomMembers[room].findIndex(
                (member) => member.id === socket.id
            );
            console.log(memberIndex);
            if (memberIndex !== -1) {
                const removedMember = roomMembers[room].splice(
                    memberIndex,
                    1
                )[0];
                const removedMemberName = removedMember.name;
                if (roomMembers[room].length === 0) {
                    delete roomMembers[room];
                    delete roomConditions[room];
                } else {
                    if (socket.id === roomConditions[room].roomOwner) {
                        // Assign new owner
                        roomConditions[room].roomOwner =
                            roomMembers[room][0].id;
                    }

                    // If the removed member was the currently drawing user
                    if (
                        socket.id ===
                        roomMembers[room][
                            roomConditions[room]?.currentlyDrawing - 1
                        ]?.id
                    ) {
                        // Update currently drawing user
                        const nextDrawingIndex =
                            roomConditions[room].currentlyDrawing %
                            roomMembers[room].length;
                        roomConditions[room].currentlyDrawing =
                            nextDrawingIndex + 1;
                    }

                    // Notify all users in the room
                    io.to(room).emit(
                        "recieve-connected-users",
                        roomMembers[room]
                    );
                    io.to(room).emit("recieve-message", {
                        name: removedMemberName,
                        message: `${removedMemberName} left the room`,
                        category: "left",
                    });

                    // Update game conditions for all users
                    const whoIsDrawing =
                        roomMembers[room][
                            roomConditions[room]?.currentlyDrawing - 1
                        ];
                    io.to(room).emit("update-game-conditions", {
                        wordChosen: roomConditions[room]?.wordChosen,
                        currentlyDrawing: whoIsDrawing,
                        totalRounds: roomConditions[room]?.rounds,
                        totalDrawTime: roomConditions[room]?.drawTime,
                        currentRound: roomConditions[room]?.currentRound,
                        currentWordLength:
                            roomConditions[room]?.correctAns?.length || 0,
                        roomOwner: roomConditions[room].roomOwner,
                        isGameStarted: roomConditions[room]?.isGameStarted,
                        showWaitingScreen:
                            roomConditions[room]?.showWaitingScreen,
                        showingResults: roomConditions[room]?.showingResults,
                    });

                }
            }
        }
    });
});

module.exports = { app, server };
