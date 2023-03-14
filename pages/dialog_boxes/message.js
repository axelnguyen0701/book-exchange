import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import { DialogContent, DialogContentText } from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import { TextField } from "@mui/material";
import { useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import { Box } from "@mui/system";

export default function MessageDialog(props) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [open, setOpen] = useState(false);

  // opening and closing the dialog box
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function sendMessage(message) {
    event.preventDefault();
    const newArray = [...messageArray, message];
    setMessageArray(newArray);
    setCurrentMessage("");
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
                from: "User",
                to: selectedConversation,
                content: currentMessage,
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
