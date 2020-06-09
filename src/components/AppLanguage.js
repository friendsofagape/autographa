import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { FormattedMessage } from "react-intl";
import AutographaStore from "./AutographaStore";
import swal from "sweetalert";
import { Typography, Button } from "@material-ui/core";
import { useState } from "react";
const refDb = require("../core/data-provider").referenceDb();

const useStyles = makeStyles((theme) => ({
  button: {
    display: "block",
    marginTop: theme.spacing(2),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  margin: {
    margin: theme.spacing(2),
  },
}));

const AppLanguage = () => {
  const classes = useStyles();
  const [appLang, setAppLang] = React.useState(AutographaStore.appLang);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setAppLang(AutographaStore.appLang);
  }, []);

  const changeLangauge = (event, index, value) => {
    setAppLang(event.target.value);
  };

  const saveAppLanguage = (e) => {
    const currentTrans = AutographaStore.currentTrans;
    refDb
      .get("app_locale")
      .then((doc) => {
        doc.appLang = appLang; //this.langRef.current.value//AutographaStore.appLang;
        refDb.put(doc);
        setMessage("dynamic-msg-save-language");
      })
      .then(function (res) {
        swal(
          currentTrans["btn-save-changes"],
          currentTrans["dynamic-msg-save-language"],
          "success",
          {
            buttons: {
              cancel: "Cancel",
              catch: {
                text: "Restart",
                value: "Restart",
              },
            },
          }
        ).then((value) => {
          if (value === "Restart") window.location.reload();
        });
      })
      .catch((err) => {
        if (err.message === "missing") {
          var locale = {
            _id: "app_locale",
            appLang: appLang, //AutographaStore.appLang
          };
          refDb
            .put(locale)
            .then(function (res) {
              console.log("res");
              swal(
                currentTrans["btn-save-changes"],
                currentTrans["dynamic-msg-save-language"],
                "success"
              );
            })
            .catch(function (internalErr) {
              console.log("res", internalErr);
              swal(
                currentTrans["dynamic-msg-error"],
                currentTrans["dynamic-msg-went-wrong"],
                "success"
              );
            });
        }
      });
  };

  return (
    <div>
      <Typography className={classes.formControl}>
        <FormattedMessage id="label-select-language" />
      </Typography>
      <Select
        className={classes.formControl}
        id="localeList"
        value={appLang}
        onChange={changeLangauge}
      >
        <MenuItem value={"ar"}>Arabic</MenuItem>
        <MenuItem value={"en"}>English</MenuItem>
        <MenuItem value={"hi"}>Hindi</MenuItem>
        <MenuItem value={"pt"}>Portuguese</MenuItem>
        <MenuItem value={"es"}>Spanish</MenuItem>
      </Select>
      <Button
        className={classes.margin}
        id="btnSaveLang"
        variant="contained"
        color="primary"
        style={{ float: "right" }}
        onClick={saveAppLanguage}
      >
        <FormattedMessage id="btn-save" />
      </Button>
    </div>
  );
};

export default AppLanguage;
