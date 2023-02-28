import { useState, useRef } from "react";
import { webClient, getRecord } from "./utils/identity";
import { Container } from "@mui/system";
import Router from "next/router";
import { Button } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AppContext } from "./context/MetaContext";
import { useContext } from "react";

// themeing
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

// sign in page -- SWAP ONCLICK BACK TO CONNECT ONCE AUTH IS FIXED --
export default function Home() {
  const { connect, loaded } = useContext(AppContext);

  return (
    <Container>
      <ThemeProvider theme={theme}>
        <div className="signin-button-box">
          <h1 className="title">Welcome to Open Market</h1>
          <h3>Connect with MetaMask to Continue</h3>
          <Button
            //onClick={connect}
            className="search-btn"
            variant="contained"
            color="primary"
            href="/home"
          >
            Authenticate
          </Button>
        </div>
      </ThemeProvider>
    </Container>
  );
}
