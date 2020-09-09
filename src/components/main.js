import React, { useEffect } from "react";
import ProjectsDrawer from "../components/ProjectsPane/ProjectsDrawer";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { IntlProvider } from "react-intl";
import { Observer } from "mobx-react";
import * as localForage from "localforage";
import AutographaStore from "./AutographaStore";
import AutoUpdate from "./AutoUpdate";

let messages;
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

const Main = () => {
  useEffect(() => {
    getLocale().then(async (lang) => {
      AutographaStore.appLang = lang;
      messages = await loadLocaleData(lang);
      AutographaStore.currentTrans = messages;
    });
  }, []);

  const getLocale = async function () {
    try {
      const value = await localForage.getItem("applang");
      // This code runs once the value has been loaded
      // from the offline store.
      return value;
    } catch (err) {
      // This code runs if there were any errors.
      console.log(err);
      return "en";
    }
  };

  const loadLocaleData = (locale) => {
    switch (locale) {
      case "en":
        return import("../translations/en.json");
      case "hi":
        return import("../translations/hi.json");
      default:
        return import("../translations/en.json");
    }
  };

  return (
    <React.Fragment>
      <Observer>
        {() =>
          Object.keys(AutographaStore.currentTrans).length !== 0 ? (
            <ThemeProvider theme={theme}>
              <IntlProvider
                defaultLocale="en"
                locale={AutographaStore.appLang}
                messages={AutographaStore.currentTrans}
              >
                <AutoUpdate />
                <ProjectsDrawer />
              </IntlProvider>
            </ThemeProvider>
          ) : (
            <div></div>
          )
        }
      </Observer>
    </React.Fragment>
  );
};

export default Main;
