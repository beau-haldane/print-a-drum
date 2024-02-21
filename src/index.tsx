import React from "react";
import App from "./App.tsx";
import { createRoot } from "react-dom/client";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const container = document.getElementById("root");
const root = createRoot(container!);
const theme = createTheme({
  palette: {
    primary: {
      main: "#406c81",
    },
  }
});

root.render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
);
