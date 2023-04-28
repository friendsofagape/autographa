import localForage from 'localforage';
import * as logger from '../../logger';
import { environment } from '../../../environment';

export const readUserSettings = async () => {
    try {
    logger.debug('userSettings.js', 'In readUserSettings');
    const currentUser = await localForage.getItem('userProfile');
    const newpath = localStorage.getItem('userPath');
    const fs = window.require('fs');
    const path = require('path');
    const file = path.join(newpath, 'autographa', 'users', currentUser.username, environment.USER_SETTING_FILE);

    if (fs.existsSync(file)) {
        const userSettings = await fs.readFileSync(file);
        if (userSettings) {
            logger.debug('userSettings.js', 'read user setings file successfully');
            const json = await JSON.parse(userSettings);
            return json;
        }
        throw new Error('failed to read user settings file');
    }
    } catch (err) {
        throw new Error(err?.message || err);
    }
};

export const saveUserSettings = async (userSettingsJson) => {
    try {
    logger.debug('userSettings.js', 'In saveUserSettings');
    const currentUser = await localForage.getItem('userProfile');
    const newpath = localStorage.getItem('userPath');
    const fs = window.require('fs');
    const path = require('path');
    const file = path.join(newpath, 'autographa', 'users', currentUser.username, environment.USER_SETTING_FILE);
    await fs.writeFileSync(file, JSON.stringify(userSettingsJson));
    } catch (err) {
        throw new Error(err?.message || err);
    }
};
