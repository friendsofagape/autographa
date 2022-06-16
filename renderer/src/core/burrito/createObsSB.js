import moment from 'moment';
import burrito from '../../lib/OBSTemplete.json';
import languageCode from '../../lib/LanguageCode.json';
import * as logger from '../../logger';
import packageInfo from '../../../../package.json';
import { updateVersion } from './updateObsSB';

const findCode = (list, id) => {
  logger.debug('createObsSB.js', 'In findCode for getting the language code');
  let code = '';
  list.forEach((obj) => {
    if ((obj.name).toLowerCase() === id.toLowerCase()) {
      code = obj.lang_code;
    }
  });
  return code;
};
const createObsSB = (
username,
projectFields,
language,
copyright,
id,
project,
call,
update,
) => {
  logger.debug('createObsSB.js', 'In createObsSB');
  return new Promise((resolve) => {
    let json = {};
    if (call === 'edit') {
      json = project;
      delete json.project;
      delete json.version;
      if (update) {
        json = updateVersion(json);
      }
    } else {
      json = burrito;
    }
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
    if (call === 'edit' && project?.copyright?.shortStatements && (copyright.licence).length <= 500) {
      json.copyright.shortStatements[0].statement = copyright.licence;
    } else {
      json.copyright.licenses[0].ingredient = 'license.md';
    }
    logger.debug('createObsSB.js', 'Created the Translation SB');
    resolve(json);
  });
};
export default createObsSB;
