import React from "react";
import { observer } from "mobx-react";
import AutographaStore from "./AutographaStore";
const session = require("electron").remote.session;

@observer
class ReferencePanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = { verses: [], refContent: "", refList: [], scriptDir: "LTR" };
    session.defaultSession.cookies.get(
      { url: "http://refs.autographa.com" },
      (error, refCookie) => {
        if (refCookie.length > 0) {
          AutographaStore.refId = refCookie[0].value;
        }
      }
    );
    session.defaultSession.cookies.get(
      { url: "http://book.autographa.com" },
      (error, bookCookie) => {
        if (bookCookie.length > 0) {
          AutographaStore.bookId = bookCookie[0].value;
        }
      }
    );
    session.defaultSession.cookies.get(
      { url: "http://chapter.autographa.com" },
      (error, chapterCookie) => {
        if (chapterCookie.length > 0) {
          AutographaStore.chapterId = chapterCookie[0].value;
        }
      }
    );
  }
  copiedSelection = () => {
    document.addEventListener("copy", (event) => {
      const selection = document.getSelection();
      event.clipboardData.setData("text/plain", selection.toString());
      event.preventDefault();
    });
  };
  render() {
    const { tIns, tDel } = this.props;
    return (
      <div className="container-fluid">
        <div className="row row-col-fixed rmvflex" style={{ display: "flex" }}>
          <div
            className="col-sm-12 col-fixed"
            onClick={this.copiedSelection}
            id="section-0"
          >
            {tIns || tDel ? (
              <div style={{ textAlign: "center" }}>
                <span style={{ color: "#27b97e", fontWeight: "bold" }}>
                  (+) {tIns}
                </span>{" "}
                |{" "}
                <span style={{ color: "#f50808", fontWeight: "bold" }}>
                  {" "}
                  (-) {tDel}
                </span>
              </div>
            ) : (
              ""
            )}
            <div className="row">
              <div
                dangerouslySetInnerHTML={{ __html: this.props.refContent }}
                className="col-12 col-ref"
                style={{ whiteSpace: "pre-wrap" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
module.exports = ReferencePanel;
