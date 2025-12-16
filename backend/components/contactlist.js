import express from "express";
import db from "../db/connection.js";

const contactlist = express.Router();

// to find the connection where any of two is user_id
async function SQLexec1(query , user_id){
    return new Promise((resolve , reject)=>{
        db.query(query , [user_id , user_id],(err , results) => {
        if(err){
            reject({message: "SQL error in fetching from connection table"});
        }
        else{
            resolve(results);
        }
        }
        );
    });
}

//find credentials of all users
async function SQLexec2(query2){
    return new Promise((resolve,reject)=>{
    db.query(query2 , [],(err,results) => {
        if(err){
            reject({message: "SQL error in fetching from credentials table"});
        }
        else{
            //console.log(results);

            //res.status(200).json(results);   
            resolve(results);         
        }

    }
    );
    });
}

//find latest chats of all connections 

async function SQLexec3(query3){
    return new Promise((resolve,reject)=>{
    db.query(query3 , [],(err,results) => {
        if(err){
            reject({message: "SQL error in fetching from chats table"});
        }
        else{
            //console.log(results);

            //res.status(200).json(results);   
            resolve(results);         
        }

    }
    );
    });
}

contactlist.get("/:user_id", async (req,res)=>{ // id should be
    
    const {user_id} = req.params;
    console.log("user_id",user_id);

    let connections_user_id = new Map(); // map stores (user_ids , connection_id and latest chat info ) of all connections of this user

    const query = "SELECT * FROM connection WHERE user1_id = ? or user2_id=?";

    let connection = await SQLexec1(query,user_id);

    const query2 = "SELECT * FROM credentials";

    let credential = await SQLexec2(query2);

    const query3 = `with A as (SELECT c.*
                    FROM chats c
                    JOIN (
                        SELECT MAX(id) AS max_id
                        FROM chats
                        GROUP BY connection_id
                    ) t ON c.id = t.max_id ) ,

                    B as ( 
                    SELECT connection_id , sum(state = "received") as unread 
                    FROM chats
                    group by connection_id
                    )

                    select A.id,A.connection_id,A.chat_time,A.message,A.sender_id,A.receiver_id,A.state,B.unread
                    from A JOIN B 
                    on A.connection_id = B.connection_id
                    `;

    let latest_chats = await SQLexec3(query3);
    const latest_chats_map = new Map( latest_chats.map( x => [x.connection_id , x] )  );// now it has [connection_id, latest_chat_details]
    console.log(latest_chats_map);

    // stores all user_ids of connections to this user in map
    for(let x of connection){
        if(x.user1_id == user_id || x.user2_id == user_id){

            if(x.user1_id == user_id){
                connections_user_id.set(x.user2_id , latest_chats_map.get(x.id) );// x.id is connection id and we are obtaining latest details for it
            }
            else{
                connections_user_id.set(x.user1_id , latest_chats_map.get(x.id) );
            }

        }
    }

    let result=[];
    for(let x of credential){
        if( connections_user_id.get(x.id)!=null ){
            result.push({...x , latest_chat_info : connections_user_id.get(x.id)});
        }

    }
    console.log("@@@@@@@@@@@",result);
    res.status(200).json(result);

});
export default contactlist;