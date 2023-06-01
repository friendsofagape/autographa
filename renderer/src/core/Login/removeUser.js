// import * as localforage from 'localforage';
import * as logger from '../../logger';
import packageInfo from '../../../../package.json';

export const removeUser = async (userName) => {
    const newpath = await localStorage.getItem('userPath');
    const fs = window.require('fs');
    const path = require('path');
    const folder = path.join(newpath, packageInfo.name, 'users', `${userName}`);
    const file = path.join(newpath, packageInfo.name, 'users', 'users.json');
    if (fs.existsSync(folder)) {
      await fs.rmdir(folder, (err) => {
        if (err) { throw err; }
        logger.error('users.json', 'Directory removed');
      });
    logger.error('users.json', 'removing data from json');
    const data = await fs.readFileSync(file);
    const json = JSON.parse(data);
    const filtered = json.filter((item) => item.username.toLowerCase() !== userName.toLowerCase());
    await fs.writeFileSync(file, JSON.stringify(json));
    return filtered;
    }
  };
