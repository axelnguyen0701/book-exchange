import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import { DialogContent, DialogContentText } from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import { TextField } from "@mui/material";

// Component used for editing a listing
export default function EditDialog(props) {
  // handle logic for opening and closing
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // add logic here for editing a listing

  return (
    <>
      <Button className="option" size="small" onClick={handleClickOpen}>
        Edit
      </Button>
      <Dialog
        className="dialog-container"
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle className="dialog-title" id="alert-dialog-title">
          Edit Listing for {props.title}?
        </DialogTitle>
        <DialogContent>
          <div className="input-container">
            <Typography
              className="search-header"
              gutterBottom
              variant="h5"
              component="div"
              fontWeight="bold"
              marginTop={"5%"}
            >
              Book Title
            </Typography>
            <TextField
              className="create-input"
              id="outlined-basic"
              variant="outlined"
              value={props.title}
            />
            <Typography
              className="search-header"
              gutterBottom
              variant="h5"
              component="div"
              fontWeight="bold"
            >
              Author
            </Typography>
            <TextField
              className="create-input"
              id="outlined-basic"
              variant="outlined"
              value={props.author}
            />
            <Typography
              className="search-header"
              gutterBottom
              variant="h5"
              component="div"
              fontWeight="bold"
            >
              ISBN
            </Typography>
            <TextField
              className="create-input"
              id="outlined-basic"
              variant="outlined"
              value={props.isbn}
            />
            <Typography
              className="search-header"
              gutterBottom
              variant="h5"
              component="div"
              fontWeight="bold"
            >
              Courses
            </Typography>
            <TextField
              className="create-input"
              id="outlined-basic"
              variant="outlined"
              value={props.courses}
            />
          </div>
        </DialogContent>

        <DialogActions className="button-box">
          <Button className="confirm-option" onClick={handleClose}>
            Update
          </Button>
          <Button className="cancel-option" onClick={handleClose} autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
