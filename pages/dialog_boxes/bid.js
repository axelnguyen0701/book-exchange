import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { TextField } from "@mui/material";

// Component uused for placing a bid
export default function BidDialog(props) {
  const [open, setOpen] = React.useState(false);

  // handle opening and closing the menu
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // logic for placing a bid here

  return (
    <>
      <Button className="option" size="small" onClick={handleClickOpen}>
        Bid
      </Button>
      <Dialog
        className="dialog-container"
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle className="dialog-title" id="alert-dialog-title">
          Place bid for {props.title}?
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            className="dialog-content"
            id="alert-dialog-description"
          >
            Bid must be greater than the current highest of {props.pricing}$
          </DialogContentText>
          <TextField className="dialog-input" variant="outlined" />
        </DialogContent>
        <DialogActions className="button-box">
          <Button className="confirm-option" onClick={handleClose}>
            Place Bid
          </Button>
          <Button className="cancel-option" onClick={handleClose} autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
