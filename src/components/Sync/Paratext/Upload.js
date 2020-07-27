import React from "react";
import { Button } from "@material-ui/core";
import swal from "sweetalert";
import AutographaStore from "../../AutographaStore";
import xml2js from "xml2js";
import Loader from "../../Loader/Loader";
const path = require("path");
const db = require(`${__dirname}/../../../core/data-provider`).targetDb();
const booksCodes = require(`${__dirname}/../../../core/constants.js`)
  .bookCodeList;
const { app } = require("electron").remote;
const fs = require("fs");

const Upload = (props) => {
  const [showLoader, setShowLoader] = React.useState(false);
  const uploadBookParatext = async () => {
    const dir = path.join(app.getPath("userData"), "paratext_projects");
    let currentTrans = AutographaStore.currentTrans;
    const projectId = props.projectId,
      projectName = props.projectName;
    var selectedBooks = Object.keys(props.books).filter(
      (key) => props.books[key] === true
    );
    if (selectedBooks == null || Object.keys(selectedBooks).length === 0) {
      swal(
        currentTrans["dynamic-msg-error"],
        currentTrans["label-selection"],
        "error"
      );
      return;
    }
    swal({
      title: currentTrans["label-warning"],
      text: currentTrans["label-uploading-warning"],
      icon: "warning",
      buttons: [currentTrans["btn-cancel"], currentTrans["btn-ok"]],
      dangerMode: false,
      closeOnClickOutside: false,
      closeOnEsc: false,
    }).then(async (action) => {
      if (action) {
        setShowLoader(true);
        await asyncForEach(selectedBooks, async (bookId) => {
          try {
            let bookData = await props.syncAdapter.getUsxBookData(
              projectId,
              bookId
            );
            if (!fs.existsSync(dir)) {
              fs.mkdirSync(dir);
            }
            if (bookData !== undefined || bookData !== null) {
              if (
                !fs.existsSync(
                  path.join(
                    app.getPath("userData"),
                    "paratext_projects",
                    projectName
                  )
                )
              ) {
                fs.mkdirSync(
                  path.join(
                    app.getPath("userData"),
                    "paratext_projects",
                    projectName
                  )
                );
              }
              if (
                fs.existsSync(
                  path.join(
                    app.getPath("userData"),
                    "paratext_projects",
                    projectName
                  )
                )
              ) {
                fs.writeFileSync(
                  path.join(
                    app.getPath("userData"),
                    "paratext_projects",
                    projectName,
                    `${bookId}.xml`
                  ),
                  bookData,
                  "utf8"
                );
                // fs.writeFileSync(path.join(app.getPath('userData'), 'paratext_projects', projectName, `${bookId}_new.xml`), bookData, 'utf8');
              }
            }
          } catch (err) {
            return false;
          }
          let bookRevision = await props.syncAdapter.getBookRevision(
            projectId,
            bookId
          );
          let parser = new xml2js.Parser();
          parser.parseString(bookRevision, (err, result) => {
            let revision = result.RevisionInfo.ChapterInfo[0].$.revision;
            let bookIndex = booksCodes.findIndex((book) => book === bookId);
            db.get((bookIndex + 1).toString())
              .then(async (doc) => {
                let xmlBook = fs.readFileSync(
                  `${app.getPath(
                    "userData"
                  )}/paratext_projects/${projectName}/${bookId.toUpperCase()}.xml`,
                  "utf8"
                );
                const xmlDoc = new DOMParser().parseFromString(
                  xmlBook,
                  "text/xml"
                );
                if (xmlDoc.evaluate) {
                  let chapterNodes = xmlDoc.evaluate(
                    "//chapter",
                    xmlDoc,
                    null,
                    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                    null
                  );
                  let verseNodes = xmlDoc.evaluate(
                    "//verse",
                    xmlDoc,
                    null,
                    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                    null
                  );
                  let dbVerses;
                  let currChapter = chapterNodes.snapshotItem(0);
                  let currVerse;
                  let v = 0;
                  let i = 0;
                  let count;
                  let verseNumber;
                  let verses;
                  let dbContent = ["test"];
                  let verseCount = 1;
                  while (v < verseNodes.snapshotLength) {
                    currVerse = verseNodes.snapshotItem(v);
                    let xmlVerseNum = currVerse.attributes[
                      "number"
                    ].value.match(/^(\d+)/g);
                    v++;
                    // verseCount + 1 is used to check the length of the dbContent
                    if (
                      xmlVerseNum == 1 &&
                      doc.chapters[currChapter.attributes["number"].value]
                        .length != 0 &&
                      verseCount + 1 > dbContent.length
                    ) {
                      currChapter = chapterNodes.snapshotItem(i);
                      dbVerses =
                        doc.chapters[currChapter.attributes["number"].value - 1]
                          .verses;
                      i++;
                      count = 0;
                      verseCount = 0;
                      dbContent = [];
                      for (const verse of dbVerses) {
                        count = count + 1;
                        if (
                          count < dbVerses.length &&
                          dbVerses[count].joint_verse
                        ) {
                          // Finding out the join verses and get their verse number(s)
                          verseNumber =
                            dbVerses[count].joint_verse +
                            "-" +
                            dbVerses[count].verse_number;
                          verses =
                            dbVerses[dbVerses[count].joint_verse - 1].verse;
                          continue;
                        } else {
                          if (verseNumber) {
                            // Push join verse number (1-3) and content.
                            dbContent.push({
                              verse_number: verseNumber,
                              verse: verses,
                            });
                            verseNumber = undefined;
                            verses = undefined;
                          } else {
                            // Push verse number and content.
                            dbContent.push({
                              verse_number: verse.verse_number,
                              verse: verse.verse,
                            });
                          }
                        }
                      }
                    } else {
                      if (
                        xmlVerseNum == 1 &&
                        verseCount + 1 <= dbContent.length
                      ) {
                        v = v - 2;
                        currVerse = verseNodes.snapshotItem(v);
                      }
                    }

                    if (
                      dbContent[verseCount] !== undefined &&
                      verseCount < dbContent.length
                    ) {
                      let dbVerseNum;
                      if (
                        String(dbContent[verseCount].verse_number).match(/\W/gm)
                      ) {
                        let dbVerseNum1 = String(
                          dbContent[verseCount].verse_number
                        ).match(/^(\d+)/g);
                        dbVerseNum = dbVerseNum1[0];
                      } else {
                        dbVerseNum = dbContent[verseCount].verse_number;
                      }
                      if (
                        parseInt(xmlVerseNum[0], 10) >= parseInt(dbVerseNum, 10)
                      ) {
                        if (!currVerse.nextSibling) {
                          currVerse.insertAdjacentText(
                            "afterend",
                            dbContent[verseCount].verse
                          );
                          currVerse.attributes["number"].value =
                            dbContent[verseCount].verse_number;
                        } else if (
                          currVerse.nextElementSibling &&
                          currVerse.nextElementSibling.nodeName === "note"
                        ) {
                          if (
                            currVerse.nextElementSibling.nextSibling &&
                            currVerse.nextElementSibling.nextSibling
                              .nodeName === "#text"
                          ) {
                            currVerse.nextElementSibling.nextSibling.remove();
                          }
                          currVerse.insertAdjacentText(
                            "afterend",
                            dbContent[verseCount].verse
                          );
                          currVerse.attributes["number"].value =
                            dbContent[verseCount].verse_number;
                        } else if (currVerse.nextSibling.nodeName === "#text") {
                          currVerse.nextSibling.remove();
                          currVerse.insertAdjacentText(
                            "afterend",
                            dbContent[verseCount].verse
                          );
                          currVerse.attributes["number"].value =
                            dbContent[verseCount].verse_number;
                        } else {
                          currVerse.insertAdjacentText(
                            "afterend",
                            dbContent[verseCount].verse
                          );
                          currVerse.attributes["number"].value =
                            dbContent[verseCount].verse_number;
                        }
                        if (verseCount + 1 <= dbContent.length) {
                          verseCount++;
                        }
                      } else if (
                        parseInt(xmlVerseNum[0], 10) <
                          parseInt(dbVerseNum, 10) &&
                        xmlVerseNum === 1 &&
                        verseCount + 1 <= dbContent.length
                      ) {
                        // Add new verse node for extra/unjoined verses
                        for (let j = verseCount; j < dbContent.length; j++) {
                          let newClone = currVerse.cloneNode([true]);
                          newClone.attributes["number"].value =
                            dbContent[j].verse_number;
                          // Node can be added on the basis parentNode
                          if (currVerse.parentNode.nodeName === "para") {
                            currVerse.parentNode.appendChild(newClone);
                          } else {
                            currVerse.parentNode.insertBefore(
                              newClone,
                              chapterNodes.snapshotItem(i)
                            );
                          }
                          newClone.insertAdjacentText(
                            "afterend",
                            dbContent[j].verse
                          );
                        }
                        verseCount = dbContent.length;
                        v = v + 1;
                      } else {
                        if (currVerse.nextSibling) {
                          currVerse.nextSibling.remove();
                        }
                        if (currVerse) {
                          currVerse.remove();
                        }
                      }
                    } else {
                      if (currVerse.nextSibling) {
                        currVerse.nextSibling.remove();
                      }
                      if (currVerse) {
                        currVerse.remove();
                      }
                    }
                  }
                }
                try {
                  props.syncAdapter.updateBookData(
                    projectId,
                    bookId,
                    revision,
                    xmlDoc.getElementsByTagName("usx")[0].outerHTML
                  );
                  fs.writeFileSync(
                    `${app.getPath(
                      "userData"
                    )}/paratext_projects/${projectName}/${bookId}.xml`,
                    xmlDoc.getElementsByTagName("BookText")[0].outerHTML,
                    "utf8"
                  );
                  swal(
                    currentTrans["dynamic-msg-book-exported"],
                    currentTrans["label-exported-book"],
                    "success"
                  );
                } catch (err) {
                  swal(
                    currentTrans["dynamic-msg-error"],
                    currentTrans["dynamic-msg-went-wrong"],
                    "error"
                  );
                } finally {
                  setShowLoader(false);
                }
              })
              .catch((err) => {
                setShowLoader(false);
                swal(
                  currentTrans["dynamic-msg-error"],
                  currentTrans["dynamic-msg-went-wrong"],
                  "error"
                );
              });
          });
        });
      }
    });
  };

  const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  };
  return (
    <React.Fragment>
      <Button
        variant="contained"
        color="primary"
        component="span"
        onClick={uploadBookParatext}
      >
        Upload
      </Button>
      {showLoader === true ? <Loader /> : ""}
    </React.Fragment>
  );
};
export default Upload;
