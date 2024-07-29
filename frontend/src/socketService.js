// src/socketService.js
import { io } from "socket.io-client";
// Access environment variables
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const SOCKET_URL = backendUrl;

class SocketService {
    constructor() {
        this.socket = null;
        this.isConnected = false;
    }

    connect() {
        if (!this.socket) {
            this.socket = io(SOCKET_URL);

            this.socket.on("connect", () => {
                // console.log("Connected to socket server");
                this.isConnected = true;
            });

            this.socket.on("disconnect", () => {
                // console.log("Disconnected from socket server");
                this.isConnected = false;
            });
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.isConnected = false;
        }
    }

    on(event, callback) {
        if (this.socket) {
            this.socket.on(event, callback);
        }
    }

    emit(event, data) {
        if (this.socket) {
            this.socket.emit(event, data);
        }
    }

    getConnectionStatus() {
        return this.isConnected;
    }
}

const socketService = new SocketService();
export default socketService;
