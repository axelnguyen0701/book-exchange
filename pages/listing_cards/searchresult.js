import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";

// This card shows listings of the same book grouped together under search results
export default function SearchResult(props) {
  const router = useRouter();
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
          {props.noresults}
        </Typography>
      </CardContent>
      <CardActions className="button-box">
        <Button
          size="small"
          className="view-listings"
          onClick={() => router.push("/resultslistings")}
        >
          View Listings
        </Button>
      </CardActions>
    </Card>
  );
}
