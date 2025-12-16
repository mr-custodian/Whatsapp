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

async function SQLexec_read_all_chat(query_read_all_chat,[chat_state , connection_id]){
    return new Promise((resolve,reject)=>{
        db.query(query_read_all_chat , [chat_state , connection_id],(err,results) => {

        if(err){
            reject({message : "Problem in chats state update table query"});
        }
        else{
            resolve(results);
        }
        }
        );
    });
}

async function SQLexec2(query,[connection_id , chat_time , message, sender_id , receiver_id , chat_state] ){
    return new Promise((resolve,reject)=>{
        db.query(query , [connection_id , chat_time , message, sender_id , receiver_id , chat_state] ,(err,results) => {

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

    const {user_id , connection_id} = req.params; // user_id is others id
    const chat_state = "read";

    const query_read_all_chat = `UPDATE chats SET state = ? WHERE connection_id = ? AND state = "received"`;
    const query = "SELECT * FROM chats WHERE connection_id = ?";

    try {
    const result = await SQLexec1(query , connection_id);

    console.log(result[result.length - 1]);
    if(result[result.length - 1].sender_id == user_id ){ // if last message sender is other then there may be chance of unread msg
        const update_read = await SQLexec_read_all_chat(query_read_all_chat,[chat_state , connection_id]);
    }
    //console.log("ffffffffffff",result);

    res.status(200).json(result);
    }
    catch(err){
        res.status(500).json(err);
    }
});

chatlist.post("/personalpage/:user_id/:connection_id" , async (req,res) => {
    const message =  req.body.message;
    const chat_time = req.body.chat_time;
    const chat_state = "received";
    const {user_id,connection_id} = req.params;
    // this user_id is receiver_id because the user that fire postAPI request with :user_id/:connection_id has :user_id of other

    const query_find_receiver_data = "SELECT * FROM connection where id = ?"//put connection_id here to find sender_id

    const query = "INSERT INTO chats (connection_id, chat_time, message, sender_id, receiver_id, state) VALUES (?, ?, ?, ?, ?, ?)";

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

    const result = await SQLexec2(query , [connection_id , chat_time , message , String(sender_id) , receiver_id , chat_state]);//user_id is sender_id added to msg
    
    res.status(200).json({message : "successfully added chat to db" , sender_name : sender_data[0].name , receiver_name : receiver_data[0].name ,chat_time : chat_time});

    }
    catch(err){
        res.status(500).json(err);
    }
});

chatlist.post("/personalpage/:connection_id" , async (req,res) => {
    const {connection_id} = req.params; // user_id is others id
    const chat_state = "read";

    const query_read_all_chat = `UPDATE chats SET state = ? WHERE connection_id = ? AND state = "received"`;
    try{
        const update_read = await SQLexec_read_all_chat(query_read_all_chat,[chat_state , connection_id]);
        console.log("jjjjjjjjjjjjjjjjjjjjj",update_read);
        res.status(200).json(update_read);
    }
    catch(err){
        res.status(500).json(err);
    }
});


export default chatlist;