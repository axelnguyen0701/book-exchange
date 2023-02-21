import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import DeleteDialog from "../dialog_boxes/delete";
import EditDialog from "../dialog_boxes/edit";

// This card is used for showing a user their own active listing
export default function MyListing(props) {
  return (
    <Card className="book-card" sx={{ maxWidth: 345 }}>
      <CardMedia sx={{ height: 290 }} image={props.imgurl} title="Book" />
      <CardContent className="info-box">
        <Typography
          className="title-text"
          gutterBottom
          variant="h5"
          component="div"
          fontWeight="bold"
        >
          {props.title}
        </Typography>
        <Typography
          className="info-text"
          variant="body2"
          color="text.secondary"
        >
          {props.author}
        </Typography>
        <Typography
          className="info-text"
          variant="body2"
          color="text.secondary"
        >
          {props.isbn}
        </Typography>
        <Typography
          className="info-text"
          variant="body2"
          color="text.secondary"
        >
          {props.courses}
        </Typography>
        <Typography
          className="price-text"
          variant="body2"
          color="text.secondary"
          fontWeight="bold"
        >
          Listed: {props.pricing}$ Retails: {props.retails}$
        </Typography>
      </CardContent>
      <CardActions className="button-box">
        <EditDialog
          title={props.title}
          author={props.author}
          isbn={props.isbn}
          courses={props.courses}
        ></EditDialog>
        <DeleteDialog title={props.title}></DeleteDialog>
      </CardActions>
    </Card>
  );
}
