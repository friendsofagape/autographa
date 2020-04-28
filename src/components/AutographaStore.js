import { observable } from 'mobx';

export class AutographaStore {
	@observable activeRefs = { 0: 'eng_ult', 1: 'eng_ult', 2: 'eng_ult' };
}
export default new AutographaStore();
