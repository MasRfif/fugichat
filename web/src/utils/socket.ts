import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // Ganti dengan domain backend kalau sudah di-deploy

export default socket;
