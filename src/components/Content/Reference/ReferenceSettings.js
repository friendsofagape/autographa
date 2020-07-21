import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Button, TextField } from "@material-ui/core";
import { BrowserWindow } from "electron";
import * as usfm_import from "../../../core/usfm_import";
import FolderIcon from "@material-ui/icons/Folder";
import AutographaStore from "../../AutographaStore";
import ImportReport from "../../Reports/ImportReport";
import Loader from "../../Loader/Loader";
import { SettingContext } from "../../../contexts/SettingContext";
import { useContext } from "react";
import { SetupContext } from "../../../contexts/SetupContext";
const { dialog, getCurrentWindow } = require("electron").remote;
const lookupsDb = require(`${__dirname}/../../../core/data-provider`).lookupsDb();
const refDb = require(`${__dirname}/../../../core/data-provider`).referenceDb();

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  list: {
    width: 500,
  },
  fullList: {
    width: "auto",
  },
  margin: {
    margin: theme.spacing(2),
  },
  button: {
    margin: theme.spacing(1),
  },
  subheader: {
    fontSize: "larger",
    fontWeight: 900,
  },
}));

export default function ReferenceSettings(props) {
  const classes = useStyles();
  var listArray = [];
  const [dir, setDir] = React.useState("LTR");
  const [state, setState] = useState({
    right: false,
  });
  const [bibleName, setbibleName] = useState("");
  const [language, setlanguage] = useState("");
  const [languageCode, setlanguageCode] = useState("");
  const [langVersion, setlangVersion] = useState("");
  const [helperTextbible, sethelperTextbible] = useState("");
  const [helperTextlanguage, sethelperTextlanguage] = useState("");
  const [helperTextVersion, sethelperTextVersion] = useState("");
  const [helperTextfolderpath, setHelperTextfolderpath] = useState("");
  const [isbiblenamevalid, setIsbiblenamevalid] = useState(false);
  const [islangcodevalid, setIslangcodevalid] = useState(false);
  const [islanvervalid, setIslangvervalid] = useState(false);
  const [ispathvalid, setIspathvalid] = useState(false);
  const [listlang, setListlang] = useState([]);
  const [folderPathImport, setFolderPathImport] = useState("");
  const [totalFile, setTotalFile] = useState([]);
  const [showReport, setShowReport] = useState(false);
  const [showLoader, setShowLoader] = React.useState(false);
  const { matchCode } = useContext(SettingContext);
  const { loadReference } = useContext(SetupContext);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (helperTextbible !== "") {
      setIsbiblenamevalid(true);
    } else if (helperTextlanguage !== "") {
      setIslangcodevalid(true);
    } else if (helperTextVersion !== "") {
      setIslangvervalid(true);
    } else if (setHelperTextfolderpath !== "") {
      setIspathvalid(true);
    }
  };

  const toggleDrawerClose = (anchor, open) => (event) => {
    handleSubmit(event);
    if (
      helperTextbible === "" &&
      helperTextlanguage === "" &&
      helperTextVersion === "" &&
      helperTextfolderpath === ""
    ) {
      setState({ ...state, [anchor]: open });
      importReference();
    }
  };
  const handleDirChange = (event) => {
    setDir(event.target.value);
  };

  const openFileDialogRefSetting = (event) => {
    dialog
      .showOpenDialog(BrowserWindow, {
        properties: ["openFile", "multiSelections"],
        filters: [{ name: "USFM Files", extensions: ["usfm", "sfm"] }],
        title: "Import Reference",
      })
      .then((result) => {
        if (result != null) {
          setFolderPathImport(result.filePaths);
          setTotalFile(result.filePaths);
        }
      });
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

  const importReference = () => {
    setShowLoader(true);
    let langCode = languageCode;
    var ref_id_value =
        langCode.toLowerCase() +
        "_" +
        langVersion.toLowerCase() +
        "_" +
        bibleName,
      ref_entry = {},
      ref_arr = [],
      dir = Array.isArray(folderPathImport)
        ? folderPathImport
        : [folderPathImport];
    ref_entry.ref_id = ref_id_value;
    ref_entry.ref_name = bibleName;
    ref_entry.ref_lang_code = langVersion.toLowerCase();
    ref_entry.isDefault = false;
    ref_arr.push(ref_entry);
    refDb.get("refs").then(
      (doc) => {
        ref_entry = {};
        doc.ref_ids.forEach((ref_doc) => {
          ref_entry.ref_id = ref_doc.ref_id;
          ref_entry.ref_name = ref_doc.ref_name;
          ref_entry.ref_lang_code = ref_doc.ref_lang_code;
          ref_entry.isDefault = ref_doc.isDefault;
          ref_arr.push(ref_entry);
          ref_entry = {};
        });
        doc.ref_ids = ref_arr;
        refDb.put(doc).then((res) => {
          saveJsonToDB(dir);
        });
      },
      (err) => {
        if (err.message === "missing") {
          var refs = {
            _id: "refs",
            ref_ids: [],
          };
          ref_entry.isDefault = true;
          refs.ref_ids.push(ref_entry);
          refDb.put(refs).then(
            (res) => {
              saveJsonToDB(dir);
            },
            (internalErr) => {
              console.log(internalErr);
            }
          );
        } else if (err.message === "usfm parser error") {
        } else {
        }
      }
    );
  };

  useEffect(() => {
    const reference_setting = (lang, langVersion) => {
      const regExp = /\(([^)]+)\)/;
      let name = bibleName;
      let langCode;
      let _langCode = regExp.exec(lang);
      if (_langCode) {
        langCode = _langCode[1];
      } else langCode = language;
      setlanguageCode(langCode);
      let version = langVersion;
      let path = folderPathImport;
      if (name === null || name === undefined || name === "") {
        sethelperTextbible("The Bible name is required.");
      } else {
        setIsbiblenamevalid(false);
        sethelperTextbible("");
      }
      if (langCode === null || langCode === undefined || langCode === "") {
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
      if (version === null || version === undefined || version === "") {
        sethelperTextVersion("The Bible version is required");
      } else {
        setIslangvervalid(false);
        sethelperTextVersion("");
      }
      if (path === null || path === undefined || path === "") {
        setHelperTextfolderpath("The folder location is required.");
      } else {
        setIspathvalid(false);
        setHelperTextfolderpath("");
      }
    };
    reference_setting(language, langVersion);
    if (setIslangcodevalid === false && language !== undefined) {
      sethelperTextlanguage("");
    }
  }, [language, langVersion, ispathvalid, folderPathImport, bibleName]);

  const saveJsonToDB = (dir) => {
    // const currentTrans = AutographaStore.currentTrans;
    // let date = new Date();
    // if (
    //   !fs.existsSync(
    //     `${appPath}/report/error${date.getDate()}${date.getMonth()}${date.getFullYear()}.log`
    //   )
    // )
    //   fs.mkdirSync(`${appPath}/report`, { recursive: true });
    usfm_import
      .saveJsonToDb(dir, bibleName, languageCode, langVersion)
      .then((res) => {
        return res;
      })
      .then((err) => {
        console.log(err);
      })
      .finally(() => {
        setShowLoader(false);
        setShowReport(true);
        referenceImport();
      });
  };

  const referenceImport = () => {
    loadReference();
  };

  const importClose = () => {
    setShowReport(false);
    AutographaStore.warningMsg = [];
    AutographaStore.successFile = [];
    AutographaStore.errorFile = [];
    window.location.reload();
  };

  const list = (anchor) => (
    <List component="div" disablePadding>
      <ListItem className={classes.nested}>
        <form
          className={classes.container}
          onSubmit={toggleDrawerClose("right", false)}
        >
          <div>
            <TextField
              className={classes.margin}
              variant="outlined"
              id="input-with-icon-textfield"
              label="Bible Name"
              error={isbiblenamevalid}
              helperText={helperTextbible}
              placeholder="New English Translation"
              value={bibleName}
              onInput={(e) => setbibleName(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <InsertDriveFileIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Autocomplete
              options={listlang ? listlang : language}
              getOptionLabel={(option) =>
                option.title ? option.title : language
              }
              value={language || ""}
              onChange={(event, newValue) => {
                if (newValue) {
                  setlanguage(newValue.title);
                }
              }}
              style={{ width: 300 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={islangcodevalid}
                  helperText={helperTextlanguage}
                  label="Language Code"
                  margin="normal"
                  className={classes.margin}
                  variant="outlined"
                  onInput={(e) => {
                    listLanguage(e.target.value);
                  }}
                />
              )}
            />
            <TextField
              className={classes.margin}
              variant="outlined"
              id="input-with-icon-textfield"
              label="Version"
              error={islanvervalid}
              helperText={helperTextVersion}
              placeholder="NET-S3"
              value={langVersion}
              onInput={(e) => setlangVersion(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <InsertDriveFileIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              onChange={(event) => {
                setFolderPathImport(event.target.value);
              }}
              value={folderPathImport || ""}
              name="folderPathImport"
              variant="outlined"
              label="Import Translation"
              error={ispathvalid}
              helperText={helperTextfolderpath}
              placeholder="select the USFM files"
              className={classes.margin}
              id="import-file-trans"
              style={{ width: "70%" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FolderIcon
                      style={{ cursor: "pointer" }}
                      onClick={openFileDialogRefSetting}
                    />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl className={classes.margin} component="fieldset">
              <FormLabel component="legend">Script Direction</FormLabel>
              <RadioGroup
                style={{ display: "inline" }}
                aria-label="Script Direction"
                name="dir"
                value={dir}
                onChange={handleDirChange}
              >
                <FormControlLabel value="LTR" control={<Radio />} label="LTR" />
                <FormControlLabel value="RTL" control={<Radio />} label="RTL" />
              </RadioGroup>
            </FormControl>
          </div>
          <Button
            type="submit"
            size="medium"
            variant="contained"
            color="primary"
            style={{ float: "right", marginTop: "-61px" }}
            className={classes.margin}
          >
            Import
          </Button>
        </form>
      </ListItem>
    </List>
  );

  return (
    <div>
      <React.Fragment>
        {list("right")}
        {showLoader === true ? <Loader /> : ""}
        <ImportReport show={showReport} importClose={importClose} />
      </React.Fragment>
    </div>
  );
}
