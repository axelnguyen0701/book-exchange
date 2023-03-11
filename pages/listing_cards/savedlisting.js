import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import PurchaseDialog from "../dialog_boxes/purchase";

// This card shows an instant sale listing saved by the user
export default function SavedListing(props) {
  const renderedCourses = props.courses.map((e) => (
    <Typography
      className="info-text"
      variant="body2"
      color="text.secondary"
      key={e.URL}
    >
      {e.name}
    </Typography>
  ));
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
        {renderedCourses}
        <Typography
          className="price-text"
          variant="body2"
          color="text.secondary"
          fontWeight="bold"
        >
          {props.allowBid
            ? `Start Price: ${props.startingPrice}`
            : `Listed ${props.pricing}`}
          ETH Retails: {props.retails}$
        </Typography>
      </CardContent>
      <CardActions className="button-box">
        <PurchaseDialog
          title={props.title}
          pricing={props.pricing}
        ></PurchaseDialog>

        <Button size="small" className="option">
          Message
        </Button>
        <Button size="small" className="selected-option">
          Saved
        </Button>
      </CardActions>
    </Card>
  );
}
