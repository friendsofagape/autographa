import AutographaStore from "../components/AutographaStore";
import * as mobx from "mobx";
const booksCodes = require(`${__dirname}/constants.js`).bookCodeList;
const bibleSkel = require(`${__dirname}/../lib/full_bible_skel.json`);
const path = require("path");
const remote = require("electron").remote;
const appPath = remote.app.getAppPath();
// const configFile =

module.exports = {
  /*
      All keys of options are required!
      e.g: options = {lang: 'en', version: 'udb', usfmFile: '/home/test-data/L66_1 Corinthians_I.SFM', 'target': 'refs|target'}
    */

  toJson: function (options, callback) {
    try {
      var lineReader = require("readline").createInterface({
        input: require("fs-extra").createReadStream(options.usfmFile),
      });
      patterns = require("fs-extra").readFileSync(
        path.join(appPath, `patterns.prop`),
        "utf8"
      );
      var book = {},
        verse = [],
        db = require(`${__dirname}/../util/data-provider`).targetDb(),
        refDb = require(`${__dirname}/../util/data-provider`).referenceDb(),
        c = 0,
        v = 0,
        vnum = 0,
        id = "",
        usfmBibleBook = false,
        validLineCount = 0,
        id_prefix =
          options.lang + "_" + options.version + "_" + options.bibleName + "_";
      book["scriptDirection"] = options.scriptDirection;
      book.chapters = [];
    } catch (err) {
      return callback(
        new Error(
          `${fileName(options.usfmFile)}: ${
            AutographaStore.currentTrans["usfm-parser-error"]
          }`
        )
      );
    }
    lineReader.on("line", function (line) {
      // Logic to tell if the input file is a USFM book of the Bible.
      if (!usfmBibleBook)
        if (validLineCount > 3)
          return callback(
            new Error(
              `${fileName(options.usfmFile)} ${
                AutographaStore.currentTrans["usfm-bookid-missing"]
              }`
            )
          );

      validLineCount++;
      var splitLine = line.split(/ +/);
      if (!line) {
        validLineCount--;
        //Do nothing for empty lines.
      } else if (splitLine[0] === "\\id") {
        if (booksCodes.includes(splitLine[1].toUpperCase()))
          usfmBibleBook = true;
        id = splitLine[1];
        book._id = id_prefix + splitLine[1].toUpperCase();
      } else if (splitLine[0] === "\\c") {
        book.chapters[parseInt(splitLine[1], 10) - 1] = {
          verses: verse,
          chapter: parseInt(splitLine[1], 10),
        };
        verse = [];
        c = parseInt(splitLine[1], 10);
        v = 0;
        vnum = 0;
      } else if (splitLine[0] === "\\v") {
        if (c === 0) return;
        // callback(new Error(`${fileName(options.usfmFile)} LineNo ${validLineCount}: ${AutographaStore.currentTrans["usfm-chaper-missing"]}`));
        var verseStr =
          splitLine.length <= 2
            ? ""
            : splitLine.splice(2, splitLine.length - 1).join(" ");
        verseStr = replaceMarkers(verseStr);
        const bookIndex = booksCodes.findIndex((element) => {
          if (book._id !== undefined) {
            return element === book._id.split("_").slice(-1)[0].toUpperCase();
          }
        });

        // To avoid panic error if book-id is null
        if (bookIndex !== -1) {
          if (bibleSkel[bookIndex + 1].chapters[c - 1] !== undefined) {
            if (v < bibleSkel[bookIndex + 1].chapters[c - 1].verses.length) {
              if (splitLine[1].match(/\W/gm)) {
                let verseNumber = splitLine[1].match(/\d+/g);
                vnum = parseInt(verseNumber[0], 10);
                book.chapters[c - 1].verses.push({
                  verse_number: parseInt(verseNumber[0], 10),
                  verse: verseStr,
                });
                v++;
                // Here instead of i = verseNumber[1], used i = verseNumber[0] so that won't miss any number
                // If the number is 1,3, therefore the verseNumber[1] will 3 and will miss number 2
                for (
                  let i = parseInt(verseNumber[0]) + 1;
                  i <= verseNumber[verseNumber.length - 1];
                  i++
                ) {
                  book.chapters[c - 1].verses.push({
                    verse_number: parseInt(i, 10),
                    verse: "",
                    joint_verse: parseInt(verseNumber[0]),
                  });
                  v++;
                }
              } else {
                vnum = parseInt(splitLine[1], 10);
                book.chapters[c - 1].verses.push({
                  verse_number: parseInt(splitLine[1], 10),
                  verse: verseStr,
                });
                v++;
              }
            }
          }
        }
      } else if (splitLine[0].match(new RegExp(/\\mt$/gm))) {
        let cleanedStr = replaceMarkers(line);
        if (booksCodes.includes(id.toUpperCase())) {
          let userBookList = AutographaStore.translatedBookNames;
          userBookList.splice(booksCodes.indexOf(id), 1, cleanedStr);
        }
      } else if (splitLine[0].startsWith("\\s")) {
        //Do nothing for section headers now.
      } else if (splitLine.length === 1) {
        // Do nothing here for now.
      } else if (splitLine[0].match(new RegExp(/\\m$/gm))) {
        let cleanedStr = replaceMarkers(line);
        cleanedStr = "\n" + cleanedStr;
        let verseIndex = book.chapters[c - 1].verses.findIndex(
          (val) => val.verse_number === vnum
        );
        if (book.chapters[c - 1].verses[verseIndex].verse !== undefined) {
          book.chapters[c - 1].verses[verseIndex].verse +=
            (cleanedStr.length === 0 ? "" : " ") + cleanedStr;
        }
      } else if (splitLine[0].startsWith("\\r")) {
        // Do nothing here for now.
      } else if (c > 0 && v > 0) {
        var qflag = false;
        if (line.match(new RegExp(/[\\q\n]/g))) {
          qflag = true;
        }
        let cleanedStr = replaceMarkers(line);
        if (qflag === false) {
          cleanedStr = "\n" + cleanedStr;
        }
        let verseIndex = book.chapters[c - 1].verses.findIndex(
          (val) => val.verse_number === vnum
        );
        book.chapters[c - 1].verses[verseIndex].verse +=
          (cleanedStr.length === 0 ? "" : " ") + cleanedStr;
      }
    });

    lineReader.on("close", function (line) {
      if (!usfmBibleBook)
        // throw new Error('not usfm file');
        return callback(
          new Error(
            `${fileName(options.usfmFile)}: ${
              AutographaStore.currentTrans["usfm-not-valid"]
            }`
          )
        );

      if (options.targetDb === "refs") {
        for (let i = 0; i < book.chapters.length; i++) {
          if (!(i in book.chapters)) {
            book.chapters[i] = {
              verses: [],
              chapter: i + 1,
            };
          }
        }
        refDb.get(book._id).then(
          (doc) => {
            book._rev = doc._rev;
            book.scriptDirection = options.scriptDirection;
            refDb.put(book);
            return callback(null, `${fileName(options.usfmFile)}`);
          },
          (err) => {
            refDb.put(book).then(
              (doc) => {
                var missingChapterbook = [];
                book.chapters.forEach((_value, index) => {
                  if (_value.verses.length === 0) {
                    missingChapterbook = fileName(options.usfmFile);
                    AutographaStore.warningMsg.push([
                      fileName(options.usfmFile),
                      index + 1,
                    ]);
                  }
                });
                if (missingChapterbook !== fileName(options.usfmFile)) {
                  return callback(null, fileName(options.usfmFile));
                } else {
                  return callback(null);
                }
              },
              (err) => {
                // console.log("Error: While loading new refs. " + err);
                return callback(`${fileName(options.usfmFile)}` + err);
              }
            );
          }
        );
      } else if (options.targetDb === "target") {
        var bookId = book._id.split("_");
        bookId = bookId[bookId.length - 1].toUpperCase();
        var i, j, k;
        for (i = 0; i < booksCodes.length; i++) {
          if (bookId === booksCodes[i]) {
            i++;
            break;
          }
        }

        db.get(i.toString()).then((doc) => {
          for (i = 0; i < doc.chapters.length; i++) {
            for (j = 0; j < book.chapters.length; j++) {
              if (book.chapters[j] === undefined) {
                continue;
              }
              if (book.chapters[j].chapter === doc.chapters[i].chapter) {
                var versesLen = Math.min(
                  book.chapters[j].verses.length,
                  doc.chapters[i].verses.length
                );
                for (k = 0; k < versesLen; k++) {
                  var verseNum = book.chapters[j].verses[k].verse_number;
                  if (doc.chapters[i].verses[verseNum - 1] != undefined) {
                    // Adding joint verse data into DB
                    if (book.chapters[j].verses[k].joint_verse) {
                      doc.chapters[i].verses[verseNum - 1] = {
                        verse_number: book.chapters[j].verses[k].verse_number,
                        verse: book.chapters[j].verses[k].verse,
                        joint_verse: book.chapters[j].verses[k].joint_verse,
                      };
                    } else {
                      doc.chapters[i].verses[verseNum - 1] = {
                        verse_number: book.chapters[j].verses[k].verse_number,
                        verse: book.chapters[j].verses[k].verse,
                      };
                    }
                    book.chapters[j].verses[k] = undefined;
                  } else {
                    return callback(
                      new Error(
                        `${fileName(options.usfmFile)} ${
                          AutographaStore.currentTrans["usfm-not-valid"]
                        }`
                      )
                    );
                  }
                }
                //check for extra verses in the imported usfm here.
                break;
              }
            }
          }
          var missingChapterbook = [];
          book.chapters.find((_value, index) => {
            if (_value === undefined) {
              missingChapterbook = fileName(options.usfmFile);
              AutographaStore.warningMsg.push([
                fileName(options.usfmFile),
                index + 1,
              ]);
            }
          });
          db.put(doc).then(
            (response) => {
              if (missingChapterbook !== fileName(options.usfmFile)) {
                return callback(null, fileName(options.usfmFile));
              } else {
                return callback(null);
              }
            },
            (err) => {
              return callback(
                `${AutographaStore.currentTrans["Error-whilesaving-db"]}` + err
              );
            }
          );
        });
      }
    });

    lineReader.on("error", function (lineReaderErr) {
      if (lineReaderErr.message === "not usfm file")
        return callback(
          new Error(
            `${fileName(options.usfmFile)}: ${
              AutographaStore.currentTrans["usfm-not-valid"]
            }`
          )
        );
      else
        return callback(
          new Error(
            `${fileName(options.usfmFile)}: ${
              AutographaStore.currentTrans["usfm-parser-error"]
            }`
          )
        );
    });
  },
};

function fileName(file) {
  return path.basename(file);
}

var patterns = "";

function replaceMarkers(str) {
  var patternsLine = patterns.split("\n");
  var pattern = "",
    replacement = "",
    pairFoundFlag = -1;
  for (var i = 0; i < patternsLine.length; i++) {
    if (str.length === 0) break;
    if (patternsLine[i] === "" || patternsLine[i].startsWith("#")) continue;

    if (patternsLine[i].startsWith(">") && pairFoundFlag <= 0) {
      pattern = patternsLine[i].substr(1);
      pairFoundFlag = 0;
    } else if (patternsLine[i].endsWith("<") && pairFoundFlag === 0) {
      replacement =
        patternsLine[i].length === 1
          ? ""
          : patternsLine[i].substr(0, patternsLine[i].length - 1);
      pairFoundFlag = 1;
    }

    if (pairFoundFlag === 1) {
      str = str.replace(new RegExp(pattern, "gu"), replacement);
      pairFoundFlag = -1;
    }
  }
  return str;
}
