/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import localForage from 'localforage';
import { Dialog, Transition } from '@headlessui/react';
import { useTranslation } from 'react-i18next';
import { SnackBar } from '@/components/SnackBar';
import {
  Accordion, AccordionDetails, AccordionSummary, Typography,
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import LoadingScreen from '@/components/Loading/LoadingScreen';
import { XIcon } from '@heroicons/react/solid';
import { AutographaContext } from '@/components/context/AutographaContext';
import { InformationCircleIcon } from '@heroicons/react/outline';
import DownloadSvg from '@/icons/basil/Outline/Files/Download.svg';
import CustomMultiComboBox from './CustomMultiComboBox';
import langJson from '../../../../lib/lang/langNames.json';
import { handleDownloadResources } from './createDownloadedResourceSB';
import * as logger from '../../../../logger';

// const grammar = require('usfm-grammar');
// const usfmJS = require('usfm-js');

const subjectTypeArray = {
  bible: [
    { id: 2, name: 'Bible' },
    // { id: 1, name: 'Aligned Bible' },
    // { id: 3, name: 'Hebrew Old Testament' },
    // { id: 4, name: 'Greek New Testament' },
  ],
  obs: [
    { id: 1, name: 'Open Bible Stories' },
  ],
};

// mui styles for accordion
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#fff',
    color: '#000',
    boxShadow: '0px 0px 15px 1px rgba(0,0,0,0.43);',

  },
  summary: {
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: theme.typography.pxToRem(12),
    fontWeight: '500',
    color: '#000',
  },
}));

function DownloadResourcePopUp({ selectResource, isOpenDonwloadPopUp, setIsOpenDonwloadPopUp }) {
  logger.debug('DownloadResourcePopUp.js', 'in download resource pop up');
  const { t } = useTranslation();
  const [snackBar, setOpenSnackBar] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [loadFilterDiv, setLoadFilterDiv] = React.useState(false);
  const [snackText, setSnackText] = React.useState('');
  // eslint-disable-next-line no-unused-vars
  const [notify, setNotify] = React.useState();

  const [resourceData, setresourceData] = React.useState([]);
  const [selectedLangFilter, setSelectedLangFilter] = React.useState([]);
  const [selectedTypeFilter, setSelectedTypeFilter] = React.useState([]);
  const [selectedPreProd, setSelectedPreProd] = React.useState(false);
  // resource Download
  const [downloadStarted, setDownloadStarted] = React.useState(false);
  const [totalDownload, setTotalDownload] = React.useState(0);
  // eslint-disable-next-line no-unused-vars
  const [downloadCount, setDownloadCount] = React.useState(0);
  const [expandAccordion, setExpandAccordion] = React.useState('');

  // const [resourceDownload, setResourceDownload] = React.useState({
  //   started: false,
  //   completed: false,
  //   totalCount: 0,
  //   downloadedCount: 0,
  // });

  const {
    // states: { resourceDownload },
    action: {
      setNotifications,
      // setResourceDownload,
    },
  } = React.useContext(AutographaContext);

  const modalClose = () => {
    if (!downloadStarted) {
      setIsOpenDonwloadPopUp(false);
    }
  };

  const toggleAcordion = (element) => {
    if (expandAccordion === element) { setExpandAccordion(''); }
    if (expandAccordion !== element) { setExpandAccordion(element); }
  };

  const addNewNotification = async (title, text, type) => {
    localForage.getItem('notification').then((value) => {
      const temp = [...value];
      temp.push({
        title,
        text,
        type,
        time: moment().format(),
        hidden: true,
      });
      setNotifications(temp);
    });
  };

  const fetchResource = async (filter) => {
    logger.debug('DownloadResourcePopUp.js', 'fetching resource as per filter applied');
    setLoading(true);
    // subject = bible and lang = en - if not custom filter or initial loading
    const baseUrl = 'https://git.door43.org/api/catalog/v5/search';
    let url = '';
    if (filter) {
      url = `${baseUrl}?`;
      if (selectedLangFilter.length > 0) {
        selectedLangFilter.forEach((row) => {
          if (url.slice(-1) === '?') {
            url += `lang=${row?.lc ? row?.lc : row?.code}`;
          } else {
            url += `&lang=${row?.lc ? row?.lc : row?.code}`;
          }
        });
      }
      if (selectedTypeFilter.length > 0) {
        selectedTypeFilter.forEach((row) => {
          if (url.slice(-1) === '?') {
            url += `subject=${row.name}`;
          } else {
            url += `&subject=${row.name}`;
          }
        });
      } else {
        // nothing selected default will be bible || obs
        switch (selectResource) {
          case 'bible':
            url += '&subject=Bible';
            break;
          case 'obs':
            url += `&subject=${subjectTypeArray.obs[0].name}`;
            break;
          default:
            break;
        }
      }
    } else {
      // initial load
      switch (selectResource) {
        case 'bible':
          url = `${baseUrl}?subject=Bible&lang=en`;
          break;
        case 'obs':
          url = `${baseUrl}?subject=${subjectTypeArray.obs[0].name}&lang=en`;
          break;
        default:
          break;
      }
      // url = `${baseUrl}?subject=Bible&subject=Aligned Bible&lang=en&lang=ml`;
    }
    // pre-release items
    if (selectedPreProd) {
      url += '&stage=preprod';
    }
    // url = 'https://git.door43.org/api/catalog/v5/search?subject=Aligned%20Bible&subject=Bible&lang=en&lang=ml&lang=hi';
    const temp_resource = {};
    selectedLangFilter.forEach((langObj) => {
      temp_resource[langObj.lc] = [];
    });
    await fetch(url)
      .then((response) => response.json())
      .then((res) => {
        logger.debug('DownloadResourcePopUp.js', 'generating language based resources after fetch');
        res.data.forEach((element) => {
          element.isChecked = false;
          if (element.language in temp_resource) {
            temp_resource[element.language].push(element);
          } else {
            temp_resource[element.language] = [element];
          }
        });
        setresourceData(temp_resource);
        setLoading(false);
      }).catch((err) => {
        logger.debug('DownloadResourcePopUp.js', 'Error on fetch content : ', err);
        setOpenSnackBar(true);
        setNotify('failure');
        setSnackText(`Error fetch content \n : ${err}`);
      });
  };

  const handleCheckbox = (e, obj) => {
    logger.debug('DownloadResourcePopUp.js', 'In check box resource selection');
    const temp_resource = resourceData;
    if (obj.selection === 'full') {
      // eslint-disable-next-line array-callback-return
      temp_resource[obj.id].map((row) => {
        row.isChecked = e.target.checked;
      });
    } else if (obj.selection === 'single') {
      // eslint-disable-next-line array-callback-return
      temp_resource[obj.parent].filter((row) => {
        if (row.id === obj.id) {
          row.isChecked = e.target.checked;
        }
      });
    }
    setresourceData((current) => ({
      ...current,
      ...temp_resource,
    }));
  };

  const handleClickFilter = () => {
    logger.debug('DownloadResourcePopUp.js', 'In toggle filter');
    if (!loading) {
      setLoadFilterDiv(!loadFilterDiv);
    }
  };

  const handleClearFilter = () => {
    logger.debug('DownloadResourcePopUp.js', 'In clear filter');
    setSelectedLangFilter([]);
    setSelectedTypeFilter([]);
    setSelectedPreProd(false);
  };

  const handleSaveFilter = async () => {
    logger.debug('DownloadResourcePopUp.js', 'save filter and call fetch');
    if (!downloadStarted) {
      setLoadFilterDiv(!loadFilterDiv);
      if (selectedLangFilter.length > 0 || selectedTypeFilter.length > 0) {
        await fetchResource(true);
      } else {
        setOpenSnackBar(true);
        setNotify('warning');
        setSnackText('No filter applied, please select filter');
      }
    } else {
      setOpenSnackBar(true);
      setNotify('warning');
      setSnackText('Please Wait, Download in progrss');
    }
  };

  const handleRemoveAccordion = (langCode) => {
    const resourceDataFiltered = [];
    // eslint-disable-next-line array-callback-return
    Object.keys(resourceData).filter((element) => {
      if (element.toLowerCase() !== langCode.toLowerCase()) {
        resourceDataFiltered[element] = resourceData[element];
      }
    });
    setresourceData(resourceDataFiltered);
  };
  const handleDownload = async () => {
    logger.debug('DownloadResourcePopUp.js', 'in handle download - call for download selected');
    // check total count to download
    const selectedResourceCount = Object.keys(resourceData).reduce((acc, key) => {
    const checkedData = resourceData[key].filter((data) => data.isChecked);
    return acc + checkedData.length;
    }, 0);
    try {
    if (selectedResourceCount > 0) {
      if (downloadStarted) {
        // console.log('downlaod in progress');
        throw new Error('Download in progress, please wait');
      }
      setTotalDownload(selectedResourceCount);
      logger.debug('DownloadResourcePopUp.js', 'In resource download all resource loop');
      console.log('resource download started ---', selectedResourceCount);
      setDownloadStarted(true);
      const action = { setDownloadCount };
      await handleDownloadResources(resourceData, selectResource, action)
      .then(async () => {
        setOpenSnackBar(true);
        setNotify('success');
        setSnackText('All Resource Downloaded Succesfully');
        await addNewNotification(
          'Resource',
          `${selectedResourceCount} Resources Downloaded successfully`,
          'success',
        );
        // setDownloadCount((prev) => prev + 1);
      }).catch((err) => {
        throw new Error(`Resource download Failed :  ${err}`);
      });
      // console.log('DOWNLOAD FINISHED');
      setDownloadStarted(false);
      setTotalDownload(0);
      setDownloadCount(0);
      logger.debug('DownloadResourcePopUp.js', 'Completed Download all resource selected');
    } else {
      logger.debug('DownloadResourcePopUp.js', 'No resource selected to download - warning');
      setOpenSnackBar(true);
      setNotify('warning');
      setSnackText('please select Resource to Download');
      // console.log('please select Resource to Download');
    }
  } catch (err) {
    setOpenSnackBar(true);
    setNotify('failure');
    setSnackText(`Error : ${err?.message || err}`);
  }
  };

  React.useEffect(() => {
    logger.debug('DownloadResourcePopUp.js', 'in useEffect initial load of resource');
    fetchResource(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const classes = useStyles();

  return (
    <>
      <Transition
        show={isOpenDonwloadPopUp}
        as={React.Fragment}
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          static
          open={isOpenDonwloadPopUp}
          onClose={modalClose}
        >
          {/* <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" /> */}
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

          <div className="flex items-center justify-center h-screen ">
            {/* <div className="flex-col max-w-xl max-h-[32rem] items-center justify-center  z-50 shadow rounded bg-white "> */}
            <div className="flex-col md:w-6/12 xl:max-w-xl items-center justify-center z-50 shadow rounded bg-white">

              <div className="w-full flex bg-secondary justify-between text-white p-1 rounded-t ">
                <div aria-label="resources-download-title" className="z-50  flex uppercase  p-2 text-xs tracking-widest leading-snug">
                  {selectResource}
                  {' '}
                  Resource Collection
                </div>
                <div className="flex items-center px-2">
                  <XIcon className="h-5 w-5 text-white cursor-pointer" onClick={modalClose} />
                </div>
              </div>

              <div className="w-full bg-white mt-2 p ">
                <div aria-label="resources-download-filter" className="z-50 flex justify-between  p-2  ">
                  <span className="text-sm font-medium">Select Resources to Download </span>
                  <div className="flex gap-4">
                    <span className="cursor-pointer" title="filter" role="button" tabIndex={-2} onClick={handleClickFilter}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
                      </svg>
                    </span>
                    <span
                      className="text-xs cursor-pointer"
                      role="button"
                      tabIndex={-3}
                      title="download"
                      onClick={handleDownload}
                    >
                      <DownloadSvg
                        fill="currentColor"
                        className="w-7 h-7"
                      />
                    </span>
                  </div>
                </div>
                <hr />
                {/* filter / status section show on conditions */}
                {loadFilterDiv && (
                  <div className="flex-col border-2 m-2 border-gray-300 ">
                    <div className="w-full flex justify-center text-md py-1 bg-black text-white">Filter Options</div>

                    <div className=" flex-col text-sm p-2 mt-2">
                      <div className="flex justify-between items-center">
                        <label htmlFor="filter-lang" className="font-bold text-base">Language</label>
                        <div className="flex items-center">
                          <div title="type and select multiple items , selected item can be removed by clicking again">
                            <InformationCircleIcon
                              className="h-5 w-5 mr-1"
                              aria-hidden="true"
                            />
                          </div>
                          <CustomMultiComboBox
                            selectedList={selectedLangFilter}
                            setSelectedList={setSelectedLangFilter}
                            customData={langJson}
                            filterParams="ang"
                          />
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <label htmlFor="filter-type" className="font-bold text-base">Type</label>
                        <CustomMultiComboBox
                          selectedList={selectedTypeFilter}
                          setSelectedList={setSelectedTypeFilter}
                          customData={selectResource === 'bible' ? subjectTypeArray.bible : subjectTypeArray.obs}
                        />
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <div className="fle w-1/2">
                          <label htmlFor="pre-prod" className="font-bold text-base">Pre Release</label>
                        </div>
                        <div className="flex w-1/2 justify-center">
                          <input
                            id="pre-prod"
                            name="pre-prod"
                            type="checkbox"
                            checked={selectedPreProd}
                            onChange={(e) => setSelectedPreProd(e.target.checked)}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end mt-5 gap-5 px-5">
                        <button
                          type="button"
                          className="w-20 h-8  bg-error leading-loose rounded shadow text-xs font-base  text-white tracking-wide  font-light uppercase"
                          onClick={handleClearFilter}
                        >
                          {t('btn-clear')}
                        </button>
                        <button
                          type="button"
                          className="w-20 h-8  bg-success leading-loose rounded shadow text-xs font-base  text-white tracking-wide  font-light uppercase"
                          onClick={handleSaveFilter}
                        >
                          {t('btn-save')}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* <div className=" bg-white my-3 "> */}
              <div className="w-full bg-white my-3 overflow-auto max-h-60 scrollbars-width ">
                <div aria-label="resources-download-content" className="flex-col  p-2 ">
                  {loading ? <LoadingScreen />
                    : downloadStarted
                      ? (
                        <div className="flex justify-evenly items-center text-sm font-medium text-center">
                          <LoadingScreen />
                          <div className="p-1">
                            Downlaod in Progress
                            {/* <span>
                              (
                              {downloadCount}
                              /
                              {totalDownload}
                              )
                            </span> */}
                            <span className="ml-2">
                              {totalDownload}
                            </span>
                          </div>
                        </div>
                      )
                      : (
                        <>
                          {Object.keys(resourceData).map((element) => (
                            <div className="mb-1">
                              <Accordion
                                className={classes.root}
                                expanded={expandAccordion === element}
                              >
                                <AccordionSummary
                                  expandIcon={<ExpandMore style={{ color: '#000' }} />}
                                  aria-controls={`panel1a-header${element}`}
                                  id={`panel1a-header${element}`}
                                  className={classes.summary}
                                  IconButtonProps={{
                                    onClick: () => toggleAcordion(element),
                                  }}
                                >
                                  <div className="flex justify-between w-full px-2">
                                    <Typography className={classes.heading}>
                                      <div className="flex gap-3 justify-center items-center">
                                        <input
                                          type="CheckBox"
                                          disabled={!(resourceData[element].length > 0)}
                                          className={`${resourceData[element].length > 0 ? '' : 'bg-gray-300'}`}
                                          onChange={(e) => handleCheckbox(e, { selection: 'full', id: element })}
                                        />
                                        <h4 className={`${resourceData[element].length > 0 ? '' : ' text-red-600'} `}>
                                          {`(${element}) ${resourceData[element].length > 0 ? resourceData[element][0].language_title : 'No Content'} `}
                                        </h4>
                                      </div>
                                    </Typography>
                                    <div className="">
                                      <XIcon
                                        className="h-4 w-4 text-red-600 cursor-pointer transform transition duration-200 hover:scale-[1.7]"
                                        onClick={() => handleRemoveAccordion(element)}
                                      />
                                    </div>
                                  </div>
                                </AccordionSummary>
                                <AccordionDetails>
                                  <div className="w-full">
                                    {resourceData[element].length > 0 ? (
                                      <>
                                        <div className="grid md:grid-cols-9 grid-cols-10 gap-2 text-center">
                                          <div className="col-span-1" />
                                          <div className="col-span-1 font-medium">Resource</div>
                                          <div className="md:col-span-2 col-span-3 font-medium">Type</div>
                                          <div className="col-span-3 font-medium">Organization</div>
                                          <div className="col-span-2 font-medium" />
                                        </div>

                                        <hr />

                                        {resourceData[element]?.map((row) => (
                                          <div className={`${row.stage === 'preprod' && 'bg-[#FFFF00]' } grid md:grid-cols-9 grid-cols-10 gap-2 text-center p-1.5 text-sm `}>
                                            <div>
                                              <input
                                                className="col-span-1"
                                                type="CheckBox"
                                                checked={row.isChecked}
                                                onChange={(e) => handleCheckbox(e, { selection: 'single', id: row.id, parent: element })}
                                              />
                                            </div>
                                            <div className="col-span-1">{row.name}</div>
                                            <div className="md:col-span-2 col-span-3">{row.subject}</div>
                                            <div className="col-span-3">{row.owner}</div>
                                            <div className="col-span-2 text-xs">
                                              {`${(row.released).split('T')[0]} (${row.release.tag_name})`}
                                            </div>
                                          </div>
                                    ))}
                                      </>
                                    ) : (
                                      <div className="flex text-base font-medium justify-center items-center ">
                                        <div className="">
                                          No Content Available
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </AccordionDetails>
                              </Accordion>
                              <hr />
                            </div>
                          ))}

                        </>
                      )}
                </div>
              </div>

            </div>
          </div>

        </Dialog>
      </Transition>

      <SnackBar
        openSnackBar={snackBar}
        snackText={snackText}
        setOpenSnackBar={setOpenSnackBar}
        setSnackText={setSnackText}
        error={notify}
      />

    </>
  );
}

DownloadResourcePopUp.propTypes = {
  selectResource: PropTypes.string,
  isOpenDonwloadPopUp: PropTypes.bool,
  setIsOpenDonwloadPopUp: PropTypes.func,
};

export default DownloadResourcePopUp;
