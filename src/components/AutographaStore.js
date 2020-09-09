import { observable, decorate } from "mobx";

class AutographaStore {
  appLang = "en";
  currentTrans = {};
}
decorate(AutographaStore, {
  currentTrans: observable,
  appLang: observable,
});
export default new AutographaStore();
