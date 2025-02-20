import { io } from "socket.io-client";

const socket = io("https://calories-tracker-3opf.onrender.com");

export default socket;
