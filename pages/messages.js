import ResponsiveAppBar from "./navbar";
import Contact from "./chat/contact";
import Incoming from "./chat/incoming";
import Outgoing from "./chat/outgoing";
import { Box } from "@mui/system";
import SendIcon from "@mui/icons-material/Send";
import { TextField } from "@mui/material";
import { useState, useContext } from "react";
import { AppContext } from "./context/MetaContext";
import Gun from "gun";

// Page for messaging
export default function Messages() {
  const gun = Gun("http://localhost:8080/gun");
  const { ethID } = useContext(AppContext);
  const [selectedConversation, setSelectedConversation] = useState("test");
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [currentMessage, setCurrentMessage] = useState("");
  const [messagesSent, setMessagesSent] = useState(null);
  const [messagesRecieved, setMessagesRecieved] = useState("null");
  const [selectedContact, setSelectedContact] = useState(null);
  const [messageArray, setMessageArray] = useState([
    {
      from: "Michael",
      to: "User",
      content: "Hey want to meet at spiral stairs?",
    },
    {
      from: "User",
      to: "Michael",
      content: "Sure, that works for me",
    },
    {
      from: "Rick",
      to: "User",
      content:
        "I'm avaiable at 6pm to pick up the book. Does this work for you? If not I can do another day",
    },
    {
      from: "Michael",
      to: "User",
      content: "Cool see you soon",
    },
  ]);

  const userNode = gun.get(ethID);

  const handleContactClick = (id, name) => {
    setSelectedContactId(id);
    setSelectedConversation(name);
    setSelectedContact(name);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && currentMessage !== "") {
      sendMessage({
        content: currentMessage,
      });
    }
  };

  function sendMessage(data) {
    userNode
      .get("messagesSent")
      .set({ recipient: "to_someonee", message: data.content });

    userNode
      .get("messagesSent")
      .map()
      .once((messageNode) => {
        console.log("Message content:", messageNode.message);
      });
  }

  return (
    <>
      <ResponsiveAppBar />
      <div className="message-container">
        <div className="users-container">
          <Contact
            id="michael"
            name="Michael"
            listing="The C Programming Language"
            letter="M"
            selected={selectedContactId === "michael"}
            onClick={() => handleContactClick("michael", "Michael")}
          ></Contact>
          <Contact
            id="rick"
            name="Rick"
            listing="World History"
            letter="R"
            selected={selectedContactId === "rick"}
            onClick={() => handleContactClick("rick", "Rick")}
          ></Contact>
          <Contact
            id="sam"
            name="Sam"
            listing="Web Development"
            letter="S"
            selected={selectedContactId === "sam"}
            onClick={() => handleContactClick("sam", "Sam")}
          ></Contact>
          <Contact
            id="nick"
            name="Nick"
            listing="Chemistry"
            letter="N"
            selected={selectedContactId === "nick"}
            onClick={() => handleContactClick("nick", "Nick")}
          ></Contact>
          <Contact
            id="blake"
            name="Blake"
            listing="Biology"
            letter="B"
            selected={selectedContactId === "blake"}
            onClick={() => handleContactClick("blake", "Blake")}
          ></Contact>
          <Contact
            id="julie"
            name="Julie"
            listing="Calculus"
            letter="J"
            selected={selectedContactId === "julie"}
            onClick={() => handleContactClick("julie", "Julie")}
          ></Contact>
          <Contact
            id="john"
            name="John"
            listing="Criminology"
            letter="J"
            selected={selectedContactId === "john"}
            onClick={() => handleContactClick("john", "John")}
          ></Contact>
          <Contact
            id="dominic"
            name="Dominic"
            listing="Sociology"
            letter="D"
            selected={selectedContactId === "dominic"}
            onClick={() => handleContactClick("dominic", "Dominic")}
          ></Contact>
          <Contact
            id="camille"
            name="Camille"
            listing="Algebra"
            letter="C"
            selected={selectedContactId === "camille"}
            onClick={() => handleContactClick("camille", "Camille")}
          ></Contact>
          <Contact
            id="vivek"
            name="Vivek"
            listing="Algebra 2"
            letter="V"
            selected={selectedContactId === "vivek"}
            onClick={() => handleContactClick("vivek", "Vivek")}
          ></Contact>
        </div>
        <div className="chat-container">
          <div className="chat-box">
            {messageArray
              .filter(
                (message) =>
                  message.from === selectedConversation ||
                  message.to === selectedConversation
              )
              .map((filteredMessage, index) => {
                if (filteredMessage.from === selectedConversation) {
                  return (
                    <Incoming key={index} content={filteredMessage.content} />
                  );
                } else {
                  return (
                    <Outgoing key={index} content={filteredMessage.content} />
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
