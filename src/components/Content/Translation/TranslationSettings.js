import React, { useState, useEffect, useContext } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import BackupIcon from "@material-ui/icons/Backup";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import SaveIcon from "@material-ui/icons/Save";
import List from "@material-ui/core/List";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Button, TextField } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import { SettingContext } from "../../../contexts/SettingContext";
import AutographaStore from "../../AutographaStore";
const BrowserWindow = window.BrowserWindow;
const remote = window.remote;
const dialog = remote.dialog;

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

export default function TranslationSettings() {
  const classes = useStyles();
  const [state, setState] = useState({
    right: false,
  });
  const {
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
    handleSubmit,
    listLanguage,
    target_setting,
    saveSetting,
  } = useContext(SettingContext);
  const {
    setlanguage,
    setlangVersion,
    setFolderPath,
    setBackup,
    sethelperTextlanguage,
    setIslangcodevalid,
  } = useContext(SettingContext);

  const toggleDrawerClose = (anchor, open) => (event) => {
    handleSubmit(event);
    if (
      helperTextlanguage === "" &&
      helperTextVersion === "" &&
      helperTextfolderpath === ""
    ) {
      setState({ ...state, [anchor]: open });
      saveSetting();
    }
  };
  const handleDirChange = (event) => {
    AutographaStore.scriptDirection = event.target.value;
  };

  const openFileDialogSettingData = (event) => {
    dialog
      .showOpenDialog(BrowserWindow, {
        properties: ["openDirectory"],
        filters: [{ name: "All Files", extensions: ["*"] }],
        title: "Export Location",
      })
      .then((result) => {
        if (result != null) {
          setFolderPath(result.filePaths);
        }
      });
  };

  useEffect(() => {
    target_setting(language, langVersion);
    if (setIslangcodevalid === false && language !== undefined) {
      sethelperTextlanguage("");
    }
  }, [
    langVersion,
    language,
    setIslangcodevalid,
    sethelperTextlanguage,
    target_setting,
  ]);
  const list = (anchor) => (
    <div className={clsx(classes.list)} role="presentation">
      <List
        component="nav"
        aria-labelledby="nested-list-subheader"
        className={classes.root}
      >
        <form
          className={classes.container}
          onSubmit={toggleDrawerClose("right", false)}
        >
          <div>
            <Autocomplete
              options={listlang ? listlang : language}
              getOptionLabel={(option) =>
                option.title ? option.title : language
              }
              value={languageCode}
              onChange={(event, newValue) => {
                if (newValue) {
                  setlanguage(newValue.title);
                }
              }}
              style={{ width: 300 }}
              renderInput={(params) => (
                <FormattedMessage id="label-language-code">
                  {(message) => (
                    <TextField
                      {...params}
                      error={islangcodevalid}
                      helperText={helperTextlanguage}
                      label={message}
                      margin="normal"
                      className={classes.margin}
                      variant="outlined"
                      onInput={(e) => {
                        listLanguage(e.target.value);
                      }}
                    />
                  )}
                </FormattedMessage>
              )}
            />
            <FormattedMessage id="label-version">
              {(message) => (
                <TextField
                  className={classes.margin}
                  variant="outlined"
                  id="input-with-icon-textfield"
                  label={message}
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
              )}
            </FormattedMessage>
            <FormattedMessage id="label-export-folder-location">
              {(message) => (
                <TextField
                  className={classes.margin}
                  variant="outlined"
                  id="input-with-icon-textfield"
                  style={{ width: "70%" }}
                  label={message}
                  value={folderPath || ""}
                  error={ispathvalid}
                  helperText={helperTextfolderpath}
                  placeholder="Path of folder for saving USFM files"
                  onInput={(e) => setFolderPath(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BackupIcon
                          onClick={openFileDialogSettingData}
                          style={{ cursor: "pointer" }}
                        />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            </FormattedMessage>
            <FormControl className={classes.margin} component="fieldset">
              <FormLabel component="legend">
                <FormattedMessage id="label-script-direction" />
              </FormLabel>
              <RadioGroup
                style={{ display: "inline" }}
                aria-label="Script Direction"
                name="dir"
                value={AutographaStore.scriptDirection}
                onChange={handleDirChange}
              >
                <FormControlLabel
                  value="LTR"
                  control={<Radio />}
                  label={<FormattedMessage id="label-ltr" />}
                />
                <FormControlLabel
                  value="RTL"
                  control={<Radio />}
                  label={<FormattedMessage id="label-rtl" />}
                />
              </RadioGroup>
            </FormControl>
          </div>
          <div>
            <FormControl className={classes.margin} component="fieldset">
              <FormLabel component="legend">
                <FormattedMessage id="label-auto-backup" />
              </FormLabel>
              <RadioGroup
                style={{ display: "inline" }}
                aria-label="Auto Backup"
                name="autobackup"
                value={backup ? backup : "daily"}
                onChange={(e) => setBackup(e.target.value)}
              >
                <FormControlLabel
                  value="none"
                  control={<Radio />}
                  label={<FormattedMessage id="label-none" />}
                />
                <FormControlLabel
                  value="daily"
                  control={<Radio />}
                  label={<FormattedMessage id="label-daily" />}
                />
                <FormControlLabel
                  value="weekly"
                  control={<Radio />}
                  label={<FormattedMessage id="label-weekly" />}
                />
              </RadioGroup>
            </FormControl>
          </div>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="medium"
            style={{
              float: "right",
              marginRight: "33px",
            }}
            className={classes.button}
            startIcon={<SaveIcon />}
          >
            <FormattedMessage id="btn-save" />
          </Button>
        </form>
      </List>
    </div>
  );

  return (
    <div data-test="component-panel">
      <React.Fragment key={"right"}>{list("right")}</React.Fragment>
    </div>
  );
}
