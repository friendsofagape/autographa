import React, { createContext, useState, useEffect } from "react";
import { SetupContext } from "./SetupContext";
import AutographaStore from "../components/AutographaStore";
import swal from "sweetalert";
import * as AutoBackup from "../core/AutoBackup";
const refDb = require("../core/data-provider").referenceDb();
const db = require(`${__dirname}/../core/data-provider`).targetDb();
const lookupsDb = require(`${__dirname}/../core/data-provider`).lookupsDb();
const Constant = require("../core/constants");

export const SettingContext = createContext();

const SettingContextProvider = (props) => {
  let listArray = [];
  const [language, setlanguage] = useState("");
  const [languageCode, setlanguageCode] = useState("");
  const [langVersion, setlangVersion] = useState("");
  const [folderPath, setFolderPath] = useState("");
  const [backup, setBackup] = useState("");
  const [helperTextlanguage, sethelperTextlanguage] = useState("");
  const [helperTextVersion, sethelperTextVersion] = useState("");
  const [helperTextfolderpath, setHelperTextfolderpath] = useState("");
  const [islangcodevalid, setIslangcodevalid] = useState(false);
  const [islanvervalid, setIslangvervalid] = useState(false);
  const [ispathvalid, setIspathvalid] = useState(false);
  const [listlang, setListlang] = useState([]);

  useEffect(() => {
    db.get("targetBible").then(
      (doc) => {
        AutographaStore.scriptDirection = doc.langScript.toUpperCase();
      },
      (err) => {
        AutographaStore.scriptDirection = "LTR";
      }
    );
    AutographaStore.refList = [];
    loadSetting();
  }, []);

  useEffect(() => {
    if (languageCode && langVersion && backup !== "none") {
      AutoBackup.initializeBackUp();
    }
  }, [backup, langVersion, languageCode]);

  const loadSetting = () => {
    db.get("targetBible").then(
      (doc) => {
        setlanguage(doc.targetLang);
        setlanguageCode(doc.targetLang);
        setlangVersion(doc.targetVersion);
        setFolderPath(doc.targetPath);
        setBackup(doc.backupFrequency);
      },
      (err) => {
        // console.log(err);
      }
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (helperTextlanguage !== "") {
      setIslangcodevalid(true);
    } else if (helperTextVersion !== "") {
      setIslangvervalid(true);
    } else if (setHelperTextfolderpath !== "") {
      setIspathvalid(true);
    }
  };

  const listLanguage = (val) => {
    setlanguage(val);
    if (val.length >= 2) {
      var autoCompleteResult = matchCode(val);
      autoCompleteResult.then((res) => {
        if (res != null) {
          listArray = Object.entries(res).map((e) => ({
            title: e[1] + " (" + [e[0]] + ")",
          }));
          if (listArray) {
            setListlang(listArray);
          }
        }
      });
    }
  };

  const matchCode = (input) => {
    var filteredResults = {};
    return lookupsDb
      .allDocs({
        startkey: input.toLowerCase(),
        endkey: input.toLowerCase() + "\uffff",
        include_docs: true,
      })
      .then(function (response) {
        if (response !== undefined && response.rows.length > 0) {
          Object.keys(response.rows).map((index, value) => {
            if (response.rows) {
              if (
                !filteredResults.hasOwnProperty(
                  response.rows[index].doc["lang_code"]
                )
              ) {
                filteredResults[response.rows[index].doc["lang_code"]] =
                  response.rows[index].doc["name"];
              } else {
                let existingValue =
                  filteredResults[response.rows[index].doc["lang_code"]];
                filteredResults[response.rows[index].doc["lang_code"]] =
                  existingValue + " , " + response.rows[index].doc["name"];
              }
            }
            return null;
          });
          return filteredResults;
        } else {
          return [];
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  const target_setting = (lang, langVersion) => {
    const regExp = /\(([^)]+)\)/;
    let langCode;
    let _langCode = regExp.exec(lang);
    if (_langCode) {
      langCode = _langCode[1];
    } else langCode = language;
    setlanguageCode(langCode);
    let version = langVersion;
    let path = folderPath;
    if (langCode === null || langCode === "") {
      sethelperTextlanguage("The Bible language code is required.");
    } else if (langCode.match(/^\d/)) {
      sethelperTextlanguage(
        "The Bible language code length should be between 2 and 8 characters and can’t start with a number."
      );
    } else if (/^([a-zA-Z0-9_-]){2,8}$/.test(langCode) === false) {
      sethelperTextlanguage(
        "The Bible language code length should be between 2 and 8 characters and can’t start with a number"
      );
    } else {
      setIslangcodevalid(false);
      sethelperTextlanguage("");
    }
    if (version === null || version === "") {
      sethelperTextVersion("The Bible version is required");
    } else {
      setIslangvervalid(false);
      sethelperTextVersion("");
    }
    if (path === null || path === "") {
      setHelperTextfolderpath("The folder location is required.");
    } else {
      setIspathvalid(false);
      setHelperTextfolderpath("");
    }
  };

  const saveSetting = () => {
    const currentTrans = AutographaStore.currentTrans;
    // const {
    //   langCode,
    //   langVersion,
    //   folderPath,
    //   backupFrequency,
    // } = this.state.settingData;
    const settingData = {
      _id: "targetBible",
      targetLang: languageCode.toLowerCase(),
      targetVersion: langVersion,
      targetPath: folderPath,
      langScript: AutographaStore.scriptDirection.toUpperCase(),
      backupFrequency: backup,
    };
    db.get("targetBible").then(
      (doc) => {
        settingData._rev = doc._rev;
        db.put(settingData).then((res) => {
          if (languageCode && langVersion && backup !== "none") {
            AutoBackup.initializeBackUp();
          }
          swal("Translation Data", "Successfully saved changes", "success");
        });
      },
      (err) => {
        db.put(settingData).then(
          (res) => {
            swal("Translation Data", "Successfully saved changes", "success");
          },
          (err) => {
            swal("Translation Data", "Successfully saved changes", "success");
          }
        );
      }
    );
  };

  return (
    <SettingContext.Provider
      value={{
        language,
        languageCode,
        langVersion,
        folderPath,
        backup,
        helperTextlanguage,
        helperTextVersion,
        helperTextfolderpath,
        islangcodevalid,
        islanvervalid,
        ispathvalid,
        listlang,
        loadSetting,
        handleSubmit,
        listLanguage,
        matchCode,
        target_setting,
        saveSetting,
        setlanguage,
        setlanguageCode,
        setlangVersion,
        setFolderPath,
        setBackup,
        sethelperTextlanguage,
        sethelperTextVersion,
        setHelperTextfolderpath,
        setIslangcodevalid,
        setIslangvervalid,
        setIspathvalid,
        setListlang,
      }}
    >
      {props.children}
    </SettingContext.Provider>
  );
};
export default SettingContextProvider;
