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

async function SQLexec2(query,[connection_id , chat_time , message, sender_id , receiver_id] ){
    return new Promise((resolve,reject)=>{
        db.query(query , [connection_id , chat_time , message, sender_id , receiver_id] ,(err,results) => {

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

async function SQLfind_receiver_id(query_find_receiver_data, connection_id){
    return new Promise((resolve,reject)=>{
        db.query(query_find_receiver_data , [connection_id] ,(err,results) => {

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
    // this user_id is receiver because the user that fire postAPI request with :user_id/:connection_id has :user_id of other

    const query_find_receiver_data = "SELECT * FROM connection where id = ?"//put connection_id here to find receiver_id

    const query = "INSERT INTO chats (connection_id, chat_time, message, sender_id, receiver_id) VALUES (?, ?, ?, ?, ?)";

    const query2 = "SELECT * FROM credentials WHERE id = ?";
    console.log(user_id,connection_id);

    try{

    //let receiver_id = undefined;

    const sender_receiver_id = await SQLfind_receiver_id(query_find_receiver_data, connection_id);
    
    console.log(sender_receiver_id);

    //if(sender_receiver_id.user1_id == user_id)receiver_id = sender_receiver_id.user2_id;
    //else receiver_id = sender_receiver_id.user2_id;
    // this user_id is receiver because the user that fire postAPI request with :user_id/:connection_id has :user_id of other

    const receiver_id = user_id;

    const sender_id = (sender_receiver_id[0].user1_id == receiver_id) ? sender_receiver_id[0].user2_id : sender_receiver_id[0].user1_id;
        
    const sender_data = await SQLexec3(query2, sender_id);//data of sender
    const receiver_data = await SQLexec3(query2, receiver_id);//data of receiver

    console.log("******",sender_data[0].name,receiver_data[0].name);
        console.log("******",sender_data,receiver_data);

    console.log([connection_id , chat_time , message , String(sender_id) , receiver_id]);

    const result = await SQLexec2(query , [connection_id , chat_time , message , String(sender_id) , receiver_id]);//user_id is sender_id added to msg
    
    res.status(200).json({message : "successfully added chat to db" , sender_name : sender_data[0].name , receiver_name : receiver_data[0].name ,chat_time : chat_time});

    }
    catch(err){
        res.status(500).json(err);
    }
});

export default chatlist;