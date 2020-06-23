// @flow
import React, {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from "react";
import { StoreContext } from "../context/StoreContext";
import Loader from "../components/Loader/Loader";
import ConcatAudio from "./ConcatAudio";
import AutographaStore from "../../components/AutographaStore";
let audio = new ConcatAudio();
const constants = require("../../core/constants");
const { app } = require("electron").remote;
const fs = require("fs");
const path = require("path");

const MergePause = () => {
  const {
    startRecording,
    setTimer,
    stopRecording,
    saveRecord,
    resetTimer,
    recVerse,
    recVerseTime,
    onselect,
    isLoading,
    SetLoader,
  } = useContext(StoreContext);
  let book = {};
  let chapter = "Chapter" + AutographaStore.chapterId;
  book.bookNumber = AutographaStore.bookId.toString();
  book.bookName = constants.booksList[parseInt(book.bookNumber, 10) - 1];

  useEffect(() => {
    if (isLoading === true) {
      setTimeout(() => {
        merge();
      }, 2000);
    }
  });

  function merge() {
    if (
      fs.existsSync(
        path.join(
          app.getPath("userData"),
          "recordings",
          book.bookName,
          chapter,
          `temp.mp3`
        )
      )
    ) {
      var existingVerse, tempVerse, merged, output;
      existingVerse = path.join(
        app.getPath("userData"),
        "recordings",
        book.bookName,
        chapter,
        `verse${onselect}.mp3`
      );
      tempVerse = path.join(
        app.getPath("userData"),
        "recordings",
        book.bookName,
        chapter,
        `temp.mp3`
      );
      audio
        .fetchAudio(existingVerse, tempVerse)
        .then((buffers) => {
          // => [AudioBuffer, AudioBuffer]
          merged = audio.concatAudio(buffers);
          console.log("buff", merged);
        })
        .then(() => {
          // => AudioBuffer
          console.log("merged", merged);
          output = audio.export(merged, "audio/mp3");
        })
        .then(() => {
          console.log("out", output);
          writeRecfile(
            output,
            path.join(
              app.getPath("userData"),
              "recordings",
              book.bookName,
              chapter,
              `verse${onselect}.mp3`
            )
          );
          // => {blob, element, url}
          // audio.download(
          // 	output.blob,
          // 	`${book.bookName}/${chapter}`,
          // );
          // console.log(output.element)
          // document.body.append(output.element);
        })
        .catch((error) => {
          // => Error Message
          console.log("error", error);
        })
        .finally(() => {
          SetLoader();
        });
      audio.notSupported(() => {
        console.log("Handle no browser support");
        // Handle no browser support
      });
    }
  }

  function writeRecfile(file, filePath) {
    var fileReader = new FileReader();
    fileReader.onload = function () {
      fs.writeFileSync(filePath, Buffer.from(new Uint8Array(this.result)));
    };
    fileReader.readAsArrayBuffer(file.blob);
    return filePath;
  }

  return <div>{isLoading === true ? <Loader /> : ""}</div>;
};

export default MergePause;
