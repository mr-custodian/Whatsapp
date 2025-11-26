import { useParams } from "react-router-dom";
import { useState } from "react";
import { Send } from "lucide-react"; // if you have lucide-react (recommended)

export default function PersonalPage() {
  const { id } = useParams();
  const [message, setMessage] = useState("");

  // Dummy name for demo
  const name = "John Doe";

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

        <button className="bg-green-600 text-white w-10 h-10 rounded-full flex items-center justify-center">
          <Send size={20} />
        </button>
      </div>

    </div>
  );
}
