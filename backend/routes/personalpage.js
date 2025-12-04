import db from "../db/connection.js";
import express from "express";

const chatlist = express.Router();

function getCurrentDate() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}


async function SQLexec1(query,id){
    return new Promise((resolve,reject)=>{
        db.query(query , [id],(err,results) => {

        if(err){
            reject({message : "Problem in chats table query"});
        }
        else{
            resolve(results);
        }
        }
        );
    });
}

async function SQLexec2(query,[connection_id , chatTime , message] ){
    return new Promise((resolve,reject)=>{
        db.query(query , [connection_id , chatTime , message] ,(err,results) => {

        if(err){
            reject({message : "Problem in chats table query"});
        }
        else{
            resolve(results);
        }
        }
        );
    });
}

async function SQLexec3(query2 , user_id){
    return new Promise((resolve,reject)=>{
        db.query(query2 , [user_id] ,(err,results) => {

        if(err){
            reject({message : "Problem in credentials table query"});
        }
        else{

            resolve(results);
        }
        }
        );
    });
}

chatlist.get("/personalpage/:user_id/:connection_id" , async (req, res)=>{

    const {connection_id} = req.params;
    //console.log(connection_id);
    const query = "SELECT * FROM chats WHERE connection_id = ?";
    try {
    const result = await SQLexec1(query , connection_id);

    //.log(result);
    res.status(200).json(result);
    }
    catch(err){
        console.log("ddddddddddddd");
        res.status(500).json(err);
    }
});

chatlist.post("/personalpage/:user_id/:connection_id" , async (req,res) => {
    const message =  req.body.message;
    const {user_id,connection_id} = req.params;
    const chatTime = getCurrentDate();
    console.log("frfrfrfrfr",message);
    const query = "INSERT INTO chats (connection_id, chat_time, message) VALUES (?, ?, ?)";

    const query2 = "SELECT NAME FROM credentials WHERE id = ?";

    try{
        
    const name = await SQLexec3(query2, user_id);

    console.log(name[0].NAME + " : " + message);
    const result = await SQLexec2(query , [connection_id , chatTime , name[0].NAME + " : " + message]);
    
    console.log("rrrrrrrr",result);
    res.status(200).json("successfully added chat to db");

    }
    catch(err){
        res.status(500).json(err);
    }
});

export default chatlist;