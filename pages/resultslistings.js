import ResponsiveAppBar from "./navbar";
import { Container } from "@mui/system";
import { useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Listing from "./listing_cards/listing";

// page for showing narrow search results for a specific book
export default function ResultsListings() {
  const [bookName, setBookName] = useState("Forensic Psychology");
  const [filter, setFilter] = useState("");

  // change filter for viewing order
  const handleChange = (event) => {
    setFilter(event.target.value);
  };
  return (
    <Container>
      <ResponsiveAppBar />
      <div className="titleHeader">
        <h1 className="title">Showing results for {bookName}</h1>

        <FormControl
          variant="filled"
          sx={{
            m: 1,
            minWidth: 140,
          }}
        >
          <InputLabel id="demo-simple-select-filled-label">
            Filter Results
          </InputLabel>
          <Select
            labelId="demo-simple-select-filled-label"
            id="demo-simple-select-filled"
            value={filter}
            onChange={handleChange}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={10}>Price: Ascending</MenuItem>
            <MenuItem value={20}>Price: Descending</MenuItem>
            <MenuItem value={10}>Time: Oldest</MenuItem>
            <MenuItem value={20}>Time: Newest</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div className="book-shelf">
        <Listing
          title="Forensic Psychology"
          imgurl="https://scontent.fyyc3-1.fna.fbcdn.net/v/t1.6435-9/67588099_10162116950740300_211602614788292608_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=b9115d&_nc_ohc=sY4WnHy011EAX9qHG3F&_nc_ht=scontent.fyyc3-1.fna&oh=00_AfCuJO12IxcD3zH2uFRag7AIvpxXAXaAP4onJC2Sn0terg&oe=63F4F741"
          isbn="ISBN: 47292386"
          author="Joanna Pozzulo"
          courses="PSYC 332"
          pricing="70"
          retails="125"
        ></Listing>
      </div>
    </Container>
  );
}
