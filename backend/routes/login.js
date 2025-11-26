import express from "express";
import db from "../db/connection.js";

const loginRouter = express.Router();

// LOGIN API
loginRouter.post("/login", (req, res) => {
  const { username, password } = req.body;
    console.log({ username, password });
  const query = "SELECT * FROM credentials WHERE name = ? AND password = ?";
  db.query(query, [username, password], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.json({ message: "Login successful!" });
  });
});

export default loginRouter;
