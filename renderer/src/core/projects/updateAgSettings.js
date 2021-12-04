import * as logger from '../../logger';

export const updateAgSettings = async (username, projectName, data) => {
  logger.debug('updateAgSettings.js', 'In updateAgSettings');
  const newpath = localStorage.getItem('userPath');
  const fs = window.require('fs');
  const path = require('path');
  const folder = path.join(newpath, 'autographa', 'users', username, 'projects', projectName, 'ingredients');
  const settings = await fs.readFileSync(path.join(folder, 'ag-settings.json'), 'utf8');
  const setting = JSON.parse(settings);
  setting.project.textTranslation = data.project.textTranslation;
  logger.debug('updateAgSettings.js', 'Updating the ag-settings.json');
  await fs.writeFileSync(path.join(folder, 'ag-settings.json'), JSON.stringify(setting));
};
