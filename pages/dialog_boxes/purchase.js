import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

// Component used for purchasing an instant sale listing
export default function PurchaseDialog(props) {
  const [open, setOpen] = React.useState(false);

  // handle opening and closing menu
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // add logic for purchasing a book here

  return (
    <>
      <Button className="option" size="small" onClick={handleClickOpen}>
        Buy
      </Button>
      <Dialog
        className="dialog-container"
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle className="dialog-title" id="alert-dialog-title">
          Confirm Purchase of {props.title}?
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            className="dialog-content"
            id="alert-dialog-description"
          >
            {props.pricing}$ will be charged to your account.
          </DialogContentText>
        </DialogContent>
        <DialogActions className="button-box">
          <Button className="confirm-option" onClick={handleClose}>
            Purchase
          </Button>
          <Button className="cancel-option" onClick={handleClose} autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
