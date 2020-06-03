import React from "react";
import ReactBootstrapSlider from "react-bootstrap-slider";
import { observer } from "mobx-react";
import AutographaStore from "./AutographaStore";
import { FormattedMessage } from "react-intl";
const refDb = require(`${__dirname}/../util/data-provider`).referenceDb();

@observer
class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.fontChange = this.fontChange.bind(this);
    this.state = {
      onSave: props.onSave,
    };
  }

  handleChange(key) {
    let translationContent = [];
    for (let i = 0; i < AutographaStore.chunkGroup.length; i++) {
      let vId = "v" + (i + 1);
      translationContent.push(
        document.getElementById(vId).textContent.toString()
      );
    }
    AutographaStore.translationContent = translationContent;
    AutographaStore.layout = key;
    AutographaStore.layoutContent = key;
    AutographaStore.aId = key;
    let chapter = AutographaStore.chapterId;
    refDb
      .get("targetReferenceLayout")
      .then(function (doc) {
        refDb.put({
          _id: "targetReferenceLayout",
          layout: key,
          _rev: doc._rev,
        });
      })
      .catch(function (err) {
        refDb
          .put({
            _id: "targetReferenceLayout",
            layout: key,
          })
          .catch(function (err) {});
      });
  }

  fontChange(multiplier) {
    var elements = document.getElementsByClassName("col-ref").length - 1;
    let fontSize = AutographaStore.fontMin;
    if (document.getElementsByClassName("col-ref")[0].style.fontSize == "") {
      document.getElementsByClassName("col-ref")[0].style.fontSize = "14px";
    } else {
      fontSize = parseInt(
        document.getElementsByClassName("col-ref")[0].style.fontSize
      );
    }
    if (multiplier < 0) {
      if (multiplier + fontSize <= AutographaStore.fontMin) {
        fontSize = AutographaStore.fontMin;
      } else {
        fontSize = multiplier + fontSize;
      }
    } else {
      if (multiplier + fontSize >= AutographaStore.fontMax) {
        fontSize = AutographaStore.fontMax;
      } else {
        fontSize = multiplier + fontSize;
      }
    }
    AutographaStore.currentFontValue = fontSize;
    for (var i = 0; i <= elements; i++) {
      document.getElementsByClassName("col-ref")[i].style.fontSize =
        fontSize + "px";
      let colRef = document.getElementsByClassName("col-ref")[i];
      let verseNum = colRef.getElementsByClassName("verse-num");
      for (let i = 0; i < verseNum.length; i++) {
        verseNum[i].style.fontSize = fontSize - 4 + "px";
      }
    }
  }
  sliderFontChange(obj) {
    var elements = document.getElementsByClassName("col-ref").length - 1;
    for (var i = 0; i <= elements; i++) {
      document.getElementsByClassName("col-ref")[i].style.fontSize =
        obj.target.value + "px";
      let colRef = document.getElementsByClassName("col-ref")[i];
      let verseNum = colRef.getElementsByClassName("verse-num");
      for (let i = 0; i < verseNum.length; i++) {
        verseNum[i].style.fontSize = obj.target.value - 4 + "px";
      }
    }
  }

  render() {
    const layout = AutographaStore.layout;
    const toggle = AutographaStore.toggle;
    return (
      <nav className="navbar navbar-default navbar-fixed-bottom">
        <div className="container-fluid">
          <div className="collapse navbar-collapse">
            <div
              style={{ float: "left" }}
              className="btn-group navbar-btn verse-diff-on"
              role="group"
              aria-label="..."
            >
              <span>
                <FormattedMessage id="tooltip-minus-font-size">
                  {(message) => (
                    <a
                      className={`btn btn-default font-button minus ${
                        toggle ? "disabled" : ""
                      }`}
                      data-toggle="tooltip"
                      data-placement="top"
                      title={message}
                      onClick={this.fontChange.bind(this, -2)}
                    >
                      A-
                    </a>
                  )}
                </FormattedMessage>
              </span>
              <ReactBootstrapSlider
                change={this.sliderFontChange.bind(this)}
                value={AutographaStore.currentFontValue}
                step={AutographaStore.fontStep}
                max={AutographaStore.fontMax}
                min={AutographaStore.fontMin}
                orientation="horizontal"
                disabled={toggle ? "disabled" : ""}
              />
              <span>
                <FormattedMessage id="tooltip-plus-font-size">
                  {(message) => (
                    <a
                      className={`btn btn-default font-button plus ${
                        toggle ? "disabled" : ""
                      }`}
                      data-toggle="tooltip"
                      data-placement="top"
                      title={message}
                      onClick={this.fontChange.bind(this, +2)}
                    >
                      A+
                    </a>
                  )}
                </FormattedMessage>
              </span>
            </div>
            <div className="nav navbar-nav navbar-center verse-diff-on">
              <div
                className="btn-group navbar-btn layout"
                role="group"
                aria-label="..."
              >
                <FormattedMessage id="tooltip-2-column">
                  {(message) => (
                    <a
                      className={`btn btn-primary btn-default ${
                        layout == 1 ? "active" : ""
                      } ${toggle ? "disabled" : ""}`}
                      id="btn-2x"
                      onClick={this.handleChange.bind(this, 1)}
                      href="#"
                      data-output="2x"
                      role="multi-window-btn"
                      data-toggle="tooltip"
                      data-placement="top"
                      title={message}
                    >
                      2x &nbsp;<i className="fa fa-columns fa-lg"></i>
                    </a>
                  )}
                </FormattedMessage>
                <FormattedMessage id="tooltip-3-column">
                  {(message) => (
                    <a
                      className={`btn btn-primary btn-default ${
                        layout == 2 ? "active" : ""
                      } ${toggle ? "disabled" : ""}`}
                      id="btn-3x"
                      onClick={this.handleChange.bind(this, 2)}
                      href="#"
                      data-output="3x"
                      role="multi-window-btn"
                      data-toggle="tooltip"
                      data-placement="top"
                      title={message}
                    >
                      3x &nbsp;<i className="fa fa-columns fa-lg"></i>
                    </a>
                  )}
                </FormattedMessage>
                <FormattedMessage id="tooltip-4-column">
                  {(message) => (
                    <a
                      className={`btn btn-primary btn-default ${
                        layout == 3 ? "active" : ""
                      } ${toggle ? "disabled" : ""}`}
                      id="btn-4x"
                      onClick={this.handleChange.bind(this, 3)}
                      href="#"
                      data-output="4x"
                      role="multi-window-btn"
                      data-toggle="tooltip"
                      data-placement="top"
                      title={message}
                    >
                      4x &nbsp;<i className="fa fa-columns fa-lg"></i>
                    </a>
                  )}
                </FormattedMessage>
              </div>
            </div>
            <span id="saved-time">
              {AutographaStore.transSaveTime
                ? `Saved ${AutographaStore.transSaveTime}`
                : ""}
            </span>
            <ul
              style={{ marginRight: "30px", float: "right" }}
              className="nav navbar-nav navbar-right"
            >
              <li>
                <FormattedMessage id="btn-save">
                  {(message) => (
                    <a
                      id="save-btn"
                      data-toggle="tooltip"
                      data-placement="top"
                      title={message}
                      className={`btn btn-success btn-save navbar-btn navbar-right ${
                        toggle ? "disabled" : ""
                      }`}
                      href="#"
                      role="button"
                      onClick={this.state.onSave}
                    >
                      <FormattedMessage id="btn-save" />
                    </a>
                  )}
                </FormattedMessage>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

module.exports = Footer;
