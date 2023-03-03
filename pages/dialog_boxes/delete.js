import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import { DialogContent, DialogContentText } from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";

// Component used for deleting an instant sale listing
export default function DeleteDialog(props) {
  const [open, setOpen] = React.useState(false);

  // opening and closing the dialog box
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // handle logic here for deleting a listing

  return (
    <>
      <Button className="option" size="small" onClick={handleClickOpen}>
        Delete
      </Button>
      <Dialog
        className="dialog-container"
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle className="dialog-title" id="alert-dialog-title">
          Delete Listing for {props.title}?
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            className="dialog-content"
            id="alert-dialog-description"
          >
            This action cannot be undone
          </DialogContentText>
        </DialogContent>

        <DialogActions className="button-box">
          <Button className="confirm-option" onClick={handleClose}>
            Confirm
          </Button>
          <Button className="cancel-option" onClick={handleClose} autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
