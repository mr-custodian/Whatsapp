import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});
console.log(process.env.DB_NAME);

db.connect((err) => {
  if (err) {
    console.log("MySQL connection failed:", err);
  } else {
    console.log("Connected to MySQL!");
  }
});

export default db;
