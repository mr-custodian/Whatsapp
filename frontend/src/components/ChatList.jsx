// src/components/ChatList.jsx
import ChatItem from "./ChatItem";
import axios from "axios";
import {useEffect ,useState} from "react";
import socket from "../../socket.js";


export default function ChatList({user_id}) {

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
          own_id: user_id,
          user_id: item.id,
          dp: item.dp,
          name: item.name,
          connection_id : item.latest_chat_info.connection_id,
          msg: item.latest_chat_info.message ,
          time: item.latest_chat_info.chat_time,
          sender_id: item.latest_chat_info.sender_id,
          receiver_id: item.latest_chat_info.receiver_id,
          chat_state : item.latest_chat_info.state,
          unread_count : item.latest_chat_info.unread // must be integer , SQL returned this
        }));

        setContacts(formatted);

        console.log("formatted", formatted);
        console.log("res.data", res.data);

        console.log(typeof res.data);
      } catch (err) {
        console.log(err);
        setError("Problem in chatlist");
      }
    };

    fetchChats();
  }, []);

  // joined all rooms
  useEffect(() => {
      if (contacts.length === 0) return;

      contacts.forEach(c => {
        socket.emit("joinRoom", [c.connection_id, c.own_id]);
        console.log(socket.id ,"->",c.connection_id , c);
      });
    }, [contacts.length]);

  useEffect(() => {
    const handler = (msg) => {
      console.log("message received", msg);

      setContacts(prevContacts =>
        prevContacts.map(chat =>
          chat.connection_id == msg.connection_id // msg.connection_id is string while other is integer
            ? {
                ...chat,
                msg: msg.message,
                unread_count: chat.unread_count + 1,
                time: msg.chat_time,
                sender_id: msg.sender_id,
                receiver_id: msg.receiver_id,
                chat_state: msg.chat_state
              }
            : chat
        )
      );
    };

    socket.on("newMessage", handler);

    return () => {
      socket.off("newMessage", handler);
    };
  }, []);



  

  return (
    <div className="flex-1 overflow-y-auto bg-white">


        {contacts.map((c) => (
        <ChatItem key={c.user_id} {...c} />
        ))}


    </div>
  );
}
