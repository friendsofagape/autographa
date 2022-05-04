import localforage from 'localforage';

const path = require('path');

export async function writeCustomResources({ resourceUrl }) {
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
                switch (resourceUrl.key) {
                    case 'tn':
                      if (agSettingsJson?.resources.door43.translationNotes.includes(resourceUrl.url) === false) {
                          agSettingsJson?.resources.door43.translationNotes.push({ name: resourceUrl.resourceName, url: resourceUrl.url });
                      }
                      break;
                    case 'tq':
                    if (agSettingsJson?.resources.door43.translationQuestions.includes(resourceUrl.url) === false) {
                        agSettingsJson?.resources.door43.translationQuestions.push({ name: resourceUrl.resourceName, url: resourceUrl.url });
                    }
                      break;
                    case 'twlm':
                    if (agSettingsJson?.resources.door43.translationWords.includes(resourceUrl.url) === false) {
                        agSettingsJson?.resources.door43.translationWords.push({ name: resourceUrl.resourceName, url: resourceUrl.url });
                    }
                      break;
                    default:
                      return null;
                  }
                  fs.writeFileSync(file, JSON.stringify(agSettingsJson));
                  resolve(agSettingsJson);
            });
      }
  });
}
