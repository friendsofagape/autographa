import React from "react";
import { Button } from "@material-ui/core";
import swal from "sweetalert";
import AutographaStore from "../../AutographaStore";
import Loader from "../../Loader/Loader";
const db = require(`${__dirname}/../../../core/data-provider`).targetDb();
const booksCodes = require(`${__dirname}/../../../core/constants.js`)
  .bookCodeList;

const Import = (props) => {
  const [showLoader, setShowLoader] = React.useState(false);

  const importBookParatext = () => {
    const projectId = props.projectId;
    var selectedBooks = Object.keys(props.books).filter(
      (key) => props.books[key] === true
    );
    if (selectedBooks == null || Object.keys(selectedBooks).length === 0) {
      swal(
        'AutographaStore.currentTrans["dynamic-msg-error"]',
        'AutographaStore.currentTrans["label-selection"]',
        "error"
      );
      return;
    }
    const currentTrans = AutographaStore.currentTrans;
    swal({
      title: currentTrans["label-warning"],
      text: currentTrans["label-override-text"],
      icon: "warning",
      buttons: [currentTrans["btn-cancel"], currentTrans["btn-ok"]],
      dangerMode: false,
      closeOnClickOutside: false,
      closeOnEsc: false,
    }).then((action) => {
      if (action) {
        setShowLoader(true);
        selectedBooks.map(async (bookId) => {
          let bookData = await props.syncAdapter.getUsxBookData(
            projectId,
            bookId
          );
          let book = {};
          let parser = new DOMParser();
          let xmlDoc = parser.parseFromString(bookData, "text/xml");
          //Modifying the exisitng dom and uploading to paratext
          if (xmlDoc.evaluate) {
            let chapterNodes = xmlDoc.evaluate(
              "//chapter",
              xmlDoc,
              null,
              XPathResult.ANY_TYPE,
              null
            );
            let verseNodes = xmlDoc.evaluate(
              "//verse",
              xmlDoc,
              null,
              XPathResult.ANY_TYPE,
              null
            );
            let currChapter = chapterNodes.iterateNext();
            book[currChapter.attributes["number"].value] = [];
            let currVerse = verseNodes.iterateNext();
            while (currVerse) {
              if (
                currVerse.attributes["number"].value === 1 &&
                book[currChapter.attributes["number"].value].length !== 0
              ) {
                currChapter = chapterNodes.iterateNext();
                book[currChapter.attributes["number"].value] = [];
              }
              if (!currVerse.nextSibling) {
                //do nothing
              } else {
                let temp = currVerse.nextSibling;
                let verseText = "";
                while (true) {
                  if (!temp || temp.nodeName === "verse") {
                    break;
                  }
                  if (temp.nodeName === "note") {
                    //do nothing
                  } else if (temp.nodeName === "#text") {
                    verseText += temp.data;
                    //verseText += temp.textContent;
                  } else {
                    verseText += temp.textContent;
                  }
                  temp = temp.nextSibling;
                }
                // for getting text from sibling of parent para tag
                temp = currVerse.parentElement.nextElementSibling;
                while (true) {
                  if (!temp || temp.nodeName !== "para") {
                    break;
                  }
                  let foundVerse = false;
                  for (let i = 0; i < temp.childNodes.length; i++) {
                    if (temp.childNodes[i].nodeName === "verse") {
                      foundVerse = true;
                    }
                  }
                  if (foundVerse) {
                    break;
                  }
                  if (
                    temp.attributes
                      .getNamedItem("style")
                      .nodeValue.match(/p|(q(\d)?)/g) &&
                    currVerse.parentElement.lastChild.previousSibling ===
                      currVerse
                  ) {
                    verseText += " " + temp.textContent;
                  }
                  temp = temp.nextElementSibling;
                }
                book[currChapter.attributes["number"].value].push({
                  verse_number: currVerse.attributes["number"].value,
                  verse: verseText,
                });
              }
              currVerse = verseNodes.iterateNext();
            }
          }
          //get bookIndex from const
          let bookCode = booksCodes.findIndex((book) => book === bookId);
          db.get((bookCode + 1).toString()).then((doc) => {
            for (let i = 0; i < doc.chapters.length; i++) {
              for (let j = 1; j <= Object.keys(book).length; j++) {
                if (j === doc.chapters[i].chapter) {
                  var versesLen = Math.min(
                    book[j].length,
                    doc.chapters[i].verses.length
                  );
                  for (let k = 0; k < versesLen; k++) {
                    var verseNum = book[j][k].verse_number;
                    if (verseNum.match(/\W/gm)) {
                      let verseNumber = verseNum.match(/\d+/g);
                      doc.chapters[i].verses[
                        parseInt(verseNumber[0], 10) - 1
                      ] = {
                        verse_number: parseInt(verseNumber[0], 10),
                        verse: book[j][k].verse,
                      };

                      // Here instead of i = verseNumber[1], used i = verseNumber[0] so that won't miss any number
                      // If the number is 1,3, therefore the verseNumber[1] will be 3 and will miss number 2

                      for (
                        let count = parseInt(verseNumber[0]) + 1;
                        count <= verseNumber[verseNumber.length - 1];
                        count++
                      ) {
                        doc.chapters[i].verses[count - 1] = {
                          verse_number: parseInt(count, 10),
                          verse: "",
                          joint_verse: parseInt(verseNumber[0]),
                        };
                      }
                    } else {
                      doc.chapters[i].verses[verseNum - 1] = {
                        verse_number: parseInt(verseNum, 10),
                        verse: book[j][k].verse,
                      };
                    }
                    book[j][k] = undefined;
                  }
                  //check for extra verses in the imported usfm here.
                  break;
                }
              }
            }
            db.put(doc)
              .then((response) => {
                setShowLoader(false);
                swal({
                  title: AutographaStore.currentTrans["btn-import"],
                  text: AutographaStore.currentTrans["label-imported-book"],
                  icon: "success",
                  dangerMode: false,
                  closeOnClickOutside: false,
                  closeOnEsc: false,
                }).then((action) => {
                  if (action) {
                    window.location.reload();
                  }
                });
              })
              .catch((err) => {
                setShowLoader(false);
                swal(
                  AutographaStore.currentTrans["dynamic-msg-error"],
                  AutographaStore.currentTrans["dynamic-msg-went-wrong"],
                  "error"
                );
              });
          });
        });
      }
    });
  };

  return (
    <React.Fragment>
      <Button
        variant="contained"
        color="primary"
        component="span"
        onClick={importBookParatext}
      >
        Import
      </Button>
      {showLoader === true ? <Loader /> : ""}
    </React.Fragment>
  );
};
export default Import;
