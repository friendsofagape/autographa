import React from "react";
import { observer } from "mobx-react";
import * as mobx from "mobx";
import AutographaStore from "./AutographaStore";
import { FormattedMessage } from "react-intl";
const numberFormat = require("../util/getNumberFormat");
const Constant = require("../util/constants");
const Modal = require("react-bootstrap/lib/Modal");

@observer
class Statistic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emptyChapter: [],
      incompleteVerse: [],
    };
  }
  render() {
    let close = () => (AutographaStore.showModalStat = false);
    const incompleteVerse = mobx.toJS(AutographaStore.incompleteVerse);
    const multipleSpaces = mobx.toJS(AutographaStore.multipleSpaces);
    const emptyChapters = mobx.toJS(AutographaStore.emptyChapter);
    let bookName = Constant.booksList[parseInt(AutographaStore.bookId, 10) - 1];
    bookName = bookName.replace(/\s/g, "-");
    const { show } = this.props;

    return (
      <Modal show={show} onHide={close} id="tab-about">
        <Modal.Header closeButton>
          <Modal.Title>
            <FormattedMessage id="label-statistic-heading" />{" "}
            <FormattedMessage id={`book-${bookName.toLowerCase()}`} />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="panel  panel-default">
            <div className="panel-heading">
              <FormattedMessage id="label-empty-chapters" />
            </div>
            <div className="panel-body">
              <span className="empty-chapter-report">
                {emptyChapters.length != 0 ? (
                  `${numberFormat.getNumberFormat(emptyChapters)} `
                ) : (
                  <FormattedMessage id="label-not-found" />
                )}
              </span>
            </div>
          </div>

          <div className="panel panel-default">
            <div className="panel-heading">
              <FormattedMessage id="label-incomplete-verses" />
            </div>
            <div className="panel-body incomplete-verse-report">
              {Object.keys(incompleteVerse).length > 0 ? (
                Object.keys(incompleteVerse).map((key, i) => {
                  return (
                    <span key={"c" + i}>
                      <span>{key}:</span>
                      <span>
                        {`${numberFormat.getNumberFormat(
                          incompleteVerse[key]
                        )}`}
                        {Object.keys(incompleteVerse).length > i + 1 ? ";" : ""}{" "}
                      </span>
                    </span>
                  );
                })
              ) : (
                <FormattedMessage id="label-not-found" />
              )}
            </div>
          </div>
          <div className="panel  panel-default">
            <div className="panel-heading">
              <FormattedMessage id="label-multiple-spaces" />
            </div>
            <div className="panel-body multiple-space-report">
              {Object.keys(multipleSpaces).length > 0 ? (
                Object.keys(multipleSpaces).map((key, i) => {
                  return (
                    <span key={"c" + i}>
                      <span>{key}:</span>
                      <span>
                        {`${numberFormat.getNumberFormat(
                          multipleSpaces[key]
                        )} `}
                        {Object.keys(multipleSpaces).length > i + 1 ? ";" : ""}
                      </span>
                    </span>
                  );
                })
              ) : (
                <FormattedMessage id="label-not-found" />
              )}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}

module.exports = Statistic;
