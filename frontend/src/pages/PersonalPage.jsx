import { useParams ,useLocation ,useNavigate} from "react-router-dom";
import { useEffect , useState } from "react";
import { Send } from "lucide-react"; // if you have lucide-react (recommended)
import axios from "axios";
import socket from "../../socket.js";
import { Avatar , Button} from "flowbite-react";
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
  const own_id = data.own_id;
  let chatlist_length=0;


  async function init_list(res) {
    return new Promise((resolve,reject)=>{
      try{
        let initial_chat_list=[];
        chatlist_length = res.data.length;
        for(let idx=0 ; idx <res.data.length ; idx+=1){

        let str = res.data[idx].message;
        let chat_time = res.data[idx].chat_time;
        let chat_state = res.data[idx].state;
        let id = res.data[idx].id;
        //user_id here is others id from the contact list , not yours
        const name = (res.data[idx].sender_id == user_id) ? contact_name : "You";

          if(name == "You"){
          initial_chat_list.push({message : str , side : "right" , chat_time: chat_time , chat_state : chat_state , chat_id : id});
          }

          else{
          initial_chat_list.push({message : str , side : "left", chat_time: chat_time , chat_state : chat_state , chat_id : id});
          }

        
      }
      //console.log(initial_chat_list);
      //console.log("****",user_id);
      //console.log(res.data);
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
        console.log("*******",res);
        //i think below line was the cause of breakpoint
        const initial_chat_list = await init_list(res);//Promise to copy message field to list , see the logic in function body
      }
      catch(err){
        setError("Problem from backend response");
      }

    };
    fetchChats();
    // --- SOCKET JOIN ROOM ---
    console.log(typeof connection_id , "and" , typeof own_id);
    socket.emit("joinRoom", [connection_id , own_id]);

    socket.emit("update_blue_tick" , [connection_id , own_id]);

    socket.on("receive_blue_tick" , (data) => {

      console.log(data.user_id ," == ",user_id," && ",data.connection_id," == ",connection_id);

      if(data.user_id == user_id && data.connection_id == connection_id){

        setResult( result => 
          result.map( ele =>
            ({ 
              ...ele , 
              chat_state:"read" 
            })
         )
        );
        
      }
    });

    socket.on("receive_single_blue_tick" , (data) => {

        console.log(data.user_id ," == ",user_id," && ",data.connection_id," == ",connection_id," && ",data.chat_id);

          if(data.user_id == user_id && data.connection_id == connection_id){

            setResult( result => 
              result.map( ele =>
                (ele.chat_id == data.chat_id)?
                { 
                  ...ele , 
                  chat_state:"read" 
                }: ele
            )
            );
            
          }
      });

    // --- SOCKET RECEIVE MESSAGE ---
    socket.on("newMessage", (msg) => {
      console.log("message receieved in personalpage with socket id : ",socket.id," is ",msg);
      let name = "You";
      let chatId = msg.chat_id;
      console.log("chatid ::::::",chatId);
      if(msg.sender_id != own_id){
        name = msg.sender_name;
        msg.chat_state = "read";// make this as read because initially it was "received and now change this as sender id is not this user"
      }

      //set this message as read
      const readChats = async () => {
      try{
        const res = await axios.post(`http://localhost:3000/api/personalpage/${connection_id}`);
        //console.log("*******",res);
      }
      catch(err){
        setError("Problem from backend response - readchat");
      }

      };


      if(name == "You"){ //message by you
        //{message : name + " : " + str , side : "left", chat_time: chat_time}
        setResult((prev) => [...prev, {message : msg.message , side : "right" , chat_time: msg.chat_time , chat_state : msg.chat_state , chat_id : msg.chat_id}]);
      }
      else{ //message by other
        readChats();// update because you are reading other message thats why it marked to be "read"
        chatlist_length = result.length;
        setResult((prev) => [...prev, {message : msg.message , side : "left" , chat_time: msg.chat_time , chat_state : msg.chat_state , chat_id : msg.chat_id}]);
        console.log("************ sending single blue tick ****************");

        if(chatId){

        socket.emit("update_single_blue_tick" , [connection_id , own_id , chatId]);
        }

      }

    });

    return () => {
      socket.off("receive_blue_tick");
      socket.off("newMessage");
      socket.off("receive_single_blue_tick");
    };
  }, []);



  const handleSend = async () => {
    if(message == "" || message == null)return;
    try{
      const res = await axios.post(`http://localhost:3000/api/personalpage/${user_id}/${connection_id}`,{message : message , chat_time: getCurrentMySQLDateTime()});
      console.log(own_id,"iiiiiiiii",res.data);
      socket.emit("sendMessage", {
        room: connection_id,
        message: message,
        sender_id: own_id,//handleSend is firing through this so sender_id is own_id
        sender_name: res.data.sender_name,
        chat_time: res.data.chat_time,
        receiver_name: res.data.receiver_name,
        chat_state: res.data.chat_state,
        chat_id: res.data.chat_id
      });

      setMessage("");

      
    } 
    catch(err){
        //console.log(err);
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

<div
  className="flex-1 overflow-y-auto p-4 space-y-3 bg-cover bg-center bg-no-repeat"
  style={{
    backgroundImage: "url('https://images.wallpaperscraft.com/image/single/astronaut_art_space_129529_1080x1920.jpg')",
  }}
>
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

        {/* 🔹 CONTACT NAME INSIDE BUBBLE */}
        <div className="text-xs font-bold text-gray-700 mb-1">
          {obj.side === "right" ? "You" : contact_name}
        </div>

        {/* 🔹 MESSAGE TEXT */}
        <div className="text-gray-900 text-[15px] leading-snug">
          {obj.message}
        </div>

        {/* 🔹 TIME AND TICK */}
        <div className="flex items-center justify-end gap-1 text-[11px] text-gray-600 mt-1">
          <span>{obj.chat_time}</span>

          {obj.side === "right" && (
          <span className="relative inline-block w-[18px] h-[14px] ml-1">
            {/* first tick */}
            <span
              className={`absolute left-0 top-0 text-[14px] leading-none ${
                obj.chat_state === "received"
                  ? "text-gray-500"
                  : "text-blue-600"
              }`}
            >
              ✓
            </span>

            {/* second tick (slightly shifted) */}
            <span
              className={`absolute left-[5px] top-0 text-[14px] leading-none ${
                obj.chat_state === "received"
                  ? "text-gray-500"
                  : "text-blue-600"
              }`}
            >
              ✓
            </span>
          </span>
        )}

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
