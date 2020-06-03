import React from "react";
import { observer } from "mobx-react";
import swal from "sweetalert";
import AutographaStore from "./AutographaStore";
import SettingsModal from "./Settings";
import AboutUsModal from "./About";
import SearchModal from "./Search";
import DownloadModal from "./Download";
import TranslationPanel from "../components/TranslationPanel";
import ReferencePanel from "../components/ReferencePanel";
import Footer from "../components/Footer";
import Reference from "./Reference";
import { FormattedMessage } from "react-intl";
import { Toggle } from "material-ui";
import { Modal, Tabs, Tab, NavDropdown, MenuItem } from "react-bootstrap/lib";
import { tokenize } from "string-punctuation-tokenizer";
import { Link } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import { Tooltip, IconButton, Zoom } from "@material-ui/core";
import BookNameEditor from "./BookNameEditor";
import * as mobx from "mobx";
const brandLogo = require("../assets/images/logo.png");
const Constant = require("../util/constants");
const session = require("electron").remote.session;
const DiffMatchPatch = require("diff-match-patch");
const dmp_diff = new DiffMatchPatch();
const refDb = require(`${__dirname}/../util/data-provider`).referenceDb();
const db = require(`${__dirname}/../util/data-provider`).targetDb();
let exportHtml = require(`${__dirname}/../util/export_html.js`);
const bibleJson = require(`${__dirname}/../lib/full_bible_skel.json`);

@observer
class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.handleRefChange = this.handleRefChange.bind(this);
    this.getData = this.getData.bind(this);
    this.state = {
      showModal: false,
      showModalSettings: false,
      showModalSearch: false,
      showModalDownload: false,
      data: Constant,
      chapData: [],
      bookNo: 1,
      defaultRef: "eng_ult",
      defaultRefOne: "eng_ult",
      refList: [],
      searchVal: "",
      replaceVal: "",
      toggled: false,
      setDiff: false,
      toggleEdit: false,
    };

    var verses, chapter;
    var that = this;
    refDb
      .get("ref_history")
      .then(function (doc) {
        var book = doc.visit_history[0].bookId;
        chapter = doc.visit_history[0].chapter;
        AutographaStore.bookId = book.toString();
        AutographaStore.chapterId = chapter;
        AutographaStore.verses = verses;
        db.get(AutographaStore.bookId).then(function (doc) {
          refDb.get("refChunks").then(function (chunkDoc) {
            AutographaStore.verses =
              doc.chapters[parseInt(AutographaStore.chapterId, 10) - 1].verses;
            AutographaStore.chunks =
              chunkDoc.chunks[parseInt(AutographaStore.bookId, 10) - 1];
            chapter = AutographaStore.chapterId;
            that.getRefContents(
              AutographaStore.activeRefs[0] +
                "_" +
                Constant.bookCodeList[parseInt(AutographaStore.bookId, 10) - 1],
              chapter.toString()
            );
          });
        });
      })
      .catch(function (err) {
        AutographaStore.bookId = "1";
        AutographaStore.chapterId = "1";
        console.log(err);
      });
    this.resetDiffValue();
  }
  componentDidMount() {
    db.get("translatedBookNames", function (err, doc) {
      if (err) {
        localStorage.setItem("editBookNamesMode", false);
        let doc = {
          _id: "translatedBookNames",
          books: Constant.booksEditList,
        };
        db.put(doc, function (err, response) {
          if (err) {
            return console.log(err);
          } else {
            window.location.reload();
          }
        });
        return console.log(err);
      } else {
        AutographaStore.translatedBookNames = doc.books;
      }
    });
    AutographaStore.editBookNamesMode = localStorage.getItem(
      "editBookNamesMode"
    );
  }
  getContent = (id, chapter) => {
    return refDb.get(id).then(
      (doc) => {
        for (var i = 0; i < doc.chapters.length; i++) {
          if (doc.chapters[i].chapter == parseInt(chapter, 10)) {
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
                doc.scriptDirection == "LTR" ? verseNum + 1 : verseNum + 1
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

  getDiffText = (refId1, refId2, book, chapter, layout) => {
    let id1 = refId1 + "_" + Constant.bookCodeList[parseInt(book, 10) - 1],
      id2 = refId2 + "_" + Constant.bookCodeList[parseInt(book, 10) - 1],
      i,
      tIns = 0,
      tDel = 0;
    return refDb
      .get(id1)
      .then((doc) => {
        for (i = 0; i < doc.chapters.length; i++) {
          if (doc.chapters[i].chapter == parseInt(chapter, 10)) {
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
            if (doc.chapters[i].chapter == parseInt(chapter, 10)) {
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
            let diffCount = this.getDifferenceCount(d, layout);
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
          if (layout != 0) {
            AutographaStore.tIns[layout] = tIns;
            AutographaStore.tDel[layout] = tDel;
          }
          tIns = 0;
          tDel = 0;
          return refString;
        });
      });
  };

  getRefContents = (id, chapter) => {
    refDb.get("targetReferenceLayout").then((doc) => {
      AutographaStore.layout = doc.layout;
      AutographaStore.layoutContent = doc.layout;
      let chapter = AutographaStore.chapterId.toString();
      this.getContent(
        AutographaStore.activeRefs[0] +
          "_" +
          Constant.bookCodeList[parseInt(AutographaStore.bookId, 10) - 1],
        chapter
      ).then((content) => {
        AutographaStore.content = content
          ? content
          : AutographaStore.currentTrans["label-data-not-found"];
      });
      this.getContent(
        AutographaStore.activeRefs[1] +
          "_" +
          Constant.bookCodeList[parseInt(AutographaStore.bookId, 10) - 1],
        chapter
      ).then((content) => {
        AutographaStore.contentOne = content
          ? content
          : AutographaStore.currentTrans["label-data-not-found"];
      });
      this.getContent(
        AutographaStore.activeRefs[2] +
          "_" +
          Constant.bookCodeList[parseInt(AutographaStore.bookId, 10) - 1],
        chapter
      ).then((content) => {
        AutographaStore.contentTwo = content
          ? content
          : AutographaStore.currentTrans["label-data-not-found"];
      });
    });
    //  AutographaStore.aId  = "";
    var i;
    var chunkIndex = 0;
    var chunkVerseStart;
    var chunkVerseEnd;
    var chunkGroup = [];
    var chunks = AutographaStore.chunks;
    var verses = AutographaStore.verses;
    for (i = 0; i < chunks.length; i++) {
      if (parseInt(chunks[i].chp, 10) === parseInt(chapter, 10)) {
        chunkIndex = i + 1;
        chunkVerseStart = parseInt(chunks[i].firstvs, 10);
        chunkVerseEnd = parseInt(chunks[i + 1].firstvs, 10) - 1;
        break;
      }
    }

    for (i = 1; i <= verses.length; i++) {
      var spanVerseNum = "";
      if (i > chunkVerseEnd) {
        chunkVerseStart = parseInt(chunks[chunkIndex].firstvs, 10);
        if (
          chunkIndex === chunks.length - 1 ||
          parseInt(chunks[chunkIndex + 1].chp, 10) != chapter
        ) {
          chunkVerseEnd = verses.length;
        } else {
          chunkIndex++;
          chunkVerseEnd = parseInt(chunks[chunkIndex].firstvs, 10) - 1;
        }
      }
      var chunk = chunkVerseStart + "-" + chunkVerseEnd;
      var spanVerse = chunk;
      chunkGroup.push(spanVerse);
    }
    AutographaStore.chunkGroup = chunkGroup;
    this.updateTransContent();
  };

  updateTransContent = () => {
    let translationContent = [];
    let jointVerse = [];
    db.get(AutographaStore.bookId.toString()).then((doc) => {
      let verses =
        doc.chapters[parseInt(AutographaStore.chapterId, 10) - 1].verses;
      AutographaStore.verses = verses;
      verses.forEach((verse, index) => {
        translationContent.push(verse.verse);
        jointVerse.push(verse.joint_verse);
      });
      AutographaStore.translationContent = translationContent;
      AutographaStore.jointVerse = jointVerse;
    });
  };

  openpopupSettings() {
    AutographaStore.showModalSettings = true;
  }

  openpopupSearch() {
    AutographaStore.showModalSearch = true;
  }

  openpopupDownload() {
    AutographaStore.showModalDownload = true;
  }

  exportPDF = (e, column) => {
    const currentTrans = AutographaStore.currentTrans;
    let id =
      AutographaStore.currentRef +
      "_" +
      Constant.bookCodeList[parseInt(AutographaStore.bookId, 10) - 1];
    db.get("targetBible")
      .then((doc) => {
        db.get(AutographaStore.bookId.toString()).then((book) => {
          let currentBookname = AutographaStore.editBookNamesMode
            ? AutographaStore.translatedBookNames[
                parseInt(AutographaStore.bookId, 10) - 1
              ]
            : Constant.booksList[parseInt(AutographaStore.bookId, 10) - 1];
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
        // handle any errors
        swal(
          currentTrans["dynamic-msg-error"],
          currentTrans["dynamic-msg-enter-translation"],
          "error"
        );
      });
  };

  openpopupAboutUs() {
    AutographaStore.showModalAboutUs = true;
  }

  openpopupBooks(tab) {
    // event.persist();
    AutographaStore.aId = tab;
    var chap = [];
    AutographaStore.showModalBooks = true;
    AutographaStore.activeTab = tab;
    AutographaStore.bookActive = AutographaStore.bookId;
    // AutographaStore.bookName = Constant.booksList[parseInt(AutographaStore.bookId, 10) - 1]
    AutographaStore.bookName =
      AutographaStore.editBookNamesMode &&
      AutographaStore.translatedBookNames !== null
        ? AutographaStore.translatedBookNames[
            parseInt(AutographaStore.bookId, 10) - 1
          ]
        : Constant.booksList[parseInt(AutographaStore.bookId, 10) - 1];
    AutographaStore.chapterActive = AutographaStore.chapterId;
    this.getData();
  }

  getData() {
    refDb
      .get(
        AutographaStore.currentRef +
          "_" +
          Constant.bookCodeList[parseInt(AutographaStore.bookId, 10) - 1]
      )
      .then(function (doc) {
        AutographaStore.bookChapter["chapterLength"] = doc.chapters.length;
        AutographaStore.bookChapter["bookId"] = AutographaStore.bookId;
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  onItemClick(bookName, requiredIndex) {
    if (AutographaStore.openBookNameEditor === true) {
      AutographaStore.bookNameEditorPopup = true;
      AutographaStore.RequiredIndex = requiredIndex;
    }
    AutographaStore.bookName = bookName;
    AutographaStore.chapterActive = 0;
    // getting chapter list
    let bookIndex = AutographaStore.editBookNamesMode
      ? AutographaStore.bookindex
      : Constant.booksList.findIndex(
          (book) => book.toLowerCase() === bookName.toLowerCase()
        );
    const bookSkel = bibleJson[bookIndex + 1];
    AutographaStore.bookActive = bookIndex + 1;
    AutographaStore.bookChapter["chapterLength"] = bookSkel.chapters.length;
    AutographaStore.bookChapter["bookId"] = bookIndex + 1;
    // moving to next chapter Tab
    if (AutographaStore.bookNameEditorPopup === false) this.goToTab(2);
  }

  handleSelect(key) {
    // this.setState({key});
  }

  goToTab(key) {
    var _this = this;
    AutographaStore.activeTab = key;
  }

  loadData = () => {
    this.getValue(AutographaStore.chapterId, AutographaStore.bookId);
  };

  getValue(chapter, bookId) {
    AutographaStore.translationContent = "";
    AutographaStore.chapterId = chapter;
    AutographaStore.bookId = bookId;
    var verses = AutographaStore.verses;
    var chunks = AutographaStore.chunks;
    this.saveLastVisit(bookId, chapter);
    const cookiechapter = {
      url: "http://chapter.autographa.com",
      name: "chapter",
      value: chapter.toString(),
    };
    session.defaultSession.cookies.set(cookiechapter, (error) => {
      if (error) console.log(error);
    });

    const cookieRef = {
      url: "http://book.autographa.com",
      name: "book",
      value: bookId.toString(),
    };
    session.defaultSession.cookies.set(cookieRef, (error) => {
      if (error) console.log(error);
    });

    session.defaultSession.cookies.get(
      { url: "http://refs.autographa.com" },
      (error, refCookie) => {
        if (refCookie.length > 0) {
          var that = this;
          var chapter;
          var bkId = AutographaStore.bookId.toString();
          db.get(bkId).then(function (doc) {
            refDb.get("refChunks").then(function (chunkDoc) {
              AutographaStore.verses =
                doc.chapters[
                  parseInt(AutographaStore.chapterId, 10) - 1
                ].verses;
              AutographaStore.chunks =
                chunkDoc.chunks[parseInt(AutographaStore.bookId, 10) - 1];
              chapter = AutographaStore.chapterId;
              that.getRefContents(
                AutographaStore.refId +
                  "_" +
                  Constant.bookCodeList[
                    parseInt(AutographaStore.bookId, 10) - 1
                  ],
                chapter.toString()
              );
            });
          });
        } else {
          var that = this;
          var bkId = AutographaStore.bookId.toString();
          var chapter;
          AutographaStore.bookName =
            Constant.booksList[parseInt(AutographaStore.bookId, 10) - 1];
          db.get(bkId).then(function (doc) {
            refDb.get("refChunks").then(function (chunkDoc) {
              AutographaStore.verses =
                doc.chapters[
                  parseInt(AutographaStore.chapterId, 10) - 1
                ].verses;
              AutographaStore.chunks =
                chunkDoc.chunks[parseInt(AutographaStore.bookId, 10) - 1];
              chapter = AutographaStore.chapterId;
              that.getRefContents(
                "eng_ult" +
                  "_" +
                  Constant.bookCodeList[
                    parseInt(AutographaStore.bookId, 10) - 1
                  ],
                chapter.toString()
              );
            });
          });
        }
      }
    );
    AutographaStore.showModalBooks = false;
  }

  saveLastVisit(book, chapter) {
    refDb.get("ref_history").then(function (doc) {
      doc.visit_history = [
        { book: AutographaStore.bookName, chapter: chapter, bookId: book },
      ];
      refDb
        .put(doc)
        .then(function (response) {})
        .catch(function (err) {
          console.log(err);
        });
    });
  }

  getbookCategory(booksstart, booksend) {
    var booksCategory = [];
    for (var i = booksstart; i <= booksend; i++) {
      booksCategory.push(Constant.booksList[i]);
    }
    AutographaStore.bookData = booksCategory;
  }
  formatDate = (date) => {
    let monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "June",
      "July",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    let day = date.getDate();
    let monthIndex = date.getMonth();
    let year = date.getFullYear();
    let hours = date.getHours();
    let seconds = date.getSeconds();
    let minutes = date.getMinutes();
    minutes = minutes < 10 ? "0" + minutes : minutes;

    return hours + ":" + minutes;
  };

  cleanVerse = (verse) => {
    return verse.replace(/&gt;/g, ">").replace(/&lt;/g, "<");
    // .replace(/\n/g, ' ');
  };

  saveTarget = () => {
    let bookNo = AutographaStore.bookId.toString();
    let that = this;
    // let translationContent = [];
    db.get(bookNo).then(
      (doc) => {
        let verses =
          doc.chapters[parseInt(AutographaStore.chapterId, 10) - 1].verses;
        verses.forEach((verse, index) => {
          let vId = "v" + (index + 1);
          // translationContent.push(document.getElementById(vId).textContent.toString());
          verse.verse = this.cleanVerse(document.getElementById(vId).innerHTML);
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
              AutographaStore.transSaveTime = that.formatDate(dateTime);
              clearInterval("#saved-time");
            },
            (err) => {
              db.put(doc).then(
                (response) => {
                  let dateTime = new Date();
                  AutographaStore.transSaveTime = that.formatDate(dateTime);
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

  handleRefChange(refDropDownPos, event) {
    // event.persist();
    AutographaStore.activeRefs[refDropDownPos] = event.target.value;
    refDb.get("activeRefs").then(
      (doc) => {
        doc._rev = doc._rev;
        doc.activeRefs = Object.assign(
          doc.activeRefs,
          AutographaStore.activeRefs
        );
        refDb.put(doc);
      },
      (err) => {
        refDb
          .put({ _id: "activeRefs", activeRefs: AutographaStore.activeRefs })
          .then(
            (res) => {},
            (err) => {
              console.log(err);
            }
          );
      }
    );
    AutographaStore.selectId = event.target.id;
    AutographaStore.layoutContent = parseInt(
      event.currentTarget.dataset.layout
    );
    let referenceValue = event.target.value;
    AutographaStore.currentRef = referenceValue;
    session.defaultSession.cookies.get(
      { url: "http://book.autographa.com" },
      (error, bookCookie) => {
        if (bookCookie.length > 0) {
          this.getRefContents(
            referenceValue +
              "_" +
              Constant.bookCodeList[parseInt(bookCookie[0].value, 10) - 1],
            AutographaStore.chapterId
          );
        } else {
          this.getRefContents(
            referenceValue + "_" + Constant.bookCodeList[parseInt("1", 10) - 1],
            AutographaStore.chapterId
          );
        }
      }
    );
    var cookieRef = {
      url: "http://refs.autographa.com",
      name: "0",
      value: event.target.value,
    };
    session.defaultSession.cookies.set(cookieRef, (error) => {
      if (error) console.log(error);
    });
  }
  isSameLanguage = async () => {
    const verseLangCode = "",
      check_value = false;
    return db.get("targetBible").then(
      (doc) => {
        let verseLangCode = doc.targetLang;
        let languagedropDown = AutographaStore.layout;
        if (languagedropDown == 1) {
          if (verseLangCode != AutographaStore.activeRefs[0].split("_")[0]) {
            return false;
          }
        }
        for (var i = 0; i < languagedropDown - 1; i++) {
          let v1 = AutographaStore.activeRefs[i].split("_")[0];
          let v2 = "";

          if (AutographaStore.activeRefs[i + 1].length) {
            v2 = AutographaStore.activeRefs[i + 1].split("_")[0];
          }
          if (verseLangCode != v1 || verseLangCode != v2) {
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
  getDifferenceCount = (verse_diff, layout) => {
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
      }
    }
    return { ins: insertions, del: deletions };
  };
  setDiff = async (e, toggled) => {
    let that = this;
    let isSameLanguage = await this.isSameLanguage();
    if (toggled) {
      this.saveTarget();
      AutographaStore.setDiff = true;
      if (!isSameLanguage) {
        AutographaStore.toggle = false;
        swal(
          AutographaStore.currentTrans["compare-mode-heading"],
          AutographaStore.currentTrans["dynamic-compare-mode"],
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
      const transDiffRef = doc.layout - 1;
      switch (doc.layout) {
        case 1:
          if (toggled) {
            this.getDiffText(
              AutographaStore.activeRefs[0],
              AutographaStore.activeRefs[1],
              AutographaStore.bookId,
              chapter,
              0
            ).then((content) => {
              AutographaStore.contentOne = content;
            });
          } else {
            this.getContent(
              AutographaStore.activeRefs[0] +
                "_" +
                Constant.bookCodeList[parseInt(AutographaStore.bookId, 10) - 1],
              chapter
            ).then((content) => {
              AutographaStore.content = content;
            });
            this.getContent(
              AutographaStore.activeRefs[1] +
                "_" +
                Constant.bookCodeList[parseInt(AutographaStore.bookId, 10) - 1],
              chapter
            ).then((content) => {
              AutographaStore.contentOne = content;
            });
            this.getContent(
              AutographaStore.activeRefs[2] +
                "_" +
                Constant.bookCodeList[parseInt(AutographaStore.bookId, 10) - 1],
              chapter
            ).then((content) => {
              AutographaStore.contentTwo = content;
            });
            this.resetDiffValue();
          }
          break;
        case 2:
          if (toggled) {
            this.getContent(
              AutographaStore.activeRefs[0] +
                "_" +
                Constant.bookCodeList[parseInt(AutographaStore.bookId, 10) - 1],
              chapter
            ).then((content) => {
              AutographaStore.content = content;
            });
            this.getDiffText(
              AutographaStore.activeRefs[0],
              AutographaStore.activeRefs[1],
              AutographaStore.bookId,
              chapter,
              1
            ).then((content) => {
              AutographaStore.contentOne = content;
            });
          } else {
            this.getContent(
              AutographaStore.activeRefs[0] +
                "_" +
                Constant.bookCodeList[parseInt(AutographaStore.bookId, 10) - 1],
              chapter
            ).then((content) => {
              AutographaStore.content = content;
            });
            this.getContent(
              AutographaStore.activeRefs[1] +
                "_" +
                Constant.bookCodeList[parseInt(AutographaStore.bookId, 10) - 1],
              chapter
            ).then((content) => {
              AutographaStore.contentOne = content;
            });
            this.resetDiffValue();
          }
          break;

        case 3:
          if (toggled) {
            this.getContent(
              AutographaStore.activeRefs[0] +
                "_" +
                Constant.bookCodeList[parseInt(AutographaStore.bookId, 10) - 1],
              chapter
            ).then((content) => {
              AutographaStore.content = content;
            });
            this.getDiffText(
              AutographaStore.activeRefs[0],
              AutographaStore.activeRefs[1],
              AutographaStore.bookId,
              chapter,
              1
            ).then((content) => {
              AutographaStore.contentOne = content;
            });
            this.getDiffText(
              AutographaStore.activeRefs[1],
              AutographaStore.activeRefs[2],
              AutographaStore.bookId,
              chapter,
              2
            ).then((content) => {
              AutographaStore.contentTwo = content;
            });
          } else {
            this.getContent(
              AutographaStore.activeRefs[0] +
                "_" +
                Constant.bookCodeList[parseInt(AutographaStore.bookId, 10) - 1],
              chapter
            ).then((content) => {
              AutographaStore.content = content;
            });
            this.getContent(
              AutographaStore.activeRefs[1] +
                "_" +
                Constant.bookCodeList[parseInt(AutographaStore.bookId, 10) - 1],
              chapter
            ).then((content) => {
              AutographaStore.contentOne = content;
            });
            this.getContent(
              AutographaStore.activeRefs[2] +
                "_" +
                Constant.bookCodeList[parseInt(AutographaStore.bookId, 10) - 1],
              chapter
            ).then((content) => {
              AutographaStore.contentTwo = content;
            });
            this.resetDiffValue();
          }
          break;
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
          if (refdoc.chapters[i].chapter == parseInt(chapter, 10)) {
            break;
          }
        }
        let book_verses = refdoc.chapters[i].verses;
        for (i = 1; i <= AutographaStore.verses.length; i++) {
          var spanVerseNum = "";
          if (i > chunkVerseEnd) {
            chunkVerseStart = parseInt(chunks[chunkIndex].firstvs, 10);
            if (
              chunkIndex === chunks.length - 1 ||
              parseInt(chunks[chunkIndex + 1].chp, 10) != chapter
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
            let diffCount = that.getDifferenceCount(verseDiff, 0);
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
  resetDiffValue = () => {
    for (let i = 0; i < 3; i++) {
      AutographaStore.tIns[i] = 0;
      AutographaStore.tDel[i] = 0;
    }
  };
  editbooks = () => {
    AutographaStore.editBookNamesMode = true;
    localStorage.setItem(
      "editBookNamesMode",
      AutographaStore.editBookNamesMode
    );
    AutographaStore.openBookNameEditor = !AutographaStore.openBookNameEditor;
  };
  handlepopper = (event) => {
    let book = event.currentTarget.getAttribute("value");
    var index1;
    AutographaStore.translatedBookNames.map((value, index) => {
      if (value === book) {
        index1 = index;
      }
    });
    AutographaStore.bookindex = index1;
  };
  render() {
    var OTbooksstart = 0;
    var OTbooksend = 38;
    var NTbooksstart = 39;
    var NTbooksend = 65;
    var bookData;
    let mode = mobx.toJS(AutographaStore.editBookNamesMode);
    if (mode.toString() === "true") {
      bookData = AutographaStore.translatedBookNames;
    } else {
      bookData = AutographaStore.bookData;
    }
    const refContent = AutographaStore.content;
    const refContentOne = AutographaStore.contentOne;
    const refContentTwo = AutographaStore.contentTwo;
    const bookName =
      mode.toString() === "true" && AutographaStore.translatedBookNames !== null
        ? AutographaStore.translatedBookNames[
            parseInt(AutographaStore.bookId, 10) - 1
          ]
        : Constant.booksList[parseInt(AutographaStore.bookId, 10) - 1];
    let close = () => (AutographaStore.showModalBooks = false);
    const test = AutographaStore.activeTab == 1;
    var chapterList = [];
    const toggle = AutographaStore.toggle;
    for (var i = 0; i < AutographaStore.bookChapter["chapterLength"]; i++) {
      chapterList.push(
        <li key={i} value={i + 1}>
          <a
            href="#"
            className={
              i + 1 == AutographaStore.chapterActive ? "link-active" : ""
            }
            onClick={this.getValue.bind(
              this,
              i + 1,
              AutographaStore.bookChapter["bookId"]
            )}
          >
            {i + 1}
          </a>
        </li>
      );
    }
    if (localStorage.getItem("editBookNamesMode") === false) {
      bookData = AutographaStore.bookData;
    }
    return (
      <div>
        <Modal
          show={AutographaStore.showModalBooks}
          onHide={close}
          id="tab-books"
        >
          <Modal.Header closeButton>
            <Modal.Title>Book and Chapter</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Tabs
              animation={false}
              activeKey={AutographaStore.activeTab}
              onSelect={() =>
                this.goToTab(AutographaStore.activeTab == 1 ? 2 : 1)
              }
              id="noanim-tab-example"
            >
              {test ? (
                <div className="wrap-center">
                  <div className="btn-group" role="group" aria-label="...">
                    <button
                      className="btn btn-primary"
                      type="button"
                      id="allBooksBtn"
                      data-toggle="tooltip"
                      data-placement="bottom"
                      title=""
                      onClick={this.getbookCategory.bind(
                        this,
                        OTbooksstart,
                        NTbooksend
                      )}
                      data-original-title="All"
                    >
                      ALL
                    </button>
                    <button
                      className="btn btn-primary"
                      type="button"
                      id="otBooksBtn"
                      data-toggle="tooltip"
                      data-placement="bottom"
                      title=""
                      onClick={this.getbookCategory.bind(
                        this,
                        OTbooksstart,
                        OTbooksend
                      )}
                      data-original-title="Old Testament"
                    >
                      OT
                    </button>
                    <button
                      className="btn btn-primary"
                      type="button"
                      id="ntBooksBtn"
                      data-toggle="tooltip"
                      data-placement="bottom"
                      title=""
                      onClick={this.getbookCategory.bind(
                        this,
                        NTbooksstart,
                        NTbooksend
                      )}
                      data-original-title="New Testament"
                    >
                      NT
                    </button>
                  </div>
                </div>
              ) : (
                ""
              )}
              <Tab eventKey={1} title="Book">
                <div className="wrap-center"></div>
                <div className="row books-li" id="bookdata">
                  <ul id="books-pane">
                    {AutographaStore.translatedBookNames !== null &&
                      bookData.map((item, index) => {
                        return (
                          <li key={index}>
                            <Link
                              key={index}
                              style={{ cursor: "pointer" }}
                              onClick={this.onItemClick.bind(this, item, index)}
                              value={item}
                              onMouseEnter={this.handlepopper}
                              className={
                                AutographaStore.bookName === item
                                  ? "link-active"
                                  : ""
                              }
                            >
                              {item}
                              <Tooltip
                                TransitionComponent={Zoom}
                                placement="top"
                                title="edit"
                              >
                                <EditIcon
                                  key={index}
                                  style={{
                                    cursor: "pointer",
                                    marginLeft: "9px",
                                  }}
                                  hidden={AutographaStore.bookindex !== index}
                                  onClick={this.editbooks}
                                />
                              </Tooltip>
                            </Link>
                          </li>
                        );
                      })}
                  </ul>
                </div>
                <div className="clearfix"></div>
              </Tab>
              <Tab eventKey={2} title="Chapters">
                <div className="chapter-no">
                  <ul id="chaptersList">{chapterList}</ul>
                </div>
              </Tab>
            </Tabs>
          </Modal.Body>
        </Modal>
        <SettingsModal
          show={AutographaStore.showModalSettings}
          loadData={this.loadData}
        />
        <AboutUsModal show={AutographaStore.showModalAboutUs} />
        <SearchModal
          show={AutographaStore.showModalSearch}
          loadData={this.loadData}
        />
        <DownloadModal show={AutographaStore.showModalDownload} />
        <BookNameEditor show={AutographaStore.bookNameEditorPopup} />
        <nav
          className="navbar navbar-inverse navbar-fixed-top"
          role="navigation"
        >
          <div className="container-fluid">
            <div className="navbar-header">
              <button
                className="navbar-toggle collapsed"
                type="button"
                data-toggle="collapse"
                data-target="#navbar"
                aria-expanded="false"
                aria-controls="navbar"
              >
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <a
                href="#"
                className="navbar-brand"
                style={{ cursor: "default" }}
              >
                <img alt="Brand" src={brandLogo} />
              </a>
            </div>
            <div className="navbar-collapse collapse" id="navbar">
              <ul className="nav navbar-nav" style={{ padding: "3px 0 0 0px" }}>
                <li>
                  <div
                    className="btn-group navbar-btn strong verse-diff-on"
                    role="group"
                    aria-label="..."
                    id="bookBtn"
                    style={{ marginLeft: "200px" }}
                  >
                    <a
                      onClick={() => this.openpopupBooks(1)}
                      href="#"
                      className={`btn btn-default ${toggle ? "disabled" : ""}`}
                      data-toggle="tooltip"
                      data-placement="bottom"
                      title="Select Book"
                      id="book-chapter-btn"
                    >
                      {bookName}
                    </a>
                    <span id="chapterBtnSpan">
                      <a
                        onClick={() => this.openpopupBooks(2)}
                        className={`btn btn-default ${
                          toggle ? "disabled" : ""
                        }`}
                        id="chapterBtn"
                        data-target="#myModal"
                        data-toggle="modal"
                        data-placement="bottom"
                        title="Select Chapter"
                      >
                        {AutographaStore.chapterId}
                      </a>
                    </span>
                  </div>
                </li>
              </ul>
              <ul className="nav navbar-nav navbar-right nav-pills verse-diff-on">
                <li
                  style={{
                    padding: "17px 5px 0 0",
                    color: "#fff",
                    fontWeight: "bold",
                  }}
                >
                  <span>
                    <FormattedMessage id="btn-switch-off" />
                  </span>
                </li>
                <li>
                  <FormattedMessage id="tooltip-compare-mode">
                    {(message) => (
                      <Toggle
                        defaultToggled={toggle}
                        style={{ marginTop: "17px" }}
                        onToggle={this.setDiff}
                        toggled={toggle}
                        id="diff"
                      />
                    )}
                  </FormattedMessage>
                </li>
                <li
                  style={{
                    padding: "17px 0 0 0",
                    color: "#fff",
                    fontWeight: "bold",
                  }}
                >
                  <span>
                    <FormattedMessage id="btn-switch-on" />
                  </span>
                </li>
                <li>
                  <FormattedMessage id="tooltip-find-and-replace">
                    {(message) => (
                      <a
                        onClick={() => this.openpopupSearch()}
                        href="#"
                        data-toggle="tooltip"
                        data-placement="bottom"
                        title={message}
                        id="searchText"
                        disabled={`${toggle ? "disabled" : ""}`}
                        style={{ pointerEvents: `${toggle ? "none" : ""}` }}
                      >
                        <i className="fa fa-search fa-2x"></i>
                      </a>
                    )}
                  </FormattedMessage>
                </li>
                <NavDropdown
                  eventKey={1}
                  title={<i className="fa fa-cloud-download fa-2x"></i>}
                  noCaret
                  id="basic-nav-dropdown"
                >
                  <MenuItem
                    eventKey="1"
                    onClick={() => this.openpopupDownload()}
                    id="export-usfm-file"
                  >
                    <FormattedMessage id="export-usfm" />
                  </MenuItem>
                  <MenuItem
                    eventKey="2"
                    onClick={(e) => this.exportPDF(e, 1)}
                    id="export-1-column"
                  >
                    <FormattedMessage id="export-html-1-column" />
                  </MenuItem>
                  <MenuItem
                    eventKey="3"
                    onClick={(e) => this.exportPDF(e, 2)}
                    id="export-2-column"
                  >
                    <FormattedMessage id="export-html-2-column" />
                  </MenuItem>
                </NavDropdown>
                <li>
                  <FormattedMessage id="tooltip-about">
                    {(message) => (
                      <a
                        onClick={() => this.openpopupAboutUs()}
                        href="#"
                        data-target="#aboutmodal"
                        data-toggle="tooltip"
                        data-placement="bottom"
                        title={message}
                        id="btnAbout"
                        disabled={`${toggle ? "disabled" : ""}`}
                        style={{ pointerEvents: `${toggle ? "none" : ""}` }}
                      >
                        <i className="fa fa-info fa-2x"></i>
                      </a>
                    )}
                  </FormattedMessage>
                </li>
                <li>
                  <FormattedMessage id="tooltip-settings">
                    {(message) => (
                      <a
                        onClick={() => this.openpopupSettings()}
                        href="#"
                        id="btnSettings"
                        data-target="#bannerformmodal"
                        data-toggle="tooltip"
                        data-placement="bottom"
                        title={message}
                        disabled={`${toggle ? "disabled" : ""}`}
                        style={{ pointerEvents: `${toggle ? "none" : ""}` }}
                      >
                        <i className="fa fa-cog fa-2x"></i>
                      </a>
                    )}
                  </FormattedMessage>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        {AutographaStore.layout === 1 && (
          <div className="parentdiv">
            <div className="layoutx">
              {" "}
              <Reference
                onClick={this.handleRefChange.bind(this, 0)}
                refIds={AutographaStore.activeRefs[0]}
                id={1}
                layout={1}
              />
              <ReferencePanel refContent={refContent} />
            </div>
            <div style={{ padding: "10px" }} className="layoutx">
              <TranslationPanel
                onSave={this.saveTarget}
                tIns={AutographaStore.tIns[0]}
                tDel={AutographaStore.tDel[0]}
              />
            </div>
          </div>
        )}
        {AutographaStore.layout === 2 && (
          <div className="parentdiv">
            <div className="layout2x">
              <Reference
                onClick={this.handleRefChange.bind(this, 0)}
                refIds={AutographaStore.activeRefs[0]}
                id={21}
                layout={1}
              />
              <ReferencePanel
                refContent={refContent}
                refIds={AutographaStore.activeRefs[0]}
              />
            </div>

            <div className="layout2x">
              <Reference
                onClick={this.handleRefChange.bind(this, 1)}
                refIds={AutographaStore.activeRefs[1]}
                id={22}
                layout={2}
              />
              <ReferencePanel
                refContent={refContentOne}
                refIds={AutographaStore.activeRefs[1]}
                tIns={AutographaStore.tIns[1]}
                tDel={AutographaStore.tDel[1]}
              />
            </div>
            <div style={{ padding: "10px" }} className="layout2x">
              <TranslationPanel
                onSave={this.saveTarget}
                tIns={AutographaStore.tIns[0]}
                tDel={AutographaStore.tDel[0]}
              />
            </div>
          </div>
        )}
        {AutographaStore.layout === 3 && (
          <div className="parentdiv">
            <div className="layout3x">
              <Reference
                onClick={this.handleRefChange.bind(this, 0)}
                refIds={AutographaStore.activeRefs[0]}
                id={31}
                layout={1}
              />
              <ReferencePanel
                refContent={refContent}
                refIds={AutographaStore.activeRefs[0]}
              />
            </div>

            <div className="layout3x">
              <Reference
                onClick={this.handleRefChange.bind(this, 1)}
                refIds={AutographaStore.activeRefs[1]}
                id={32}
                layout={2}
              />
              <ReferencePanel
                refContent={refContentOne}
                refIds={AutographaStore.activeRefs[1]}
                tIns={AutographaStore.tIns[1]}
                tDel={AutographaStore.tDel[1]}
              />
            </div>

            <div className="layout3x">
              <Reference
                onClick={this.handleRefChange.bind(this, 2)}
                refIds={AutographaStore.activeRefs[2]}
                id={33}
                layout={3}
              />
              <ReferencePanel
                refContent={refContentTwo}
                refIds={AutographaStore.activeRefs[2]}
                tIns={AutographaStore.tIns[2]}
                tDel={AutographaStore.tDel[2]}
              />
            </div>
            <div style={{ padding: "10px" }} className="layout3x">
              <TranslationPanel
                onSave={this.saveTarget}
                tIns={AutographaStore.tIns[0]}
                tDel={AutographaStore.tDel[0]}
              />
            </div>
          </div>
        )}
        <Footer onSave={this.saveTarget} getRef={this.getRefContents} />
      </div>
    );
  }
}
module.exports = Navbar;
