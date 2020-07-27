import React, { useState, useContext } from "react";
import {
  TextField,
  InputAdornment,
  makeStyles,
  Button,
} from "@material-ui/core";
import FolderIcon from "@material-ui/icons/Folder";
import * as usfm_import from "../../../core/usfm_import";
import { BrowserWindow } from "electron";
import ImportReport from "../../Reports/ImportReport";
import AutographaStore from "../../AutographaStore";
import { FormattedMessage } from "react-intl";
import { SettingContext } from "../../../contexts/SettingContext";

const { dialog } = require("electron").remote;

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  margin: {
    margin: theme.spacing(2),
  },
  button: {
    margin: theme.spacing(1),
  },
}));

const TranslationImport = (props) => {
  const classes = useStyles();
  const [folderPathImport, setFolderPathImport] = useState("");
  const [showReport, setShowReport] = useState(false);
  const { languageCode, langVersion } = useContext(SettingContext);
  const openFileDialogImportTrans = (event) => {
    dialog
      .showOpenDialog(BrowserWindow, {
        properties: ["openFile", "multiSelections"],
        filters: [{ name: "USFM Files", extensions: ["usfm", "sfm"] }],
        title: "Import Translation",
      })
      .then((result) => {
        if (result != null) {
          setFolderPathImport(result.filePaths);
        }
      });
  };
  const import_sync_setting = () => {
    let targetImportPath = folderPathImport;
    let isValid = true;
    if (
      targetImportPath === undefined ||
      targetImportPath === null ||
      targetImportPath === ""
    ) {
      isValid = false;
    }
    return isValid;
  };

  const importTranslation = () => {
    if (!import_sync_setting()) return;
    // let date = new Date();
    const importDir = Array.isArray(folderPathImport)
      ? folderPathImport
      : [folderPathImport];
    usfm_import
      .importTranslationFiles(importDir, languageCode, langVersion)
      .then((res) => {
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
  //   const transImport = () => {
  //     props.loadData();
  //     setFolderPathImport("");
  //   };

  return (
    <div>
      <div>
        <FormattedMessage id="placeholder-select-usfm-files">
          {(message) => (
            <TextField
              onChange={(event) => {
                setFolderPathImport(event.target.value);
              }}
              value={folderPathImport || ""}
              name="folderPathImport"
              variant="outlined"
              label={<FormattedMessage id="label-folder-location" />}
              placeholder={message}
              className={classes.margin}
              id="import-file-trans"
              style={{ width: "70%" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FolderIcon
                      style={{ cursor: "pointer" }}
                      onClick={openFileDialogImportTrans}
                    />
                  </InputAdornment>
                ),
              }}
            />
          )}
        </FormattedMessage>
      </div>
      <Button
        size="medium"
        variant="contained"
        color="primary"
        style={{ float: "right", marginTop: "-61px" }}
        onClick={importTranslation}
        className={classes.margin}
      >
        <FormattedMessage id="btn-import" />
      </Button>
      <ImportReport show={showReport} importClose={importClose} />
    </div>
  );
};

export default TranslationImport;
