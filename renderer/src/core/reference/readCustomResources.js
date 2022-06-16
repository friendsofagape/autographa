import localforage from 'localforage';

const path = require('path');

export async function readCustomResources({ resourceId, translationData }) {
    const fs = window.require('fs');
    const newpath = localStorage.getItem('userPath');
      let currentUser;
      await localforage.getItem('userProfile').then((value) => {
        currentUser = value.username;
      });
      const file = path.join(newpath, 'autographa', 'users', currentUser, 'ag-user-settings.json');
      return new Promise((resolve) => {
        if (fs.existsSync(file)) {
            fs.readFile(file, (err, data) => {
                const agSettingsJson = JSON.parse(data);
                // const owner = [];
                    switch (resourceId) {
                        case 'tn':
                            (agSettingsJson?.resources.door43.translationNotes)?.forEach(async (url) => {
                              const language = url.url?.split('/');
                              let resourceExists = false;
                              translationData.forEach((val) => {
                                // console.log(val.name, url.url?.split('/')[3]);
                                if (val.name === url.name) {
                                  if (val.language === (language[language.length - 1]?.split('_')[0])) {
                                    resourceExists = true;
                                  }
                                }
                              });
                              if (resourceExists === false && url) {
                                translationData.push({
                                  name: url.name,
                                  language: (language[language.length - 1]?.split('_')[0]),
                                  owner: url.url?.split('/')[3],
                                });
                              }
                            });
                          break;
                        case 'tq':

                            (agSettingsJson?.resources.door43.translationQuestions)?.forEach(async (url) => {
                              const language = url.url?.split('/');
                              let resourceExists = false;
                              translationData.forEach((val) => {
                                if (val.name === url.name) {
                                  if (val.language === (language[language.length - 1]?.split('_')[0])) {
                                    resourceExists = true;
                                  }
                                }
                              });
                              if (resourceExists === false && url) {
                                translationData.push({
                                  name: url.name,
                                  language: (language[language.length - 1]?.split('_')[0]),
                                  owner: url.url?.split('/')[3],
                                });
                              }
                            });
                          break;
                        case 'twlm':
                            (agSettingsJson?.resources.door43.translationWords)?.forEach(async (url) => {
                              const language = url.url?.split('/');
                              let resourceExists = false;
                              translationData.forEach((val) => {
                                if (val.name === url.name) {
                                  if (val.language === (language[language.length - 1]?.split('_')[0])) {
                                    resourceExists = true;
                                  }
                                }
                              });
                              if (resourceExists === false && url) {
                                translationData.push({
                                  name: url.name,
                                  language: (language[language.length - 1]?.split('_')[0]),
                                  owner: url.url?.split('/')[3],
                                });
                              }
                            });
                          break;
                          case 'obs-tn':
                            if (!(agSettingsJson?.resources.door43.obsTranslationNotes)) {
                              agSettingsJson.resources.door43.obsTranslationNotes = [];
                            }
                            (agSettingsJson?.resources.door43.obsTranslationNotes)?.forEach(async (url) => {
                              const language = url.url?.split('/');
                              let resourceExists = false;
                              translationData.forEach((val) => {
                                // console.log(val.name, url.url?.split('/')[3]);
                                if (val.name === url.name) {
                                  if (val.language === (language[language.length - 1]?.split('_')[0])) {
                                    resourceExists = true;
                                  }
                                }
                              });
                              if (resourceExists === false && url) {
                                translationData.push({
                                  name: url.name,
                                  language: (language[language.length - 1]?.split('_')[0]),
                                  owner: url.url?.split('/')[3],
                                });
                              }
                            });
                          break;
                        default:
                          return null;
                      }
                      resolve(translationData);
            });
        }
    });
}
