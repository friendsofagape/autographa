import React, { useContext } from "react";
import { Button } from "@material-ui/core";
import {
  AuthenticationContext,
  AuthenticationContextProvider,
  RepositoryContext,
  RepositoryContextProvider,
  FileContext,
  FileContextProvider,
} from "gitea-react-toolkit";
import toJson from "../../../core/usfm_to_json";
import AutographaStore from "../../AutographaStore";
import * as bibUtil from "../../../core/json_to_usfm";
import swal from "sweetalert";
const constants = require("../../../core/constants");
const remote = window.remote;
const app = remote.app;
const path = require("path");
const fs = window.fs;

const FileList = () => {
  const { state: auth, component: authComponent } = useContext(
    AuthenticationContext
  );
  const { state: repo, component: repoComponent } = useContext(
    RepositoryContext
  );
  const {
    state: file,
    actions: fileActions,
    component: fileComponent,
  } = useContext(FileContext);

  // the following are all the actions available for the file context.
  const { save } = fileActions;
  const importBook = () => {
    const dir = path.join(app.getPath("userData"), "Gitea_projects");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    console.log(file.filepath.split("/"));
    fs.writeFileSync(path.join(dir, file.name), file.content, "utf8", function (
      err,
      result
    ) {
      if (err) console.log("error", err);
    });
    toJson(
      {
        lang: "",
        version: "",
        usfmFile: path.join(dir, file.name),
        targetDb: "target",
        scriptDirection: AutographaStore.refScriptDirection,
      },
      (err, data) => {
        if (err !== null) console.log(err);
        else {
          console.log(data);
          window.location.reload(false);
        }
      }
    );
  };
  const uploadBook = async () => {
    let book = {};
    book.bookNumber = AutographaStore.bookId.toString();
    book.bookName = AutographaStore.editBookNamesMode
      ? AutographaStore.translatedBookNames[parseInt(book.bookNumber, 10) - 1]
      : constants.booksList[parseInt(book.bookNumber, 10) - 1];
    book.bookCode = constants.bookCodeList[parseInt(book.bookNumber, 10) - 1];
    const content = await bibUtil.toUsfmDoc(book, false);
    save(content);
    swal("Export as USFM", `Book Exported:${file.filepath}`, "success");
  };

  const logout = () => {
    console.log("logout auth", auth);
    auth.logout();
    window.location.reload(false);
  };

  return (
    (!auth && authComponent) ||
    (!repo && repoComponent) ||
    (!file && fileComponent) || (
      <React.Fragment>
        <Button
          variant="contained"
          color="primary"
          component="span"
          onClick={importBook}
        >
          Import
        </Button>
        <Button
          variant="contained"
          color="primary"
          component="span"
          onClick={uploadBook}
        >
          Upload
        </Button>
        <Button
          variant="contained"
          color="primary"
          component="span"
          onClick={logout}
        >
          Logout
        </Button>
      </React.Fragment>
    )
  );
};
export default FileList;
