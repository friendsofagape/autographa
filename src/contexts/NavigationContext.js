import React, { createContext, useState, useEffect } from "react";
import AutographaStore from "../components/AutographaStore";
import * as mobx from "mobx";
const bibleJson = require(`${__dirname}/../lib/bible_Silhouette.json`);
const refDb = require(`${__dirname}/../core/data-provider`).referenceDb();
const db = require(`${__dirname}/../core/data-provider`).targetDb();
const session = require("electron").remote.session;
const Constant = require("../core/constants");

export const NavigationContext = createContext();

const NavigationContextProvider = (props) => {
  const [open, setOpen] = React.useState(false);
  const [bookdata, setBookdata] = useState(AutographaStore.bookData);
  const [chapterList, setChapterList] = useState([]);
  const [selectedbook, setSelectedBook] = useState("");
  const [selectedchapter, setSelectedChapter] = useState("");

  const saveLastVisit = (book, chapter) => {
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
  };

  const getValue = (chapter, bookId) => {
    AutographaStore.translationContent = "";
    AutographaStore.chapterId = chapter;
    AutographaStore.chapterActive = chapter;
    AutographaStore.bookId = bookId;
    AutographaStore.editBookNamesMode
      ? setSelectedBook(
          AutographaStore.translatedBookNames[
            parseInt(AutographaStore.bookId, 10) - 1
          ]
        )
      : setSelectedBook(
          Constant.booksList[parseInt(AutographaStore.bookId, 10) - 1]
        );
    saveLastVisit(bookId, chapter);
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
              getRefContents(
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
          AutographaStore.bookName =
            Constant.booksList[parseInt(AutographaStore.bookId, 10) - 1];
          db.get(AutographaStore.bookId.toString()).then((doc) => {
            refDb.get("refChunks").then((chunkDoc) => {
              AutographaStore.verses =
                doc.chapters[
                  parseInt(AutographaStore.chapterId, 10) - 1
                ].verses;
              AutographaStore.chunks =
                chunkDoc.chunks[parseInt(AutographaStore.bookId, 10) - 1];
              getRefContents(
                `eng_ult_${
                  Constant.bookCodeList[
                    parseInt(AutographaStore.bookId, 10) - 1
                  ]
                }`,
                AutographaStore.chapterId.toString()
              );
            });
          });
        }
      }
    );
    setOpen(false);
  };

  const openpopupBooks = (tab) => {
    // event.persist();
    AutographaStore.bookActive = AutographaStore.bookId;
    AutographaStore.bookName =
      Constant.booksList[parseInt(AutographaStore.bookId, 10) - 1];
    AutographaStore.chapterActive = AutographaStore.chapterId;
    getData();
  };

  const getData = () => {
    refDb
      .get(
        AutographaStore.currentRef +
          "_" +
          Constant.bookCodeList[parseInt(AutographaStore.bookId, 10) - 1]
      )
      .then(function (doc) {
        AutographaStore.bookChapter["chapterLength"] = doc.chapters.length;
        AutographaStore.bookChapter["bookId"] = AutographaStore.bookId;
        goToTab();
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  const goToTab = () => {
    let _chapterList = [];
    for (var i = 0; i < AutographaStore.bookChapter["chapterLength"]; i++) {
      _chapterList.push(i + 1);
    }
    setChapterList(_chapterList);
  };

  const getbookCategory = (e, booksstart, booksend) => {
    var booksCategory = [];
    for (var i = 0; i <= 65; i++) {
      booksCategory.push(Constant.booksList[i]);
    }
    setBookdata(booksCategory);
  };

  const onItemClick = (requiredIndex, bookName) => {
    AutographaStore.bookName = bookName;
    AutographaStore.chapterActive = 0;
    // getting chapter list
    let bookIndex = AutographaStore.editBookNamesMode
      ? AutographaStore.bookIndex
      : Constant.booksList.findIndex(
          (book) => book.toLowerCase() === bookName.toLowerCase()
        );
    const bookSkel = bibleJson[bookIndex + 1];
    AutographaStore.bookActive = bookIndex + 1;
    AutographaStore.bookChapter["chapterLength"] = bookSkel.chapters.length;
    AutographaStore.bookChapter["bookId"] = bookIndex + 1;
    goToTab();
  };

  const getRefContents = (id, chapter) => {
    refDb.get("targetReferenceLayout").then((doc) => {
      AutographaStore.layout = doc.layout;
      AutographaStore.layoutContent = doc.layout;
      let chapter = AutographaStore.chapterId.toString();
      getContent(
        AutographaStore.activeRefs[0] +
          "_" +
          Constant.bookCodeList[parseInt(AutographaStore.bookId, 10) - 1],
        chapter
      ).then((content) => {
        AutographaStore.content = content
          ? content
          : AutographaStore.currentTrans["label-data-not-found"];
      });
      getContent(
        AutographaStore.activeRefs[1] +
          "_" +
          Constant.bookCodeList[parseInt(AutographaStore.bookId, 10) - 1],
        chapter
      ).then((content) => {
        AutographaStore.contentOne = content
          ? content
          : AutographaStore.currentTrans["label-data-not-found"];
      });
      getContent(
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
      var chunk = chunkVerseStart + "-" + chunkVerseEnd;
      var spanVerse = chunk;
      chunkGroup.push(spanVerse);
    }
    AutographaStore.chunkGroup = chunkGroup;
    updateTransContent();
  };

  const updateTransContent = () => {
    let translationContent = [];
    db.get(AutographaStore.bookId.toString()).then((doc) => {
      let verses =
        doc.chapters[parseInt(AutographaStore.chapterId, 10) - 1].verses;
      AutographaStore.verses = verses;
      verses.forEach((verse, index) => {
        translationContent.push(verse.verse);
      });
      AutographaStore.translationContent = translationContent;
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
              return `<div type="ref" class="col-12 col-ref ref-contents 
              ${doc.scriptDirection.toLowerCase()}" 
              dir=${doc.scriptDirection}><div data-verse=r${verseNum + 1}>
              <span class="verse-num"> 
              ${doc.scriptDirection === "LTR" ? verseNum + 1 : verseNum + 1}
              </span>
              <span> ${verse.verse}</span></div></div`;
            })
            .join("");
        return refString;
      },
      (err) => {
        return "";
      }
    );
  };

  return (
    <NavigationContext.Provider
      value={{
        open,
        setOpen,
        bookdata,
        chapterList,
        selectedbook,
        selectedchapter,
        onItemClick,
        openpopupBooks,
        getValue,
        setSelectedBook,
        setSelectedChapter,
        getRefContents,
        setBookdata,
      }}
    >
      {props.children}
    </NavigationContext.Provider>
  );
};

export default NavigationContextProvider;
