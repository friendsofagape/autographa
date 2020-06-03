import en from './en';
import hi from './hi';
import es from './es';
import ar from './ar';
import pt from './pt';

let loadedLanguage;
const rtlDetect = require('rtl-detect');
const refDb = require(`${__dirname}/../util/data-provider`).referenceDb();
const fs = require('fs');
const path = require('path');


function i18n() {
	loadedLanguage = refDb.get('app_locale').then(function(doc) {
		switch(doc.appLang){
			case 'en':
				return en;
			case 'hi':
				return hi;
			case 'pt':
				return pt;
			case 'es':
				return es;
			case 'ar':
				return ar;
			default:
				return en;
		}

		// if(fs.existsSync(path.join(__dirname, doc.appLang + '.js'))) {
		// 	return JSON.parse(fs.readFileSync(path.join(__dirname, doc.appLang + '.js'), 'utf8'))
		// }
		// else {
		// 	return JSON.parse(fs.readFileSync(path.join(__dirname, "en.js"), 'utf8'))
		// }
	}).catch(function(error){
		//return JSON.parse(fs.readFileSync(path.join(__dirname, "en.js"), 'utf8'))
		return en;
	})
}

i18n.prototype.getLocale = function() {
	return refDb.get('app_locale').then(function(doc) {
		return doc.appLang;
	}).catch(function(error){
		return 'en';
	});
}

i18n.prototype.isRtl = function(){
	return this.getLocale().then((res) => rtlDetect.isRtlLang(res));
}

i18n.prototype.currentLocale = function() {
	return loadedLanguage.then(function(res){
		return res;
	})
}

i18n.prototype.__ = function(phrase) {
	return loadedLanguage.then(function(res){
		let translation = res[phrase]
		if(translation === undefined) {
	    	translation = phrase
	  	}
	  	return translation;
	})
}
module.exports = i18n;