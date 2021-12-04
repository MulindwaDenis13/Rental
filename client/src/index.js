import React from "react";
import ReactDOM from "react-dom";
import "@fontsource/ubuntu";
import App from "./App";
import { MuiThemeProvider, createTheme } from "@material-ui/core/styles";

const THEME = createTheme({
  typography: {
    fontFamily: `"Ubuntu", sans-serifs`,
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
  },
});

const AppWithTheme = () => (
  <MuiThemeProvider theme={THEME}>
    <App />
  </MuiThemeProvider>
);

ReactDOM.render(<AppWithTheme />, document.getElementById("root"));
