import * as localForage from 'localforage';
import languages from '../../lib/lang/langNames.json';
import * as logger from '../../logger';

export const getLanguageDirection = (languageCode) => {
  logger.debug('languageUtil.js', 'In getLanguageDirection for fetching the direction using language code');
  const scriptureDirection = languages.find((l) => l.lc === languageCode);
  return scriptureDirection?.ld;
};
export const getScriptureDirection = async (projectName) => {
  logger.debug('languageUtil.js', 'In getScriptureDirection for fetching the direction using language code from burrito');
  let languageCode;
  let scriptureDirection;
  // Fetching the resource details from the LocalForage
  await localForage.getItem('resources')
  .then((refs) => {
    logger.debug('languageUtil.js', 'In getScriptureDirection:- fetching burrito data');
    const projectDetails = refs.find((o) => o.projectDir === projectName);
    languageCode = projectDetails?.value?.languages[0]?.tag;
  });
  if (languageCode) {
    logger.debug('languageUtil.js', 'In getScriptureDirection:- fetching langauge code from burrito');
    scriptureDirection = getLanguageDirection(languageCode);
  }
  return scriptureDirection;
};
