import React from "react";
import swal from "sweetalert";
import AutographaStore from "../AutographaStore";
import exportHtml from "../../core/convert/export_html";
const db = require(`${__dirname}/../../core/data-provider`).targetDb();
const constants = require("../../core/constants");

const HtmlExport = (props) => {
  const column = props.columns;
  const currentTrans = AutographaStore.currentTrans;
  let id =
    AutographaStore.currentRef +
    "_" +
    constants.bookCodeList[parseInt(AutographaStore.bookId, 10) - 1];
  db.get("targetBible")
    .then((doc) => {
      db.get(AutographaStore.bookId.toString()).then((book) => {
        let currentBookname = AutographaStore.editBookNamesMode
          ? AutographaStore.translatedBookNames[
              parseInt(AutographaStore.bookId, 10) - 1
            ]
          : constants.booksList[parseInt(AutographaStore.bookId, 10) - 1];
        exportHtml.exportHtml(
          id,
          book,
          db,
          doc.langScript,
          column,
          currentTrans,
          currentBookname
        );
      });
    })
    .catch(function (err) {
      swal(
        "Error",
        "Please enter Translation Details in the Settings to continue with Export.",
        "error"
      );
      // handle any errors
      //   swal(
      //     currentTrans["dynamic-msg-error"],
      //     currentTrans["dynamic-msg-enter-translation"],
      //     "error"
      //   );
    });

  return props.htmlClose;
};
export default HtmlExport;
