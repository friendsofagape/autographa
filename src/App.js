import React from "react";
import ProjectsDrawer from "./components/ProjectsPane/ProjectsDrawer";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    type: "light",
    primary: {
      light: "#757ce8",
      main: "#212121",
      dark: "#455a64",
      contrastText: "#fff",
    },
    secondary: {
      light: "#fff",
      main: "#ffffff",
      dark: "#455a64",
      contrastText: "#000",
    },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ProjectsDrawer />
    </ThemeProvider>
  );
}

export default App;
