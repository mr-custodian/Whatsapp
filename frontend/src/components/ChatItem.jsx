import { useEffect , useState} from "react";
import { Link } from "react-router-dom";
import FormatChatTime from "../helper_functions/FormatChatTime.js"
import {FormatChatMessage , TruncateChatMessage} from "../helper_functions/FormatChatMessage.js";





export default function ChatItem({ own_id , user_id , dp , name , connection_id , msg , time , sender_id , receiver_id , chat_state ,unread_count}) {
  
  let full_message =  (sender_id == user_id ? name : "You" ) + " : " + msg;
  let side = (sender_id == own_id )? "right" : "left";


  return (
<div className="flex items-center px-4 py-3 border-b bg-white hover:bg-gray-100 cursor-pointer">
  {/* line 1 */}
  <img
    src={dp}
    alt="dp"
    className="w-12 h-12 rounded-full object-cover flex-shrink-0"
  />

  <Link
    to={`/personalpage/${user_id}/${connection_id}`}
    state={{ user_name: name, dp: dp, own_id: own_id }}
    className="flex-1 ml-3 block min-w-0"   // ⭐ KEY
  >
    {/* line 2 */}
    <div className="w-full">
      {/* line 3 */}
      <div className="flex items-center w-full">
        <h3 className="font-semibold text-black truncate">
          {name}
        </h3>

        {/* line 4 */}
        <span className="ml-auto text-xs text-gray-500 flex-shrink-0">
          {FormatChatTime(time)}
        </span>
      </div>

      <div className="flex items-center w-full">
        <p className="text-gray-600 text-sm truncate flex-1 min-w-0">
          {TruncateChatMessage(full_message)}
        </p>

        {unread_count > 0 && (
          <span className="ml-2 min-w-[22px] h-[22px] bg-green-500 text-white text-xs rounded-full flex items-center justify-center flex-shrink-0">
            {unread_count}
          </span>
        )}
      </div>
    </div>
  </Link>
</div>

       
  );
}
