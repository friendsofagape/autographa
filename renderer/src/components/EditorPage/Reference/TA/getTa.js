// Get OBS TN usign the APIs
import * as logger from '../../../../logger';

export const getObsTn = async (owner, repo, path) => {
  logger.debug('getTa.js', 'Fetch Tn content of Transaltion Academy');
  const BaseUrl = 'https://bg.door43.org/api/v1/repos/';
  const error = {};
  return new Promise((resolve) => {
    fetch(`${BaseUrl}${owner}/${repo}/contents`)
    .then((data) => data.json())
    .then((data) => {
      const check = data.some((obj) => obj.name === 'content');
      // console.log("check : " + check);
      if (check) {
        fetch(`${BaseUrl}${owner}/${repo}/contents/${path}`)
          .then((data) => data.json())
        .then((data) => {
          const file = [];
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
      }
    });
  });
};
