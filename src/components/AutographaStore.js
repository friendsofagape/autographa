import { observable, decorate } from "mobx";
const Constant = require("../core/constants");

class AutographaStore {
  bookId = "1";
  chapterId = "1";
  bookChapter = { bookId: 0, chapterLength: 0 };
  activeTab = 1;
  chunkGroup = "";
  content = "";
  contentOne = "";
  contentTwo = "";
  contentCommon = "";
  bookActive = 1;
  chapterActive = 1;
  currentRef = "eng_ult";
  scriptDirection = "LTR";
  refScriptDirection = "LTR";
  refList = [];
  refListEdit = [];
  refListExist = [];
  transSaveTime = "";
  activeRefs = { 0: "eng_ult", 1: "eng_ult", 2: "eng_ult" };
  bookData = Constant.booksList;
  bookName = "";
  translationContent = "";
  selectId = 1;
  setDiff = false;
  toggle = false;
  tIns = [];
  tDel = [];
  emptyChapter = [];
  incompleteVerse = {};
  multipleSpaces = {};
  chunks = "";
  verses = "";
  fontStep = 1;
  fontMax = 50;
  fontMin = 14;
  currentFontValue = 16;
  layout = 1;
  layoutContent = 1;
  layout3xDirect = true;
  layout2xDirect = true;
  aId = "";
  currentTrans = {};
  translatedBookNames = null;
  openBookNameEditor = false;
  updatedTranslatedBookNames = "";
  editBookNamesMode = false;
  bookNameEditorPopup = false;
  bookIndex = null;
  RequiredIndex = null;
  successFile = [];
  errorFile = [];
  warningMsg = [];
  jointVerse = "";
  paraUsername = "";
  paraPassword = "";
  appLang = "en";
  currentTrans = {};
  AudioMount = false;
  vId = 1;
  recVerse = null;
  isWarning = false;
  isRecording = false;
  savedTime = null;
  isPlaying = false;
  isPause = false;
  currentSession = true;
  currentRefverse = "";
  isAudioSave = true;
  blobURL = null;
  audioImport = false;
  multiplier = 0;
  Tab = null;
  recordedChapters = [];
  AudioJointVerse = [];
  ChapterComplete = false;
  fontselected = "";
}
decorate(AutographaStore, {
  bookId: observable,
  chapterId: observable,
  bookChapter: observable,
  activeTab: observable,
  chunkGroup: observable,
  content: observable,
  contentOne: observable,
  contentTwo: observable,
  contentCommon: observable,
  bookActive: observable,
  chapterActive: observable,
  currentRef: observable,
  scriptDirection: observable,
  refScriptDirection: observable,
  refList: observable,
  refListEdit: observable,
  refListExist: observable,
  transSaveTime: observable,
  activeRefs: observable,
  bookData: observable,
  bookName: observable,
  translationContent: observable,
  selectId: observable,
  setDiff: observable,
  toggle: observable,
  tIns: observable,
  tDel: observable,
  emptyChapter: observable,
  incompleteVerse: observable,
  multipleSpaces: observable,
  chunks: observable,
  verses: observable,
  fontStep: observable,
  fontMax: observable,
  fontMin: observable,
  currentFontValue: observable,
  layout: observable,
  layoutContent: observable,
  layout3xDirect: observable,
  layout2xDirect: observable,
  aId: observable,
  currentTrans: observable,
  translatedBookNames: observable,
  openBookNameEditor: observable,
  updatedTranslatedBookNames: observable,
  editBookNamesMode: observable,
  bookNameEditorPopup: observable,
  bookIndex: observable,
  RequiredIndex: observable,
  successFile: observable,
  errorFile: observable,
  warningMsg: observable,
  jointVerse: observable,
  paraUsername: observable,
  paraPassword: observable,
  appLang: observable,
  AudioMount: observable,
  vId: observable,
  recVerse: observable,
  isWarning: observable,
  isRecording: observable,
  savedTime: observable,
  isPlaying: observable,
  isPause: observable,
  currentSession: observable,
  currentRefverse: observable,
  isAudioSave: observable,
  blobURL: observable,
  audioImport: observable,
  multiplier: observable,
  Tab: observable,
  recordedChapters: observable,
  AudioJointVerse: observable,
  ChapterComplete: observable,
  fontselected: observable,
});
export default new AutographaStore();
