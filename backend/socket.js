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
    console.log("🔥 User connected to socket with socket id:", socket.id);

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
      const Room = String(room);
      socket.join(Room); // convert to string 
      console.log("socket : " , socket.id , "User : ", user_id ,"has joined room : ", Room , "with type " , typeof Room );
    });

    socket.on("sendMessage", (data) => {
      console.log("reached to bCKEND with socket id : " , socket.id , "data",data);
      io.to(String (data.room) ).emit("newMessage", { connection_id : data.room , message: data.message , 
        sender_id: data.sender_id , sender_name: data.sender_name  , receiver_name: data.receiver_name , 
        chat_time: data.chat_time , chat_state: data.chat_state , chat_id: data.chat_id});
    });

    socket.on("update_blue_tick" ,([room,user_id])=>{
      console.log("socket : " , socket.id ," received update from user_id : ",user_id, "now firing this to other user so that it can see update blue tick because user with own_id read all");
      io.to(String(room)).emit("receive_blue_tick",{connection_id: room , user_id : user_id});
    });

    socket.on("update_single_blue_tick" ,([room,user_id,chat_id])=>{
      console.log("**********single - socket : " , socket.id ," received update from user_id : ",user_id, "now firing msg with id = ",chat_id," to other user so that it can see update blue tick because user with own_id read all");
      io.to(String(room)).emit("receive_single_blue_tick",{connection_id: room , user_id : user_id , chat_id: chat_id });
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
