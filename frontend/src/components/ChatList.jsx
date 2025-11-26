// src/components/ChatList.jsx
import ChatItem from "./ChatItem";

export default function ChatList() {
  const contacts = [
    { id:1 , name: "Rahul", msg: "Hey, what's up?", time: "10:23 AM" },
    { id:2 , name: "Sneha", msg: "See you tomorrow!", time: "09:11 AM" },
    { id:3 , name: "Ankit", msg: "Send me the files", time: "Yesterday" },
  ];

  return (
    <div className="overflow-y-auto h-[calc(100vh-64px)]">
        {contacts.map((c) => (
        <ChatItem key={c.time} {...c} />
        ))}

    </div>
  );
}
