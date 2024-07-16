import { Stack } from "@mui/material";
import React from "react";

const WaitingPage = ({ category }) => {
    return (
        <Stack sx={{ width: "100%", height: "100%" }}>waiting {category}</Stack>
    );
};

export default WaitingPage;
