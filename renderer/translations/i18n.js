import React from 'react';
import * as localForage from 'localforage';
import { isElectron } from '@/core/handleElectron';
import en from './en';
import hi from './hi';

const messages = (appLanguage) => {
  switch (appLanguage) {
    case 'en':
      return en;
    case 'hi':
      return hi;
    default:
      return en;
  }
};
const I18n = () => {
  const [appLanguage, setAppLanguage] = React.useState('en');
  if (isElectron()) {
    localForage.getItem('userProfile').then((user) => {
      if (user !== null) {
        const newpath = localStorage.getItem('userPath');
        const fs = window.require('fs');
        const path = window.require('path');
        const file = path.join(newpath, 'autographa', 'users', user?.username, 'ag-user-settings.json');
        if (fs.existsSync(file)) {
          fs.readFile(file, (err, data) => {
            const json = JSON.parse(data);
            setAppLanguage(json.appLanguage);
          });
        }
      }
    });
  }
  const message = messages(appLanguage);
  return { appLang: appLanguage, message };
};
export default I18n;
