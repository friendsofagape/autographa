import React, { useState } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import InputAdornment from "@material-ui/core/InputAdornment";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import SettingsIcon from "@material-ui/icons/Settings";
import ListSubheader from "@material-ui/core/ListSubheader";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import TranslateIcon from "@material-ui/icons/Translate";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  IconButton,
  Typography,
  Button,
  TextField,
  Paper,
} from "@material-ui/core";
import { BrowserWindow } from "electron";
import * as mobx from "mobx";
import * as usfm_import from "../../../core/usfm_import";
import FolderIcon from "@material-ui/icons/Folder";
import AutographaStore from "../../AutographaStore";
import ImportReport from "../../Reports/ImportReport";
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
  const [open, setOpen] = React.useState(true);
  const [tab2, setTab2] = useState(false);
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

  const handleClick = () => {
    setOpen(!open);
  };
  const ExpandTab2 = () => {
    setTab2(!tab2);
  };

  const toggleDrawer = (anchor, open) => (event) => {
    setState({ ...state, [anchor]: open });
  };
  const toggleDrawerClose = (anchor, open) => (event) => {
    handleSubmit(event);
    if (
      helperTextlanguage === "" &&
      helperTextVersion === "" &&
      helperTextfolderpath === ""
    ) {
      setState({ ...state, [anchor]: open });
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

  const importReference = () => {
    if (!reference_setting()) return;
    const regExp = /\(([^)]+)\)/;
    let _langCode = regExp.exec(language);
    let langCode = "";
    if (_langCode) {
      langCode = _langCode[1];
    } else langCode = language;
    setlanguageCode(langCode);
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

  const reference_setting = () => {
    let name = bibleName;
    let langCode = language;
    let version = langVersion;
    let path = folderPathImport;
    let isValid = true;
    if (name === null || name === "") {
      sethelperTextbible("The Bible name is required.");
      isValid = false;
    } else {
      setIsbiblenamevalid(false);
      sethelperTextbible("");
    }
    if (langCode === null || langCode === "") {
      sethelperTextlanguage("The Bible language code is required.");
      isValid = false;
    } else if (langCode.match(/^\d/)) {
      sethelperTextlanguage(
        "The Bible language code length should be between 2 and 8 characters and can’t start with a number."
      );
      isValid = false;
    } else if (/^([a-zA-Z0-9_-]){2,8}$/.test(langCode) === false) {
      sethelperTextlanguage(
        "The Bible language code length should be between 2 and 8 characters and can’t start with a number"
      );
      isValid = false;
    } else {
      setIslangcodevalid(false);
      sethelperTextlanguage("");
    }
    if (version === null || version === "") {
      sethelperTextVersion("The Bible version is required");
      isValid = false;
    } else {
      setIslangvervalid(false);
      sethelperTextVersion("");
    }
    if (path === null || path === "") {
      setHelperTextfolderpath("The folder location is required.");
      isValid = false;
    } else {
      setIspathvalid(false);
      setHelperTextfolderpath("");
    }
    return isValid;
  };

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
      .saveJsonToDb(dir, bibleName, language, langVersion)
      .then((res) => {
        console.log(res);
        return res;
      })
      .then((err) => {
        console.log(err);
      })
      .finally(() => setShowReport(true));
  };

  const importClose = () => {
    setShowReport(false);
    AutographaStore.warningMsg = [];
    AutographaStore.successFile = [];
    AutographaStore.errorFile = [];
    window.location.reload();
  };

  const list = (anchor) => (
    <div className={clsx(classes.list)} role="presentation">
      <List
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader
            className={classes.subheader}
            component="div"
            id="nested-list-subheader"
          >
            Settings
          </ListSubheader>
        }
        className={classes.root}
      >
        <ListItem button onClick={handleClick}>
          <ListItemIcon>
            <TranslateIcon />
          </ListItemIcon>
          <ListItemText primary="Reference Settings" />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem className={classes.nested}>
              <Paper className={classes.root}>
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
                    <FormControl
                      className={classes.margin}
                      component="fieldset"
                    >
                      <FormLabel component="legend">Script Direction</FormLabel>
                      <RadioGroup
                        style={{ display: "inline" }}
                        aria-label="Script Direction"
                        name="dir"
                        value={dir}
                        onChange={handleDirChange}
                      >
                        <FormControlLabel
                          value="LTR"
                          control={<Radio />}
                          label="LTR"
                        />
                        <FormControlLabel
                          value="RTL"
                          control={<Radio />}
                          label="RTL"
                        />
                      </RadioGroup>
                    </FormControl>
                  </div>
                  <Button
                    type="submit"
                    size="medium"
                    variant="contained"
                    color="primary"
                    style={{ float: "right", marginTop: "-61px" }}
                    onClick={importReference}
                    className={classes.margin}
                  >
                    Import
                  </Button>
                </form>
              </Paper>
            </ListItem>
          </List>
        </Collapse>
      </List>
    </div>
  );

  return (
    <div>
      <React.Fragment key={"right"}>
        <IconButton color="inherit" onClick={toggleDrawer("right", true)}>
          <SettingsIcon />
        </IconButton>
        <SwipeableDrawer
          anchor={"right"}
          open={state["right"]}
          onOpen={toggleDrawer("right", true)}
          onClose={toggleDrawer("right", false)}
        >
          {list("right")}
        </SwipeableDrawer>
        <ImportReport show={showReport} importClose={importClose} />
      </React.Fragment>
    </div>
  );
}
