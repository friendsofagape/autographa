/* eslint-disable no-unused-vars */
import moment from 'moment';
import * as localforage from 'localforage';
import { createVersificationUSFM } from '../../util/createVersificationUSFM';
import createTranslationSB from '../burrito/createTranslationSB';

const sha1 = require('sha1');

const saveProjectsMeta = async (
  newProjectFields,
  selectedVersion,
  selectedLanguage,
  versificationScheme,
  canonSpecification,
  copyright,
) => {
  const newpath = localStorage.getItem('userPath');
  const status = [];
  const fs = window.require('fs');
  const path = require('path');
  let currentUser;
  await localforage.getItem('userProfile').then((value) => {
    currentUser = value?.username;
  });
  fs.mkdirSync(path.join(
    newpath, 'autographa', 'users', currentUser, 'projects',
  ), {
    recursive: true,
  });
  const projectDir = path.join(newpath, 'autographa', 'users', currentUser, 'projects');
  let projectNameExists = false;
  const folderList = fs.readdirSync(projectDir);
  folderList.forEach((folder) => {
    const name = folder.split('_');
    if (name[0] === newProjectFields.projectName) {
      projectNameExists = true;
      // checking for duplicates
      status.push({ type: 'Warning', value: 'projectname exists' });
    }
  });

  if (projectNameExists === false) {
    const id = sha1(currentUser + selectedVersion.name + moment().format());
    // Create New burrito
    // ingredient has the list of created files in the form of SB Ingredients
    await createVersificationUSFM(
      currentUser,
      newProjectFields,
      versificationScheme,
      canonSpecification.currentScope,
      selectedLanguage.scriptDirection,
      id,
    ).then(async (ingredient) => {
      const burritoFile = await createTranslationSB(currentUser,
        selectedVersion,
        canonSpecification.currentScope,
        selectedLanguage.title,
        copyright.licence,
        id);
      burritoFile.ingredients = ingredient;
      await fs.writeFileSync(path.join(projectDir, `${newProjectFields.projectName}_${id}`,
        'metadata.json'), JSON.stringify(burritoFile));
    }).finally(() => {
      status.push({ type: 'success', value: 'new project created' });
    });
  } else {
    status.push({ type: 'error', value: 'Project already exists' });
  }
  return status;
};

export default saveProjectsMeta;
