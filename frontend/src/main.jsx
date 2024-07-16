import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes/index.jsx";
import { store } from "./store/store.js";
import { Provider } from "react-redux";
import { SocketProvider } from "./context/SocketContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <SocketProvider>
        <Provider store={store}>
            <RouterProvider router={router}>
                <App />
            </RouterProvider>
        </Provider>
    </SocketProvider>
);
