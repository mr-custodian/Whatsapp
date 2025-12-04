import express from "express";
import db from "../db/connection.js";
//import { sign } from "jsonwebtoken";
import multer from "multer";
import storage from "../multer.js";


const signupRouter = express.Router();

const upload = multer({ storage: storage });//use multer for object upload(image here)

signupRouter.post("/signup",upload.single("dp"),(req,res)=>{

    const {username , password , gmail , mobile} = req.body;
    let dpPath;
    try{
    dpPath = req.file ? req.file.path : null;
    }
    catch(err){
        return res.status(500).json({ message: "Multer error , problem in storing dp" });
    }

    const query = "INSERT INTO credentials (name, password, gmail, mobile ,dp) VALUES (?,?,?,?,?)";

    db.query(query,[username,password,gmail,mobile,dpPath], (err,result)=>{
        if(err){
            console.log(err);
            return res.status(500).json({ message: "Server error" });
        }
        return res.json({ message: "Submission successful!" });
    });

});

export default signupRouter;