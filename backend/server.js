import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import loginRoutes from "./routes/login.js";
import signupRoutes from "./routes/signup.js";
import mainpageRouter from "./routes/mainpage.js";
import personalpageRoutes from "./routes/personalpage.js";

import http from "http";
import { initSocket } from "./socket.js";


const app = express();

// Create http server
const server = http.createServer(app);

// Initialize sockets
initSocket(server);

app.use(cors());
app.use(express.json());

app.use("/api/auth", loginRoutes);
app.use("/api/auth", signupRoutes);
app.use("/api",mainpageRouter);
app.use("/api",personalpageRoutes);


server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
