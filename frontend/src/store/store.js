import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice";
import gameConditionReducer from "../features/gameConditionSlice";
export const store = configureStore({
    reducer: {
        user: userReducer,
        gameCondition: gameConditionReducer,
    },
});
