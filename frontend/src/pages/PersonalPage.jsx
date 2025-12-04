import { useParams } from "react-router-dom";
import { useEffect , useState } from "react";
import { Send } from "lucide-react"; // if you have lucide-react (recommended)
import axios from "axios";

export default function PersonalPage() {
  const { user_id , connection_id } = useParams();
  const [message, setMessage] = useState("");
  const [error , setError] = useState(null);
  const [result, setResult] = useState([]);
  console.log(user_id);
  useEffect(() => {
    const fetchChats = async () => {
      try{
        const res = await axios.get(`http://localhost:3000/api/personalpage/${user_id}/${connection_id}`);
        setResult(res.data);
        console.log("rrr");
      }
      catch(err){
        console.log(err);
        setError("Problem from backend response");
      }

    };
    fetchChats();
  },[]);

  const handleSend = async () => {
    if(message == "" || message == null)return;
    try{
      console.log("ffffff",message);
      const res = await axios.post(`http://localhost:3000/api/personalpage/${user_id}/${connection_id}`,{message : message});
      console.log("lllllll",...result);
      setResult((result) => [...result , {message : message}]);
      console.log("ssssssssssss",...result);
      setMessage("");
      console.log(message);
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
        <h2 className="text-lg font-semibold">{name}</h2>
      </div>

      {/* 🔹 CHAT WINDOW */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[url('https://i.imgur.com/6IUBq.png')] bg-cover">
        {/* Example messages */}
        <div className="self-start bg-white px-4 py-2 rounded-lg shadow max-w-xs">
          Hey! What's up?
        </div>

        <div className="self-end bg-green-200 px-4 py-2 rounded-lg shadow max-w-xs">
          All good! You tell?
        </div>

        <div className="self-end bg-green-200 px-4 py-2 rounded-lg shadow max-w-xs">
          {result?.map((obj, i) => (
            <div key={i}>{obj.message}</div>
          ))}
        </div>

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
