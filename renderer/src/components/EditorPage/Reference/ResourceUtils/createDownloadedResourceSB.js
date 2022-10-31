import moment from 'moment';
import { v5 as uuidv5 } from 'uuid';
import localForage from 'localforage';
import Textburrito from '../../../../lib/BurritoTemplete.json';
import OBSburrito from '../../../../lib/OBSTemplete.json';
import languageCode from '../../../../lib/LanguageCode.json';
import * as logger from '../../../../logger';
import { environment } from '../../../../../environment';
import packageInfo from '../../../../../../package.json';
import customLicense from '../../../../lib/license/Custom.md';
import OBSLicense from '../../../../lib/OBSLicense.md';
import OBSData from '../../../../lib/OBSData.json';

const md5 = require('md5');

const path = require('path');
const JSZip = require('jszip');

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

export const generateAgSettings = async (metaData, currentResourceMeta, selectResource) => new Promise((resolve) => {
  logger.debug('DownloadResourcePopUp.js', 'In generate ag-settings for resource downloaded');
  try {
    const settings = {
      version: environment.AG_SETTING_VERSION,
      project: {
        [metaData.type.flavorType.flavor.name]: {
          scriptDirection: currentResourceMeta?.dublin_core?.language?.direction,
          starred: false,
          description: currentResourceMeta?.dublin_core?.description,
          copyright: currentResourceMeta?.dublin_core?.rights,
          lastSeen: moment().format(),
          refResources: [],
          bookMarks: [],
        },
      },
      sync: { services: { door43: [] } },
    };
    if (selectResource === 'bible') {
      settings.versification = 'ENG';
    }
    resolve(settings);
  } catch (err) {
    throw new Error(`Generate Ag-settings Failed :  ${err}`);
  }
});

export const generateResourceIngredientsTextTransaltion = async (currentResourceMeta, path, folder, currentResourceProject, resourceBurritoFile) => {
  // generating ingredients content in metadata
  currentResourceMeta?.projects.forEach(async (project) => {
    logger.debug('DownloadResourcePopUp.js', 'In adding ingredients to burrito for TextTransaltion');
    const fs = window.require('fs');
    if (fs.existsSync(path.join(folder, currentResourceProject.name, project.path))) {
      const filecontent = await fs.readFileSync(path.join(folder, currentResourceProject.name, project.path), 'utf8');
      // find checksum & size by read the file
      const checksum = md5(filecontent);
      const stats = fs.statSync(path.join(folder, currentResourceProject.name, project.path));
      resourceBurritoFile.ingredients[project.path] = {
        checksum: { md5: checksum },
        mimeType: currentResourceMeta.dublin_core.format,
        size: stats.size,
        scope: { [project?.identifier.toUpperCase()]: [] },
      };
    } else {
      logger.debug('DownloadResourcePopUp.js', 'error file not found in resource download');
      throw new Error(`File not Exist in project Directory:  ${project.path}`);
    }
  });
  return resourceBurritoFile;
};

export const generateResourceIngredientsOBS = async (currentResourceMeta, path, folder, currentResourceProject, resourceBurritoFile, files) => {
  logger.debug('DownloadResourcePopUp.js', 'In adding ingredients to burrito of OBS');
  files.forEach(async (file) => {
    const fs = window.require('fs');
    const endPart = file.split('/').pop();
    const regX = /^\d{2}.md$/;
    if (regX.test(endPart) || ['intro.md', 'title.md'].indexOf(endPart) > -1) {
      // console.log('matched : ', file);
      if (fs.existsSync(path.join(folder, file))) {
        const filecontent = await fs.readFileSync(path.join(folder, file), 'utf8');
        // find checksum & size by read the file
        const checksum = md5(filecontent);
        const stats = fs.statSync(path.join(folder, file));
        resourceBurritoFile.ingredients[file.replace(`${currentResourceProject.name}/`, '')] = {
          checksum: { md5: checksum },
          mimeType: currentResourceMeta.dublin_core.format,
          size: stats.size,
        };
        if (endPart.toLowerCase() === 'front.md') {
          resourceBurritoFile.ingredients[file.replace(`${currentResourceProject.name}/`, '')].role = 'pubdata';
        } else if (regX.test(endPart)) {
          // eslint-disable-next-line array-callback-return
          resourceBurritoFile.ingredients[file.replace(`${currentResourceProject.name}/`, '')].scope = OBSData.filter((story) => {
            if (`${story.storyId.toString().padStart(2, 0)}.md` === endPart.toLowerCase()) {
              return story;
            }
          })[0].scope;
        } else {
          resourceBurritoFile.ingredients[file.replace(`${currentResourceProject.name}/`, '')].role = 'title';
        }
      } else {
        logger.debug('DownloadResourcePopUp.js', 'error file not found in resource download');
        throw new Error(`File not Exist in project Directory:  ${file}`);
      }
    }
  });
  return resourceBurritoFile;
};

export const handleDownloadResources = async (resourceData, selectResource, action, update = false) => {
  logger.debug('DownloadResourcePopUp.js', 'In resource download - started : ');
  const newpath = localStorage.getItem('userPath');
//   console.log({
//  resourceData, selectResource, action, update,
// });
  return new Promise((resolve, reject) => {
  localForage.getItem('userProfile').then(async (user) => {
    logger.debug('DownloadResourcePopUp.js', 'In resource download user fetch - ', user?.username);
    const folder = path.join(newpath, 'autographa', 'users', `${user?.username}`, 'resources');
    const fs = window.require('fs');
    let resourceBurritoFile = {};
    let currentResourceMeta = '';
    let currentResourceProject = '';
    let licenseFileFound = false;
    let currentProjectName = '';
    let customLicenseContent = 'empty';
      try {
        // eslint-disable-next-line no-restricted-syntax, guard-for-in
         for (const key in resourceData) {
          // eslint-disable-next-line no-await-in-loop, no-restricted-syntax, guard-for-in
          for (const row in resourceData[key]) {
            const resource = resourceData[key][row];
            if (resource.isChecked) {
              logger.debug('passed is checked ---------->');
              // eslint-disable-next-line no-await-in-loop
              await fetch(resource.metadata_json_url)
                .then((res) => res.json())
                // eslint-disable-next-line no-loop-func
                .then(async (response) => {
                  logger.debug('passed  fetch meta ---------->', { response });
                  logger.debug('DownloadResourcePopUp.js', 'In resource download - fetch resourceMeta yml');
                  currentResourceMeta = response;
                  currentResourceProject = resource;
                  // creating burrito template
                  resourceBurritoFile = await createDownloadedResourceSB(user?.username, currentResourceMeta, currentResourceProject, selectResource);
                  // adding online fetch response meta as resourceMeta
                  resourceBurritoFile.resourceMeta = currentResourceProject;
                  resourceBurritoFile.resourceMeta.lastUpdatedAg = moment().format();
                  logger.debug('passed  create burrito ---------->');

                  logger.debug('DownloadResourcePopUp.js', 'In resource download - basic burrito generated for resource ', `${resource.name}-${resource.owner}`);
                  // logger.debug(`${resource.name}-${resource.owner}`);
                  // console.log('buritto before ingred : ', resourceBurritoFile);

                  currentProjectName = `${resource.name}_${Object.keys(resourceBurritoFile.identification.primary.ag)[0]}`;
                  // console.log(currentProjectName);
                  await fetch(resource.zipball_url)
                    .then((res) => res.arrayBuffer())
                    .then(async (blob) => {
                      logger.debug('DownloadResourcePopUp.js', 'In resource download - downloading zip content ');
                      if (!fs.existsSync(folder)) {
                        fs.mkdirSync(folder, { recursive: true });
                      }
                      // wririntg zip to local
                      await fs.writeFileSync(path.join(folder, `${currentProjectName}.zip`), Buffer.from(blob));
                      logger.debug('DownloadResourcePopUp.js', 'In resource download - downloading zip content completed ');

                      logger.debug('DownloadResourcePopUp.js', 'In resource download - Unzip downloaded resource');
                      // extract zip
                      const filecontent = await fs.readFileSync(path.join(folder, `${currentProjectName}.zip`));
                      const result = await JSZip.loadAsync(filecontent);
                      const keys = Object.keys(result.files);

                      // eslint-disable-next-line no-restricted-syntax
                      for (const key of keys) {
                        const item = result.files[key];
                        if (item.dir) {
                          fs.mkdirSync(path.join(folder, item.name), { recursive: true });
                        } else {
                          // eslint-disable-next-line no-await-in-loop
                          const bufferContent = Buffer.from(await item.async('arraybuffer'));
                          fs.writeFileSync(path.join(folder, item.name), bufferContent);
                        }
                        if (key.toLowerCase().includes('license')) {
                          logger.debug('DownloadResourcePopUp.js', 'In resource download - check license file found');
                          licenseFileFound = true;
                          // console.log('license exist');
                          if (fs.existsSync(path.join(folder, key))) {
                            const licenseContent = fs.readFileSync(path.join(folder, key), 'utf8');
                            const checksum = md5(licenseContent);
                            const stats = fs.statSync(path.join(folder, key));
                            resourceBurritoFile.ingredients[key.replace(currentResourceProject.name, '.')] = {
                              checksum: { md5: checksum },
                              mimeType: 'text/md',
                              size: stats.size,
                              role: 'x-licence',
                            };
                          }
                        }
                      }
                      logger.debug('passed zip extract ---------->');

                      // ingredients add to burrito
                      switch (selectResource) {
                        case 'bible':
                          resourceBurritoFile = await generateResourceIngredientsTextTransaltion(currentResourceMeta, path, folder, currentResourceProject, resourceBurritoFile);
                          customLicenseContent = customLicense;
                          break;
                        case 'obs':
                          resourceBurritoFile = await generateResourceIngredientsOBS(currentResourceMeta, path, folder, currentResourceProject, resourceBurritoFile, keys);
                          customLicenseContent = OBSLicense;
                          break;
                        default:
                          throw new Error(' can not process :Inavalid Type od Resource requested');
                      }
                      logger.debug('passed ingredients creations ---------->');

                      // custom license adding
                      if (!licenseFileFound) {
                        logger.debug('DownloadResourcePopUp.js', 'In resource custom license add - no license found');
                        // console.log('no license file found -', md5(customLicenseContent));
                        if (fs.existsSync(path.join(folder, currentResourceProject.name))) {
                          fs.writeFileSync(path.join(folder, currentResourceProject.name, 'LICENSE.md'), customLicenseContent);
                          const stats = fs.statSync(path.join(folder, currentResourceProject.name, 'LICENSE.md'));
                          resourceBurritoFile.ingredients['./LICENSE.md'] = {
                            checksum: { md5: md5(customLicenseContent) },
                            mimeType: 'text/md',
                            size: stats.size,
                            role: 'x-licence',
                          };
                        }
                      }

                      // ag settings file generation
                      logger.debug('DownloadResourcePopUp.js', 'generating ag-settings');
                      const settings = await generateAgSettings(resourceBurritoFile, currentResourceMeta, selectResource);
                      await fs.writeFileSync(path.join(folder, currentResourceProject.name, 'ag-settings.json'), JSON.stringify(settings));
                      const settingsContent = fs.readFileSync(path.join(folder, currentResourceProject.name, 'ag-settings.json'), 'utf8');
                      const checksum = md5(settingsContent);
                      const stats = fs.statSync(path.join(folder, currentResourceProject.name, 'ag-settings.json'));
                      resourceBurritoFile.ingredients['./ag-settings.json'] = {
                        checksum: { md5: checksum },
                        mimeType: 'application/json',
                        size: stats.size,
                        role: 'x-autographa',
                      };
                      // write metaData.json
                      await fs.writeFileSync(path.join(folder, currentResourceProject.name, 'metadata.json'), JSON.stringify(resourceBurritoFile));

                      logger.debug('passed ag settings creations ---------->');

                      // console.log('buritto after FINAL write  : ', resourceBurritoFile);

                      // finally remove zip and rename base folder to projectname_id
                      logger.debug('DownloadResourcePopUp.js', 'deleting zip file - rename project with project + id in ag format');
                      if (fs.existsSync(folder)) {
                        fs.renameSync(path.join(folder, currentResourceProject.name), path.join(folder, currentProjectName));
                        fs.unlinkSync(path.join(folder, `${currentProjectName}.zip`), () => {
                          logger.debug('DownloadResourcePopUp.js', 'error in deleting zip');
                          throw new Error(`Removing Resource Zip Failed :  ${currentResourceProject.name}`);
                        });
                      }
                    }).catch((err) => {
                      throw new Error(`Download Resource file Failed :  ${err}`);
                    });
                }).catch((err) => {
                  throw new Error(`Fetch Resource Failed :  ${err}`);
                });
              logger.debug('DownloadResourcePopUp.js', 'Finished single resource: ');
              logger.debug('completed single resource ---------->', resource.name);
              action && action?.setDownloadCount((prev) => prev + 1);
            }
          }
          // console.log('lang group finished ---------------------------');
          if (update && update.status) {
            // eslint-disable-next-line no-await-in-loop
            await fs.rmdir(path.join(folder, update?.oldResource?.projectDir), { recursive: true }, (err) => {
              if (err) {
                throw new Error(`Delete old Resource failed :  ${err}`);
              }
            });
          }
          resolve({ status: 'success' });
        }
      } catch (err) {
        logger.debug('DownloadResourcePopUp.js', 'Catching error in dowload resource', err);
        reject(err);
      }
  });
});
};
