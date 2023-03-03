import ResponsiveAppBar from "./navbar";
import { Container } from "@mui/system";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { useState } from "react";
import MuiToggleButton from "@mui/material/ToggleButton";
import { styled } from "@mui/material/styles";
import MyListing from "./listing_cards/mylisting";
import ClosedListing from "./listing_cards/closedlisting";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { TextField } from "@mui/material";
import Button from "@mui/material/Button";
import { useEffect } from "react";
import Box from "@mui/system";

// Themeing for MUI elements
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

// Used to accept a file and display it to the user
const FileInput = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (selectedImage) {
      setImageUrl(URL.createObjectURL(selectedImage));
    }
  }, [selectedImage]);

  return (
    <>
      <input
        accept="image/*"
        type="file"
        id="select-image"
        style={{ display: "none" }}
        onChange={(e) => setSelectedImage(e.target.files[0])}
      />
      <label htmlFor="select-image">
        <div className="search-button-box">
          <ThemeProvider theme={theme}>
            <Button
              className="create-button"
              variant="contained"
              color="primary"
              component="span"
            >
              Upload Image
            </Button>
          </ThemeProvider>
        </div>
      </label>
      {imageUrl && selectedImage && (
        <div className="search-button-box" mt={2} textAlign="center">
          <img src={imageUrl} alt={selectedImage.name} height="300px" />
        </div>
      )}
    </>
  );
};

// Used to create a listing
export default function CreateListing() {
  const [alignment, setAlignment] = useState("active");
  const [header, setHeader] = useState("Create an Instant Sale Listing");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (selectedImage) {
      setImageUrl(URL.createObjectURL(selectedImage));
    }
  }, [selectedImage]);

  // define toggle button style
  const ToggleButton = styled(MuiToggleButton)(({ selectedColor }) => ({
    "&.Mui-selected, &.Mui-selected:hover": {
      color: "white",
      backgroundColor: selectedColor,
    },
  }));

  // swap between creating an auction or instant sale listing
  const handleChange = () => {
    if (alignment === "active") {
      setAlignment("past");
      setHeader("Create an Auction Listing");
    }

    if (alignment === "past") {
      setAlignment("active");
      setHeader("Create an Instant Sale Listing");
    }
  };

  // if creating an auction listing
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
              Instant
            </ToggleButton>
            <ToggleButton value="past" selectedColor=" #301934">
              Auction
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
        <FileInput></FileInput>

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
            className="create-input"
            id="outlined-basic"
            label="Ex. The C Programming Langauge"
            variant="outlined"
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
            className="create-input"
            id="outlined-basic"
            label="Ex. James Stewart"
            variant="outlined"
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
            className="create-input"
            id="outlined-basic"
            label="Ex. 978-3-16-148410-0"
            variant="outlined"
          />
          <Typography
            className="search-header"
            gutterBottom
            variant="h5"
            component="div"
            fontWeight="bold"
          >
            Courses
          </Typography>
          <TextField
            className="create-input"
            id="outlined-basic"
            label="Ex. CMPT 315"
            variant="outlined"
          />
          <Typography
            className="search-header"
            gutterBottom
            variant="h5"
            component="div"
            fontWeight="bold"
          >
            Sale Price
          </Typography>
          <TextField
            className="create-input"
            id="outlined-basic"
            label="Ex. 35$"
            variant="outlined"
          />
          <ThemeProvider theme={theme}>
            <div className="search-button-box">
              <Button
                className="create-button"
                variant="contained"
                color="primary"
              >
                Create Listing
              </Button>
            </div>
          </ThemeProvider>
        </div>
      </Container>
    );
  }
  // if creating an auction
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
              Instant
            </ToggleButton>
            <ToggleButton value="past" selectedColor=" #301934">
              Auction
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
        <FileInput></FileInput>

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
            className="create-input"
            id="outlined-basic"
            label="Ex. The C Programming Langauge"
            variant="outlined"
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
            className="create-input"
            id="outlined-basic"
            label="Ex. James Stewart"
            variant="outlined"
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
            className="create-input"
            id="outlined-basic"
            label="Ex. 978-3-16-148410-0"
            variant="outlined"
          />
          <Typography
            className="search-header"
            gutterBottom
            variant="h5"
            component="div"
            fontWeight="bold"
          >
            Courses
          </Typography>
          <TextField
            className="create-input"
            id="outlined-basic"
            label="Ex. CMPT 315"
            variant="outlined"
          />
          <Typography
            className="search-header"
            gutterBottom
            variant="h5"
            component="div"
            fontWeight="bold"
          >
            Starting Price
          </Typography>
          <TextField
            className="create-input"
            id="outlined-basic"
            label="Ex. 35$"
            variant="outlined"
          />
          <ThemeProvider theme={theme}>
            <div className="search-button-box">
              <Button
                className="create-button"
                variant="contained"
                color="primary"
              >
                Create Listing
              </Button>
            </div>
          </ThemeProvider>
        </div>
      </Container>
    );
  }
}
