import React from "react";
import { RaisedButton } from "material-ui";
import { observer } from "mobx-react";
import AutographaStore from "./AutographaStore";
import swal from "sweetalert";
import { RadioButton, RadioButtonGroup } from "material-ui/RadioButton";
import { Modal, NavDropdown, MenuItem } from "react-bootstrap";
import { FormattedMessage } from "react-intl";
const db = require(`${__dirname}/../util/data-provider`).targetDb();
const constants = require("../util/constants");
let bibUtil = require("../util/json_to_usfm.js");

@observer
class DownloadModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stageName: "",
      stageChange: "",
      buttonStage: "dynamic-msg-stage-trans",
    };
  }
  onChange = (e) => {
    this.setState({ stageName: e.target.value, stageChange: "" });
  };

  clickStage = (e) => {
    this.setState({
      buttonStage: "label-stage",
      stageChange: e,
      stageName: "",
    });
  };

  onChangeBackupdir = (value) => {
    AutographaStore.backupOption = value;
  };

  exportUsfm = async (e) => {
    AutographaStore.showModalDownload = true;
    const { stageChange, stageName } = this.state;
    let stageInput = stageName ? stageName : `Stage ${stageChange}`;
    const currentTrans = AutographaStore.currentTrans;
    let book = {};
    let filepath;
    let books = AutographaStore.backupOption;
    try {
      let doc = await db.get("targetBible");
      if (books === "current") {
        book.bookNumber = AutographaStore.bookId.toString();
        book.bookName = AutographaStore.editBookNamesMode
          ? AutographaStore.translatedBookNames[
              parseInt(book.bookNumber, 10) - 1
            ]
          : constants.booksList[parseInt(book.bookNumber, 10) - 1];
        book.bookCode =
          constants.bookCodeList[parseInt(book.bookNumber, 10) - 1];
        book.outputPath = doc.targetPath;
        filepath = await bibUtil.toUsfm(book, stageInput, doc);
        AutographaStore.showModalDownload = false;
        swal({
          title: currentTrans["tooltip-export-usfm"],
          text: `${currentTrans["label-exported-file"]}:${filepath}`,
        });
      }
      if (books === "*") {
        constants.bookCodeList.forEach(async (value, index) => {
          book = {};
          book.bookNumber = (index + 1).toString();
          book.bookName = AutographaStore.editBookNamesMode
            ? AutographaStore.translatedBookNames[index]
            : constants.booksList[index];
          book.bookCode = value;
          book.outputPath = doc.targetPath;
          filepath = await bibUtil.toUsfm(book, stageInput, doc);
        });
        AutographaStore.showModalDownload = false;
        swal({
          title: currentTrans["tooltip-export-usfm"],
          text: `${currentTrans["label-backup-usfm"]} : ${doc.targetPath}`,
        });
      }
    } catch (ex) {
      swal(
        currentTrans["dynamic-msg-error"],
        currentTrans["dynamic-msg-enter-translation"]
      );
    } finally {
      AutographaStore.showModalDownload = false;
    }
  };

  render() {
    let closeSearchUSFM = () => (AutographaStore.showModalDownload = false);
    const { stageChange, stageName } = this.state;
    return (
      <Modal
        show={AutographaStore.showModalDownload}
        onHide={closeSearchUSFM}
        id="tab-search"
      >
        <Modal.Header closeButton>
          <Modal.Title id="export-heading">
            <FormattedMessage id="tooltip-export-usfm" />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-lg-9">
              <div className="input-group">
                <FormattedMessage id="placeholder-stage-trans">
                  {(message) => (
                    <input
                      type="text"
                      className="form-control"
                      id="stageText"
                      placeholder={message}
                      name="stageChange"
                      value={
                        stageName
                          ? stageName
                          : stageChange
                          ? `Stage ${stageChange}`
                          : ""
                      }
                      onChange={this.onChange}
                    />
                  )}
                </FormattedMessage>
                <div className="input-group-btn">
                  <NavDropdown
                    eventKey={1}
                    title={
                      <button
                        id="dropdownBtn"
                        type="button"
                        className="btn btn-default dropdown-toggle"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <FormattedMessage id={this.state.buttonStage} />
                        &nbsp;{this.state.stageChange}
                        <span className="caret"></span>
                      </button>
                    }
                    id="export-usfm"
                    noCaret
                  >
                    <MenuItem eventKey="1" onClick={() => this.clickStage("1")}>
                      <span className="stage">
                        <FormattedMessage id="label-stage" />{" "}
                      </span>{" "}
                      1
                    </MenuItem>
                    <MenuItem eventKey="2" onClick={() => this.clickStage("2")}>
                      <span className="stage">
                        <FormattedMessage id="label-stage" />{" "}
                      </span>{" "}
                      2
                    </MenuItem>
                    <MenuItem eventKey="3" onClick={() => this.clickStage("3")}>
                      <span className="stage">
                        <FormattedMessage id="label-stage" />{" "}
                      </span>{" "}
                      3
                    </MenuItem>
                    <MenuItem eventKey="4" onClick={() => this.clickStage("4")}>
                      <span className="stage">
                        <FormattedMessage id="label-stage" />{" "}
                      </span>{" "}
                      4
                    </MenuItem>
                    <MenuItem onClick={() => this.clickStage("5")}>
                      <span className="stage">
                        <FormattedMessage id="label-stage" />{" "}
                      </span>{" "}
                      5
                    </MenuItem>
                  </NavDropdown>
                </div>
              </div>
            </div>
            <div className="col-lg-9">
              <RadioButtonGroup
                valueSelected={AutographaStore.backupOption}
                name="backUpOption"
                style={{
                  display: "inline-flex",
                  marginTop: "13px",
                  width: "100%",
                }}
                onChange={(event, value) => this.onChangeBackupdir(value)}
              >
                <RadioButton
                  value="current"
                  label={<FormattedMessage id="label-current" />}
                  style={{ width: "40%" }}
                />
                <RadioButton
                  value="*"
                  label={<FormattedMessage id="label-all" />}
                  style={{ width: "60%" }}
                />
              </RadioButtonGroup>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <FormattedMessage id="btn-export">
            {(message) => (
              <RaisedButton
                style={{ float: "right", marginLeft: "5px" }}
                disabled={stageName || stageChange ? false : true}
                id="btn-export-usfm"
                label={message}
                primary={true}
                onClick={(e) => this.exportUsfm(e)}
              />
            )}
          </FormattedMessage>
        </Modal.Footer>
      </Modal>
    );
  }
}

module.exports = DownloadModal;
