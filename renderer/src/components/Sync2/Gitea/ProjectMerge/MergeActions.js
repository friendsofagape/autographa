import * as logger from '../../../../logger';
import { environment } from '../../../../../environment';
import { uploadProjectToBranchRepoExist } from './ProjectMergeUtils';

export async function tryMergeProjects(selectedGiteaProject, ignoreFilesPaths, actions) {
  let uploadResp = false;
  try {
    logger.debug('MergeActions.js', 'Try Merge Project started');
    // uplaod local project to merge branch
    uploadResp = await uploadProjectToBranchRepoExist(selectedGiteaProject, ignoreFilesPaths);
    if (uploadResp) {
      console.log('upload true ----');
      logger.debug('MergeActions.js', 'Try Merge Project - Local project upload success, send PR');
      // local project uploaded successfully and send PR
      actions.setStepCount((prevStepCount) => prevStepCount + 1);
      const urlPr = `${environment.GITEA_API_ENDPOINT}/repos/${selectedGiteaProject?.repo?.owner?.username}/${selectedGiteaProject?.repo?.name}/pulls`;
      const myHeaders = new Headers();
      myHeaders.append('Authorization', `Bearer ${selectedGiteaProject.auth.token.sha1}`);
      myHeaders.append('Content-Type', 'application/json');
      const payloadPr = JSON.stringify({
        base: `${selectedGiteaProject.branch.name}-merge`,
        head: selectedGiteaProject.branch.name,
        title: `Merge ${selectedGiteaProject.branch.name} to ${selectedGiteaProject.branch.name}-merge`,
      });
      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: payloadPr,
        redirect: 'follow',
      };
      console.log('before fetch for PR ===');
      // check merge possible or not
      let returnData = null;
      await fetch(urlPr, requestOptions).then((resp) => resp.json().then((data) => ({ resposne: resp, body: data })))
      .then((async (result) => {
        if (result.resposne.ok) {
          if (result.body.mergeable) {
            // mergeable
            logger.debug('MergeActions.js', 'PR success - continue Merge operations');
            actions.setStepCount((prevStepCount) => prevStepCount + 1);
            const mergePayload = JSON.stringify({
              Do: 'merge',
              delete_branch_after_merge: false,
              });
            requestOptions.body = mergePayload;
            const urlMerge = `${environment.GITEA_API_ENDPOINT}/repos/${selectedGiteaProject?.repo?.owner?.username}/${selectedGiteaProject?.repo?.name}/pulls/${result.body.number}/merge`;
            // perform merge action
            await fetch(urlMerge, requestOptions).then((response) => response)
            .then(async (mergeResult) => {
              if (mergeResult.status === 200) {
                console.log('fetch 2 Merge : ', mergeResult?.status);
                logger.debug('MergeActions.js', 'Successfully Merged');
                returnData = { status: 'success', message: 'Merge Success' };
              } if (mergeResult.status === 405) {
                logger.debug('MergeActions.js', 'Can not merge - nothing to merge or error ', mergeResult.resposne.statusText);
                throw new Error(mergeResult.resposne.statusText);
              }
            });
          } else {
            // merge is not possible - conflict , Display Conflict Message
            let htmlPart = '<div></div>';
            await fetch(result.body.html_url).then((response) => response.text())
            .then(async (resultDiff) => {
              const parser = new DOMParser();
              const doc = parser.parseFromString(resultDiff, 'text/html');
              htmlPart = doc.getElementsByClassName('merge-section');
            });
            returnData = { status: 'failure', message: 'Conflict Exist - Can not perform Merge , Need to fix manually', conflictHtml: htmlPart[0].innerHTML };
          }
        } else {
          throw new Error(result?.resposne?.statusText);
        }
      }));
      return returnData;
    }
  } catch (err) {
      logger.debug('MergeActions.js', `failed Merge Action ${err}`);
  }
}
