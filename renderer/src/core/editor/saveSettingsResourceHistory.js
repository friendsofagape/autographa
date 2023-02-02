import localforage from 'localforage';
import { saveReferenceResource } from '../projects/updateAgSettings';
import * as logger from '../../logger';

export async function saveSettingsResourceHistory(
    sectionNum,
    openResourceR1,
    openResourceR2,
    layout,
    referenceColumnData1,
    referenceColumnData2,
    addingSection,
    removingSection,
    setAddingSection,
    setRemovingSection,
    sectionPlaceholderNum,
    setReferenceColumnData1,
) {
    logger.debug('SaveSettingsResourceHistory.js', 'In save reference hsotory func');
    // removingSection : "1" and openResourceR2 :false and sectionPlaceholderNum: "1" -> reference 2 to reference 1
    // removingSection : "3" and openResourceR2 and sectionPlaceholderNum: "2" -> reference 2 to reference 1
    let historyColumn = '0';
    let rowOneDeleteOnTwoExist = removingSection === '1' && openResourceR2 === false;
    if (sectionPlaceholderNum === '2') {
      historyColumn = '1';
      rowOneDeleteOnTwoExist = removingSection === '3' && openResourceR2 === false;
    }
    return new Promise((resolve) => {
    logger.debug('SaveSettingsResourceHistory.js', `call from placeholder : ${sectionPlaceholderNum}`);
    const refsHistory = [];
    localforage.getItem('currentProject').then((projectName) => {
    const _projectname = projectName?.split('_');
    localforage.getItem('projectmeta').then((value) => {
      Object?.entries(value).forEach(
        ([, _value]) => {
          Object?.entries(_value).forEach(
            ([, resources]) => {
              if (resources.identification.name.en === _projectname[0]) {
                refsHistory.push(resources.project[resources.type.flavorType.flavor.name].refResources);
                if (sectionNum === 1 || sectionNum === 0) {
                  logger.debug('SaveSettingsResourceHistory.js', 'section for remove both rows of C0 or C1');
                  if (openResourceR1 && openResourceR2) {
                    // works when all rows CxR0, CxR1 removeconsole.log('working any one row open actions ------ : ', sectionPlaceholderNum);
                      resources.project[resources.type.flavorType.flavor.name].refResources.splice(0, 1);
                    }
                }
                const layout_check_num = sectionPlaceholderNum === '1' ? 0 : 1;
                if (sectionNum === 1 && (layout > layout_check_num) && !(openResourceR1 && openResourceR2)) {
                  // works when any 1 row open, set object of 1 item
                  logger.debug('SaveSettingsResourceHistory.js', 'section single rows of C0 or C1');
                  let referenceToUse = referenceColumnData1;
                  if (rowOneDeleteOnTwoExist) {
                    referenceToUse = referenceColumnData2;
                    // reset colum2 --> col1 and col2 - ""
                    setReferenceColumnData1((prev) => ({
                      ...prev,
                      languageId: referenceColumnData2?.languageId,
                      selectedResource: referenceColumnData2?.selectedResource,
                      refName: referenceColumnData2?.refName,
                      header: referenceColumnData2?.header,
                      owner: referenceColumnData2?.owner,
                      offlineResource: referenceColumnData2.offlineResource,
                    }
                    ));
                  }
                  resources.project[resources.type.flavorType.flavor.name].refResources[historyColumn] = {
                      1: {
                        resouceId: referenceToUse?.selectedResource,
                        language: referenceToUse?.languageId,
                        name: referenceToUse?.refName,
                        owner: referenceToUse?.owner,
                        navigation: { book: '1TI', chapter: '1' },
                        offline: referenceToUse.offlineResource,
                      },
                    };
                }
                if (sectionNum === 2 && layout > layout_check_num) {
                  // works when both row open, set object of 2 items
                  logger.debug('SaveSettingsResourceHistory.js', 'section both rows of C0 or C1');
                  if (referenceColumnData1.refName !== undefined) {
                    resources.project[resources.type.flavorType.flavor.name].refResources[historyColumn] = {
                    1: {
                      resouceId: referenceColumnData1?.selectedResource,
                      language: referenceColumnData1?.languageId,
                      name: referenceColumnData1?.refName,
                      owner: referenceColumnData1?.owner,
                      navigation: { book: '1TI', chapter: '1' },
                      offline: referenceColumnData1.offlineResource,
                    },
                    2: {
                      resouceId: referenceColumnData2?.selectedResource,
                      language: referenceColumnData2?.languageId,
                      name: referenceColumnData2?.refName,
                      owner: referenceColumnData2?.owner,
                      navigation: { book: '1TI', chapter: '1' },
                      offline: referenceColumnData2.offlineResource,
                    },
                  };
                }
              }
              }
            },
          );
        },
      );
      if (!openResourceR1 || !openResourceR2 || addingSection <= 2 || removingSection <= 2) {
        setRemovingSection();
        setAddingSection();
        localforage.setItem('projectmeta', value).then(() => {
          saveReferenceResource();
            resolve();
        });
      }
    });
  });
});
}
