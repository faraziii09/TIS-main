import { useState } from "react";
import ChatFooter from "../../components/chat/ChatFooter";
import ChatHeader from "../../components/chat/ChatHeader";
import ChatMessages from "../../components/chat/ChatMessages";

const Chat = () => {
  // 1. Create state to hold the search text
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex flex-col min-h-screen">
      {/* 2. Header gets the "Setter" to update text */}
      <ChatHeader onSearch={setSearchQuery} />
      
      {/* 3. Messages gets the "Value" to filter the list */}
      <ChatMessages searchQuery={searchQuery} />
      
      <ChatFooter />
    </div>
  );
};

export default Chat;