const path = require("path");
const fs = require("fs");
const constants = require("../core/constants");
const db = require(`${__dirname}/data-provider`).targetDb();

export const allBooksToUsfm = async (exportPath) => {
  const activeBookNums = await db
    .allDocs()
    .then((docs) =>
      docs.rows.map((row) => row.id).filter((id) => parseInt(id, 10) === id)
    );

  const books = activeBookNums.map((bookNumber) => {
    const index = parseInt(bookNumber, 10) - 1;
    return {
      bookNumber: bookNumber,
      bookName: constants.booksList[index],
      bookCode: constants.bookCodeList[index],
      outputPath: exportPath,
    };
  });

  const skipEmptyBook = true;
  const bookWritePromises = books.map((book) =>
    toUsfmDoc(book, skipEmptyBook)
      .then((usfmDoc) => writeUsfm(usfmDoc, buildFilePath(book)))
      .then((filename) => Object.assign(book, { filename: filename }))
  );

  const booksWithFilenames = await Promise.all(bookWritePromises);
  const writtenBooks = booksWithFilenames.filter((book) => book.filename);
  return writtenBooks;
};

export const toUsfm = async (book, stage, targetLangDoc) => {
  const usfmDoc = await toUsfmDoc(book, false);
  const filePath = buildFilePath(book, targetLangDoc, stage, new Date());
  return writeUsfm(usfmDoc, filePath);
};

async function toUsfmDoc(book, returnNullForEmptyBook = false) {
  try {
    const usfmContent = [];
    var isEmpty = true;
    usfmContent.push("\\id " + book.bookCode);
    usfmContent.push("\\mt " + book.bookName);
    const doc = await db.get(book.bookNumber);
    for (const chapter of doc.chapters) {
      usfmContent.push("\n\\c " + chapter.chapter);
      usfmContent.push("\\p");
      let i = 0;
      let verseNumber;
      let verses;
      for (const verse of chapter.verses) {
        i = i + 1;
        if (i < chapter.verses.length && chapter.verses[i].joint_verse) {
          // Finding out the join verses and get their verse number(s)
          verseNumber =
            chapter.verses[i].joint_verse +
            "-" +
            chapter.verses[i].verse_number;
          verses = chapter.verses[chapter.verses[i].joint_verse - 1].verse;
          continue;
        } else {
          if (verseNumber) {
            // Push join verse number (1-3) and content.
            let newVerse = addMtag(verses);
            usfmContent.push("\\v " + verseNumber + " " + newVerse);
            verseNumber = undefined;
            verses = undefined;
          } else {
            // Push verse number and content.
            let newVerse = addMtag(verse.verse);
            usfmContent.push("\\v " + verse.verse_number + " " + newVerse);
          }
          isEmpty = isEmpty && !verse.verse;
        }
      }
    }
    return returnNullForEmptyBook && isEmpty ? null : usfmContent.join("\n");
  } catch (err) {
    console.log(err);
  }
}

function addMtag(verses) {
  let newVerse = verses;
  if (verses.indexOf("\n") !== -1) {
    newVerse = verses.trim().replace(new RegExp(/[\n\r]/, "gu"), "\n\\m ");
    verses = newVerse;
  }
  return newVerse;
}

function buildFilePath(book, targetLangDoc, stage, date) {
  const directory = Array.isArray(book.outputPath)
    ? book.outputPath[0]
    : book.outputPath;
  const nameElements = [
    targetLangDoc && targetLangDoc.targetLang,
    targetLangDoc && targetLangDoc.targetVersion,
    book.bookCode,
    stage,
    date && getTimeStamp(date),
  ].filter(Boolean);
  const filename = nameElements.join("_") + ".usfm";
  return path.join(directory, filename);
}

function writeUsfm(usfmDoc, filePath) {
  if (usfmDoc && filePath) {
    fs.writeFileSync(filePath, usfmDoc, "utf8");
    return filePath;
  } else {
    return null;
  }
}

function getTimeStamp(date) {
  var year = date.getFullYear(),
    // months are zero indexed
    month = (date.getMonth() + 1 < 10 ? "0" : "") + (date.getMonth() + 1),
    day = (date.getDate() < 10 ? "0" : "") + date.getDate(),
    hour = (date.getHours() < 10 ? "0" : "") + date.getHours(),
    minute = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes(),
    second = (date.getSeconds() < 10 ? "0" : "") + date.getSeconds();
  //hourFormatted = hour % 12 || 12, // hour returned in 24 hour format
  //minuteFormatted = minute < 10 ? "0" + minute : minute,
  //morning = hour < 12 ? "am" : "pm";
  return (
    year.toString().substr(2, 2) +
    month +
    day +
    hour +
    minute +
    second
  ).toString();
}
