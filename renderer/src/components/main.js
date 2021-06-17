import React, { useEffect } from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { IntlProvider } from 'react-intl';
// import { Observer } from "mobx-react";
import * as localForage from 'localforage';
import Router from 'next/router';
import NProgress from 'nprogress';
// import ProjectsDrawer from './ProjectsPage/ProjectsDrawer';
import Meta from '../Meta';
import AutographaContextProvider from './context/AutographaContext';
import ProjectContextProvider from './context/ProjectContext';
// import AutographaStore from "./AutographaStore";
// import AutoUpdate from "./AutoUpdate";
// import { logger } from "../logger";

Router.onRouteChangeStart = () => {
  NProgress.start();
};

Router.onRouteChangeComplete = () => {
  NProgress.done();
};

Router.onRouteChangeError = () => {
  NProgress.done();
};

let messages;
 export const theme = createMuiTheme({
  palette: {
    type: 'light',
    primary: {
      light: '#757ce8',
      main: '#212121',
      dark: '#455a64',
      contrastText: '#fff',
    },
    secondary: {
      light: '#fff',
      main: '#ffffff',
      dark: '#455a64',
      contrastText: '#000',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
  },
});

const Main = () => {
  const [language, setlanguage] = React.useState('en');
  const [message, setmessage] = React.useState({});
  const getLocale = async () => {
    // logger.debug("main.js, started work for getLocale");
    try {
      const value = await localForage.getItem('applang');
      // This code runs once the value has been loaded
      // from the offline store.
      if (!value) {
        // logger.error(
        //   "main.js, failed to fetch language from localforage, setting to default language"
        // );
        return 'en';
      } return value;
    } catch (err) {
      // This code runs if there were any errors.
      // logger.error(
      //   "main.js, failed to fetch language from localforage, setting to default language"
      // );
      return 'en';
    }
  };

  const loadLocaleData = (locale) => {
    switch (locale) {
      case 'en':
        return import('../translations/en.json');
      case 'hi':
        return import('../translations/hi.json');
      default:
        // logger.warn("main.js, Setting to default language");
        return import('../translations/en.json');
    }
  };

  useEffect(() => {
    // logger.info("main.js, setting up app with preferred language");
    getLocale().then(async (lang) => {
      // AutographaStore.appLang = lang;
      setlanguage(lang);
      messages = await loadLocaleData(lang);
      setmessage(messages);
      // AutographaStore.currentTrans = messages;
    });
    NProgress.start();
    NProgress.inc(0.4);
    NProgress.done();
  }, []);

  return (
    <>
      {Object.keys(message).length !== 0 ? (
        <ThemeProvider theme={theme}>
          <AutographaContextProvider>
            <ProjectContextProvider>
              <IntlProvider
                defaultLocale="en"
                locale={language}
                messages={message}
              >
                {/* <ProjectsDrawer /> */}
                <Meta />
              </IntlProvider>
            </ProjectContextProvider>
          </AutographaContextProvider>
        </ThemeProvider>
      ) : (
        <div />
      )}
    </>
  );
};

export default Main;
