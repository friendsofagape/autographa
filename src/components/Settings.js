import React from "react";
import { TextField, RaisedButton, SelectField, MenuItem } from "material-ui";
import swal from "sweetalert";
import { observer } from "mobx-react";
import AutographaStore from "./AutographaStore";
import { FormattedMessage } from "react-intl";
import Loader from "./Loader";
import { RadioButton, RadioButtonGroup } from "material-ui/RadioButton";
import * as mobx from "mobx";
import { makeStyles } from "@material-ui/core/styles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Icon from "@material-ui/core/Icon";
const numberFormat = require("../util/getNumberFormat");
const { dialog, getCurrentWindow } = require("electron").remote;
const {
  Tab,
  Tabs,
  Modal,
  Col,
  Row,
  Nav,
  NavItem,
} = require("react-bootstrap/lib");
const refDb = require(`${__dirname}/../util/data-provider`).referenceDb();
const lookupsDb = require(`${__dirname}/../util/data-provider`).lookupsDb();
const db = require(`${__dirname}/../util/data-provider`).targetDb();
const Constant = require("../util/constants");
const bibUtil_to_json = require(`${__dirname}/../util/usfm_to_json`);
const path = require("path");
const Promise = require("bluebird");
var fs = Promise.promisifyAll(require("fs"));
var appPath = path.join(__dirname, "..", "..");
let flag = false;

@observer
class SettingsModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      settingData: {
        langCodeValue: "",
        langCode: "",
        langVersion: "",
        folderPath: "",
      },
      refSetting: {
        bibleName: "",
        refLangCodeValue: "",
        refLangCode: "",
        refVersion: "",
        refFolderPath: "",
      },
      folderPathImport: "",
      refList: [],
      refListEdit: [],
      bibleReference: true,
      visibleList: true,
      myBible: "",
      appLang: AutographaStore.appLang,
      message: "",
      hideAlert: "hidemessage",
      showLoader: false,
      refIndex: 0,
      refName: "",
      showMsg: false,
      msgId: "",
      filepath: "",
      modalBody: "",
      title: "",
      successFile: [],
      errorFile: [],
      warningFile: [],
      warningTitle: "",
      successTitle: "",
      errorTitle: "",
      show: false,
      expanded: "",
      totalFile: [],
      key: 1,
    };
    db.get("targetBible").then(
      (doc) => {
        AutographaStore.scriptDirection = doc.langScript.toUpperCase();
      },
      (err) => {
        AutographaStore.scriptDirection = "LTR";
      }
    );
    AutographaStore.refList = [];
    this.loadSetting();
  }

  getStuffAsync = (param) => {
    return new Promise(function (resolve, reject) {
      bibUtil_to_json.toJson(param, function (err, data) {
        if (err !== null) return reject(err);
        resolve(data);
      });
    });
  };

  loadSetting = () => {
    const settingData = this.state.settingData;
    db.get("targetBible").then(
      (doc) => {
        settingData.langCode = doc.targetLang;
        settingData.langCodeValue = doc.targetLang;
        settingData.langVersion = doc.targetVersion;
        settingData.folderPath = doc.targetPath;
      },
      (err) => {
        // console.log(err);
      }
    );
  };

  loadReference = () => {
    AutographaStore.refListExist = [];
    AutographaStore.refListEdit = [];
    AutographaStore.refList = [];
    refDb.get("refs").then((doc) => {
      doc.ref_ids.forEach((ref_doc) => {
        AutographaStore.refList.push({
          value: ref_doc.ref_id,
          option: ref_doc.ref_name,
        });
        if (Constant.defaultReferences.indexOf(ref_doc.ref_id) >= 0) {
          AutographaStore.refListExist.push(ref_doc);
        } else {
          AutographaStore.refListEdit.push(ref_doc);
        }
      });
    });
  };

  onChange = (event) => {
    let settingData = Object.assign({}, this.state.settingData);
    settingData[event.target.name] = event.target.value;
    this.setState({ settingData });
  };

  onChangeList = (event) => {
    let settingData = Object.assign({}, this.state.settingData);
    settingData.langCode = event.target.value;
    settingData.langCodeValue = event.target.value;
    this.setState({ settingData, visibleList: true });
    this.listLanguage(event.target.value);
    this.setState({});
  };

  matchCode = (input) => {
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

  listLanguage = (val) => {
    if (val.length >= 2) {
      var autoCompleteResult = this.matchCode(val);
      autoCompleteResult.then((res) => {
        if (res != null) {
          this.setState({ _listArray: res });
          document.addEventListener("click", this.handleOutsideClick, false);
        } else {
          document.removeEventListener("click", this.handleOutsideClick, false);
        }
      });
    }
  };

  onReferenceChange = (event) => {
    let refSetting = Object.assign({}, this.state.refSetting);
    refSetting[event.target.name] = event.target.value;
    this.setState({ refSetting });
  };

  onReferenceChangeList = (event) => {
    let refSetting = Object.assign({}, this.state.refSetting);
    refSetting.refLangCode = event.target.value;
    refSetting.refLangCodeValue = event.target.value;
    this.setState({ refSetting, visibleList: true });
    this.listLanguage(event.target.value);
    this.setState({});
  };

  setMessage = (msgid, isValid) => {
    this.setState({ message: msgid, hideAlert: "failure" });
    setTimeout(() => {
      this.setState({ hideAlert: "hidemessage" });
    }, 2000);
    return isValid;
  };

  target_setting = () => {
    const { langCode, langVersion, folderPath } = this.state.settingData;
    let version = langVersion;
    let path = folderPath;
    let isValid = true;
    if (langCode === null || langCode === "") {
      isValid = this.setMessage("dynamic-msg-bib-code-validation", false);
    } else if (langCode.match(/^\d/)) {
      isValid = this.setMessage(
        "dynamic-msg-bib-code-start-with-number",
        false
      );
    } else if (/^([a-zA-Z0-9_-]){2,8}$/.test(langCode) === false) {
      isValid = this.setMessage(
        "dynamic-msg-bib-code-start-with-number",
        false
      );
    } else if (version === null || version === "") {
      isValid = this.setMessage("dynamic-msg-bib-version-validation", false);
    } else if (path === null || path === "") {
      isValid = this.setMessage("dynamic-msg-bib-path-validation", false);
    } else {
      isValid = true;
    }
    return isValid;
  };

  saveSetting = () => {
    if (this.target_setting() === false) return;
    const currentTrans = AutographaStore.currentTrans;
    const { langCode, langVersion, folderPath } = this.state.settingData;
    const settingData = {
      _id: "targetBible",
      targetLang: langCode.toLowerCase(),
      targetVersion: langVersion,
      targetPath: folderPath,
      langScript: AutographaStore.scriptDirection.toUpperCase(),
    };
    db.get("targetBible").then(
      (doc) => {
        settingData._rev = doc._rev;
        db.put(settingData).then((res) => {
          swal(
            currentTrans["dynamic-msg-trans-data"],
            currentTrans["dynamic-msg-saved-change"],
            "success"
          );
        });
      },
      (err) => {
        db.put(settingData).then(
          (res) => {
            swal(
              currentTrans["dynamic-msg-trans-data"],
              currentTrans["dynamic-msg-saved-change"],
              "success"
            );
          },
          (err) => {
            swal(
              currentTrans["dynamic-msg-trans-data"],
              currentTrans["dynamic-msg-went-wrong"],
              "success"
            );
          }
        );
      }
    );
  };

  openFileDialogSettingData = (event) => {
    dialog.showOpenDialog(
      getCurrentWindow(),
      {
        properties: ["openDirectory"],
        filters: [{ name: "All Files", extensions: ["*"] }],
        title: "Export Location",
      },
      (selectedDir) => {
        if (selectedDir != null) {
          this.state.settingData["folderPath"] = selectedDir;
          this.setState({});
        }
      }
    );
  };

  openFileDialogImportTrans = (event) => {
    dialog.showOpenDialog(
      getCurrentWindow(),
      {
        properties: ["openFile", "multiSelections"],
        filters: [{ name: "USFM Files", extensions: ["usfm", "sfm"] }],
        title: "Import Translation",
      },
      (selectedDir) => {
        if (selectedDir != null) {
          this.setState({ folderPathImport: selectedDir });
          this.setState({ totalFile: selectedDir });
        }
      }
    );
  };

  openFileDialogRefSetting = (event) => {
    dialog.showOpenDialog(
      getCurrentWindow(),
      {
        properties: ["openFile", "multiSelections"],
        filters: [{ name: "All Files", extensions: ["usfm", "sfm"] }],
        title: "Import Reference",
      },
      (selectedDir) => {
        if (selectedDir != null) {
          this.state.refSetting["refFolderPath"] = selectedDir;
          this.setState({ totalFile: selectedDir });
          this.setState({});
        }
      }
    );
  };

  import_sync_setting = () => {
    let targetImportPath = this.state.folderPathImport;
    let isValid = true;
    if (
      targetImportPath === undefined ||
      targetImportPath === null ||
      targetImportPath === ""
    ) {
      isValid = this.setMessage("dynamic-msg-bib-path-validation", false);
    }
    return isValid;
  };

  importTranslation = () => {
    // let that = this;
    if (this.import_sync_setting() === false) return;
    this.setState({ showLoader: true });
    let date = new Date();
    const { langCode, langVersion } = this.state.settingData;
    let inputPath = Array.isArray(this.state.folderPathImport)
      ? this.state.folderPathImport
      : [this.state.folderPathImport];
    // var files = fs.readdirSync(inputPath[0]);
    if (
      !fs.existsSync(
        `${appPath}/report/error${date.getDate()}${date.getMonth()}${date.getFullYear()}.log`
      )
    )
      fs.mkdirSync(`${appPath}/report`, { recursive: true });

    Promise.map(inputPath, (file) => {
      // var filePath = path.join(inputPath[0], file);
      if (fs.statSync(file).isFile() && !file.startsWith(".")) {
        var options = {
          lang: langCode.toLowerCase(),
          version: langVersion.toLowerCase(),
          usfmFile: file,
          targetDb: "target",
          scriptDirection: AutographaStore.refScriptDirection,
        };
        return this.getStuffAsync(options)
          .then((res) => {
            this.setState((prevState) => ({
              successFile: [...prevState.successFile, res],
              successTitle:
                AutographaStore.currentTrans["tooltip-import-title"],
            }));

            const chapterMissing = mobx.toJS(AutographaStore.warningMsg);
            let objWarnArray = [];
            let preValue = undefined;
            let book = "";
            let chapters = [];

            chapterMissing.map((value) => {
              if (value[0] !== preValue) {
                if (value[0] !== preValue && preValue !== undefined) {
                  const obj = { filename: book, chapter: chapters };
                  objWarnArray.push(obj);
                  book = "";
                  chapters = [];
                }
                book = value[0];
                chapters.push(value[1]);
                preValue = value[0];
              } else {
                chapters.push(value[1]);
              }
            });

            if (book !== "" && chapters.length !== 0) {
              const obj = { filename: book, chapter: chapters };
              objWarnArray.push(obj);
              if (this.state.warningTitle === "") {
                this.setState({ warningTitle: "WarningFiles" });
              }
            }
            let finalWarnArray = Array.from(new Set(objWarnArray));
            this.setState({ warningFile: finalWarnArray });
            // To remove 'undefined' values from success files state array.
            this.state.successFile = this.state.successFile.filter(function (
              element
            ) {
              return element !== undefined;
            });

            return res;
          })
          .catch((err) => {
            var errorpath = `${appPath}/report/error${date.getDate()}${
              date.getMonth() + 1
            }${date.getFullYear()}.log`;
            fs.appendFile(errorpath, err + "\n", (err) => {
              if (err) {
                console.log(err);
              } else {
                console.log("succesfully created error.log file");
              }
            });
            let newErr = err.toString().replace("Error:", "");
            this.setState((prevState) => ({
              errorFile: [...prevState.errorFile, newErr],
              errorTitle: AutographaStore.currentTrans["tooltip-error-title"],
            }));
            return err;
          });
      }
    })
      .then(() => {
        db.get("translatedBookNames", function (err, doc) {
          if (err) {
            return console.log(err);
          } else {
            localStorage.setItem("editBookNamesMode", true);
            AutographaStore.editBookNamesMode = true;
            doc.books = mobx.toJS(AutographaStore.translatedBookNames);
          }
          db.put(doc);
        });
        this.setState({ showLoader: false });
        this.setState({ show: true });
        AutographaStore.showModalSettings = false;
      })
      .finally(() => this.transImport());
  };

  reference_setting() {
    const {
      bibleName,
      refVersion,
      refLangCode,
      refFolderPath,
    } = this.state.refSetting;
    let name = bibleName;
    let langCode = refLangCode;
    let version = refVersion;
    let path = refFolderPath;
    let isValid = true;
    if (name === "") {
      isValid = this.setMessage("dynamic-msg-bib-name-validation", false);
    } else if (langCode === null || langCode === "") {
      isValid = this.setMessage("dynamic-msg-bib-code-validation", false);
    } else if (langCode.match(/^\d/)) {
      isValid = this.setMessage(
        "dynamic-msg-bib-code-start-with-number",
        false
      );
    } else if (version === null || version === "") {
      isValid = this.setMessage("dynamic-msg-bib-version-validation", false);
    } else if (path === null || path === "") {
      isValid = this.setMessage("dynamic-msg-bib-path-validation", false);
    } else {
      isValid = true;
    }
    return isValid;
  }

  importReference = () => {
    if (this.reference_setting() === false) return;
    this.setState({ showLoader: true });
    let {
      bibleName,
      refVersion,
      refLangCodeValue,
      refLangCode,
      refFolderPath,
    } = this.state.refSetting;
    if (refLangCodeValue === null) {
      refLangCodeValue = refLangCode;
    }

    var ref_id_value =
        refLangCodeValue.toLowerCase() +
        "_" +
        refVersion.toLowerCase() +
        "_" +
        bibleName,
      ref_entry = {},
      ref_arr = [],
      files = Array.isArray(refFolderPath) ? refFolderPath : [refFolderPath];
    ref_entry.ref_id = ref_id_value;
    ref_entry.ref_name = bibleName;
    ref_entry.ref_lang_code = refLangCodeValue.toLowerCase();
    ref_entry.isDefault = false;
    ref_arr.push(ref_entry);
    refDb.get("refs").then(
      (doc) => {
        ref_entry = {};
        var refExistsFlag = false;
        var updatedDoc = doc.ref_ids.forEach((ref_doc) => {
          if (ref_doc.ref_id === ref_id_value) {
            refExistsFlag = true;
            // return
          }
          ref_entry.ref_id = ref_doc.ref_id;
          ref_entry.ref_name = ref_doc.ref_name;
          ref_entry.ref_lang_code = ref_doc.ref_lang_code;
          ref_entry.isDefault = ref_doc.isDefault;
          ref_arr.push(ref_entry);
          ref_entry = {};
        });
        doc.ref_ids = ref_arr;
        refDb.put(doc).then((res) => {
          this.saveJsonToDB(files);
        });
        // if (!refExistsFlag) {
        //     doc.ref_ids = ref_arr;
        //     refDb.put(doc).then((res)=> {
        //         this.saveJsonToDB(files);
        //     });
        // } else {
        //     this.saveJsonToDB(files);
        // }
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
              this.saveJsonToDB(files);
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

  saveJsonToDB = (files) => {
    const { bibleName, refVersion, refLangCodeValue } = this.state.refSetting;
    const that = this;
    fs.mkdirSync(`${appPath}/report`, { recursive: true });
    Promise.map(files, (file) => {
      if (fs.statSync(file).isFile() && !file.startsWith(".")) {
        const options = {
          bibleName: bibleName,
          lang: refLangCodeValue.toLowerCase(),
          version: refVersion.toLowerCase(),
          usfmFile: file,
          targetDb: "refs",
          scriptDirection: AutographaStore.refScriptDirection,
        };
        return that
          .getStuffAsync(options)
          .then((res) => {
            this.setState((prevState) => ({
              successFile: [...prevState.successFile, res],
              successTitle:
                AutographaStore.currentTrans["tooltip-import-title"],
            }));

            const chapterMissing = mobx.toJS(AutographaStore.warningMsg);
            let objWarnArray = [];
            let preValue = undefined;
            let book = "";
            let chapters = [];

            chapterMissing.map((value) => {
              if (value[0] !== preValue) {
                if (value[0] !== preValue && preValue !== undefined) {
                  const obj = { filename: book, chapter: chapters };
                  objWarnArray.push(obj);
                  book = "";
                  chapters = [];
                }
                book = value[0];
                chapters.push(value[1]);
                preValue = value[0];
              } else {
                chapters.push(value[1]);
              }
            });

            if (book !== "" && chapters.length !== 0) {
              const obj = { filename: book, chapter: chapters };
              objWarnArray.push(obj);
              if (this.state.warningTitle === "") {
                this.setState({ warningTitle: "WarningFiles" });
              }
            }
            let finalWarnArray = Array.from(new Set(objWarnArray));
            this.setState({ warningFile: finalWarnArray });
            // To remove 'undefined' values from success files state array.
            this.state.successFile = this.state.successFile.filter(function (
              element
            ) {
              return element !== undefined;
            });

            return res;
          })
          .catch((err) => {
            let errorpath = `${appPath}/report/referror.log`;
            fs.appendFile(errorpath, err + "\n", (err) => {
              if (err) {
                console.log(err);
              } else {
                console.log("succesfully created referror.log file");
              }
            });
            let newErr = err.toString().replace("Error:", "");
            this.setState((prevState) => ({
              errorFile: [...prevState.errorFile, newErr],
              errorTitle: AutographaStore.currentTrans["tooltip-error-title"],
            }));
            return err;
          });
      }
    })
      .then(() => {
        this.setState({ showLoader: false });
        this.setState({ show: true });
        AutographaStore.showModalSettings = false;
      })
      .finally(() => this.referenceImport());
  };

  referenceImport = () => {
    this.loadReference();
    //clearing state fields after loading
    this.setState({ refSetting: "" });
  };

  transImport = () => {
    this.props.loadData();
    this.setState({ folderPathImport: "" });
  };

  clickListSettingData = (evt, obj) => {
    let settingData = Object.assign({}, this.state.settingData);
    settingData.langCodeValue = evt + " " + obj;
    settingData.langCode = obj.slice(1, -1);
    this.setState({
      settingData,
      visibleList: false,
    });
  };

  clickListrefSetting = (evt, obj) => {
    let refSetting = Object.assign({}, this.state.refSetting);
    refSetting.refLangCode = evt + " " + obj;
    refSetting.refLangCodeValue = obj.slice(1, -1);
    this.setState({
      refSetting,
      visibleList: false,
    });
  };

  //Rename
  onReferenceRename = (name, index, e) => {
    this.setState({
      bibleReference: !this.state.bibleReference,
      refIndex: index,
    });
  };

  //Remove
  onReferenceRemove = (element) => {
    var ref_ids = [];
    const currentTrans = AutographaStore.currentTrans;
    swal({
      title: currentTrans["label-heading-confirmation"],
      text: currentTrans["dynamic-msg-del-ref-text"],
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        refDb
          .get("refs")
          .then(
            (doc) => {
              doc.ref_ids.forEach((ref_doc) => {
                if (ref_doc.ref_id != element) {
                  ref_ids.push({
                    ref_id: ref_doc.ref_id,
                    ref_name: ref_doc.ref_name,
                    isDefault: ref_doc.isDefault,
                  });
                }
              });
              doc.ref_ids = ref_ids;
              return refDb.put(doc);
            },
            (err) => {
              swal(
                currentTrans["dynamic-msg-error"],
                currentTrans["dynamic-msg-del-unable"],
                "error"
              );
            }
          )
          .then((res) => {
            window.location.reload();
          });
      }
    });
  };
  //Save
  onReferenceSave = (docId, e) => {
    // this.setState({bibleReference: !this.state.bibleReference});
    const currentTrans = AutographaStore.currentTrans;
    let bibleNameLen = this.state.refName.length;
    if (bibleNameLen > 10) {
      swal(
        currentTrans["label-bible-name"],
        currentTrans["ref_name_max_valid"],
        "error"
      );
      return;
    } else if (bibleNameLen < 3) {
      swal(
        currentTrans["label-bible-name"],
        currentTrans["ref_name_min_valid"],
        "error"
      );
      return;
    } else if (bibleNameLen == 0) {
      swal(
        currentTrans["label-bible-name"],
        currentTrans["ref_name_blank"],
        "error"
      );
      return;
    }
    let ref_ids = [];
    let result = false;
    refDb
      .get("refs")
      .then((doc) => {
        doc.ref_ids.forEach((ref_doc) => {
          if (
            ref_doc.ref_id != docId &&
            ref_doc.ref_name.toLowerCase() === this.state.refName.toLowerCase()
          ) {
            result = true;
            return;
          }
          if (ref_doc.ref_id != docId) {
            ref_ids.push({
              ref_id: ref_doc.ref_id,
              ref_name: ref_doc.ref_name,
              isDefault: ref_doc.isDefault,
            });
          } else {
            ref_ids.push({
              ref_id: ref_doc.ref_id,
              ref_name: this.state.refName,
              isDefault: ref_doc.isDefault,
            });
          }
        });
        if (result == true) {
          return true;
        } else {
          doc.ref_ids = ref_ids;
          return refDb.put(doc);
        }
      })
      .then(
        (res) => {
          if (res == true) {
            swal(
              currentTrans["label-bible-name"],
              currentTrans["dynamic-msg-name-taken"],
              "success"
            );
          } else {
            this.loadReference();
            this.setState({
              bibleReference: !this.state.bibleReference,
              refName: "",
            });
          }
        },
        (err) => {
          swal(
            currentTrans["label-bible-name"],
            currentTrans["dynamic-msg-ren-unable"],
            "error"
          );
        }
      );
  };

  //Cancel
  onReferenceCancel = (e) => {
    this.setState({ bibleReference: !this.state.bibleReference });
  };

  //onChange Bible
  onChangeBible = (e) => {
    this.setState({ refName: e.target.value });
  };

  changeLangauge = (event, index, value) => {
    this.setState({ appLang: value });
  };

  saveAppLanguage = (e) => {
    const currentTrans = AutographaStore.currentTrans;
    refDb
      .get("app_locale")
      .then((doc) => {
        doc.appLang = this.state.appLang;
        refDb.put(doc);
        this.setState({
          message: "dynamic-msg-save-language",
          hideAlert: "success",
        });
        setTimeout(() => {
          this.setState({ hideAlert: "hidemessage" });
        }, 2000);
      })
      .catch((err) => {
        if (err.message === "missing") {
          var locale = {
            _id: "app_locale",
            appLang: this.state.appLang,
          };
          refDb
            .put(locale)
            .then(function (res) {
              swal(
                currentTrans["btn-save-changes"],
                currentTrans["dynamic-msg-save-language"],
                "success"
              );
            })
            .catch(function (internalErr) {
              swal(
                currentTrans["dynamic-msg-error"],
                currentTrans["dynamic-msg-went-wrong"],
                "success"
              );
            });
        }
      });
  };

  onChangeScriptDir = (value) => {
    AutographaStore.scriptDirection = value;
  };
  onChangeRefScriptDir = (value) => {
    AutographaStore.refScriptDirection = value;
  };
  hideCodeList = () => {
    this.setState({ _listArray: [] });
  };

  handleOutsideClick = (e) => {
    // ignore clicks on the component itself
    if (this.node && this.node.contains(e.target)) {
      return;
    }
    this.hideCodeList();
  };
  clearList = () => {
    this.hideCodeList();
  };

  handleClose = () => {
    this.setState({ show: false });
    //clearing import report states
    this.setState({
      successFile: [],
      errorFile: [],
      warningFile: [],
      warningTitle: "",
      successTitle: "",
      errorTitle: "",
    });
    AutographaStore.warningMsg = [];
  };

  handleChange = (panel) => (event, isExpanded) => {
    if (isExpanded === undefined && flag === false) {
      isExpanded = true;
      flag = true;
    } else if (isExpanded === undefined && flag === true) {
      isExpanded = false;
      flag = false;
    }
    this.setState({ expanded: isExpanded ? panel : false });
  };

  handleErrChange = (panel) => (event, isExpanded) => {
    if (isExpanded === undefined && flag === false) {
      isExpanded = true;
      flag = true;
    } else if (isExpanded === undefined && flag === true) {
      isExpanded = false;
      flag = false;
    }
    this.setState({ expanded: isExpanded ? panel : false });
  };

  handleSelect = (key) => {
    this.setState({ key: key });
  };

  render() {
    var errorStyle = {
      margin: "auto",
      textAlign: "center",
    };

    let closeSetting = () => (AutographaStore.showModalSettings = false);
    const { show } = this.props;
    const { showMsg, modalBody, title } = this.state;
    const {
      langCodeValue,
      langCode,
      langVersion,
      folderPath,
    } = this.state.settingData;
    const {
      bibleName,
      refVersion,
      refLangCodeValue,
      refLangCode,
      refFolderPath,
    } = this.state.refSetting;

    const listCode = this.state._listArray;
    let displayCSS = "none";
    if (
      listCode != null &&
      Object.keys(listCode).length > 0 &&
      this.state.visibleList
    ) {
      displayCSS = "inline-block";
    } else {
      displayCSS = "none";
    }
    if (this.state.showLoader) {
      return <Loader />;
    }

    return (
      <div>
        <Modal show={show} onHide={closeSetting} id="tab-settings">
          <Modal.Header closeButton>
            <Modal.Title>
              <FormattedMessage id="modal-title-setting" />
            </Modal.Title>
            <div
              className={
                "alert " +
                (this.state.hideAlert != "hidemessage"
                  ? this.state.hideAlert === "success"
                    ? "alert-success msg"
                    : "alert-danger msg"
                  : "invisible")
              }
            >
              <span>
                {this.state.message ? (
                  <FormattedMessage id={this.state.message} />
                ) : (
                  ""
                )}
              </span>
            </div>
          </Modal.Header>
          <Modal.Body>
            <Tab.Container id="left-tabs-example" defaultActiveKey="first">
              <Row className="clearfix">
                <Col sm={4}>
                  <Nav bsStyle="pills" stacked>
                    <NavItem eventKey="first">
                      <FormattedMessage id="label-translation-details" />
                    </NavItem>
                    <NavItem eventKey="second">
                      <FormattedMessage id="label-import-translation" />
                    </NavItem>
                    <NavItem eventKey="third" onClick={this.hideCodeList}>
                      <FormattedMessage id="label-import-ref-text" />
                    </NavItem>
                    <NavItem eventKey="fourth" onClick={this.loadReference}>
                      <FormattedMessage id="label-manage-ref-texts" />
                    </NavItem>
                    <NavItem eventKey="fifth">
                      <FormattedMessage id="label-language" />
                    </NavItem>
                  </Nav>
                </Col>
                <Col sm={8}>
                  <Tab.Content animation>
                    <Tab.Pane eventKey="first">
                      <div data-tip="Length should be between 2 and 8 characters and can’t start with a number.">
                        <label>
                          <FormattedMessage id="label-language-code" />
                        </label>
                        <br />
                        <TextField
                          hintText="eng"
                          onChange={this.onChangeList.bind(this)}
                          value={langCodeValue || ""}
                          name="langCode"
                          className="textbox-width-70 margin-top-24"
                          id="lang-code"
                        />
                      </div>
                      <div
                        id="target-lang-result"
                        className="lang-code"
                        style={{ display: displayCSS }}
                        ref={(node) => {
                          this.node = node;
                        }}
                      >
                        <ul>
                          {this.state.visibleList && listCode != null ? (
                            Object.keys(listCode).map((key, index) => {
                              return (
                                <li
                                  key={index}
                                  onClick={this.clickListSettingData.bind(
                                    this,
                                    listCode[key],
                                    `(${key})`
                                  )}
                                >
                                  <span className="code-name">
                                    {listCode[key]} {`(${key})`}
                                  </span>
                                </li>
                              );
                            })
                          ) : (
                            <li />
                          )}
                        </ul>
                      </div>
                      <div>
                        <label>
                          <FormattedMessage id="label-version" />
                        </label>
                        <br />
                        <TextField
                          hintText="NET-S3"
                          onChange={this.onChange.bind(this)}
                          value={langVersion || ""}
                          name="langVersion"
                          className="margin-top-24 textbox-width-70"
                          onFocus={this.clearList}
                          id="lang-version"
                        />
                      </div>
                      <div>
                        <label>
                          <FormattedMessage id="label-export-folder-location" />
                        </label>
                        <br />
                        <FormattedMessage id="placeholder-saving-usfm-files">
                          {(message) => (
                            <TextField
                              hintText={message}
                              onChange={this.onChange.bind(this)}
                              value={folderPath || ""}
                              name="folderPath"
                              onClick={this.openFileDialogSettingData}
                              className="margin-top-24 textbox-width-70"
                              id="export-folder-location"
                            />
                          )}
                        </FormattedMessage>
                      </div>
                      <div
                        style={{ display: "flex" }}
                        className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label"
                      >
                        <label
                          style={{ marginTop: "-24px", fontSize: "14px" }}
                          className="mdl-textfield__label"
                          id="label-script-dir"
                        >
                          <FormattedMessage id="label-script-direction" />
                        </label>
                        <RadioButtonGroup
                          valueSelected={AutographaStore.scriptDirection.toUpperCase()}
                          name="scriptDir"
                          style={{
                            display: "flex",
                            marginBottom: "6%",
                            width: "100%",
                          }}
                          onChange={(event, value) =>
                            this.onChangeScriptDir(value)
                          }
                        >
                          <RadioButton
                            value="LTR"
                            label={<FormattedMessage id="label-ltr" />}
                            style={{ width: "30%" }}
                          />
                          <RadioButton
                            value="RTL"
                            label={<FormattedMessage id="label-rtl" />}
                            style={{ width: "70%" }}
                          />
                        </RadioButtonGroup>
                      </div>
                      <FormattedMessage id="btn-save">
                        {(message) => (
                          <RaisedButton
                            style={{ float: "right", marginRight: "33px" }}
                            label={message}
                            primary={true}
                            onClick={this.saveSetting}
                            id="save-setting"
                          />
                        )}
                      </FormattedMessage>
                    </Tab.Pane>

                    <Tab.Pane eventKey="second">
                      <div className="form-group">
                        <label>
                          <FormattedMessage id="label-file-location" />
                        </label>
                        <br />
                        <FormattedMessage id="placeholder-select-usfm-files">
                          {(message) => (
                            <div>
                              <TextField
                                hintText={message}
                                onChange={(event) => {
                                  this.setState({
                                    folderPathImport: event.target.value,
                                  });
                                }}
                                value={this.state.folderPathImport || ""}
                                name="folderPathImport"
                                className="margin-top-24 textbox-width-70"
                                id="import-file-trans"
                              />
                              <div className="folder-selection">
                                <Icon
                                  style={{ margin: "2" }}
                                  onClick={this.openFileDialogImportTrans}
                                >
                                  folder
                                </Icon>
                              </div>
                            </div>
                          )}
                        </FormattedMessage>
                        <FormattedMessage id="btn-import">
                          {(message) => (
                            <RaisedButton
                              style={{
                                float: "right",
                                marginRight: "33px",
                                marginTop: "257px",
                              }}
                              label={message}
                              primary={true}
                              onClick={this.importTranslation}
                              id="btn-import-trans"
                            />
                          )}
                        </FormattedMessage>
                      </div>
                    </Tab.Pane>

                    <Tab.Pane eventKey="third">
                      <div>
                        <label>
                          <FormattedMessage id="label-bible-name" />
                        </label>
                        <br />
                        <FormattedMessage id="placeholder-eng-translation">
                          {(message) => (
                            <TextField
                              hintText={message}
                              onChange={this.onReferenceChange.bind(this)}
                              value={bibleName || ""}
                              name="bibleName"
                              className="margin-top-24 textbox-width-70"
                              id="import-ref-name"
                            />
                          )}
                        </FormattedMessage>
                      </div>
                      <div data-tip="Length should be between 2 and 8 characters and can’t start with a number.">
                        <label>
                          <FormattedMessage id="label-language-code" />
                        </label>
                        <br />
                        <TextField
                          hintText="eng"
                          onChange={this.onReferenceChangeList.bind(this)}
                          value={refLangCode || ""}
                          name="refLangCode"
                          className="margin-top-24 textbox-width-70"
                          id="import-ref-lang"
                        />
                      </div>
                      <div
                        id="reference-lang-result"
                        className="lang-code"
                        style={{ display: displayCSS }}
                        ref={(node) => {
                          this.node = node;
                        }}
                      >
                        <ul>
                          {listCode != null ? (
                            Object.keys(listCode).map((key, index) => {
                              return (
                                <li
                                  key={index}
                                  onClick={this.clickListrefSetting.bind(
                                    this,
                                    listCode[key],
                                    `(${key})`
                                  )}
                                >
                                  <span className="code-name">
                                    {listCode[key]} {`(${key})`}
                                  </span>
                                </li>
                              );
                            })
                          ) : (
                            <li />
                          )}
                        </ul>
                      </div>
                      <div>
                        <label>
                          <FormattedMessage id="label-version" />
                        </label>
                        <br />
                        <TextField
                          hintText="NET-S3"
                          onChange={this.onReferenceChange.bind(this)}
                          value={refVersion || ""}
                          name="refVersion"
                          className="margin-top-24 textbox-width-70"
                          onFocus={this.clearList}
                          id="import-ref-version"
                        />
                      </div>
                      <div
                        style={{ display: "flex" }}
                        className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label"
                      >
                        <label
                          style={{ marginTop: "-29px", fontSize: "14px" }}
                          className="mdl-textfield__label"
                          id="label-script-dir"
                        >
                          <FormattedMessage id="label-script-direction" />
                        </label>
                        <RadioButtonGroup
                          valueSelected={AutographaStore.refScriptDirection}
                          name="refscriptDir"
                          style={{
                            display: "flex",
                            marginBottom: "-6%",
                            width: "100%",
                          }}
                          onChange={(event, value) =>
                            this.onChangeRefScriptDir(value)
                          }
                        >
                          <RadioButton
                            value="LTR"
                            label={<FormattedMessage id="label-ltr" />}
                            style={{ width: "30%" }}
                          />
                          <RadioButton
                            value="RTL"
                            label={<FormattedMessage id="label-rtl" />}
                            style={{ width: "70%" }}
                          />
                        </RadioButtonGroup>
                      </div>
                      <div>
                        <label>
                          <FormattedMessage id="label-folder-location" />
                        </label>
                        <br />
                        <FormattedMessage id="placeholder-path-of-usfm-files">
                          {(message) => (
                            <div>
                              <TextField
                                hintText={message}
                                onChange={this.onReferenceChange}
                                value={refFolderPath || ""}
                                ref="refFolderPath"
                                name="refFolderPath"
                                className="margin-top-24 textbox-width-70"
                                id="import-ref-path"
                              />
                              <div className="folder-selection">
                                <Icon
                                  style={{ margin: "2" }}
                                  onClick={this.openFileDialogRefSetting}
                                >
                                  folder
                                </Icon>
                              </div>
                            </div>
                          )}
                        </FormattedMessage>
                      </div>
                      <FormattedMessage id="btn-import">
                        {(message) => (
                          <RaisedButton
                            style={{ float: "right", marginRight: "33px" }}
                            label={message}
                            primary={true}
                            onClick={this.importReference}
                            id="btn-import-ref"
                          />
                        )}
                      </FormattedMessage>
                    </Tab.Pane>

                    <Tab.Pane eventKey="fourth">
                      <div style={{ overflowY: "scroll", maxHeight: "343px" }}>
                        <table className="table table-bordered table-hover table-striped">
                          <thead>
                            <tr>
                              <th>
                                <FormattedMessage id="tbl-header-name" />
                              </th>
                              <th>
                                <FormattedMessage id="label-language-code" />
                              </th>
                              <th>
                                <FormattedMessage id="label-version" />
                              </th>
                              <th>
                                <FormattedMessage id="tbl-header-action" />
                              </th>
                            </tr>
                          </thead>
                          <tbody id="reference-list">
                            {AutographaStore.refListEdit.map((ref, index) => {
                              let ref_first = ref.ref_id.substr(
                                0,
                                ref.ref_id.indexOf("_")
                              );
                              let ref_except_first = ref.ref_id.substr(
                                ref.ref_id.indexOf("_") + 1
                              );
                              return (
                                <tr key={index}>
                                  <td>
                                    {this.state.bibleReference &&
                                    this.state.refIndex != index ? (
                                      <div>{ref.ref_name}</div>
                                    ) : !this.state.bibleReference &&
                                      this.state.refIndex === index ? (
                                      <div>
                                        <input
                                          type="text"
                                          onChange={this.onChangeBible.bind(
                                            this
                                          )}
                                          value={this.state.refName}
                                          name="biblename"
                                        />
                                        <div style={{ marginLeft: "22%" }}>
                                          <a
                                            title="Rename"
                                            style={{ paddingRight: "4px" }}
                                            href="javascript:void(0);"
                                            className="edit-ref"
                                            data-rename={ref.ref_name}
                                            value={ref.ref_name}
                                            onClick={this.onReferenceSave.bind(
                                              this,
                                              ref.ref_id
                                            )}
                                          >
                                            <FormattedMessage id="btn-save" />
                                          </a>
                                          <span>|</span>
                                          <a
                                            title="Remove"
                                            style={{ paddingLeft: "4px" }}
                                            href="javascript:void(0);"
                                            className="remove-ref"
                                            data-remove={ref.ref_name}
                                            onClick={() =>
                                              this.onReferenceCancel(
                                                ref.ref_name
                                              )
                                            }
                                          >
                                            Cancel
                                          </a>
                                        </div>
                                      </div>
                                    ) : (
                                      <div>{ref.ref_name}</div>
                                    )}
                                  </td>
                                  <td>{ref.ref_lang_code}</td>
                                  <td>{ref_except_first}</td>
                                  <td>
                                    {
                                      <div>
                                        <a
                                          title="Rename"
                                          style={{ paddingRight: "4px" }}
                                          href="javascript:void(0);"
                                          className="edit-ref"
                                          data-rename={ref.ref_name}
                                          value={ref.ref_name}
                                          onClick={() =>
                                            this.onReferenceRename(
                                              ref.ref_name,
                                              index
                                            )
                                          }
                                        >
                                          Rename
                                        </a>
                                        <span>|</span>
                                        <a
                                          title="Remove"
                                          style={{ paddingLeft: "4px" }}
                                          href="javascript:void(0);"
                                          className="remove-ref"
                                          data-remove={
                                            ref_first + "_" + ref_except_first
                                          }
                                          onClick={() =>
                                            this.onReferenceRemove(
                                              ref_first + "_" + ref_except_first
                                            )
                                          }
                                        >
                                          Remove
                                        </a>
                                      </div>
                                    }
                                  </td>
                                </tr>
                              );
                            })}
                            {AutographaStore.refListExist.map((ref, index) => {
                              let ref_first = ref.ref_id.substr(
                                0,
                                ref.ref_id.indexOf("_")
                              );
                              let ref_except_first = ref.ref_id.substr(
                                ref.ref_id.indexOf("_") + 1
                              );
                              return (
                                <tr key={index}>
                                  <td>{ref.ref_name}</td>
                                  <td>{ref.ref_lang_code}</td>
                                  <td>{ref_except_first}</td>
                                  <td>{}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </Tab.Pane>

                    <Tab.Pane eventKey="fifth">
                      <div id="app-lang-setting" className="tabcontent">
                        <div className="form-group">
                          <div className="mdl-selectfield mdl-js-selectfield">
                            <label
                              id="language-select"
                              className="mdl-selectfield__label"
                            >
                              <FormattedMessage id="label-select-language" />
                            </label>
                            <br />
                            <SelectField
                              className="mdl-selectfield__select"
                              id="localeList"
                              value={this.state.appLang}
                              onChange={this.changeLangauge}
                            >
                              <MenuItem value={"ar"} primaryText="Arabic" />
                              <MenuItem value={"en"} primaryText="English" />
                              <MenuItem value={"hi"} primaryText="Hindi" />
                              <MenuItem value={"pt"} primaryText="Portuguese" />
                              <MenuItem value={"es"} primaryText="Spanish" />
                            </SelectField>
                          </div>
                        </div>
                        <button
                          className="btn btn-success btn-save"
                          id="btnSaveLang"
                          onClick={this.saveAppLanguage}
                        >
                          <FormattedMessage id="btn-save" />
                        </button>
                      </div>
                    </Tab.Pane>
                  </Tab.Content>
                </Col>
              </Row>
            </Tab.Container>
          </Modal.Body>
        </Modal>
        <Modal
          className="import-report"
          show={this.state.show}
          onHide={this.handleClose}
        >
          <Modal.Header className="head" closeButton>
            <Modal.Title>
              <FormattedMessage id="modal-import-report" />
            </Modal.Title>
          </Modal.Header>
          <div>
            <Tabs
              activeKey={this.state.key}
              onSelect={this.handleSelect}
              id="controlled-tab-example"
            >
              <Tab
                eventKey={1}
                style={{ width: "auto" }}
                title={
                  <div className="success-title">
                    <FormattedMessage id="tooltip-import-title" /> (
                    {this.state.successFile.length +
                      this.state.warningFile.length}
                    /{this.state.totalFile.length})
                  </div>
                }
              >
                <Modal.Body
                  className={this.state.successTitle ? "imported-files" : ""}
                  onDoubleClick={this.handleChange("panel")}
                >
                  <div
                    style={{ position: "absolute", top: "-4px", right: "39px" }}
                  >
                    {this.state.warningTitle ? (
                      <ExpandMoreIcon
                        onClick={this.handleErrChange("panel")}
                        style={{
                          borderRadius: "35%",
                          backgroundColor: "#a59f9f",
                        }}
                      />
                    ) : (
                      ""
                    )}
                  </div>
                  {this.state.successFile.map((success, key) => (
                    <div
                      id={key}
                      key={key}
                      style={{
                        width: "200px",
                        textAlign: "center",
                        float: "left",
                        margin: "2px 1px 2px 1px",
                      }}
                    >
                      <ExpansionPanelSummary
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        style={{ backgroundColor: "lightgreen" }}
                      >
                        <Typography>{success}</Typography>
                      </ExpansionPanelSummary>
                    </div>
                  ))}
                  {this.state.warningFile.map((_warning, key) => (
                    <div
                      id={key}
                      key={key}
                      style={{
                        width: "200px",
                        textAlign: "center",
                        display: "inline-block",
                        margin: "1px",
                      }}
                    >
                      <ExpansionPanel
                        expanded={
                          this.state.expanded === "panel" + key ||
                          this.state.expanded === "panel"
                        }
                        onChange={this.handleChange("panel" + key)}
                      >
                        <ExpansionPanelSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                          style={{ backgroundColor: "yellow" }}
                        >
                          <Typography>{_warning.filename}</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                          <Typography>
                            <FormattedMessage id="usfm-warning1-chapter" />{" "}
                            {numberFormat.getNumberFormat(_warning.chapter)}{" "}
                            <FormattedMessage id="usfm-warning2-chapter" />
                          </Typography>
                        </ExpansionPanelDetails>
                      </ExpansionPanel>
                    </div>
                  ))}
                  {this.state.successFile.length +
                    this.state.warningFile.length ===
                  0 ? (
                    <div style={{ textAlign: "center" }}>
                      <FormattedMessage id="tooltip-noimport-title" />
                    </div>
                  ) : (
                    ""
                  )}
                </Modal.Body>
              </Tab>
              <Tab
                eventKey={2}
                title={
                  <div className="error-title">
                    {<FormattedMessage id="tooltip-error-title" />} (
                    {this.state.errorFile.length +
                      "/" +
                      this.state.totalFile.length}
                    )
                  </div>
                }
              >
                <Modal.Body
                  className={this.state.errorTitle ? "error-files" : ""}
                >
                  <div
                    style={{ position: "absolute", top: "-4px", right: "39px" }}
                  >
                    {this.state.errorTitle ? (
                      <ExpandMoreIcon
                        onClick={this.handleErrChange("Errpanel")}
                        style={{
                          borderRadius: "35%",
                          backgroundColor: "#a59f9f",
                        }}
                      />
                    ) : (
                      ""
                    )}
                  </div>
                  {this.state.errorFile.map((err, key) => (
                    <div
                      id={key}
                      key={key}
                      style={{
                        width: "200px",
                        textAlign: "center",
                        display: "inline-block",
                        margin: "1px",
                      }}
                    >
                      <ExpansionPanel
                        expanded={
                          this.state.expanded === "Errpanel" + key ||
                          this.state.expanded === "Errpanel"
                        }
                        onChange={this.handleErrChange("Errpanel" + key)}
                      >
                        <ExpansionPanelSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                          style={{ backgroundColor: "red" }}
                        >
                          <Typography>
                            {err.match(/(.*)(\.usfm|\.sfm)(.*)/i)[1] +
                              err.match(/(.*)(\.usfm|\.sfm)(.*)/i)[2]}
                          </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                          <Typography>
                            {err.match(/(.*)(\.usfm|\.sfm)(.*)/i)[3]}
                          </Typography>
                        </ExpansionPanelDetails>
                      </ExpansionPanel>
                    </div>
                  ))}
                  {this.state.errorFile.length === 0 ? (
                    <div style={{ textAlign: "center" }}>
                      <FormattedMessage id="tooltip-noerror-title" />
                    </div>
                  ) : (
                    ""
                  )}
                </Modal.Body>
              </Tab>
            </Tabs>
          </div>
          <Modal.Footer />
        </Modal>
      </div>
    );
  }
}

module.exports = SettingsModal;
