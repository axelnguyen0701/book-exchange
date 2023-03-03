import ResponsiveAppBar from "./navbar";
import { Container } from "@mui/system";
import { useState } from "react";
import SearchResult from "./listing_cards/searchresult";

// Page for showing broad search results
export default function Results() {
  const [noResults, setNoResults] = useState(2);
  const [title, setTitle] = useState("Psychology Textbook");
  return (
    <Container>
      <ResponsiveAppBar></ResponsiveAppBar>
      <div className="titleHeader">
        <h1 className="title">
          {noResults} results found for {title}
        </h1>
      </div>
      <div className="book-shelf">
        <SearchResult
          imgurl="https://m.media-amazon.com/images/I/91-xkZV4foL.jpg"
          title="Psychology"
          isbn="ISBN: 27528247"
          author="Mary Lilenfield"
          courses="PSYC 104, PSYC 105"
          noresults="2 Listings"
        ></SearchResult>
        <SearchResult
          imgurl="https://m.media-amazon.com/images/I/51BUvrNdE3L.jpg"
          title="Forensic Psychology"
          isbn="ISBN: 47292386"
          author="Joanna Pozzulo"
          courses="PSYC 332"
          noresults="1 Listing"
        ></SearchResult>
      </div>
    </Container>
  );
}
