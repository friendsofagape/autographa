import moment from 'moment';
import * as localforage from 'localforage';
import { v5 as uuidv5 } from 'uuid';
import { createAudioVersification } from '@/util/createAudioVersification';
import { createVersificationUSFM } from '../../util/createVersificationUSFM';
import { createObsContent } from '../../util/createObsContent';
import createTranslationSB from '../burrito/createTranslationSB';
import createObsSB from '../burrito/createObsSB';
import * as logger from '../../logger';
import { environment } from '../../../environment';
import createAudioSB from '../burrito/createAudioSB';

const bookAvailable = (list, id) => list.some((obj) => obj === id);
const checker = (arr, target) => target.every((v) => arr.includes(v));

const saveProjectsMeta = async (projectMetaObj) => {
  logger.debug('saveProjectsMeta.js', 'In saveProjectsMeta');
  const newpath = localStorage.getItem('userPath');
  const status = [];
  const fs = window.require('fs');
  const path = require('path');
  let currentUser;
  await localforage.getItem('userProfile').then((value) => {
    logger.debug('saveProjectsMeta.js', 'Fetching the current username');
    currentUser = value?.username;
  });
  fs.mkdirSync(path.join(newpath, 'autographa', 'users', currentUser, 'projects'), {
    recursive: true,
  });
  const projectDir = path.join(newpath, 'autographa', 'users', currentUser, 'projects');
  let projectNameExists = false;
  let checkCanon = false;
  const folderList = fs.readdirSync(projectDir);
  projectMetaObj.newProjectFields.projectName = projectMetaObj.newProjectFields.projectName.trim();
  folderList.forEach((folder) => {
    const name = folder.split('_');
    if (name[0] === projectMetaObj.newProjectFields.projectName && projectMetaObj.call === 'new') {
      projectNameExists = true;
      // checking for duplicates
      logger.warn('saveProjectsMeta.js', 'Project Name already exists');
      status.push({ type: 'warning', value: 'projectname exists, check you archived or projects tab' });
    }
  });

  // Translation burrito creation and checks
  const translationBurritoChecksAndCreation = async () => {
    logger.debug('saveProjectsMeta.js', 'In translation Burrito Checks And Creation');

    projectMetaObj.importedFiles.forEach((file) => {
      if (!bookAvailable(projectMetaObj.canonSpecification.currentScope, file.id)) {
        checkCanon = true;
        logger.warn('saveProjectsMeta.js', `${file.id} is not added in Canon Specification or scope`);
        status.push({ type: 'warning', value: `${file.id} is not added in Canon Specification` });
      }
    });

    if (projectMetaObj.call === 'edit' && !checker((projectMetaObj.canonSpecification.currentScope), Object.keys(projectMetaObj.project.type.flavorType.currentScope))) {
      checkCanon = true;
      logger.warn('saveProjectsMeta.js', 'Not allowed to remove previous scope');
      status.push({ type: 'warning', value: 'You are not allowed to remove previous scope.' });
    }

    if (checkCanon === false) {
      let id;
      let scope;
      if (projectMetaObj.call === 'new') {
        logger.debug('saveProjectsMeta.js', 'Creating a key for the Project');
        const key = currentUser + projectMetaObj.newProjectFields.projectName + moment().format();
        id = uuidv5(key, environment.uuidToken);
        scope = projectMetaObj.canonSpecification.currentScope;
      } else {
        logger.debug('saveProjectsMeta.js', 'Fetching the key from the existing Project');
        // from existing metadata
        scope = (projectMetaObj.canonSpecification.currentScope)
        .filter((x) => !(Object.keys(projectMetaObj.project.type.flavorType.currentScope)).includes(x));
        id = Object.keys(projectMetaObj.project?.identification?.primary?.ag);
        projectMetaObj.importedFiles.forEach((file) => {
          scope.push(file.id);
        });
      }
      // Create New burrito
      // ingredient has the list of created files in the form of SB Ingredients
      logger.debug('saveProjectsMeta.js', 'Calling creatVersification for generating USFM files.');
      await createVersificationUSFM(
        currentUser,
        projectMetaObj.newProjectFields,
        projectMetaObj.versificationScheme,
        scope,
        projectMetaObj.language.ld,
        id,
        projectMetaObj.importedFiles,
        projectMetaObj.copyright,
        projectMetaObj.project,
        projectMetaObj.call,
        projectMetaObj.projectType,
      ).then(async (ingredient) => {
        logger.debug('saveProjectsMeta.js', 'Calling createTranslationSB for creating burrito.');
        const burritoFile = await createTranslationSB(
          currentUser,
          projectMetaObj.newProjectFields,
          scope,
          projectMetaObj.language.ang,
          projectMetaObj.language.lc,
          projectMetaObj.language.ld,
          projectMetaObj.copyright,
          id,
          projectMetaObj.project,
          projectMetaObj.call,
          projectMetaObj.update,
        );
        if (projectMetaObj.call === 'edit') {
          burritoFile.ingredients = { ...projectMetaObj.project.ingredients, ...ingredient };
          burritoFile?.sync && delete burritoFile.sync;
        } else {
          burritoFile.ingredients = ingredient;
        }
        logger.debug('saveProjectsMeta.js', 'Creating a burrito file.');
        await fs.writeFileSync(path.join(
          projectDir,
          `${projectMetaObj.newProjectFields.projectName}_${id}`,
          'metadata.json',
        ), JSON.stringify(burritoFile));
      }).finally(() => {
        logger.debug('saveProjectsMeta.js', projectMetaObj.call === 'new' ? 'New project created successfully.' : 'Updated the Changes.');
        status.push({ type: 'success', value: (projectMetaObj.call === 'new' ? 'New project created' : 'Updated the changes') });
      });
    }
  };

  // OBS burrito creation and checks
  const obsBurritoChecksAndCreation = async () => {
    logger.debug('saveProjectsMeta.js', 'In OBS Burrito Checks And Creation');
    let id;
    if (projectMetaObj.call === 'new') {
      logger.debug('saveProjectsMeta.js', 'Creating a key for the Project');
    const key = currentUser + projectMetaObj.newProjectFields.projectName + moment().format();
    id = uuidv5(key, environment.uuidToken);
    } else {
      logger.debug('saveProjectsMeta.js', 'Fetching the key from the existing Project');
      // from existing metadata
      id = Object.keys(projectMetaObj.project?.identification?.primary?.ag);
    }
    // Create New burrito
    // ingredient has the list of created files in the form of SB Ingredients
    logger.debug('saveProjectsMeta.js', 'Calling createObsContent for generating md files.');
    await createObsContent(
      currentUser,
      projectMetaObj.newProjectFields,
      projectMetaObj.language.ld,
      id,
      projectMetaObj.project,
      projectMetaObj.importedFiles,
      projectMetaObj.copyright,
      projectMetaObj.call,
    ).then(async (ingredient) => {
      logger.debug('saveProjectsMeta.js', 'Calling createTranslationSB for creating burrito.');
      const burritoFile = await createObsSB(
        currentUser,
        projectMetaObj.newProjectFields,
        projectMetaObj.language.ang,
        projectMetaObj.language.lc,
        projectMetaObj.language.ld,
        projectMetaObj.copyright,
        id,
        projectMetaObj.project,
        projectMetaObj.call,
        projectMetaObj.update,
      );
      if (projectMetaObj.call === 'edit') {
        burritoFile.ingredients = { ...projectMetaObj.project.ingredients, ...ingredient };
        burritoFile?.sync && delete burritoFile.sync;
      } else {
      burritoFile.ingredients = ingredient;
      }
      logger.debug('saveProjectsMeta.js', 'Creating a burrito file.');
      await fs.writeFileSync(path.join(
        projectDir,
        `${projectMetaObj.newProjectFields.projectName}_${id}`,
        'metadata.json',
      ), JSON.stringify(burritoFile));
    }).finally(() => {
      logger.debug('saveProjectsMeta.js', projectMetaObj.call === 'new' ? 'New project created successfully.' : 'Updated the Changes.');
      status.push({ type: 'success', value: (projectMetaObj.call === 'new' ? 'New project created' : 'Updated the changes') });
    });
  };

  // Translation burrito creation and checks
  const audioBurritoChecksAndCreation = async () => {
    logger.debug('saveProjectsMeta.js', 'In audio Burrito Checks And Creation');

    projectMetaObj.importedFiles.forEach((file) => {
      if (!bookAvailable(projectMetaObj.canonSpecification.currentScope, file.id)) {
        checkCanon = true;
        logger.warn('saveProjectsMeta.js', `${file.id} is not added in Canon Specification or scope`);
        status.push({ type: 'warning', value: `${file.id} is not added in Canon Specification` });
      }
    });

    if (projectMetaObj.call === 'edit' && !checker((projectMetaObj.canonSpecification.currentScope), Object.keys(projectMetaObj.project.type.flavorType.currentScope))) {
      checkCanon = true;
      logger.warn('saveProjectsMeta.js', 'Not allowed to remove previous scope');
      status.push({ type: 'warning', value: 'You are not allowed to remove previous scope.' });
    }

    if (checkCanon === false) {
      let id;
      let scope;
      if (projectMetaObj.call === 'new') {
        logger.debug('saveProjectsMeta.js', 'Creating a key for the Project');
      const key = currentUser + projectMetaObj.newProjectFields.projectName + moment().format();
      id = uuidv5(key, environment.uuidToken);
      scope = projectMetaObj.canonSpecification.currentScope;
      } else {
        logger.debug('saveProjectsMeta.js', 'Fetching the key from the existing Project');
        // from existing metadata
        scope = (projectMetaObj.canonSpecification.currentScope)
        .filter((x) => !(Object.keys(projectMetaObj.project.type.flavorType.currentScope)).includes(x));
        id = Object.keys(projectMetaObj.project?.identification?.primary?.ag);
        projectMetaObj.importedFiles.forEach((file) => {
          scope.push(file.id);
        });
      }
      // Create New burrito
      // ingredient has the list of created files in the form of SB Ingredients
      logger.debug('saveProjectsMeta.js', 'Calling createAudioVersification for generating USFM files.');
      await createAudioVersification(
        currentUser,
        projectMetaObj.newProjectFields,
        projectMetaObj.versificationScheme,
        // scope,
        id,
        // projectMetaObj.importedFiles,
        projectMetaObj.copyright,
        projectMetaObj.project,
        projectMetaObj.call,
      ).then(async (ingredient) => {
        logger.debug('saveProjectsMeta.js', 'Calling createAudioSB for creating burrito.');
        const burritoFile = await createAudioSB(
          currentUser,
          projectMetaObj.newProjectFields,
          scope,
          projectMetaObj.language.ang,
          projectMetaObj.language.lc,
          projectMetaObj.language.ld,
          projectMetaObj.copyright,
          id,
          projectMetaObj.project,
          projectMetaObj.call,
          projectMetaObj.update,
        );
        if (projectMetaObj.call === 'edit') {
          burritoFile.ingredients = { ...projectMetaObj.project.ingredients, ...ingredient };
          burritoFile?.sync && delete burritoFile.sync;
        } else {
          burritoFile.ingredients = ingredient;
        }
        logger.debug('saveProjectsMeta.js', 'Creating a burrito file.');
        await fs.writeFileSync(path.join(
          projectDir,
          `${projectMetaObj.newProjectFields.projectName}_${id}`,
          'metadata.json',
        ), JSON.stringify(burritoFile));
      })
      .then(async () => {
        // Adding text USFM to audio project
        if ((projectMetaObj.importedFiles).length !== 0) {
          const newScope = [];
          projectMetaObj.importedFiles.forEach((file) => {
            newScope.push(file.id);
          });
          // ingredient has the list of created files in the form of SB Ingredients
          logger.debug('saveProjectsMeta.js', 'Calling creatVersification for generating USFM files.');
          await createVersificationUSFM(
            currentUser,
            projectMetaObj.newProjectFields,
            projectMetaObj.versificationScheme,
            newScope,
            projectMetaObj.language.ld,
            id,
            projectMetaObj.importedFiles,
            projectMetaObj.copyright,
            projectMetaObj.project,
            projectMetaObj.call,
            'Audio',
          ).then(async (ingredient) => {
            logger.debug('saveProjectsMeta.js', 'Calling createTranslationSB for creating burrito.');
            const burritoFile = await createTranslationSB(
              currentUser,
              projectMetaObj.newProjectFields,
              scope,
              projectMetaObj.language.ang,
              projectMetaObj.language.lc,
              projectMetaObj.language.ld,
              projectMetaObj.copyright,
              id,
              projectMetaObj.project,
              projectMetaObj.call,
              projectMetaObj.update,
            );
            if (projectMetaObj.call === 'edit') {
              burritoFile.ingredients = { ...projectMetaObj.project.ingredients, ...ingredient };
            } else {
              burritoFile.ingredients = ingredient;
            }
            logger.debug('saveProjectsMeta.js', 'Creating a burrito file.');
            await fs.writeFileSync(path.join(
              projectDir,
              `${projectMetaObj.newProjectFields.projectName}_${id}`,
              'text-1',
              'metadata.json',
            ), JSON.stringify(burritoFile));
          });
        }
      })
      .finally(() => {
        logger.debug('saveProjectsMeta.js', projectMetaObj.call === 'new' ? 'New project created successfully.' : 'Updated the Changes.');
        status.push({ type: 'success', value: (projectMetaObj.call === 'new' ? 'New project created' : 'Updated the changes') });
      });
    }
  };
  // Switch Project Creation
  if (projectNameExists === false || projectMetaObj.call === 'edit') {
    switch (projectMetaObj.projectType) {
      case 'Translation':
        await translationBurritoChecksAndCreation();
        break;

      case 'OBS':
        await obsBurritoChecksAndCreation();
        break;

      case 'Audio':
        await audioBurritoChecksAndCreation();
        break;

      default:
        break;
    }
  } else {
    logger.warn('saveProjectsMeta.js', 'Project already exists');
    status.push({ type: 'error', value: 'Project already exists' });
  }
  return status;
};

export default saveProjectsMeta;
