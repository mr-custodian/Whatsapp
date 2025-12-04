// src/components/ChatList.jsx
import ChatItem from "./ChatItem";
import axios from "axios";
import {useEffect ,useState} from "react";


/*
  const contacts = [
    { id:1 , name: "Rahul", msg: "Hey, what's up?", time: "10:23 AM" },
    { id:2 , name: "Sneha", msg: "See you tomorrow!", time: "09:11 AM" },
    { id:3 , name: "Ankit", msg: "Send me the files", time: "Yesterday" },
  ];
  */
export default function ChatList({user_id}) {

  //const [contacts, setContacts] = useState([]);
  const [contacts , setContacts] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchChats = async () => {
      try {
        console.log(connectionId);
        const res = await axios.get(
          `http://localhost:3000/api/mainpage/${user_id}`
        );
        console.log("Fetched data:", res.data);
        //await func(res.data , contacts);
        const formatted = res.data.map(item => ({
          user_id: item.id,
          connection_id : item.connectionId,
          name: item.name,
          msg: "Hey, what's up?",
          time: "10:23 AM"
        }));

        setContacts(formatted);
        /*for(let i=0;i<res.data.length;i+=1){
          contacts.push({id:res.data[i].id , name: res.data[i].name , msg: "Hey, what's up?", time: "10:23 AM"})
        }*/
        console.log(contacts);
        //setContacts(res.data);   // store result in state

        console.log(typeof res.data);
      } catch (err) {
        console.log(err);
        setError("Problem in chatlist");
      }
    };

    fetchChats();
  }, []);

  

  return (
    <div className="overflow-y-auto h-[calc(100vh-64px)]">
        {contacts.map((c) => (
        <ChatItem key={c.user_id} {...c} />
        ))}

    </div>
  );
}
