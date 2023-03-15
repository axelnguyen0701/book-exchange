import ResponsiveAppBar from "./navbar";
import Contact from "./chat/contact";
import Incoming from "./chat/incoming";
import Outgoing from "./chat/outgoing";
import { Box } from "@mui/system";
import SendIcon from "@mui/icons-material/Send";
import { TextField } from "@mui/material";
import { useState, useContext, useEffect } from "react";
import { AppContext } from "./context/MetaContext";
import Gun from "gun";

// ACCOUNT 0 (4 on metamask)  DID: did:3:kjzl6cwe1jw145oneizhocrl2pdyswo1syoeat8jvebu3tkal14sbsax582ofgd
// ACCOUNT 0  (3 on metamask) did:3:kjzl6cwe1jw149qgb89y6j9mdwwd6mtdyhqfxi86cnlqutduos3gtn8xzsqvui0 // HARDCODED MESSAGE RECIPIENT FROM LISTING

// Page for messaging
export default function Messages() {
  const gun = Gun("http://localhost:8080/gun");
  const { ethID } = useContext(AppContext);
  const [selectedConversation, setSelectedConversation] = useState("test");
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageArray, setMessageArray] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messageUsers, setMessageUsers] = useState([]);
  const messagelist = [];
  const userBookTitles = [];

  // get users sent and recieved nodes
  const userNode = gun.get(ethID);
  const messagesSentNode = userNode.get("messagesSent");
  const messagesReceivedNode = userNode.get("messagesReceived");

  // create an array of all recieved messages
  messagesReceivedNode.map((message, id) => {
    messagelist.push(message);
  });

  // get sent messages
  messagesSentNode.map((message, id) => {
    messagelist.push(message);
  });

  console.log(messagelist);

  // create information needed for contact cards
  messagelist.forEach((message) => {
    if (message.to === ethID || message.from === ethID) {
      // include messages sent by the user
      const fromUser = message.from === ethID ? message.to : message.from;
      const bookTitle = message.bookTitle;
      const userBookTitle = { fromUser, bookTitle };
      if (
        !userBookTitles.some(
          (ubt) => ubt.fromUser === fromUser && ubt.bookTitle === bookTitle
        )
      ) {
        userBookTitles.push(userBookTitle);
      }
    }
  });

  // ENTER KEY MESSAGE SENDING
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && currentMessage !== "") {
      sendMessage({
        content: currentMessage,
      });
    }
  };

  return (
    <>
      <ResponsiveAppBar />
      <div className="message-container">
        <div className="users-container">
          {userBookTitles.map((userBookTitle, index) => (
            <Contact
              key={index}
              name={userBookTitle.fromUser}
              letter={userBookTitle.fromUser.charAt(0)}
              listing="ecks dee"
              selected={selectedContactId === index}
              onClick={() => {
                setSelectedContactId(index);
                setSelectedConversation(userBookTitle.fromUser);
                setSelectedContact(userBookTitle);
              }}
            />
          ))}
        </div>
        <div className="chat-container">
          <div className="chat-box">
            {messagelist
              .filter(
                (message) =>
                  message.from === selectedConversation ||
                  message.to === selectedConversation
              )
              .map((filteredMessage, index) => {
                if (filteredMessage.from === selectedConversation) {
                  return (
                    <Incoming key={index} content={filteredMessage.message} />
                  );
                } else {
                  return (
                    <Outgoing key={index} content={filteredMessage.message} />
                  );
                }
              })}
          </div>
          <div className="input-box">
            <Box sx={{ display: "flex", alignItems: "flex-end" }}>
              <TextField
                className="message-input"
                label="Type Message..."
                variant="standard"
                value={currentMessage}
                InputProps={{
                  disableUnderline: true,
                }}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <SendIcon
                sx={{ color: "action.active", mr: 1, my: 0.5 }}
                onClick={() =>
                  sendMessage({
                    content: currentMessage,
                  })
                }
              />
            </Box>
          </div>
        </div>
      </div>
    </>
  );
}
