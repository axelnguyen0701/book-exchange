import ResponsiveAppBar from "./navbar";
import { Container } from "@mui/system";
import { TextField } from "@mui/material";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { useContext } from "react";
import { AppContext } from "./context/MetaContext";

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

// Search page
export default function Search() {
  // load global user info
  const {
    loaded,
    profile,
    setName,
    name,
    pic,
    setPic,
    updateProfile,
    readProfile,
  } = useContext(AppContext);
  readProfile();

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
          Picture URL
        </Typography>
        <TextField
          className="search-input"
          id="outlined-basic"
          variant="outlined"
          onChange={(e) => setPic(e.target.value)}
        />
        <Typography
          className="search-header"
          gutterBottom
          variant="h5"
          component="div"
          fontWeight="bold"
        >
          Display Name
        </Typography>
        <TextField
          className="search-input"
          id="outlined-basic"
          variant="outlined"
          onChange={(e) => setName(e.target.value)}
        />

        <ThemeProvider theme={theme}>
          <div className="search-button-box">
            <Button
              className="search-btn"
              variant="contained"
              color="primary"
              onClick={updateProfile}
            >
              Update Profile
            </Button>
          </div>
        </ThemeProvider>
      </div>
    </Container>
  );
}
