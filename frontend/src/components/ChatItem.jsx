import { useEffect } from "react";
import { Link } from "react-router-dom";


export default function ChatItem({ user_id ,connection_id , name, msg, time }) {
  return (
<div className="flex px-4 py-3 items-center cursor-pointer hover:bg-gray-200">
  {/* Profile Image */}
  <div className="w-14 h-14 rounded-full overflow-hidden mr-4">
    <img
      src="https://i.pravatar.cc/150"
      alt="profile"
      className="w-full h-full object-cover"
    />
  </div>

      {/* Chat Details */}
    <Link to={`/personalpage/${user_id}/${connection_id}`}>     
      <div className="flex-1 flex flex-col border-b border-gray-300 py-2">

        {/* Name + Time (same row) */}
        <div className="flex justify-between items-center ">
          <h3 className="font-semibold text-gray-900 text-lg">{name}</h3>
          <span className="text-xs text-gray-500">{time}</span>
        </div>

        {/* Message + Badge (same row) */}
        <div className="flex justify-between items-center mt-1">
          <p className="text-gray-600 text-sm truncate">{msg}</p>

          {/* Unread count (optional) */}
          <span className="ml-2 min-w-[22px] h-[22px] bg-green-500 text-white text-xs rounded-full flex items-center justify-center">
            3
          </span>
        </div>
        
      </div>
    </Link>
</div>
       
  );
}
