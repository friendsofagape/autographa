import moment from 'moment';
import burrito from '../../lib/BurritoTemplete.json';
import { OT, NT } from '../../lib/CanonSpecification';
import languageCode from '../../lib/LanguageCode.json';
import * as logger from '../../logger';

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
const uniqType = (canon) => [...new Set(canon)];
const createTranslationSB = (username, projectFields, currentScope, language, licence, id) => {
  logger.debug('createTranslationSB.js', 'In createTranslationSB');
  const names = {};
  const canonTypes = [];
  const canonSpec = {
    ot: {
      name: 'western',
    },
    nt: {
      name: 'western',
    },
  };
  return new Promise((resolve) => {
    const json = burrito;
    json.meta.generator.userName = username;
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
    const newLicence1 = licence?.replace(/(\n)/gm, '\\n');
    const newLicence = newLicence1?.replace(/(\r)/gm, '\\r');
    json.copyright.fullStatementPlain.en = newLicence?.replace(/"/gm, '\'');
    currentScope.forEach((scope) => {
      json.type.flavorType.currentScope[scope] = [];
      names[scope] = json.names[scope];
      const ot = OT.includes(scope);
      if (ot) {
        canonTypes.push('ot');
      } else {
        const nt = NT.includes(scope);
        if (nt) {
          canonTypes.push('nt');
        }
      }
    });
    const canonType = uniqType(canonTypes);
    json.type.flavorType.canonType = canonType;
    canonType.forEach((type) => {
      json.type.flavorType.canonSpec[type] = canonSpec[type];
    });
    json.names = names;
    logger.debug('createTranslationSB.js', 'Created the Translation SB');
    resolve(json);
  });
};
export default createTranslationSB;
