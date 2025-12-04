import ChatList from "../components/ChatList";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { MoreVertical } from "lucide-react";


export default function MainPage() {
  const { user_id } = useParams();
  console.log("ccc",user_id);
  const [openMenu , setOpenMenu ] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full bg-gray-100 flex">

      {/* LEFT Sidebar (Chats) */}
      <div className="w-1/3 bg-white border-r shadow-md">
        
        {/* Header */}
          <div className="p-4 bg-green-600 text-white font-semibold text-lg flex items-center justify-between">
            {/* 3-dot menu */}
            <MoreVertical
              className="w-6 h-6 cursor-pointer"
              onClick={() => setOpenMenu(!openMenu)}
            />
            {/* Popup Menu */}
            {openMenu && (
              <div className="absolute top-14 left-4 bg-white text-black shadow-lg rounded-md w-40 z-50">

                <div
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => {
                    setOpenMenu(false);
                    navigate("/add-connection");
                  }}
                >
                  Add Connection
                </div>

                <div
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => {
                    setOpenMenu(false);
                    navigate("/new-group");
                  }}
                >
                  New Group
                </div>

                <div
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => {
                    setOpenMenu(false);
                    navigate("/settings");
                  }}
                >
                  Settings
                </div>

              </div>
            )}
            {/* Title */}
            <div>WhatsApp</div>

            {/* Right side empty for spacing (optional) */}
            <div className="w-6"></div>
          </div>
        
        {/* Chat List */}
        <ChatList connectionId={user_id} />
      </div>

    </div>
  );
}
