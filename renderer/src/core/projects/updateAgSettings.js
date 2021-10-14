export const updateAgSettings = async (username, name, data) => {
  const newpath = localStorage.getItem('userPath');
  const fs = window.require('fs');
  const path = require('path');
  const id = Object.keys(data.identification.primary.ag);
  const projectName= `${name}_${id}`
  const folder = path.join(newpath, 'autographa', 'users', username, 'projects', projectName, 'ingredients');
  const settings = await fs.readFileSync(path.join(folder, 'ag-settings.json'), 'utf8');
  const setting = JSON.parse(settings);
  setting.project.textTranslation = data.project.textTranslation;
  await fs.writeFileSync(path.join(folder, 'ag-settings.json'), JSON.stringify(setting));
};
