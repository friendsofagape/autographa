import moment from 'moment';
import { v5 as uuidv5 } from 'uuid';
import burrito from '../../../../lib/BurritoTemplete.json';
import languageCode from '../../../../lib/LanguageCode.json';
import * as logger from '../../../../logger';
import { environment } from '../../../../../environment';
import packageInfo from '../../../../../../package.json';

const findCode = (list, id) => {
    logger.debug('createBibleResourceSB.js', 'In findCode for getting the language code');
    let code = '';
    list.forEach((obj) => {
      if ((obj.name).toLowerCase() === id.toLowerCase()) {
        code = obj.lang_code;
      }
    });
    return code;
  };
const createBibleResourceSB = async (username, resourceMeta, projectResource) => {
    logger.debug('createBibleResourceSB.js', 'Create Metadata for downloaded bible resource');
    // generate unique key
    const key = username + projectResource.name + projectResource.owner + moment().format();
    const id = uuidv5(key, environment.uuidToken);
    const localizedNames = {};
    // console.log('unique id : ', id);
    return new Promise((resolve) => {
        let json = {};
        json = burrito;
        json.meta.generator.userName = username;
        json.meta.generator.softwareName = 'Autographa';
        json.meta.generator.softwareVersion = packageInfo.version;
        json.meta.dateCreated = moment().format();
        json.idAuthorities = {
          dcs: {
            id: new URL(projectResource.url).hostname,
            name: {
              en: projectResource.owner,
            },
          },
        };
        json.identification.primary = {
            ag: {
              [id]: {
              revision: '1',
              timestamp: moment().format(),
              },
            },
          };
        json.identification.upstream = {
            dcs: [{
              [`${projectResource.owner}:${projectResource.name}`]: {
              revision: projectResource.release.tag_name,
              timestamp: projectResource.released,
              },
            },
          ],
          };
        json.identification.name.en = projectResource.name;
        json.identification.abbreviation.en = '';
        const code = findCode(languageCode, resourceMeta.dublin_core.language.title);
        if (code) {
          json.languages[0].tag = code;
        } else {
          json.languages[0].tag = resourceMeta.dublin_core.language.title.substring(0, 3);
        }
        json.languages[0].name.en = projectResource.language_title;

        json.copyright.shortStatements = [
          {
            statement: resourceMeta?.dublin_core?.rights,
          },
        ];
        json.copyright.licenses[0].ingredient = 'LICENSE.md';
        resourceMeta.books.forEach((scope) => {
          json.type.flavorType.currentScope[scope.toUpperCase()] = [];
          localizedNames[scope.toUpperCase()] = json.localizedNames[scope.toUpperCase()];
        });
        json.localizedNames = localizedNames;

        logger.debug('createBibleResourceSB.js', 'Created the createBibleResource SB');
        resolve(json);
      });
};

export default createBibleResourceSB;
