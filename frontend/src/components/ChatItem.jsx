import { useEffect , useState} from "react";
import { Link } from "react-router-dom";



export default function ChatItem({ own_id , user_id , dp , name , connection_id , msg , time , sender_id , receiver_id , chat_state ,unread_count}) {
  
  let full_message =  (sender_id == user_id ? name : "You" ) + " : " + msg;


  return (
<div className="flex items-center px-4 py-3 border-b bg-white hover:bg-gray-100 cursor-pointer">

  
      <img 
        src={dp} 
        alt="dp"
        className="w-12 h-12 rounded-full object-cover"
      />

      <Link 
      to={`/personalpage/${user_id}/${connection_id}`}
      state = {{user_name : name , dp : dp , own_id : own_id}}
      >
          <div className="flex-1 ml-3">
            <div className="flex justify-between">
              <h3 className="font-semibold text-black">{name}</h3>
              <span className="text-xs text-gray-500">{time}</span>
            </div>

            <div className="flex justify-between items-center">
              <p className="text-gray-600 text-sm truncate">{full_message}</p>
              <span className="ml-2 min-w-[22px] h-[22px] bg-green-500 text-white text-xs rounded-full flex items-center justify-center">
                {unread_count}
              </span>
            </div>
          </div>
      </Link>
          

</div>
       
  );
}
