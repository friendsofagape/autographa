import React, { createContext, Component } from "react";
import AutographaStore from "../../components/AutographaStore";
import swal from "sweetalert";
import mergeAudios from "../core/mergeAudios";
import createPauseData from "../core/createPauseData";
import * as mobx from "mobx";
const refDb = require(`${__dirname}/../../core/data-provider`).referenceDb();
const constants = require("../../core/constants");
let saveRec = require("../core/savetodir");
let timerfuction;
export const StoreContext = createContext();

class StoreContextProvider extends Component {
  state = {
    isOpen: true,
    onselect: 1,
    record: false,
    recordedFiles: {},
    storeRecord: [],
    recVerse: [],
    isWarning: false,
    blob: "",
    secondsElapsed: 0,
    timer: false,
    totalTime: 0,
    recVerseTime: [],
    isLoading: false,
    previousTime: "",
  };

  toggleOpen = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  setTimer = (time) => {
    this.setState({ secondsElapsed: time });
  };

  setPreviousTime = (prevTime) => {
    this.setState({ previousTime: prevTime });
  };

  resetTimer = () => {
    this.setState({ secondsElapsed: 0 });
  };

  selectPrev = (vId) => {
    AutographaStore.isWarning = false;
    AutographaStore.isPlaying = false;
    AutographaStore.currentSession = true;
    if (this.state.onselect > 1 && AutographaStore.isRecording === false) {
      this.setState({ onselect: AutographaStore.vId - 1 });
      AutographaStore.vId = AutographaStore.vId - 1;
      this.state.recVerse.map((value, index) => {
        if (value.toString() === AutographaStore.vId.toString()) {
          AutographaStore.isWarning = true;
          AutographaStore.currentSession = false;
          this.resetTimer();
        }
      });
    } else {
      if (this.state.onselect > 1)
        swal({
          title: "Are you sure?",
          text: "You want stop the currently recording verse",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        }).then((willDelete) => {
          if (willDelete) {
            this.stopRecording();
            this.setState({ secondsElapsed: 0 });
            AutographaStore.currentSession = false;
            swal("Stopped Recording!", {
              icon: "success",
            });
          }
        });
    }
  };

  selectNext = (vId) => {
    AutographaStore.currentSession = true;
    AutographaStore.isPlaying = false;
    AutographaStore.isWarning = false;
    if (
      this.state.onselect <= AutographaStore.chunkGroup.length - 1 &&
      AutographaStore.isRecording === false
    ) {
      this.setState({ onselect: AutographaStore.vId + 1 });
      this.resetTimer();
      AutographaStore.vId = AutographaStore.vId + 1;
      this.state.recVerse.map((value, index) => {
        if (value.toString() === AutographaStore.vId.toString()) {
          AutographaStore.isWarning = true;
          AutographaStore.currentSession = false;
        }
      });
    } else {
      if (this.state.onselect <= AutographaStore.chunkGroup.length - 1) {
        swal({
          title: "Are you sure?",
          text: "You want stop the currently recording verse",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        }).then((willDelete) => {
          if (willDelete) {
            this.resetTimer();
            this.stopRecording();
            swal("Stopped Recording!", {
              icon: "success",
            });
          }
        });
      }
    }
  };

  resetVal = (value, event, index) => {
    this.setState({ onselect: value });
  };

  startRecording = () => {
    let joint = mobx.toJS(AutographaStore.AudioJointVerse);
    let isJoint = joint.indexOf(this.state.onselect) !== -1;
    if (isJoint === false) this.setState({ timer: true });
    this.setState({ record: true });
    AutographaStore.isRecording = true;
    AutographaStore.isAudioSave = false;
  };

  stopRecording = () => {
    AutographaStore.currentSession = false;
    AutographaStore.isRecording = false;
    this.setState({ record: false });
  };

  saveRecord = async (value, event) => {
    let joint = mobx.toJS(AutographaStore.AudioJointVerse);
    let isJoint = joint.indexOf(this.state.onselect) !== -1;
    if (this.state.secondsElapsed > 0 && isJoint === false) {
      let save,
        mergetemp,
        previousSeconds,
        book = {};
      value["verse"] = this.state.onselect;
      value["totaltime"] = this.state.secondsElapsed;
      let chapter = "Chapter" + AutographaStore.chapterId;
      book.bookNumber = AutographaStore.bookId.toString();
      book.bookName = constants.booksList[parseInt(book.bookNumber, 10) - 1];
      if (this.state.recVerse.indexOf(AutographaStore.vId) !== -1) {
        this.setState({ timer: false });
        let FindIndexofverse = this.state.recVerseTime.findIndex(
          (verse) => verse.verse === this.state.onselect
        );
        this.state.recVerseTime.map((val, index) => {
          if (FindIndexofverse === index) {
            previousSeconds = val.totaltime;
          }
        });
        previousSeconds = this.state.secondsElapsed - previousSeconds;
        if (previousSeconds > 0) {
          this.state.recVerseTime.splice(FindIndexofverse, 1, {
            verse: this.state.onselect,
            totaltime: this.state.secondsElapsed,
          });
          this.setState({
            totalTime: this.state.totalTime + previousSeconds,
          });
          save = await createPauseData(
            value,
            book,
            chapter,
            this.state.onselect,
            this.state.recVerseTime
          ).then((save) => {
            if (save) {
              previousSeconds = undefined;
              this.setState({ isLoading: true });
            }
          });
        } else {
          this.setState({ timer: false });
          this.setTimer(this.state.previousTime);
        }
      } else {
        this.state.recVerse.push(this.state.onselect);
        this.state.recVerseTime.push({
          verse: this.state.onselect,
          totaltime: this.state.secondsElapsed,
        });
        AutographaStore.isWarning = true;
        this.setState({
          totalTime: this.state.totalTime + this.state.secondsElapsed,
        });
        this.setState({ recordedFiles: value });
        this.setState({ timer: false });
        this.state.storeRecord.push(value);
        save = await saveRec.recSave(
          book,
          this.state.recordedFiles,
          chapter,
          this.state.onselect,
          this.state.recVerse,
          this.state.recVerseTime
        );
        AutographaStore.recVerse = this.state.recVerse;
      }
    } else {
      this.setState({ timer: false });
      this.resetTimer();
    }
  };

  // mergePause = async (save) => {
  // 	let mergetemp,
  // 		book = {};
  // 	let chapter = 'Chapter' + AutographaStore.chapterId;
  // 	book.bookNumber = AutographaStore.bookId.toString();
  // 	book.bookName = constants.booksList[parseInt(book.bookNumber, 10) - 1];
  // 	if (save) {
  // 		setTimeout(() => {
  // 			mergetemp = MergePause(
  // 				book,
  // 				chapter,
  // 				this.state.onselect,
  // 				this.state.secondsElapsed,
  // 			);
  // 			console.log('Merge and close', AutographaStore.MergeStatus);
  // 			if (AutographaStore.MergeStatus === true) {
  // 				console.log('Merge and close', mergetemp);
  // 				this.SetLoader();
  // 			}
  // 		}, 2000);
  // 	}
  // };

  SetLoader = () => {
    this.setState({ isLoading: false });
  };

  exportAudio = async () => {
    let save,
      book = {};
    let chapter = "Chapter" + AutographaStore.chapterId;
    book.bookNumber = AutographaStore.bookId.toString();
    book.bookName = constants.booksList[parseInt(book.bookNumber, 10) - 1];
    save = await mergeAudios(
      book,
      chapter,
      this.state.recVerse,
      this.state.storeRecord
    );
  };

  reduceTimer = (deletedTime) => {
    this.setState({ totalTime: this.state.totalTime - deletedTime });
  };

  setOnselect = (vId) => {
    this.setState({ onselect: vId });
  };

  setRecverse = (value) => {
    this.state.recVerse.push(value);
    AutographaStore.recVerse = this.state.recVerse;
  };

  fetchTimer = (time) => {
    this.setState({
      totalTime: this.state.totalTime + time,
    });
  };
  updateJSON = (json) => {
    this.state.recVerseTime.push(json);
  };
  findBook = () => {
    AutographaStore.showModalBooks = true;
    AutographaStore.aId = 1;
    AutographaStore.activeTab = 1;
  };
  findChapter = () => {
    let bookId = AutographaStore.bookId.toString();
    let BookName = constants.booksList[parseInt(bookId, 10) - 1];
    AutographaStore.aId = 2;
    AutographaStore.showModalBooks = true;
    AutographaStore.activeTab = 2;
    AutographaStore.bookActive = AutographaStore.bookId;
    AutographaStore.bookName =
      AutographaStore.editBookNamesMode &&
      AutographaStore.translatedBookNames !== null
        ? AutographaStore.translatedBookNames[
            parseInt(AutographaStore.bookId, 10) - 1
          ]
        : constants.booksList[parseInt(AutographaStore.bookId, 10) - 1];
    AutographaStore.chapterActive = AutographaStore.chapterId;
    refDb
      .get(
        AutographaStore.currentRef +
          "_" +
          constants.bookCodeList[parseInt(AutographaStore.bookId, 10) - 1]
      )
      .then(function (doc) {
        AutographaStore.bookChapter["chapterLength"] = doc.chapters.length;
        AutographaStore.bookChapter["bookId"] = AutographaStore.bookId;
      })
      .catch(function (err) {
        console.log(err);
      });
    let existing = localStorage.getItem(BookName);
    // If no existing data, create an array
    // Otherwise, convert the localStorage string to an array
    existing = existing ? existing.split(",") : [];
    if (
      AutographaStore.chunkGroup.length !== this.state.recVerse.length &&
      existing.indexOf(AutographaStore.chapterId.toString()) !== -1
    ) {
      // Add new data to localStorage Array
      console.log(
        existing.indexOf(AutographaStore.chapterId.toString()) !== -1
      );
      if (existing.indexOf(AutographaStore.chapterId.toString() !== -1))
        existing.splice(
          existing.indexOf(AutographaStore.chapterId.toString()),
          1
        );
      localStorage.setItem(BookName, existing.toString());
    }
    let existingValue = localStorage.getItem(BookName);
    // If no existing data, create an array
    // Otherwise, convert the localStorage string to an array
    existingValue = existingValue ? existingValue.split(",") : [];
    AutographaStore.recordedChapters = existingValue;
  };

  render() {
    console.log(this.state.record);
    return (
      <StoreContext.Provider
        value={{
          ...this.state,
          toggleOpen: this.toggleOpen,
          selectNext: this.selectNext,
          selectPrev: this.selectPrev,
          resetVal: this.resetVal,
          startRecording: this.startRecording,
          stopRecording: this.stopRecording,
          saveRecord: this.saveRecord,
          getDB: this.getDB,
          setTimer: this.setTimer,
          resetTimer: this.resetTimer,
          exportAudio: this.exportAudio,
          reduceTimer: this.reduceTimer,
          setOnselect: this.setOnselect,
          setRecverse: this.setRecverse,
          fetchTimer: this.fetchTimer,
          updateJSON: this.updateJSON,
          findBook: this.findBook,
          findChapter: this.findChapter,
          SetLoader: this.SetLoader,
          setPreviousTime: this.setPreviousTime,
        }}
      >
        {this.props.children}
      </StoreContext.Provider>
    );
  }
}

export default StoreContextProvider;
