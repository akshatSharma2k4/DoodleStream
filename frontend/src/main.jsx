import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes/index.jsx";
import { store } from "./store/store.js";
import { Provider } from "react-redux";
import { SocketProvider } from "./context/SocketContext.jsx";

import AgoraRTC, { AgoraRTCProvider } from "agora-rtc-react";
const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

ReactDOM.createRoot(document.getElementById("root")).render(
    <AgoraRTCProvider client={client}>
        <SocketProvider>
            <Provider store={store}>
                <RouterProvider router={router}>
                    <App />
                </RouterProvider>
            </Provider>
        </SocketProvider>
    </AgoraRTCProvider>
);
