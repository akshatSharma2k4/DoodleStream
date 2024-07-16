import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    totalRounds: null,
    wordChosen: false,
    currentlyDrawing: null,
    totalDrawTime: null,
    currentRound: null,
    currentWordLength: null,
    hints: [],
    roomOwner: null,
    isGameStarted: false,
    showWaitingScreen: false,
};

export const gameConditionSlice = createSlice({
    name: "gameCondition",
    initialState,
    reducers: {
        setWordChosen: (state, action) => {
            state.wordChosen = action.payload;
        },
        setTotalRounds: (state, action) => {
            state.totalRounds = action.payload;
        },
        setCurrentlyDrawing: (state, action) => {
            state.currentlyDrawing = action.payload;
        },
        setTotalDrawTime: (state, action) => {
            state.totalDrawTime = action.payload;
        },
        setCurrentRound: (state, action) => {
            state.currentRound = action.payload;
        },
        setCurrentWordLength: (state, action) => {
            state.currentWordLength = action.payload;
        },
        addHints: (state, action) => {
            state.hints.push(action.payload);
        },
        setRoomOwner: (state, action) => {
            state.roomOwner = action.payload;
        },
        setIsGameStarted: (state, action) => {
            state.isGameStarted = action.payload;
        },
        setShowWaitingScreen: (state, action) => {
            state.showWaitingScreen = action.payload;
        },
        resetGameConditions: (state, action) => {
            return {
                totalRounds: null,
                wordChosen: false,
                currentlyDrawing: null,
                totalDrawTime: null,
                currentRound: null,
                currentWordLength: null,
                hints: [],
            };
        },
    },
});

export const {
    setTotalRounds,
    setWordChosen,
    setCurrentRound,
    setCurrentlyDrawing,
    setCurrentWordLength,
    setTotalDrawTime,
    addHints,
    setRoomOwner,
    resetGameConditions,
    setIsGameStarted,
    setShowWaitingScreen,
} = gameConditionSlice.actions;

export default gameConditionSlice.reducer;
