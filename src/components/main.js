import React, { useState, useEffect } from "react";
import AppBar from "./NavBar/AppBar";
import AutographaStore from "./AutographaStore";
import dbUtil from "../core/DbUtil";
import { IntlProvider } from "react-intl";
import { Observer } from "mobx-react";
const refDb = require("../core/data-provider").referenceDb();
let messages;
function Main() {
  const [dbsetup, Setdbsetup] = useState(false);

  useEffect(() => {
    getLocale().then(async (lang) => {
      AutographaStore.appLang = lang;
      messages = await loadLocaleData(lang);
      AutographaStore.currentTrans = messages;
    });
  }, []);

  useEffect(() => {
    dbUtil
      .dbSetupAll()
      .then((res) => {
        Setdbsetup(res);
      })
      .catch((err) => {
        Setdbsetup(false);
      });
  });

  useEffect(() => {
    refDb.get("activeRefs").then(
      (doc) => {
        Object.assign(AutographaStore.activeRefs, doc.activeRefs);
      },
      (err) => {
        console.log(err);
      }
    );
  });

  const getLocale = function () {
    return refDb
      .get("app_locale")
      .then(function (doc) {
        return doc.appLang;
      })
      .catch(function (error) {
        return "en";
      });
  };

  const loadLocaleData = (locale) => {
    switch (locale) {
      case "en":
        return import("../translations/en.json");
      case "hi":
        return import("../translations/hi.json");
      case "pt":
        return import("../translations/pt.json");
      case "es":
        return import("../translations/es.json");
      case "ar":
        return import("../translations/ar.json");
      default:
        return import("../translations/en.json");
    }
  };
  return (
    <React.Fragment>
      <Observer>
        {() =>
          dbsetup || Object.keys(AutographaStore.currentTrans).length !== 0 ? (
            <IntlProvider
              defaultLocale="en"
              locale={AutographaStore.appLang}
              messages={AutographaStore.currentTrans}
            >
              <AppBar />
            </IntlProvider>
          ) : (
            <div></div>
          )
        }
      </Observer>
    </React.Fragment>
  );
}

export default Main;
