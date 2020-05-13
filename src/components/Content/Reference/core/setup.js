import React, { useState, useEffect } from "react";
import AutographaStore from "../../../AutographaStore";
import ReferenceSelector from "../ReferenceSelector";
import ReferencePanel from "../ReferencePanel";
import { useStyles } from "../useStyles";
import { Observer } from "mobx-react";
const session = require("electron").remote.session;
const refDb = require(`${__dirname}/../../../../core/data-provider`).referenceDb();
const db = require(`${__dirname}/../../../../core/data-provider`).targetDb();
const Constant = require("../../../../core/constants");

const SetUp = () => {
  const classes = useStyles();
  const [data, setData] = useState(Constant);
  const [chapData, setChapData] = useState([]);
  const [defaultRef, setdefaultRef] = useState("eng_ult");
  const [defaultRefOne, setdefaultRefOne] = useState("eng_ult");
  // const [refList, setrefList] = useState([]);
  let verses, chapter;

  useEffect(() => {
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
            getRefContents(
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
  });

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

  const handleRefChange = (refDropDownPos, event) => {
    console.log(refDropDownPos, event);
    // event.persist();
    AutographaStore.activeRefs[0] = event.props.value;
    refDb.get("activeRefs").then(
      (doc) => {
        // doc._rev = doc._rev;
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
    AutographaStore.selectId = event.key;
    // AutographaStore.layoutContent = parseInt(
    //   event.currentTarget.dataset.layout
    // );
    let referenceValue = event.props.value;
    AutographaStore.currentRef = referenceValue;
    session.defaultSession.cookies
      .get({ url: "http://book.autographa.com" })
      .then((bookCookie) => {
        if (bookCookie.length > 0) {
          getRefContents(
            referenceValue +
              "_" +
              Constant.bookCodeList[parseInt(bookCookie[0].value, 10) - 1],
            AutographaStore.chapterId
          );
        } else {
          getRefContents(
            referenceValue + "_" + Constant.bookCodeList[parseInt("1", 10) - 1],
            AutographaStore.chapterId
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
    var cookieRef = {
      url: "http://refs.autographa.com",
      name: "0",
      value: event.props.value,
    };
    session.defaultSession.cookies.set(cookieRef, (error) => {
      if (error) console.log(error);
    });
  };

  return (
    <React.Fragment>
      <Observer>
        {() => (
          <div className={classes.root}>
            <ReferenceSelector
              onClick={handleRefChange}
              refIds={AutographaStore.activeRefs[0]}
              id={1}
            />
            <ReferencePanel refContent={AutographaStore.content} />
          </div>
        )}
      </Observer>
    </React.Fragment>
  );
};

export default SetUp;
