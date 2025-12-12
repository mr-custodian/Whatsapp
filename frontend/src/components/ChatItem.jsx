import { useEffect } from "react";
import { Link } from "react-router-dom";


export default function ChatItem({ user_id ,connection_id , name, msg, time, dp}) {
  console.log(user_id ,connection_id , name, msg, time , dp );
  return (
<div className="flex items-center px-4 py-3 border-b bg-white hover:bg-gray-100 cursor-pointer">

  
      <img 
        src={dp} 
        alt="dp"
        className="w-12 h-12 rounded-full object-cover"
      />

      <Link 
      to={`/personalpage/${user_id}/${connection_id}`}
      state = {{user_name : name , dp : dp}}
      >
          <div className="flex-1 ml-3">
            <div className="flex justify-between">
              <h3 className="font-semibold text-black">{name}</h3>
              <span className="text-xs text-gray-500">{time}</span>
            </div>

            <div className="flex justify-between items-center">
              <p className="text-gray-600 text-sm truncate">{msg}</p>
              <span className="ml-2 min-w-[22px] h-[22px] bg-green-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </div>
          </div>
      </Link>
          

</div>
       
  );
}
