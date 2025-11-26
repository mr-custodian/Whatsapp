import ChatList from "../components/ChatList";

export default function MainPage() {
  return (
    <div className="h-screen w-full bg-gray-100 flex">

      {/* LEFT Sidebar (Chats) */}
      <div className="w-1/3 bg-white border-r shadow-md">
        
        {/* Header */}
        <div className="p-4 bg-green-600 text-white font-semibold text-lg flex items-center">
          WhatsApp
        </div>

        {/* Chat List */}
        <ChatList />
      </div>

      {/* RIGHT panel (Blank for now) */}
      <div className="flex-1 bg-gray-200 flex items-center justify-center text-gray-600">
        Select a chat to start messaging
      </div>
    </div>
  );
}
