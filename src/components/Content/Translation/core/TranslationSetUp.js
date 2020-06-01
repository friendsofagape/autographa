import React from "react";
import AutographaStore from "../../../AutographaStore";
import TranslationPanel from "../TranslationPanel";
import * as mobx from "mobx";
import { Observer } from "mobx-react";
import { useEffect } from "react";
import Footer from "../../../Footer/Footer";
const db = require(`${__dirname}/../../../../core/data-provider`).targetDb();

const TranslationSetUp = () => {
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

  return (
    <Observer>
      {() => (
        <React.Fragment>
          <TranslationPanel
            onSave={saveTarget}
            chunkGroup={mobx.toJS(AutographaStore.chunkGroup)}
          />
          <Footer onSave={saveTarget} />
        </React.Fragment>
      )}
    </Observer>
  );
};

export default TranslationSetUp;
