import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";

export default function Contact(props) {
  return (
    <Card
      className={`contact ${props.selected ? "selected" : ""}`}
      onClick={() => props.onClick(props.id)}
    >
      <CardHeader
        avatar={<Avatar sx={{ bgcolor: "#B785B7" }}>{props.letter}</Avatar>}
        title={props.name}
        subheader={props.listing}
      />
    </Card>
  );
}
