// src/components/ChatList.jsx
import ChatItem from "./ChatItem";
import axios from "axios";
import {useEffect ,useState} from "react";

export default function ChatList({user_id}) {

  //const [contacts, setContacts] = useState([]);
  const [contacts , setContacts] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchChats = async () => {
      try {
        //console.log(connectionId);
        const res = await axios.get(
          `http://localhost:3000/api/mainpage/${user_id}`
        );
        console.log(res.data);
        const formatted = res.data.map(item => ({
          user_id: item.id,
          connection_id : item.latest_chat_info.connection_id,
          name: item.name,
          msg: item.latest_chat_info.message ,
          time: item.latest_chat_info.chat_time,
          dp: item.dp
        }));

        setContacts(formatted);

        console.log("formatted", formatted);

        console.log(typeof res.data);
      } catch (err) {
        console.log(err);
        setError("Problem in chatlist");
      }
    };

    fetchChats();
  }, []);

  

  return (
    <div className="flex-1 overflow-y-auto bg-white">


        {contacts.map((c) => (
        <ChatItem key={c.user_id} {...c} />
        ))}


    </div>
  );
}
