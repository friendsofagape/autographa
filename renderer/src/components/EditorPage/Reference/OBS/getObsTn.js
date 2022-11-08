// Get OBS TN and TQ usign the APIs
import * as logger from '../../../../logger';

export const getObsTn = async (owner, repo, path) => {
  logger.debug('getObsTn.js', 'Fetch Tn content of OBS');
  const BaseUrl = 'https://git.door43.org/api/v1/repos/';
  const error = {};
  return new Promise((resolve) => {
    fetch(`${BaseUrl}${owner}/${repo}/contents`)
    .then((data) => data.json())
    .then((data) => {
      const check = !data?.message && data?.some((obj) => obj.name === 'content');
      // console.log("check : " + check);
      const file = [];
      if (check) {
        fetch(`${BaseUrl}${owner}/${repo}/contents/${path}`)
          .then((data) => data.json())
        .then((data) => {
          data.forEach((content) => {
            fetch(content.download_url)
            .then((tnNotes) => tnNotes.text())
            .then((tnNote) => {
              file.push({
                  OccurrenceNote: tnNote,
              });
              // resolve(file);
            }).finally(() => {
              resolve(file);
            });
          });
          error.status = false;
        });
      } else {
          error.status = true;
          error.msg = 'Invalid URL , No content Directory';
          resolve([]);
      }
    });
  });
};
