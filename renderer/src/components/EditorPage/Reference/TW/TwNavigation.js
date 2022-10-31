import PropTypes from 'prop-types';
import {
    useState, useEffect,
} from 'react';
import localForage from 'localforage';
import { SnackBar } from '@/components/SnackBar';
import * as logger from '../../../../logger';
import MultiComboBox from '../MultiComboBox';

export default function TwNavigation({ languageId, referenceResources, setReferenceResources }) {
  const [selected, setSelected] = useState('');
  const [twList, setTwList] = useState([]);
  const [options, setoptions] = useState([]);
  const [selectedOption, setselectedOption] = useState(null);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [snackText, setSnackText] = useState('');
  const [error, setError] = useState('');

  const baseUrl = 'https://git.door43.org/api/v1/repos';
  const owner = referenceResources?.owner;

  useEffect(() => {
    if (referenceResources && referenceResources?.offlineResource?.offline) {
      // offline
      // console.log('offline : ', { referenceResources });
      const taArrayOffline = [];
      const { offlineResource } = referenceResources;
      localForage.getItem('userProfile').then(async (user) => {
        logger.debug('TwNavigation.js', 'reading offline helps ', offlineResource.data?.projectDir);
        const fs = window.require('fs');
        const path = require('path');
        const newpath = localStorage.getItem('userPath');
        const currentUser = user?.username;
        const folder = path.join(newpath, 'autographa', 'users', `${currentUser}`, 'resources');
        const projectName = `${offlineResource?.data?.value?.meta?.name}_${offlineResource?.data?.value?.meta?.owner}_${offlineResource?.data?.value?.meta?.release?.tag_name}`;
        // set Options
        const optionsDir = path.join(folder, projectName, 'bible');
        const tempOptions = [];
        if (fs.existsSync(optionsDir)) {
          fs.readdir(optionsDir, async (err, optionsNames) => {
            if (err) {
              // console.log(`Unable to scan directory: ${ err}`);
              logger.debug('TwNavigation.js', `Unable to scan directory: ${ err}`);
            }
            // console.log({ optionsNames });
            let optionsCount = 0;
            await optionsNames.forEach(async (folderName) => {
              if (fs.lstatSync(path.join(optionsDir, folderName)).isDirectory()) {
                optionsCount += 1;
                tempOptions.push(folderName);
              }
            });
            if (tempOptions.length === optionsCount) {
                    setoptions(tempOptions);
              }
            // fetch contents of selected folder
            if (selectedOption && selectedOption?.length > 0 && fs.existsSync(path.join(optionsDir, selectedOption))) {
              fs.readdir(path.join(optionsDir, selectedOption), async (err, folderContents) => {
                let contentsCount = 0;
                folderContents.forEach((content) => {
                  if (fs.lstatSync(path.join(optionsDir, selectedOption, content)).isFile()) {
                    contentsCount += 1;
                    taArrayOffline.push(
                      {
                        folder: path.join(selectedOption, content),
                        title: content.replace('.md', ''),
                        subTitle: '',
                      },
                      );
                  }
                });
                if (taArrayOffline.length === contentsCount) {
                  setTwList(taArrayOffline);
                }
              });
            }
        });
        }
      });
    } else {
      // online
      // get options
      fetch(`https://git.door43.org/api/catalog/v5/search?subject=Translation%20Words&lang=${languageId}&owner=${owner}`)
      .then((res) => res.json())
      .then((meta) => {
        // console.log('meta : ', { meta });
        fetch(meta?.data[0]?.contents_url)
        .then((response) => response.json())
        .then((contents) => {
          const bibleDirUlr = contents.filter((content) => content?.name === 'bible' && content?.type === 'dir');
          // console.log({ bibleDirUlr });
          if (bibleDirUlr?.length > 0) {
            const tempOptions = [];
            fetch(bibleDirUlr[0]?.url)
            .then((resp) => resp.json())
            .then((twFolders) => {
              if (twFolders?.length > 0) {
                let folderCount = 0;
                twFolders.forEach((folder) => {
                  if (folder?.type === 'dir') {
                    folderCount += 1;
                    tempOptions.push(folder?.name);
                  }
                });
                if (folderCount === tempOptions?.length) {
                  setoptions(tempOptions);
                }
              }
            });
          }
        });

        const fetchData = async () => {
          await fetch(`${baseUrl}/${owner}/${languageId}_tw/contents/bible/${selectedOption}?ref=${meta?.data[0]?.release?.tag_name}`)
          .then((response) => response.json())
          .then((twData) => {
            twData && twData?.forEach((data) => {
              data.folder = data?.path.replace('bible/', '');
              data.title = data?.name.replace('.md', '');
              data.subTitle = '';
            });
            setTwList(twData);
          }).catch((err) => {
            logger.debug('TwNavigation.js', 'reading offline helps ', err);
            setOpenSnackBar(true);
            setError('failure');
            setSnackText('Can not load content');
          });
        };

        const getData = async () => {
          await fetchData();
        };
        // console.log({ selectedOption });
        selectedOption && getData();
      });
    }
  }, [languageId, referenceResources, owner, selectedOption]);

  useEffect(() => {
    selected && setReferenceResources((current) => ({
      ...current,
      offlineResource: { ...current.offlineResource, twSelected: selected },
    }));
    }, [selected, selectedOption, setReferenceResources]);

  return (
    <>
      <div className="flex fixed">
        <div className="bg-grey text-danger py-0 uppercase tracking-wider text-xs font-semibold">
          <div aria-label="resource-bookname" className="px-1" />
          {languageId && owner && (
            <MultiComboBox
              selected={selected}
              setSelected={setSelected}
              data={twList}
              options={options}
              selectedOption={selectedOption}
              setselectedOption={setselectedOption}
            />
            )}
        </div>
      </div>

      <SnackBar
        openSnackBar={openSnackBar}
        setOpenSnackBar={setOpenSnackBar}
        snackText={snackText}
        setSnackText={setSnackText}
        error={error}
      />
    </>
  );
}

TwNavigation.propTypes = {
  languageId: PropTypes.string,
  referenceResources: PropTypes.object,
  setReferenceResources: PropTypes.func,
};
