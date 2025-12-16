// socket.js
import { Server } from "socket.io";

let io = null;


export function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*", // allow all clients for development
    },
  });

  io.on("connection", (socket) => {
    console.log("🔥 User connected:", socket.id);

    // When frontend sends message
    socket.on("send_message", (data) => {
      console.log("📨 Message received:", data);

      // Broadcast to all users
      io.emit("receive_message", data);
    });

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });

    socket.on("joinRoom", ([room,user_id]) => {
      socket.join(room);
      console.log("User : ", user_id ,"has joined room : ", room);
    });

    socket.on("sendMessage", (data) => {
      console.log("reached to bCKEND",data);
      io.to(data.room).emit("newMessage", { message: data.message , sender_id: data.sender_id , sender_name: data.sender_name  , receiver_name: data.receiver_name , chat_time: data.chat_time});
    });

  });

  return io;
}

// Allow other files to send messages
export function getIO() {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
}
