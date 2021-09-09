import moment from 'moment';
import burrito from '../../lib/BurritoTemplete.json';
import { OT, NT } from '../../lib/CanonSpecification';
import languageCode from '../../lib/LanguageCode.json';

const sha1 = require('sha1');

const findCode = (list, id) => {
  let code = '';
  list.forEach((obj) => {
    if ((obj.name).toLowerCase() === id.toLowerCase()) {
      code = obj.lang_code;
    }
  });
  return code;
};
const uniqType = (canon) => [...new Set(canon)];
const createTranslationSB = (username, version, currentScope, language, licence) => {
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
        [sha1(username + version.name + moment().format())]: {
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
    json.identification.name.en = version.name;
    json.identification.abbreviation.en = version.abbreviation;
    json.languages[0].name.en = language;
    json.copyright.fullStatementPlain.en = licence;
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
    resolve(json);
  });
};
export default createTranslationSB;
