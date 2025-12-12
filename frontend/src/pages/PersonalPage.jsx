import { useParams ,useLocation ,useNavigate} from "react-router-dom";
import { useEffect , useState } from "react";
import { Send } from "lucide-react"; // if you have lucide-react (recommended)
import axios from "axios";
import socket from "../../socket.js";
import { Avatar } from "flowbite-react";

import { Button } from "flowbite-react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";



function getCurrentMySQLDateTime() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // 01–12
  const day = String(now.getDate()).padStart(2, "0");

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


export default function PersonalPage() {
  const { user_id , connection_id } = useParams();
  const [message, setMessage] = useState("");
  const [error , setError] = useState(null);
  const [result, setResult] = useState([]);
  const navigate = useNavigate();

  const location = useLocation();//catch data send with link from previous page
  const data = location.state;
  const contact_name = data.user_name;
  const dp = data.dp;


  async function init_list(res) {
    return new Promise((resolve,reject)=>{
      try{
        let initial_chat_list=[];
        for(let idx=0 ; idx <res.data.length ; idx+=1){

        let str = res.data[idx].message;
        let chat_time = res.data[idx].chat_time;
        let name = "Hidden";

        if(str.split(":").length > 1){
          name = contact_name;
          if(str.split(":")[0] == user_id){
            name = "You";
          }
          if(name=="You"){
          initial_chat_list.push({message : name+" : "+str.split(":")[1] , side : "right" , chat_time: chat_time});
          }
          else{
          initial_chat_list.push({message : name+" : "+str.split(":")[1] , side : "left", chat_time: chat_time});
          }
        }
        else{
          initial_chat_list.push({message : name+" : "+str.split(":")[0] , side : "left", chat_time: chat_time});
        }
        
      }
      setResult(initial_chat_list);
      resolve(initial_chat_list);
    }
    catch(err){
      reject(err);
    }
    });

  }

  useEffect(() => {
    const fetchChats = async () => {
      try{
        const res = await axios.get(`http://localhost:3000/api/personalpage/${user_id}/${connection_id}`);
        //i think below line was the cause of breakpoint
        const initial_chat_list = await init_list(res);//Promise to copy message field to list , see the logic in function body
      }
      catch(err){
        setError("Problem from backend response");
      }

    };
    fetchChats();
    // --- SOCKET JOIN ROOM ---
    socket.emit("joinRoom", [connection_id , user_id]);

    // --- SOCKET RECEIVE MESSAGE ---
    socket.on("newMessage", (msg) => {
      let name = "You";
      if(msg.sender_id != user_id){
        name = msg.sender_name;
      }

      if(name == "You"){
        setResult((prev) => [...prev, {message : name + " : " + msg.message , side : "right" , chat_time: msg.chat_time}]);
      }
      else{
        setResult((prev) => [...prev, {message : name + " : " + msg.message , side : "left" , chat_time: msg.chat_time}]);
      }

    });

    return () => {
      socket.off("newMessage");
    };
  }, []);

  const handleSend = async () => {
    if(message == "" || message == null)return;
    try{
      const res = await axios.post(`http://localhost:3000/api/personalpage/${user_id}/${connection_id}`,{message : message , chat_time: getCurrentMySQLDateTime()});
      socket.emit("sendMessage", {
        room: connection_id,
        message: message,
        sender_id: user_id,
        sender_name: res.data.sender_name,
        chat_time: res.data.chat_time
      });

      setMessage("");
    } 
    catch(err){
        console.log(err);
        setError("Problem from backend response during send");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">

      {/* 🔹 TOP BAR */}
      <div className="bg-green-600 text-white px-4 py-3 flex items-center shadow">
          {/* Back Button */}
          <Button
            onClick={() => navigate(-1)}
            pill
            className="w-10 h-10 p-0 flex items-center justify-center bg-transparent hover:bg-gray-200/40 shadow-none border-none"
          >
            <ArrowLeftIcon className="w-5 h-5 text-white" />
          </Button>


          {/* Avatar */}
          <div className="flex flex-wrap gap-2">
            <Avatar img="https://img.freepik.com/premium-vector/young-man-avatar-character-due-avatar-man-vector-icon-cartoon-illustration_1186924-4438.jpg?semt=ais_hybrid&w=740&q=80"
            alt="avatar of Jese" rounded />
          </div>

          {/* Contact Name */}
          <h2 className="text-lg font-semibold ml-3">{contact_name}</h2>
          
      </div>

    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-100">
      {result?.map((obj, i) => (
        <div
          key={i}
          className={`flex w-full ${
            obj.side === "right" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`px-3 py-2 rounded-lg shadow max-w-[75%] relative
              ${obj.side === "right" ? "bg-green-200" : "bg-white"}`}
          >
            {/* Message */}
            <div className="text-gray-900 text-[15px] leading-snug">
              {obj.message}
            </div>

            {/* Time */}
            <div className="text-[11px] text-gray-600 mt-1 text-right">
              {obj.chat_time}
            </div>
          </div>
        </div>
      ))}
    </div>



      {/* 🔹 MESSAGE INPUT BAR */}
      <div className="px-3 py-3 bg-white flex items-center gap-3 shadow-lg">
        <input
          type="text"
          placeholder="Type a message"
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button 
          onClick={handleSend}
          className="bg-green-600 text-white w-10 h-10 rounded-full flex items-center justify-center">
          <Send size={20} />
        </button>

      </div>

    </div>
  );
}
