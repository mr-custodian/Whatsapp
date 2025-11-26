import express from "express";
import db from "../db/connection.js";
//import { sign } from "jsonwebtoken";

const signupRouter = express.Router();

signupRouter.post("/signup",(req,res)=>{
    const {username , password , gmail , mobile} = req.body;
    const query = "INSERT INTO credentials (name, password, gmail, mobile) VALUES (?,?,?,?)";
    db.query(query,[username,password,gmail,mobile], (err,result)=>{
        if(err){
            console.log(err);
            return res.status(500).json({ message: "Server error" });
        }
        return res.json({ message: "Submission successful!" });
    });

});

export default signupRouter;