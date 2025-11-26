import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import loginRoutes from "./routes/login.js";
import signupRoutes from "./routes/signup.js"




const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", loginRoutes);
app.use("/api/auth", signupRoutes)

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
