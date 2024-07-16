import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Hompepage from "../Components/Hompepage";
// import GameplayPage from "../Components/Gameplay";
// import GameLayout from "../Components/GameLayout";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Hompepage />,
    },
    {
        path: "create-game",
        element: <></>,
        children: [],
    },
]);

export default router;
