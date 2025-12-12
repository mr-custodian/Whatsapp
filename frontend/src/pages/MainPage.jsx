import ChatList from "../components/ChatList";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { MoreVertical } from "lucide-react";


export default function MainPage() {
  const { user_id } = useParams();
  const [openMenu , setOpenMenu ] = useState(false);
  const navigate = useNavigate();

  return  (
    <div className="h-screen w-full bg-gray-100 flex flex-col">

      {/* 🔹 HEADER */}
      <div className="bg-green-600 text-white px-4 py-3 flex items-center justify-between shadow">

        {/* Left — Title */}
        <h1 className="text-xl font-bold">WhatsApp</h1>


      </div>

      {/* 🔹 CHAT LIST (scrollable) */}
      <ChatList user_id={user_id} />

    </div>
  );
}

/*

      <div className="flex-1 overflow-y-auto bg-white">

        // Example contact item 
        <div className="flex items-center px-4 py-3 border-b bg-white hover:bg-gray-100 cursor-pointer">
          <div className="w-12 h-12 rounded-full bg-gray-300"></div>

          <div className="flex-1 ml-3">
            <div className="flex justify-between">
              <h3 className="font-semibold text-black">Mayank</h3>
              <span className="text-xs text-gray-500">10:45 AM</span>
            </div>

            <div className="flex justify-between items-center">
              <p className="text-gray-600 text-sm truncate">Hello, how are you?</p>
              <span className="ml-2 min-w-[22px] h-[22px] bg-green-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </div>
          </div>
        </div>

        // Duplicate this block to show more chat items 
        <div className="flex items-center px-4 py-3 border-b bg-white hover:bg-gray-100 cursor-pointer">
          <div className="w-12 h-12 rounded-full bg-gray-300"></div>

          <div className="flex-1 ml-3">
            <div className="flex justify-between">
              <h3 className="font-semibold text-black">Rohit</h3>
              <span className="text-xs text-gray-500">9:12 AM</span>
            </div>

            <div className="flex justify-between items-center">
              <p className="text-gray-600 text-sm truncate">Bro call me.</p>
            </div>
          </div>
        </div>

      </div>
    */ 