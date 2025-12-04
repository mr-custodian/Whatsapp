import express from "express";
import db from "../db/connection.js";

const contactlist = express.Router();

async function SQLexec1(query,id){
    return new Promise((resolve,reject)=>{
        db.query(query , [id,id],(err,results) => {
        if(err){
            reject({message: "SQL error in fetching from connection table"});
        }
        else{
            //result1=results;
            //console.log(result1);

            resolve(results);
            //res.status(200).json(results);            
        }
        }
        );
    });
}

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

contactlist.get("/:id", async (req,res)=>{ // id should be user_id
    const {id} = req.params;
    const query = "SELECT * FROM connection WHERE user1_id = ? or user2_id=?";

    let connection=[];
    let result2=new Map();

    connection = await SQLexec1(query,id);

    const query2 = "SELECT * FROM credentials";

    let credential = await SQLexec2(query2);

    console.log(connection);
    console.log(credential);

    for(let x of connection){
        if(x.user1_id == id || x.user2_id == id){
            if(x.user1_id == id){
                result2.set(x.user2_id,x.id);
            }
            else{
                result2.set(x.user1_id,x.id);
            }
        }
        //result2.set(x.id,x.name);
    }
    //console.log(result2);
    let result=[];
    for(let x of credential){
        if(result2.get(x.id)!=null){
            result.push({...x , connectionId : result2.get(x.id)});
        }

    }
    console.log(result);
    res.status(200).json(result);

});
export default contactlist;