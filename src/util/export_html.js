import swal from "sweetalert";
import {
  css_1_col_ltr,
  css_2_col_ltr,
  css_1_col_rtl,
  css_2_col_rtl,
} from "./export_css";
const path = require("path");
var fs = require("fs");
module.exports = {
  exportHtml: function (
    id,
    currentBook,
    db,
    direction,
    column,
    currentTrans,
    currentBookname
  ) {
    if (direction !== "RTL") {
      let htmlContent = "";
      let inlineData = `<!DOCTYPE html>
	                <html lang="en">
	                <head>
	                    <meta charset="utf-8">
	                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
	                    <meta name="viewport" content="width=device-width, initial-scale=1">
	                    <meta name="description" content="">
	                    ${column == 1 ? css_1_col_ltr : css_2_col_ltr}
					</head>
					<body class="body">
					<center><h1>${currentBookname}</h1></center>
					<div class="newspaper">`;
      var contentFlag = false;
      db.get(currentBook._id).then(function (doc) {
        doc.chapters.map((obj, i) => {
          var count = 0;
          var verseNumber;
          var verses;
          htmlContent += `<ul class="list">
										<li>
											<p class="firstLi"><span class="chapter">${obj.chapter}</span></p>
										</li><li><ol>`;
          for (let i = 0; i < obj.verses.length; i++) {
            if (obj.verses[i].verse !== "" && obj.verses[i].verse !== null) {
              contentFlag = true;
            }
            count = count + 1;
            if (count < obj.verses.length && obj.verses[count].joint_verse) {
              // Finding out the join verses and get their verse number(s)
              verseNumber =
                obj.verses[count].joint_verse +
                "-" +
                obj.verses[count].verse_number;
              verses = obj.verses[obj.verses[count].joint_verse - 1].verse;
              continue;
            } else {
              if (verseNumber) {
                // Push join verse number (1-3) and content.
                htmlContent += `<div class="verseDiv"><p class="prespace"><span class="verseSpan">${verseNumber}</span>${verses}</p></div>`;
                verseNumber = undefined;
                verses = undefined;
              } else {
                // Push verse number and content.
                htmlContent += `<div class="verseDiv"><p class="prespace"><span class="verseSpan">${obj.verses[i].verse_number} </span>${obj.verses[i].verse}</p></div>`;
              }
            }
          }
          htmlContent += `</ol></li></ul>`;
          if (contentFlag) inlineData += htmlContent;
          htmlContent = "";
          contentFlag = false;
        });
        inlineData += "</div></body></html>";

        db.get("targetBible").then((doc) => {
          let targetPath = Array.isArray(doc.targetPath)
            ? doc.targetPath[0]
            : doc.targetPath;
          let filepath = path.join(
            targetPath,
            `${currentBook.book_name.toLowerCase()}_${column}col_${getTimeStamp(
              new Date()
            )}.html`
          );
          fs.writeFile(filepath, inlineData, function (err) {
            if (err) {
              swal(
                currentTrans["dynamic-msg-error"],
                currentTrans["dynamic-msg-went-wrong"],
                "error"
              );
              return;
            } else {
              swal(
                currentTrans["btn-export"],
                `${currentTrans["label-exported-file"]}: ${filepath}`,
                "success"
              );
            }
          });
        });
      });
    } else {
      let htmlContent = "";
      let inlineData = `<!DOCTYPE html>
                <html lang="ar" dir="rtl">
                <head>
                    <meta charset="utf-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <meta name="description" content="">
					${column == 1 ? css_1_col_rtl : css_2_col_rtl}
                </head>
                <body class="body">
	                <center><h1>${currentBookname}</h1></center>
	                <div class="newspaper">`;
      var contentFlag = false;
      db.get(currentBook._id).then(function (doc) {
        doc.chapters.map((obj, i) => {
          var count = 0;
          var verseNumber;
          var verses;
          htmlContent += `<ul class="list">
	                                    <li>
	                                        <p class="firstLi"><span class="chapter">${obj.chapter}</span></p>
	                                    </li><li><ol>`;
          for (let i = 0; i < obj.verses.length; i++) {
            if (obj.verses[i].verse !== "" && obj.verses[i].verse !== null) {
              contentFlag = true;
            }
            count = count + 1;
            if (count < obj.verses.length && obj.verses[count].joint_verse) {
              // Finding out the join verses and get their verse number(s)
              verseNumber =
                obj.verses[count].joint_verse +
                "-" +
                obj.verses[count].verse_number;
              verses = obj.verses[obj.verses[count].joint_verse - 1].verse;
              continue;
            } else {
              if (verseNumber) {
                // Push join verse number (1-3) and content.
                htmlContent += `<div class="verseDiv"><p class="prespace"><span class="verseSpan">${verseNumber} </span>${verses}</p></div>`;
                verseNumber = undefined;
                verses = undefined;
              } else {
                // Push verse number and content.
                htmlContent += `<div class="verseDiv"><p class="prespace"><span class="verseSpan">${obj.verses[i].verse_number} </span>${obj.verses[i].verse}</p></div>`;
              }
            }
          }
          htmlContent += `</ol></li></ul>`;
          if (contentFlag) inlineData += htmlContent;
          htmlContent = "";
          contentFlag = false;
        });
        inlineData += "</div></body></html>";
        db.get("targetBible").then((doc) => {
          let filepath = path.join(
            doc.targetPath[0],
            `${currentBook.book_name.toLowerCase()}_${column}col_${getTimeStamp(
              new Date()
            )}.html`
          );
          fs.writeFile(filepath, inlineData, function (err) {
            if (err) {
              swal(
                currentTrans["dynamic-msg-error"],
                currentTrans["dynamic-msg-went-wrong"],
                "error"
              );
              return;
            } else {
              swal(
                currentTrans["btn-export"],
                `${currentTrans["label-exported-file"]}: ${filepath}`,
                "success"
              );
            }
          });
        });
      });
    }
  },
};

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
