import moment from 'moment';
import { v5 as uuidv5 } from 'uuid';
import Textburrito from '../../../../lib/BurritoTemplete.json';
import OBSburrito from '../../../../lib/OBSTemplete.json';
import languageCode from '../../../../lib/LanguageCode.json';
import * as logger from '../../../../logger';
import { environment } from '../../../../../environment';
import packageInfo from '../../../../../../package.json';

const findCode = (list, id) => {
    logger.debug('createDownloadedResourceSB.js', 'In findCode for getting the language code');
    let code = '';
    list.forEach((obj) => {
      if ((obj.name).toLowerCase() === id.toLowerCase()) {
        code = obj.lang_code;
      }
    });
    return code;
  };
const createDownloadedResourceSB = async (username, resourceMeta, projectResource, selectResource) => {
    logger.debug('createDownloadedResourceSB.js', 'Create Metadata for downloaded bible resource');
    // generate unique key
    try {
    const key = username + projectResource.name + projectResource.owner + moment().format();
    const id = uuidv5(key, environment.uuidToken);
    const localizedNames = {};
    // console.log('unique id : ', id);
    return new Promise((resolve) => {
        let json = {};
        switch (selectResource) {
          case 'bible':
            json = Textburrito;
            break;
            case 'obs':
            json = OBSburrito;
            break;
          default:
            throw new Error(' can not process :Inavalid Type od Resource requested');
            // break;
        }
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

        if (selectResource === 'bible') {
          resourceMeta.books.forEach((scope) => {
            json.type.flavorType.currentScope[scope.toUpperCase()] = [];
            localizedNames[scope.toUpperCase()] = json.localizedNames[scope.toUpperCase()];
          });
          json.localizedNames = localizedNames;
        }

        logger.debug('createDownloadedResourceSB.js', 'Created the createBibleResource SB');
        resolve(json);
      });
    } catch (err) {
      throw new Error(`Generate Burrito Failed :  ${err}`);
    }
};

export default createDownloadedResourceSB;
