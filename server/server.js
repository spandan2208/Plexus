import express from 'express';
import "dotenv/config";
import cors from 'cors';
import http from 'http'; 
import {connectDB} from './lib/db.js';
import userRouter from './routes/userRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import { Server } from 'socket.io';


const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
cors: {origin: "*"}
});
// Store online users
export const userSocketMap = {};
export { io };
// {userId: socketId}

io.on("connection", (socket) => {
const userId = socket.handshake.query.userId;
console.log("User connected: " , userId);

if (userId) userSocketMap[userId] = socket.id;  

// Emit online users to all connected clients
io.emit("getOnlineUsers", Object.keys(userSocketMap));

socket.on("disconnect", () => {
 console.log("User disconnected: ", userId);
delete userSocketMap[userId];
io.emit("getOnlineUsers", Object.keys(userSocketMap)); 
 });
});


app.use(express.json({limit: '6mb'}));
app.use(cors({
origin: process.env.CLIENT_URL || "http://localhost:5173",
credentials: true
}));

// Routes
app.use("/api/status", (req, res) => res.send("Server is live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// MongoDB connect
await connectDB();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log("Server is running on port: " + PORT));