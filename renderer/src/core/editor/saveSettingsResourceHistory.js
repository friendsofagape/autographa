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
) {
    logger.debug('SaveSettingsResourceHistory.js', 'In save reference hsotory func');
    let historyColumn = '0';
    if (sectionPlaceholderNum === '2') {
      historyColumn = '1';
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
                    // works when all rows CxR0, CxR1 remove
                      resources.project[resources.type.flavorType.flavor.name].refResources.splice(0, 1);
                    }
                }
                const layout_check_num = sectionPlaceholderNum === '1' ? 0 : 1;
                if (sectionNum === 1 && (layout > layout_check_num) && !(openResourceR1 && openResourceR2)) {
                  // works when any 1 row open, set object of 1 item
                  logger.debug('SaveSettingsResourceHistory.js', 'section single rows of C0 or C1');
                  resources.project[resources.type.flavorType.flavor.name].refResources[historyColumn] = {
                      1: {
                        resouceId: referenceColumnData1?.selectedResource,
                        language: referenceColumnData1?.languageId,
                        name: referenceColumnData1?.refName,
                        owner: referenceColumnData1?.owner,
                        navigation: { book: '1TI', chapter: '1' },
                        offline: referenceColumnData1.offlineResource,
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
