import ResponsiveAppBar from "./navbar";
import { Container } from "@mui/system";
import { TextField } from "@mui/material";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { useContext, useState } from "react";
import { AppContext } from "./context/MetaContext";
import axios from "axios"
import { marketplaceAddress } from "../config"
import BookMarketplace from "../artifacts/contracts/BookMarketplace.sol/BookMarketplace.json"
import { ethers } from "ethers"
import SavedListing from "./listing_cards/savedlisting";

// themeing for MUI elements
const theme = createTheme({
  palette: {
    primary: {
      main: "#301934",
    },
    secondary: {
      main: "#11cb5f",
    },
  },
});

export default function Search() {
  const { loaded, profile } = useContext(AppContext);
  const [formInput, updateFormInput] = useState({
    title: "",
    author: "",
    ISBN: "",
  });
  const [loadingState, setLoadingState] = useState("not-loaded")
  const [nfts, setNfts] = useState([]);

  async function handleSearch() {
    const searchInput = formInput
    console.log("searching for: ", searchInput)

    const listings = await getListings()
    
    const titleTokens = searchInput.title.toLowerCase().split(" ").filter((token) => token.trim() !== "")
    const authorTokens = searchInput.author.split(" ").filter((token) => token.trim() !== "")
    const isbnTokens = searchInput.ISBN.split(" ").filter((token) => token.trim() !== "")

    const titleRegex = new RegExp(titleTokens.join("|"), "gim")
    const authorRegex = new RegExp(authorTokens.join("|"), "gim")
    const isbnRegex = new RegExp(isbnTokens.join("|"), "gim")
  
    const filteredListings = listings.filter((listing) => {

      return (
        ((searchInput.title != "") && titleRegex.test(listing.title)) ||
        ((searchInput.author != "") && authorRegex.test(listing.author)) ||
        ((searchInput.ISBN != "") && isbnRegex.test(listing.IBSN))
      )
    })

    setNfts(filteredListings)

    setLoadingState("loaded")
}

  async function getListings() {
    /* create a generic provider and query for unsold market items */
    const provider = new ethers.providers.JsonRpcProvider();
    const contract = new ethers.Contract(
        marketplaceAddress,
        BookMarketplace.abi,
        provider
    );
  
    // fetch items from subgraph
    const data = await axios({
      url: 'http://127.0.0.1:8000/subgraphs/name/book-marketplace',
      method: 'post',
      data: {
          query: `
              query {
                  listings(where: {sold: false}) {
                      id
                      tokenId
                      allowBid
                      seller
                      owner
                      startingPrice
                      sold
                      instantPrice
                      did
                    }
                  }
              `
          }
                  
  }).then((result) => {
      console.log(
          "data returned:\n",
          result.data)
          return result.data.data.listings
      }).catch((err) => {
          console.log(err)
          return contract.fetchListings();
          });
  
    const items = await Promise.all(
      data.map(async (i) => {
          const tokenUri = await contract.tokenURI(i.tokenId);
          const meta = await axios.get(tokenUri);
          const courseMeta = await Promise.all(
              meta.data.courses.map(async (i) => {
                  const courseName = await axios.get(i);
  
                  return { name: courseName.data.name, URL: i };
              })
          );
          let item = {
              id: i.id || 1,
              price: ethers.utils.formatUnits(
      i.instantPrice.toString(),
      "ether"
    ),
              tokenId: i.tokenId,
              seller: i.seller,
              owner: i.owner,
              allowBid: i.allowBid,
              startingPrice: ethers.utils.formatEther(i.startingPrice),
              image: meta.data.image,
              title: meta.data.title,
              author: meta.data.author,
              ISBN: meta.data.ISBN,
              course: courseMeta,
              sold: i.sold
          };
          return item;
      })
  );
  setLoadingState("loaded");
  return items
  }

  const resultContents = nfts.map((listing, i) => {
    return (<div className="col-md-4" key={i}>
        <SavedListing 
          tokenId={listing.tokenId}
          imgurl={listing.image}
          title={listing.title}
          author={listing.author}
          isbn={`ISBN: ${listing.ISBN}`}
          courses={listing.course}
          allowBid={listing.allowBid}
          pricing={listing.price}
          startingPrice={listing.startingPrice}
          retails="90"
        />
      </div>)
      
})

  const renderResults = () => {
		if (loadingState === "loaded" && !resultContents.length) {
      
			return <Typography>Nothing to show yet</Typography>
    }

		return resultContents
	}
  return (
    <Container>
      <ResponsiveAppBar />

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
          className="search-input"
          id="outlined-basic"
          label="Ex. The C Programming Langauge"
          variant="outlined"
          onChange={(e) =>
            updateFormInput({
              ...formInput,
              title: e.target.value,
            })
          }
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
          className="search-input"
          id="outlined-basic"
          label="Ex. James Stewart"
          variant="outlined"
          onChange={(e) =>
            updateFormInput({
              ...formInput,
              author: e.target.value,
            })
          }
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
          className="search-input"
          id="outlined-basic"
          label="Ex. 978-3-16-148410-0"
          variant="outlined"
          onChange={(e) =>
            updateFormInput({
              ...formInput,
              ISBN: e.target.value,
            })
          }
        />
        <ThemeProvider theme={theme}>
          <div className="search-button-box">
            <Button
              className="search-btn"
              variant="contained"
              color="primary"
              // href="/results"
              onClick={handleSearch}
            >
              Search
            </Button>
            <Button 
            className="search-btn" 
            variant="contained" 
            color="primary"
            
            >
              Reset
            </Button>
          </div>
          <div className="results">{renderResults()}</div>
        </ThemeProvider>
      </div>
    </Container>
  );
}

