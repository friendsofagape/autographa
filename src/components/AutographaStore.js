import { observable } from "mobx";
const Constant = require("../core/constants");

export class AutographaStore {
  @observable bookId = "1";
  @observable chapterId = "1";
  @observable bookChapter = { bookId: 0, chapterLength: 0 };
  @observable activeTab = 1;
  @observable chunkGroup = "";
  @observable content = "";
  @observable bookActive = 1;
  @observable chapterActive = 1;
  @observable currentRef = "eng_ult";
  @observable bookData = Constant.booksList;
  @observable bookName = "";
  @observable translationContent = "";
  @observable selectId = 1;
  @observable setDiff = false;
  @observable emptyChapter = [];
  @observable incompleteVerse = {};
  @observable multipleSpaces = {};
  @observable chunks = "";
  @observable verses = "";
  @observable layout = 1;
  @observable layoutContent = 1;
  @observable aId = "";
  @observable currentTrans = {};
  @observable scriptDirection = "LTR";
  @observable refScriptDirection = "LTR";
  @observable refList = [];
  @observable refListEdit = [];
  @observable refListExist = [];
  @observable activeRefs = { 0: "eng_ult", 1: "eng_ult", 2: "eng_ult" };
}
export default new AutographaStore();
