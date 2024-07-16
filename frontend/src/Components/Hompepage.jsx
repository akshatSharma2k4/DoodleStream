import { Stack } from "@mui/material";
import React from "react";

const Hompepage = () => {
    const generateRoomCode = () => {
        return generateUniqueId({
            length: 8,
            useLetters: true,
        });
    };
    return <Stack>hello world</Stack>;
};

export default Hompepage;
