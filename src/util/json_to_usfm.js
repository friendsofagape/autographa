module.exports = {
  toUsfm: function (book, stage, targetLangDoc) {
    var db = require(`${__dirname}/data-provider`).targetDb();
    var fs = require("fs"),
      path = require("path"),
      usfmContent = [];
    var filePath;
    usfmContent.push("\\id " + book.bookCode);
    usfmContent.push("\\mt " + book.bookName);
    return db
      .get(book.bookNumber)
      .then((doc) => {
        var chapterLimit = doc.chapters.length;
        doc.chapters.forEach((chapter, index) => {
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
                let newverse = addMtag(verses);
                usfmContent.push("\\v " + verseNumber + " " + newverse);
                verseNumber = undefined;
                verses = undefined;
              } else {
                let newverse = addMtag(verse.verse);
                // Push verse number and content.
                usfmContent.push("\\v " + verse.verse_number + " " + newverse);
              }
            }
          }
          if (index === chapterLimit - 1) {
            var exportName =
              targetLangDoc.targetLang +
              "_" +
              targetLangDoc.targetVersion +
              "_" +
              book.bookCode +
              "_" +
              stage +
              "_" +
              getTimeStamp(new Date());
            filePath = path.join(
              Array.isArray(book.outputPath)
                ? book.outputPath[0]
                : book.outputPath,
              exportName
            );
            filePath += ".usfm";
            fs.writeFileSync(filePath, usfmContent.join("\n"), "utf8");
          }
        });
        return filePath;
      })
      .then((path) => {
        return path;
      })
      .catch((err) => {
        console.log(err);
      });
  },
};

function addMtag(verses) {
  let newVerse = verses;
  if (verses.indexOf("\n") !== -1) {
    newVerse = verses.trim().replace(new RegExp(/[\n\r]/, "gu"), "\n\\m ");
    verses = newVerse;
  }
  return newVerse;
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
