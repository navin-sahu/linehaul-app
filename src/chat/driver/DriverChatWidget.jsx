import { useState } from "react";
import ChatFab from "../components/ChatFab";
import ChatBox from "../components/ChatBox";
import { mockMessages } from "../data/mockMessages";

const DriverChatWidget = ({ driverId }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <ChatFab onClick={() => setOpen(!open)} />
      {open && (
        <ChatBox
          title="Admin Support"
          messages={mockMessages[driverId] || []}
        />
      )}
    </>
  );
};

export default DriverChatWidget;
