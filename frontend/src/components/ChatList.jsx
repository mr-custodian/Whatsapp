// src/components/ChatList.jsx
import ChatItem from "./ChatItem";
import axios from "axios";
import {useEffect ,useState} from "react";



  const contacts_temp = [
    { user_id:1 , connection_id:101 ,name: "Rahul", msg: "Hey, what's up?", time: "10:23 AM" },
    { user_id:2 , connection_id:102 ,name: "Sneha", msg: "See you tomorrow!", time: "09:11 AM" },
    { user_id:3 , connection_id:103 ,name: "Ankit", msg: "Send me the files", time: "Yesterday" },
  ];
  
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
        console.log("formatted", formatted);
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
    <div className="flex-1 overflow-y-auto bg-white">


        {contacts.map((c) => (
        <ChatItem key={c.user_id} {...c} />
        ))}


    </div>
  );
}
/*

        {contacts.map((c) => (
        <ChatItem key={c.user_id} {...c} />
        ))}

*/