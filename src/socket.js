import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // Ersetze localhost mit deiner Server-Adresse, falls nötig

export default socket;
