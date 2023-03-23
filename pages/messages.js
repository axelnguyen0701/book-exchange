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

// Page for messaging
export default function Messages() {
  const gun = Gun({
    peers: ["https://capserver.onrender.com/gun"],
  });

  const { ethID } = useContext(AppContext);
  const [selectedConversation, setSelectedConversation] = useState(""); // the eth ID of the selected contact
  const [selectedContactId, setSelectedContactId] = useState(null); // index of the selected contact for UI purposes
  const [currentMessage, setCurrentMessage] = useState(""); // message being typed
  const [currentBook, setCurrentBook] = useState("");

  const messagelist = [];
  const sentMessageList = [];
  const userBookTitles = [];

  // get users sent and recieved nodes
  const userNode = gun.get(ethID);
  const messagesSentNode = userNode.get("messagesSent");
  const messagesReceivedNode = userNode.get("messagesReceived");

  // create an array of all recieved messages
  messagesReceivedNode.map((message, id) => {
    console.log(message);
    messagelist.push(message);
  });

  // create an array of all sent messages
  messagesSentNode.map((message, id) => {
    messagelist.push(message);
  });

  messagelist.sort((a, b) => a.timestamp - b.timestamp);

  console.log(messagelist);
  // get sent messages

  // create information needed for contact cards
  messagelist.forEach((message) => {
    if (message.to === ethID) {
      const fromUser = message.from;
      const bookTitle = message.book;
      const userBookTitle = { fromUser, bookTitle };
      if (
        !userBookTitles.some(
          (ubt) => ubt.fromUser === fromUser && ubt.bookTitle === bookTitle
        )
      ) {
        userBookTitles.push(userBookTitle);
      }
    } else {
      const fromUser = message.to;
      const bookTitle = message.book;
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

  // sending a message

  function sendMessage(data) {
    // set message in user's messagesSent node
    const message = {
      to: data.to,
      from: data.from,
      message: data.message,
      book: data.book,
      timestamp: new Date().getTime(),
    };

    const userSentNode = userNode.get("messagesSent");
    userSentNode.set(message);

    userSentNode.once(() => {
      console.log("messagesSent updated with: " + message);
    });

    // set message in recipient's messagesReceived node
    const recipientNode = gun.get(data.to);
    const recipientReceivedNode = recipientNode.get("messagesReceived");
    recipientReceivedNode.set(message);

    recipientReceivedNode.once(() => {
      console.log("messagesReceived updated");
    });

    setCurrentMessage("");
  }

  // ENTER KEY MESSAGE SENDING
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && currentMessage !== "") {
      sendMessage({
        to: selectedConversation,
        from: ethID,
        message: currentMessage,
        book: currentBook,
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
              listing={userBookTitle.bookTitle}
              selected={selectedContactId === index}
              onClick={() => {
                setSelectedContactId(index);
                setSelectedConversation(userBookTitle.fromUser);
                setCurrentBook(userBookTitle.bookTitle);
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
                    to: selectedConversation,
                    from: ethID,
                    message: currentMessage,
                    book: currentBook,
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
