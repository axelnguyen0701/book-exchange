import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import BidDialog from "../dialog_boxes/bid";

// This card shows a bid listing that was saved by the user
export default function SavedBidListing(props) {
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
          Current Bid: {props.pricing}$ Retails: {props.retails}$
        </Typography>
      </CardContent>
      <CardActions className="button-box">
        <BidDialog title={props.title} pricing={props.pricing}></BidDialog>
        <Button size="small" className="option">
          Message
        </Button>
        <Button size="small" className="selected-option">
          Save
        </Button>
      </CardActions>
    </Card>
  );
}
