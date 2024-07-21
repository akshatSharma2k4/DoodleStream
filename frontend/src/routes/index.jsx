import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Hompepage from "../Components/Hompepage";
import CreateGame from "../Components/CreateGame";
import ScreenLayout from "../Components/ScreenLayout";
import Gameplay from "../Components/Gameplay/Gameplay";
import VideoCall from "../Components/VideoCall";
// import GameplayPage from "../Components/Gameplay";
// import GameLayout from "../Components/GameLayout";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                element: <Hompepage />,
            },
            {
                path: "create-game",
                element: <ScreenLayout />,
                children: [
                    {
                        path: "/create-game",
                        element: <CreateGame></CreateGame>,
                    },

                    {
                        path: "*",
                        element: <div>404</div>,
                    },
                ],
            },
            {
                path: "/vc",
                element: <VideoCall></VideoCall>,
            },
            {
                path: "*",
                element: <div>404</div>,
            },
        ],
    },
]);

export default router;
