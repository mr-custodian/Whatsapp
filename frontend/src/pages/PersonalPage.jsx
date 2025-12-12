import { useParams ,useLocation } from "react-router-dom";
import { useEffect , useState } from "react";
import { Send } from "lucide-react"; // if you have lucide-react (recommended)
import axios from "axios";
import socket from "../../socket.js";


export default function PersonalPage() {
  const { user_id , connection_id } = useParams();
  const [message, setMessage] = useState("");
  const [error , setError] = useState(null);
  const [result, setResult] = useState([]);

  const location = useLocation();//catch data send with link from previous page
  const data = location.state;
  const contact_name = data.user_name;


  async function init_list(res) {
    return new Promise((resolve,reject)=>{
      try{
        let initial_chat_list=[];
        for(let idx=0 ; idx <res.data.length ; idx+=1){

        let str = res.data[idx].message;

        let name = "Hidden";

        if(str.split(":").length > 1){
          name = contact_name;
          if(str.split(":")[0] == user_id){
            name = "You";
          }
          if(name=="You"){
          initial_chat_list.push({message : name+" : "+str.split(":")[1] , side : "right"});
          }
          else{
          initial_chat_list.push({message : name+" : "+str.split(":")[1] , side : "left"});
          }
        }
        else{
          initial_chat_list.push({message : name+" : "+str.split(":")[0] , side : "left"});
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
        setResult((prev) => [...prev, {message : name + " : " + msg.message , side : "right"}]);
      }
      else{
        setResult((prev) => [...prev, {message : name + " : " + msg.message , side : "left"}]);
      }

    });

    return () => {
      socket.off("newMessage");
    };
  }, []);

  const handleSend = async () => {
    if(message == "" || message == null)return;
    try{
      const res = await axios.post(`http://localhost:3000/api/personalpage/${user_id}/${connection_id}`,{message : message});
      socket.emit("sendMessage", {
        room: connection_id,
        message: message,
        sender_id: user_id,
        sender_name: res.data.sender_name
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
        <h2 className="text-lg font-semibold">{contact_name}</h2>
      </div>

      {/* 🔹 CHAT WINDOW */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[url('https://images.wallpaperscraft.com/image/single/nature_lake_forest_167639_1080x1920.jpg')] bg-cover">

        {result?.map((obj, i) => (
          <div
            key={i}
            className={
              "px-4 py-2 rounded-lg shadow max-w-xs " +
              (obj.side === "right"
                ? "self-end bg-green-200 text-black"
                : "self-start bg-white text-black")
            }
          >
            {obj.message}
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
