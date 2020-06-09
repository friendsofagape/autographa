import React, { useState, useEffect } from "react";
import AppBar from "./NavBar/AppBar";
import AutographaStore from "./AutographaStore";
import dbUtil from "../core/DbUtil";
import { IntlProvider, addLocaleData } from "react-intl";
import en from "@formatjs/intl-relativetimeformat/dist/locale-data/en";
import es from "@formatjs/intl-relativetimeformat/dist/locale-data/es";
import fr from "@formatjs/intl-relativetimeformat/dist/locale-data/fr";
import it from "@formatjs/intl-relativetimeformat/dist/locale-data/it";
import { Observer } from "mobx-react";
const i18n = new (require("../translations/i18n"))();
const refDb = require("../core/data-provider").referenceDb();

function Main() {
  const [dbsetup, Setdbsetup] = useState(false);

  useEffect(() => {
    i18n.getLocale().then((lang) => {
      AutographaStore.appLang = lang;
    });
    i18n.currentLocale().then((res) => {
      AutographaStore.currentTrans = res;
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

  return (
    <React.Fragment>
      <Observer>
        {() =>
          dbsetup || Object.keys(AutographaStore.currentTrans).length !== 0 ? (
            <IntlProvider
              locale="en"
              key={AutographaStore.appLang}
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
