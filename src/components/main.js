import React, { useState, useEffect } from "react";
import AppBar from "./NavBar/AppBar";
import AutographaStore from "./AutographaStore";
import dbUtil from "../core/DbUtil";
const refDb = require("../core/data-provider").referenceDb();

function Main() {
  const [dbsetup, Setdbsetup] = useState(false);

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

  return <React.Fragment>{dbsetup ? <AppBar /> : <div></div>}</React.Fragment>;
}

export default Main;
