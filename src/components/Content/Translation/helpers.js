import ConcatAudio from "../../../Audio/core/ConcatAudio";
import AutographaStore from "../../AutographaStore";
import * as mobx from "mobx";
const { app } = require("electron").remote;
const path = require("path");
const fs = require("fs");
const constants = require("../../../core/constants");
let audio = new ConcatAudio();

export const lastSavedtime = () => {
  let bookId = AutographaStore.bookId.toString();
  let BookName = constants.booksList[parseInt(bookId, 10) - 1];
  var newfilepath = path.join(
    app.getPath("userData"),
    "recordings",
    BookName,
    `Chapter${AutographaStore.chapterId}`,
    `output.json`
  );
  if (fs.existsSync(newfilepath)) {
    fs.readFile(
      newfilepath,
      // callback function that is called when reading file is done
      function (err, data) {
        // json data
        var jsonData = data;
        // parse json
        var jsonParsed = JSON.parse(jsonData);
        // access elements
        for (var key in jsonParsed) {
          if (jsonParsed.hasOwnProperty(key)) {
            var val = jsonParsed[key];
            if (val.verse === AutographaStore.vId) {
              AutographaStore.savedTime = val.totaltime;
            }
          }
        }
      }
    );
  }
};

export const fetchAudio = () => {
  let newfilepath, merged, output;
  let audiomp3 = [];
  let bookId = AutographaStore.bookId.toString();
  let recordedVerse = mobx.toJS(AutographaStore.recVerse);
  let BookName = constants.booksList[parseInt(bookId, 10) - 1];
  if (AutographaStore.isPlaying === true) {
    recordedVerse.map((versenum, index) => {
      if (versenum === AutographaStore.vId) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        newfilepath = path.join(
          app.getPath("userData"),
          "recordings",
          BookName,
          `Chapter${AutographaStore.chapterId}`,
          `verse${versenum}.mp3`
        );
        audiomp3.push(newfilepath);
      }
    });
    audio
      .fetchAudio(...audiomp3)
      .then((buffers) => {
        // => [AudioBuffer, AudioBuffer]
        merged = audio.concatAudio(buffers);
      })
      .then(() => {
        // => AudioBuffer
        output = audio.export(merged, "audio/mp3");
      })
      .then(() => {
        AutographaStore.blobURL = output.url;
      });
  }
};
