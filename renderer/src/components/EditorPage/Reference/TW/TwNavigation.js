import PropTypes from 'prop-types';
import {
    useState, useEffect,
} from 'react';
import localForage from 'localforage';
import * as logger from '../../../../logger';
import MultiComboBox from '../MultiComboBox';

const fs = window.require('fs');

export default function TwNavigation({ languageId, referenceResources, setReferenceResources }) {
  { console.log({ referenceResources }); }

  const [selected, setSelected] = useState('');
  const [twList, setTwList] = useState([]);
  const [options, setoptions] = useState([]);
  const [selectedOption, setselectedOption] = useState(null);

  const baseUrl = 'https://git.door43.org/api/v1/repos';
  const owner = referenceResources?.owner;

  useEffect(() => {
    if (referenceResources && referenceResources?.offlineResource?.offline) {
      // offline
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
            twData.forEach((data) => {
              data.folder = data?.path.replace('bible/', '');
              data.title = data?.name.replace('.md', '');
              data.subTitle = '';
            });
            setTwList(twData);
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
    <div className="flex fixed">
      <div className="bg-grey text-danger py-0 uppercase tracking-wider text-xs font-semibold">
        <div aria-label="resource-bookname" className="px-1" />
        <MultiComboBox
          selected={selected}
          setSelected={setSelected}
          data={twList}
          options={options}
          selectedOption={selectedOption}
          setselectedOption={setselectedOption}
        />
      </div>
    </div>
  );
}

TwNavigation.propTypes = {
  languageId: PropTypes.string,
  referenceResources: PropTypes.object,
  setReferenceResources: PropTypes.func,
};
