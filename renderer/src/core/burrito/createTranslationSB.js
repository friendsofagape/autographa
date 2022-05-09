import moment from 'moment';
import burrito from '../../lib/BurritoTemplete.json';
import languageCode from '../../lib/LanguageCode.json';
import * as logger from '../../logger';
import packageInfo from '../../../../package.json';

const findCode = (list, id) => {
  logger.debug('createTranslationSB.js', 'In findCode for getting the language code');
  let code = '';
  list.forEach((obj) => {
    if ((obj.name).toLowerCase() === id.toLowerCase()) {
      code = obj.lang_code;
    }
  });
  return code;
};
const createTranslationSB = (username, projectFields, selectedScope, language, licence, id) => {
  logger.debug('createTranslationSB.js', 'In createTranslationSB');
  const localizedNames = {};
  return new Promise((resolve) => {
    const json = burrito;
    json.meta.generator.userName = username;
    json.meta.generator.softwareVersion = packageInfo.version;
    json.meta.dateCreated = moment().format();
    json.identification.primary = {
      ag: {
        [id]: {
        revision: '1',
        timestamp: moment().format(),
        },
      },
    };
    const code = findCode(languageCode, language);
    if (code) {
      json.languages[0].tag = code;
    } else {
      json.languages[0].tag = language.substring(0, 3);
    }
    json.identification.name.en = projectFields.projectName;
    json.identification.abbreviation.en = projectFields.abbreviation;
    json.languages[0].name.en = language;
    // const newLicence = licence;
    // json.copyright.fullStatementPlain.en = newLicence?.replace(/"/gm, '\'');
    json.copyright.licenses[0].ingredient = 'license.md';
    selectedScope.forEach((scope) => {
      json.type.flavorType.currentScope[scope] = [];
      localizedNames[scope] = json.localizedNames[scope];
    });
    json.localizedNames = localizedNames;
    logger.debug('createTranslationSB.js', 'Created the Translation SB');
    resolve(json);
  });
};
export default createTranslationSB;
