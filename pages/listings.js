import ResponsiveAppBar from "./navbar";
import { Container } from "@mui/system";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { useState } from "react";
import MuiToggleButton from "@mui/material/ToggleButton";
import { styled } from "@mui/material/styles";
import MyListing from "./listing_cards/mylisting";
import ClosedListing from "./listing_cards/closedlisting";
import { AppContext } from "./context/MetaContext";
import { useContext } from "react";

// Used to show users active and past listings
export default function Listings() {
  const { loaded, profile } = useContext(AppContext);
  const [alignment, setAlignment] = useState("active");
  const [header, setHeader] = useState("Your Active Listings");

  // themeing for button
  const ToggleButton = styled(MuiToggleButton)(({ selectedColor }) => ({
    "&.Mui-selected, &.Mui-selected:hover": {
      color: "white",
      backgroundColor: selectedColor,
    },
  }));

  // used to swap between active and sold listings
  const handleChange = () => {
    if (alignment === "active") {
      setAlignment("past");
      setHeader("Your Past Listings");
    }

    if (alignment === "past") {
      setAlignment("active");
      setHeader("Your Active Listings");
    }
  };

  // viewing active listings
  if (alignment === "active") {
    return (
      <Container>
        <ResponsiveAppBar />
        <div className="titleHeader">
          <h1 className="title">{header}</h1>
        </div>
        <div className="search-button-box">
          <ToggleButtonGroup
            color="primary"
            value={alignment}
            exclusive
            onChange={handleChange}
            aria-label="Platform"
          >
            <ToggleButton value="active" selectedColor=" #301934">
              Active
            </ToggleButton>
            <ToggleButton value="past" selectedColor=" #301934">
              Sold
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
        <div className="book-shelf">
          <MyListing
            imgurl="https://i.ebayimg.com/images/g/pwYAAOSwbDdji-Dn/s-l500.jpg"
            title="Sociology in Action"
            author="Myles Richer"
            isbn="ISBN: 18371921"
            courses="SOCI 100"
            pricing="40"
            retails="75"
          ></MyListing>
          <MyListing
            imgurl="https://thomaspark.co/wp/wp-content/uploads/2012/12/interactiondesign-book.jpg"
            title="Interaction Design (3rd Ed)"
            author="Thomas Park"
            isbn="ISBN: 83917334"
            courses="CMPT 250, DESN 223"
            pricing="80"
            retails="105"
          ></MyListing>
        </div>
      </Container>
    );
  }
  // viewing old listings
  if (alignment === "past") {
    return (
      <Container>
        <ResponsiveAppBar />
        <div className="titleHeader">
          <h1 className="title">{header}</h1>
        </div>
        <div className="search-button-box">
          <ToggleButtonGroup
            color="primary"
            value={alignment}
            exclusive
            onChange={handleChange}
            aria-label="Platform"
          >
            <ToggleButton value="active" selectedColor=" #301934">
              Active
            </ToggleButton>
            <ToggleButton value="past" selectedColor=" #301934">
              Sold
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
        <div className="book-shelf">
          <ClosedListing
            imgurl="https://media.karousell.com/media/photos/products/2020/9/1/oxford_complete_chemistry_text_1598935446_e60666e6_progressive.jpg"
            title="Complete Chemistry"
            author="Thomas Park"
            isbn="ISBN: 83917334"
            courses="CMPT 250, DESN 223"
            outcome="Sold: 36$"
          ></ClosedListing>
        </div>
      </Container>
    );
  }
}
