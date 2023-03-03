import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

// This card is used to show a users listing that was sold to someone else
export default function ClosedListing(props) {
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
      </CardContent>
      <CardActions className="button-box">
        <h1 className="titleHeader">{props.outcome}</h1>
      </CardActions>
    </Card>
  );
}
