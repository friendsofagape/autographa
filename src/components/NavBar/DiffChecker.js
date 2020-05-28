import React, { useState, useEffect } from "react";
import { Tooltip, IconButton, Zoom } from "@material-ui/core";
import AutographaStore from "../AutographaStore";
import { tokenize } from "string-punctuation-tokenizer";
import * as mobx from "mobx";
import swal from "sweetalert";
const Constant = require("../../core/constants");
const refDb = require(`${__dirname}/../../core/data-provider`).referenceDb();
const db = require(`${__dirname}/../../core/data-provider`).targetDb();
const DiffMatchPatch = require("diff-match-patch");
const dmp_diff = new DiffMatchPatch();

const DiffChecker = () => {
  const [toggle, setToggle] = useState(false);
  const saveTarget = () => {
    let bookNo = AutographaStore.bookId.toString();
    db.get(bookNo).then(
      (doc) => {
        let verses =
          doc.chapters[parseInt(AutographaStore.chapterId, 10) - 1].verses;
        verses.forEach((verse, index) => {
          let vId = "v" + (index + 1);
          // translationContent.push(document.getElementById(vId).textContent.toString());
          verse.verse = cleanVerse(document.getElementById(vId).innerText);
          doc.chapters[
            parseInt(AutographaStore.chapterId, 10) - 1
          ].verses = verses;
        });
        // AutographaStore.translationContent = translationContent;
        db.get(doc._id).then((book) => {
          doc._rev = book._rev;
          db.put(doc).then(
            (response) => {
              let dateTime = new Date();
              AutographaStore.transSaveTime = formatDate(dateTime);
              clearInterval("#saved-time");
            },
            (err) => {
              db.put(doc).then(
                (response) => {
                  let dateTime = new Date();
                  AutographaStore.transSaveTime = formatDate(dateTime);
                },
                (err) => {
                  clearInterval("#saved-time");
                }
              );
              clearInterval("#saved-time");
            }
          );
        });
      },
      (err) => {
        console.log("Error: While retrieving document. " + err);
      }
    );
  };

  const formatDate = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    minutes = minutes < 10 ? "0" + minutes : minutes;
    return hours + ":" + minutes;
  };

  const cleanVerse = (verse) => {
    return verse.replace(/&gt;/g, ">").replace(/&lt;/g, "<");
    // .replace(/\n/g, ' ');
  };

  const setDiff = async (toggled) => {
    let _isSameLanguage = await isSameLanguage();
    console.log(_isSameLanguage, toggle);
    setToggle(toggled);
    if (toggled) {
      saveTarget();
      AutographaStore.setDiff = true;
      if (!_isSameLanguage) {
        AutographaStore.toggle = false;
        setToggle(false);
        swal(
          "Unable to Show Comparison",
          "Compare mode is not meaningful across different languages. Please ensure you have set the translation details in Settings and selected the same language across all panes.",
          "warning"
        );
        return;
      }
    } else {
      AutographaStore.setDiff = false;
    }
    AutographaStore.toggle = toggled;
    refDb.get("targetReferenceLayout").then((doc) => {
      AutographaStore.layout = doc.layout;
      AutographaStore.layoutContent = doc.layout;
      let chapter = AutographaStore.chapterId.toString();
      switch (doc.layout) {
        case 1:
          if (toggled) {
            getDiffText(
              AutographaStore.activeRefs[0],
              AutographaStore.activeRefs[1],
              AutographaStore.bookId,
              chapter,
              0
            ).then((content) => {
              AutographaStore.contentOne = content;
            });
          } else {
            getContent(
              AutographaStore.activeRefs[0] +
                "_" +
                Constant.bookCodeList[parseInt(AutographaStore.bookId, 10) - 1],
              chapter
            ).then((content) => {
              AutographaStore.content = content;
            });
            getContent(
              AutographaStore.activeRefs[1] +
                "_" +
                Constant.bookCodeList[parseInt(AutographaStore.bookId, 10) - 1],
              chapter
            ).then((content) => {
              AutographaStore.contentOne = content;
            });
            getContent(
              AutographaStore.activeRefs[2] +
                "_" +
                Constant.bookCodeList[parseInt(AutographaStore.bookId, 10) - 1],
              chapter
            ).then((content) => {
              AutographaStore.contentTwo = content;
            });
            resetDiffValue();
          }
          break;
        case 2:
          if (toggled) {
            getContent(
              AutographaStore.activeRefs[0] +
                "_" +
                Constant.bookCodeList[parseInt(AutographaStore.bookId, 10) - 1],
              chapter
            ).then((content) => {
              AutographaStore.content = content;
            });
            getDiffText(
              AutographaStore.activeRefs[0],
              AutographaStore.activeRefs[1],
              AutographaStore.bookId,
              chapter,
              1
            ).then((content) => {
              AutographaStore.contentOne = content;
            });
          } else {
            getContent(
              AutographaStore.activeRefs[0] +
                "_" +
                Constant.bookCodeList[parseInt(AutographaStore.bookId, 10) - 1],
              chapter
            ).then((content) => {
              AutographaStore.content = content;
            });
            getContent(
              AutographaStore.activeRefs[1] +
                "_" +
                Constant.bookCodeList[parseInt(AutographaStore.bookId, 10) - 1],
              chapter
            ).then((content) => {
              AutographaStore.contentOne = content;
            });
            resetDiffValue();
          }
          break;

        case 3:
          if (toggled) {
            getContent(
              AutographaStore.activeRefs[0] +
                "_" +
                Constant.bookCodeList[parseInt(AutographaStore.bookId, 10) - 1],
              chapter
            ).then((content) => {
              AutographaStore.content = content;
            });
            getDiffText(
              AutographaStore.activeRefs[0],
              AutographaStore.activeRefs[1],
              AutographaStore.bookId,
              chapter,
              1
            ).then((content) => {
              AutographaStore.contentOne = content;
            });
            getDiffText(
              AutographaStore.activeRefs[1],
              AutographaStore.activeRefs[2],
              AutographaStore.bookId,
              chapter,
              2
            ).then((content) => {
              AutographaStore.contentTwo = content;
            });
          } else {
            getContent(
              AutographaStore.activeRefs[0] +
                "_" +
                Constant.bookCodeList[parseInt(AutographaStore.bookId, 10) - 1],
              chapter
            ).then((content) => {
              AutographaStore.content = content;
            });
            getContent(
              AutographaStore.activeRefs[1] +
                "_" +
                Constant.bookCodeList[parseInt(AutographaStore.bookId, 10) - 1],
              chapter
            ).then((content) => {
              AutographaStore.contentOne = content;
            });
            getContent(
              AutographaStore.activeRefs[2] +
                "_" +
                Constant.bookCodeList[parseInt(AutographaStore.bookId, 10) - 1],
              chapter
            ).then((content) => {
              AutographaStore.contentTwo = content;
            });
            resetDiffValue();
          }
          break;

        default:
      }
    });
    //  AutographaStore.aId  = "";
    var translationContent = [];
    var i,
      tIns = 0,
      tDel = 0;
    var chunkIndex = 0;
    var chunkVerseStart;
    var chunkVerseEnd;
    var chunkGroup = [];
    var chunks = AutographaStore.chunks;
    var verses = AutographaStore.verses;
    var chapter = AutographaStore.chapterId;
    for (i = 0; i < chunks.length; i++) {
      if (parseInt(chunks[i].chp, 10) === parseInt(chapter, 10)) {
        chunkIndex = i + 1;
        chunkVerseStart = parseInt(chunks[i].firstvs, 10);
        chunkVerseEnd = parseInt(chunks[i + 1].firstvs, 10) - 1;
        break;
      }
    }
    db.get(AutographaStore.bookId.toString()).then((targetDoc) => {
      AutographaStore.verses =
        targetDoc.chapters[parseInt(AutographaStore.chapterId, 10) - 1].verses;
      let id =
        AutographaStore.activeRefs[AutographaStore.layout - 1] +
        "_" +
        Constant.bookCodeList[parseInt(AutographaStore.bookId, 10) - 1];
      refDb.get(id).then(function (refdoc) {
        for (i = 0; i < refdoc.chapters.length; i++) {
          if (refdoc.chapters[i].chapter === parseInt(chapter, 10)) {
            break;
          }
        }
        let book_verses = refdoc.chapters[i].verses;
        for (i = 1; i <= AutographaStore.verses.length; i++) {
          if (i > chunkVerseEnd) {
            chunkVerseStart = parseInt(chunks[chunkIndex].firstvs, 10);
            if (
              chunkIndex === chunks.length - 1 ||
              parseInt(chunks[chunkIndex + 1].chp, 10) !== chapter
            ) {
              chunkVerseEnd = verses.length;
            } else {
              chunkIndex++;
              chunkVerseEnd = parseInt(chunks[chunkIndex].firstvs, 10) - 1;
            }
          }
          let chunk = chunkVerseStart + "-" + chunkVerseEnd;
          if (toggled) {
            let verseDiff = dmp_diff.diff_main(
              book_verses[i - 1] ? book_verses[i - 1].verse : "",
              targetDoc.chapters[parseInt(chapter, 10) - 1].verses[i - 1]
                ? targetDoc.chapters[parseInt(chapter, 10) - 1].verses[i - 1]
                    .verse
                : ""
            );
            dmp_diff.diff_cleanupSemantic(verseDiff);
            let diffCount = getDifferenceCount(verseDiff, 0);
            tIns += diffCount["ins"];
            tDel += diffCount["del"];
            let ds = dmp_diff.diff_prettyHtml(verseDiff);
            translationContent.push(
              <span dangerouslySetInnerHTML={{ __html: ds }}></span>
            );
          } else {
            translationContent.push(
              AutographaStore.verses[i - 1].verse.toString()
            );
          }
          chunkGroup.push(chunk);
        }
        AutographaStore.tIns[0] = tIns;
        AutographaStore.tDel[0] = tDel;
        AutographaStore.chunkGroup = chunkGroup;
        AutographaStore.translationContent = translationContent;
      });
    });
  };

  const getContent = (id, chapter) => {
    return refDb.get(id.toString()).then(
      (doc) => {
        for (var i = 0; i < doc.chapters.length; i++) {
          if (doc.chapters[i].chapter === parseInt(chapter, 10)) {
            break;
          }
        }
        let refString =
          doc.chapters[i] &&
          doc.chapters[i].verses
            .map((verse, verseNum) => {
              return `<div type="ref" class="col-12 col-ref ref-contents ${doc.scriptDirection.toLowerCase()}" dir=${
                doc.scriptDirection
              }><div data-verse=r${verseNum + 1}><span class="verse-num"> ${
                doc.scriptDirection === "LTR" ? verseNum + 1 : verseNum + 1
              } </span><span> ${verse.verse}</span></div></div`;
            })
            .join("");
        return refString;
      },
      (err) => {
        return "";
      }
    );
  };

  const getDiffText = (refId1, refId2, book, chapter, layout) => {
    let id1 = refId1 + "_" + Constant.bookCodeList[parseInt(book, 10) - 1],
      id2 = refId2 + "_" + Constant.bookCodeList[parseInt(book, 10) - 1],
      i,
      tIns = 0,
      tDel = 0;
    return refDb
      .get(id1)
      .then((doc) => {
        for (i = 0; i < doc.chapters.length; i++) {
          if (doc.chapters[i].chapter === parseInt(chapter, 10)) {
            break;
          }
        }
        return doc.chapters[i].verses;
      })
      .then((response) => {
        let ref1 = response;
        let i;
        return refDb.get(id2).then((doc) => {
          for (i = 0; i < doc.chapters.length; i++) {
            if (doc.chapters[i].chapter === parseInt(chapter, 10)) {
              break;
            }
          }
          let ref2 = doc.chapters[i].verses;
          var refString = "";
          for (let i = 1; i <= ref1.length; i++) {
            var d = dmp_diff.diff_main(
              ref1[i - 1] ? ref1[i - 1].verse : "",
              ref2[i - 1] ? ref2[i - 1].verse : ""
            );
            dmp_diff.diff_cleanupSemantic(d);
            let diffCount = getDifferenceCount(d, layout);
            tIns += diffCount["ins"];
            tDel += diffCount["del"];
            let ds = dmp_diff.diff_prettyHtml(d);
            refString +=
              '<div data-verse="r' +
              i +
              '"><span class="verse-num">' +
              i +
              "</span><span>" +
              ds +
              "</span></div>";
          }
          if (layout !== 0) {
            AutographaStore.tIns[layout] = tIns;
            AutographaStore.tDel[layout] = tDel;
          }
          tIns = 0;
          tDel = 0;
          return refString;
        });
      });
  };

  const getDifferenceCount = (verse_diff, layout) => {
    let insertions = 0,
      deletions = 0,
      insertWord,
      deleteWord;
    // let re = /\b(\w+)'?(\w+)?\b/g;
    for (let x = 0; x < verse_diff.length; x++) {
      var op = verse_diff[x][0];
      var data = verse_diff[x][1];
      switch (op) {
        case DiffMatchPatch.DIFF_INSERT:
          // insertions += data.match(re) ? data.match(re).length : 0
          insertWord = tokenize({ text: data });
          insertions += insertWord.length;
          break;
        case DiffMatchPatch.DIFF_DELETE:
          // deletions += data.match(re) ? data.match(re).length : 0
          deleteWord = tokenize({ text: data });
          deletions += deleteWord.length;
          break;
        case DiffMatchPatch.DIFF_EQUAL:
          break;
        default:
      }
    }
    return { ins: insertions, del: deletions };
  };

  const isSameLanguage = async () => {
    return db.get("targetBible").then(
      (doc) => {
        let verseLangCode = doc.targetLang;
        let languagedropDown = AutographaStore.layout;
        if (languagedropDown === 1) {
          if (verseLangCode !== AutographaStore.activeRefs[0].split("_")[0]) {
            return false;
          }
        }
        for (var i = 0; i < languagedropDown - 1; i++) {
          let v1 = AutographaStore.activeRefs[i].split("_")[0];
          let v2 = "";

          if (AutographaStore.activeRefs[i + 1].length) {
            v2 = AutographaStore.activeRefs[i + 1].split("_")[0];
          }
          if (verseLangCode !== v1 || verseLangCode !== v2) {
            return false;
          }
        }
        return true;
      },
      (err) => {
        return false;
      }
    );
  };

  const resetDiffValue = () => {
    for (let i = 0; i < 3; i++) {
      AutographaStore.tIns[i] = 0;
      AutographaStore.tDel[i] = 0;
    }
  };

  return (
    <div>
      {console.log(AutographaStore.toggle)}
      <span>
        {toggle === false ? (
          <IconButton
            data-toggle="tooltip"
            data-placement="bottom"
            value={mobx.toJS(AutographaStore.toggle)}
            onClick={() => setDiff(true)}
            id="diff"
          >
            <img
              alt="Brand"
              src={require("../../assets/icons/DiffFiles.svg")}
            />
          </IconButton>
        ) : (
          <IconButton
            value={mobx.toJS(AutographaStore.toggle)}
            style={{ backgroundColor: "#000096", borderRadius: "0%" }}
            onClick={() => setDiff(false)}
            id="diff"
          >
            <img
              alt="Brand"
              src={require("../../assets/icons/DiffFiles.svg")}
            />
          </IconButton>
        )}
      </span>
    </div>
  );
};

export default DiffChecker;
