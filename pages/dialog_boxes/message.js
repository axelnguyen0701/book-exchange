import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import { DialogContent, DialogContentText } from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import { TextField } from "@mui/material";
import { useState } from "react";
import Gun from "gun";
import { Box } from "@mui/system";
import { useContext } from "react";
import { AppContext } from "../context/MetaContext";

export default function MessageDialog(props) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [open, setOpen] = useState(false);
  const { ethID, profile } = useContext(AppContext);
  const gun = Gun({
    peers: ["https://capserver.onrender.com/gun"],
  });

  const date = new Date();

  // opening and closing the dialog box
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function sendMessage(data) {
    // set message in user's messagesSent node
    const message = {
      to: data.to,
      from: data.from,
      message: data.message,
      book: data.book,
      timestamp: new Date().getTime(),
    };

    const userNode = gun.get(ethID);
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

    handleClose();
  }

  return (
    <>
      <Button className="option" size="small" onClick={handleClickOpen}>
        Message
      </Button>
      <Dialog
        className="dialog-container"
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle className="dialog-title" id="alert-dialog-title">
          Message Seller of {props.title}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", alignItems: "flex-end" }}>
            <TextField
              className="message-input"
              label="Type Message..."
              variant="standard"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
            />
          </Box>
        </DialogContent>

        <DialogActions className="button-box">
          <Button
            className="confirm-option"
            onClick={() =>
              sendMessage({
                to: "did:3:kjzl6cwe1jw146nppuppc5rxx39bu2552sv1kz770w3rjbw4cd0yazkpmge0ide",
                from: ethID,
                message: currentMessage,
                book: props.title,
              })
            }
          >
            Send
          </Button>
          <Button className="cancel-option" onClick={handleClose} autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
