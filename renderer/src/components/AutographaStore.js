import { observable, decorate } from 'mobx';

class AutographaStore {
  appLang = 'en';

  currentTrans = {};

  avatarPath = '';
}
decorate(AutographaStore, {
  currentTrans: observable,
  appLang: observable,
  avatarPath: observable,
});
export default new AutographaStore();
