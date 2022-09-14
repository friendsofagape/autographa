import React from 'react';
import PropTypes from 'prop-types';
// import localforage, * as localForage from 'localforage';
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
import DownloadSvg from '@/icons/basil/Outline/Files/Download.svg';
import CustomMultiComboBox from './CustomMultiComboBox';
import langJson from '../../../../lib/lang/langNames.json';

// dummy language values for resource filter
// const languageArray = [
//   { id: 1, name: 'English', code: 'en' },
//   { id: 2, name: 'Hindi', code: 'hi' },
//   { id: 3, name: 'Malayalam', code: 'ml' },
//   { id: 4, name: 'Tamil', code: 'ta' },
//   { id: 5, name: 'telugu', code: 'te' },
//   { id: 6, name: 'kannada', code: 'kn' },
//   { id: 7, name: 'urdu', code: 'ur' },
//   { id: 8, name: 'Hebrew, Modern', code: 'he' },
// ];
const subjectTypeArray = [
  { id: 2, name: 'Bible' },
  // { id: 1, name: 'Aligned Bible' },
  // { id: 3, name: 'Hebrew Old Testament' },
  // { id: 4, name: 'Greek New Testament' },
];

 // mui styles for accordion
const useStyles = makeStyles((theme) => ({
  root: {
    // backgroundColor: '#454545',
    // color: '#fff',
    backgroundColor: '#fff',
    color: '#000',
    boxShadow: '0px 0px 15px 1px rgba(0,0,0,0.43);',

  },
  summary: {
    // backgroundColor: '#212121',
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: theme.typography.pxToRem(12),
    fontWeight: '500',
    // color: '#ffffff',
    color: '#000',
  },
}));

function DownloadResourcePopUp({ selectResource, isOpenDonwloadPopUp, setIsOpenDonwloadPopUp }) {
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

    const [languageArray, setLanguageArray] = React.useState([]);

    const modalClose = () => {
        setIsOpenDonwloadPopUp(false);
      };

    const fetchResource = async (filter) => {
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
        // nothing selected default will be bible
        url += '&subject=Bible';
      }
      } else {
        url = `${baseUrl}?subject=Bible&lang=en`;
      }
      // url = 'https://git.door43.org/api/catalog/v5/search?subject=Aligned%20Bible&subject=Bible&lang=en&lang=ml&lang=hi';
      await fetch(url)
      .then((response) => response.json())
      .then((res) => {
          // console.log('fetched out res ->', res.data);
          const temp_resource = {};
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
      });
  };

    const handleCheckbox = (e, obj) => {
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
      // console.log('after updatechecked : ', resourceData);
    };

    const handleClickFilter = () => {
      if (!loading) {
        setLoadFilterDiv(!loadFilterDiv);
      }
    };

    const handleClearFilter = () => {
      setSelectedLangFilter([]);
      setSelectedTypeFilter([]);
    };

    const handleSaveFilter = async () => {
      setLoadFilterDiv(!loadFilterDiv);
      if (selectedLangFilter.length > 0 || selectedTypeFilter.length > 0) {
        await fetchResource(true);
        // .then(() => {
        //   // clear filter after fetch finish
        // setSelectedLangFilter([]);
        // setSelectedTypeFilter([]);
        // });
      } else {
        setOpenSnackBar(true);
        setNotify('warning');
        setSnackText('No filter applied, please select filter');
      }
    };

    React.useEffect(() => {
        const temp_lang_arr = [];
        langJson.forEach(((data) => {
          temp_lang_arr.push(
            { id: data.pk, name: data.ang, code: data.lc },
          );
        }));
        setLanguageArray(temp_lang_arr);
        fetchResource(false);
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
            className="fixed inset-0 z-10 overflow-y-auto"
            static
            open={isOpenDonwloadPopUp}
            onClose={modalClose}
          >
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

            <div className="flex items-center justify-center h-screen ">
              <div className="flex-col w-2/5 max-h-[32rem] items-center justify-center  z-50 shadow rounded bg-white ">

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
                      <span className="text-xs cursor-pointer" title="download">
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
                    <div className="flex-col  border-2 m-2 border-gray-300 bg-gray-200">
                      <div className="w-full flex justify-center text-sm py-1">Filter Options</div>

                      <div className=" flex-col text-sm p-2 ">
                        <div className="flex justify-between items-center">
                          <label htmlFor="filter-lang">Language</label>
                          <CustomMultiComboBox
                            selectedList={selectedLangFilter}
                            setSelectedList={setSelectedLangFilter}
                            // customData={languageArray}
                            customData={langJson}
                            filterParams="ang"
                          />
                        </div>
                        <div className="flex justify-between  items-center mt-2">
                          <label htmlFor="filter-type">Type</label>
                          <CustomMultiComboBox
                            selectedList={selectedTypeFilter}
                            setSelectedList={setSelectedTypeFilter}
                            customData={subjectTypeArray}
                          />
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

                <div className="w-full bg-white my-3 ">
                  <div aria-label="resources-download-content" className="flex-col  p-2 ">
                    {loading ? <LoadingScreen /> : (
                      <>
                        {Object.keys(resourceData).map((element) => (
                          <div className="mb-1">
                            <Accordion className={classes.root}>
                              <AccordionSummary
                                expandIcon={<ExpandMore style={{ color: '#000' }} />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                                className={classes.summary}
                              >
                                <Typography className={classes.heading}>
                                  <div className="flex gap-3 justify-center items-center">
                                    <input type="CheckBox" className="" onChange={(e) => handleCheckbox(e, { selection: 'full', id: element })} />
                                    <h4>{`${resourceData[element][0].language_title} (${element})`}</h4>
                                  </div>
                                </Typography>
                              </AccordionSummary>
                              <AccordionDetails>

                                <div className="w-full">
                                  <div className="grid grid-cols-8 gap-2 text-center">
                                    <div className="col-span-1" />
                                    <div className="col-span-1 font-medium">Resource</div>
                                    <div className="col-span-3 font-medium">Type</div>
                                    <div className="col-span-3 font-medium">Organization</div>
                                  </div>
                                  <hr />
                                  {resourceData[element].map((row) => (
                                    <div className="grid grid-cols-8 gap-2 text-center p-1.5 text-sm">
                                      <div>
                                        <input className="col-span-1" type="CheckBox" checked={row.isChecked} onChange={(e) => handleCheckbox(e, { selection: 'single', id: row.id, parent: element })} />
                                      </div>
                                      <div className="col-span-1">{row.name}</div>
                                      <div className="col-span-3">{row.subject}</div>
                                      <div className="col-span-3">{row.owner}</div>
                                    </div>
                                ))}
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
    setIsOpenDonwloadPopUp: PropTypes.bool,
  };

export default DownloadResourcePopUp;
