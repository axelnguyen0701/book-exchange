import "@/styles/globals.css";
import * as React from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MetaProvider from "./context/MetaContext";

export default function App({ Component, pageProps }) {
  // check users system to see whether they prefer light or dark mode
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
        },
      }),
    [prefersDarkMode]
  );

  // Themeprovider and css baseline allow for dark mode, MetaProvider gives global user context
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MetaProvider>
        <Component {...pageProps} />
      </MetaProvider>
    </ThemeProvider>
  );
}
