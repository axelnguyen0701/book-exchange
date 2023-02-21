import ResponsiveAppBar from "./navbar";
import { Container } from "@mui/system";
import { TextField } from "@mui/material";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { useContext } from "react";
import { AppContext } from "./context/MetaContext";

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

// search input page
export default function Search() {
  const { loaded, profile } = useContext(AppContext);
  // check if user is signed in (WIP)
  if (loaded) {
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
          />
          <ThemeProvider theme={theme}>
            <div className="search-button-box">
              <Button
                className="search-btn"
                variant="contained"
                color="primary"
                href="/results"
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
          </ThemeProvider>
        </div>
      </Container>
    );
  }
  // Prevent access for non signed in users (WIP)
  if (!loaded) {
    return <h1>SIGN IN</h1>;
  }
}
