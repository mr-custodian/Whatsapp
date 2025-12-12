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

async function SQLexec2(query,[connection_id , chat_time , message] ){
    return new Promise((resolve,reject)=>{
        db.query(query , [connection_id , chat_time , message] ,(err,results) => {

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

async function SQLfind_reciever_id(query_find_reciever_data, connection_id){
    return new Promise((resolve,reject)=>{
        db.query(query_find_reciever_data , [connection_id] ,(err,results) => {

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

    const query = "SELECT * FROM chats WHERE connection_id = ?";
    try {
    const result = await SQLexec1(query , connection_id);

    res.status(200).json(result);
    }
    catch(err){
        res.status(500).json(err);
    }
});

chatlist.post("/personalpage/:user_id/:connection_id" , async (req,res) => {
    const message =  req.body.message;
    const chat_time = req.body.chat_time;
    const {user_id,connection_id} = req.params;

    const query_find_reciever_data = "SELECT * FROM connection where id = ?"//put connection_id here to find reciever_id

    const query = "INSERT INTO chats (connection_id, chat_time, message) VALUES (?, ?, ?)";

    const query2 = "SELECT * FROM credentials WHERE id = ?";

    try{

    let sender_id = undefined;

    const sender_reciever_id = await SQLfind_reciever_id(query_find_reciever_data, connection_id);

    if(sender_reciever_id.user1_id == user_id)sender_id = sender_reciever_id.user2_id;
    else sender_id = sender_reciever_id.user2_id;
        
    const sender_data = await SQLexec3(query2, user_id);
    const reciever_data = await SQLexec3(query2, sender_id);

    console.log(reciever_data);

    const result = await SQLexec2(query , [connection_id , chat_time , user_id+":"+message]);//user_id is sender_id added to msg
    
    res.status(200).json({message : "successfully added chat to db" , sender_name : sender_data[0].NAME , chat_time : chat_time});

    }
    catch(err){
        res.status(500).json(err);
    }
});

export default chatlist;