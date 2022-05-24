/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/solid';
<<<<<<< HEAD
import { useTranslation } from 'react-i18next';
=======
import localforage from 'localforage';
import { OT, NT } from '../../../lib/CanonSpecification';
>>>>>>> 824ed4f5af1d475dd3406ede2f735bd5f66506a6
import CustomList from '@/modules/projects/CustomList';
import { ProjectContext } from '../../context/ProjectContext';
import CustomCanonSpecification from './CustomCanonSpecification';
import LicencePopover from './LicencePopover';
import * as logger from '../../../logger';

function BookNumberTag(props) {
  const { children } = props;

  let numberOfBooks = 'books';

  if (children.toString() === '1') {
    numberOfBooks = 'book';
  }

  return (
    <div className="rounded-full px-2 py-1 bg-gray-200 text-xs uppercase font-semibold">
      <div className="flex">
        <span>
          {children}
          {' '}
          <span>
            {numberOfBooks}
          </span>
        </span>
      </div>
    </div>
  );
}
export default function AdvancedSettingsDropdown({ call, project }) {
  const {
    states: {
      canonSpecification,
      canonList,
      licenceList,
      versification,
      versificationScheme,
      copyright,
    },
    actions: {
      setVersificationScheme,
      setcanonSpecification,
      setCopyRight,
    },
  } = React.useContext(ProjectContext);
  const [isShow, setIsShow] = React.useState(true);
  const [bibleNav, setBibleNav] = React.useState(false);
  const [handleNav, setHandleNav] = React.useState();
  const [currentScope, setCurrentScope] = React.useState();
  const { t } = useTranslation();
  const handleClick = () => {
    setIsShow(!isShow);
  };
  const openBibleNav = (value) => {
    setHandleNav(value);
    setBibleNav(true);
  };
  function closeBooks() {
    setBibleNav(false);
  }
  const loadScope = (project) => {
    logger.debug('AdvancedSettingsDropdown.js', 'In loadScope for loading a exact scope from burrito');
    const vals = Object.keys(project.type.flavorType.currentScope).map((key) => key);
    if (vals.length === 66) {
      setcanonSpecification({ title: 'All Books', currentScope: vals });
      setCurrentScope({ title: 'All Books', currentScope: vals });
    } else if (vals.length === 39 && vals.every((val) => OT.includes(val))) {
      setcanonSpecification({ title: 'Old Testament (OT)', currentScope: vals });
      setCurrentScope({ title: 'Old Testament (OT)', currentScope: vals });
    } else if (vals.length === 27 && vals.every((val) => NT.includes(val))) {
      setcanonSpecification({ title: 'New Testament (NT)', currentScope: vals });
      setCurrentScope({ title: 'New Testament (NT)', currentScope: vals });
    } else {
      setcanonSpecification({ title: 'Other', currentScope: vals });
      setCurrentScope({ title: 'Other', currentScope: vals });
    }
  };
  // selectNew variable is used to track whether its a new selection or loading from the list
  const setALicense = (licenceTitle, selectNew) => {
    let title = licenceTitle;
    let myLicence = { };
    const fs = window.require('fs');
    if ((title === 'Custom' || !title) && !selectNew) {
      myLicence.title = 'Custom';
      myLicence.locked = false;
      myLicence.id = 'Other';
      // To support the Projects of 0.3.0 version of burrito
      if (project.copyright?.fullStatementPlain) {
        myLicence.licence = project.copyright?.fullStatementPlain?.en;
      } else if (project.copyright?.shortStatements) {
        myLicence.licence = project.copyright?.shortStatements[0]?.statement;
      } else {
        const path = require('path');
        const newpath = localStorage.getItem('userPath');
        const id = Object.keys(project.identification.primary.ag);
        localforage.getItem('userProfile').then((value) => {
          logger.debug('AdvancedSettingsDropdown.js', 'Fetching the current username');
          const folder = path.join(newpath, 'autographa', 'users', value?.username, 'projects', `${project.identification.name.en}_${id[0]}`, 'ingredients', 'license.md');
          if (fs.existsSync(folder)) {
            fs.readFile(folder, 'utf8', (err, data) => {
              myLicence.licence = data;
            });
          } else {
            const licensefile = require('../../../lib/license/Custom.md');
            // console.log(myLicence, licensefile.default);
            myLicence.licence = licensefile.default;
          }
        });
      }
    } else {
      // license names are being updated by a prefix 'CC' so to avoid error with previous versions
      // checking whether the prefix is available or not
      if (!title.match(/CC/g) && title !== 'Custom') {
        const str = `CC ${title}`;
        title = str.replace(/_/gm, '-');
      }
      myLicence = licenceList.find((item) => item.title === title);
      // eslint-disable-next-line import/no-dynamic-require
      const licensefile = require(`../../../lib/license/${title}.md`);
      myLicence.licence = licensefile.default;
    }
    setCopyRight(myLicence);
  };
  const loadLicence = () => {
    logger.debug('AdvancedSettingsDropdown.js', 'In loadLicence for loading the selected licence');
    setALicense(project.project?.textTranslation?.copyright, false);
  };
  const selectCanon = (val) => {
    const value = val;
    if (call === 'edit' && value.title === 'Other') {
      if (canonSpecification.title === 'Other') {
        value.currentScope = canonSpecification.currentScope;
      } else {
       value.currentScope = currentScope.currentScope;
      }
    } else if (canonSpecification.title === 'Other' && value.title === 'Other') {
        value.currentScope = canonSpecification.currentScope;
      }
    setcanonSpecification(value);
    openBibleNav('edit');
  };
  useEffect(() => {
    if (call === 'edit' && !isShow) {
      loadScope(project);
      loadLicence(project);
      setVersificationScheme({ title: project?.project?.textTranslation?.versification ? project?.project?.textTranslation?.versification : 'ENG' });
    }
  }, [isShow]);

  return (
    <>
      <div>
        <button
          className="min-w-max flex justify-between items-center pt-3 shadow tracking-wider leading-none h-10 px-4 py-2 w-96 text-sm font-medium text-black bg-gray-100 rounded-sm hover:bg-gray-200 focus:outline-none"
          onClick={handleClick}
          type="button"
          id="open-advancesettings"
        >
          <h3>{t('btn-advance-settings')}</h3>
          {isShow
            ? (
              <ChevronDownIcon
                className="h-5 w-5 text-primary"
                aria-hidden="true"
              />
            )
            : (
              <ChevronUpIcon
                className="h-5 w-5 text-primary"
                aria-hidden="true"
              />
          )}
        </button>
        {!isShow
          && (
            <div>
              <div className="mt-8">
                <div className="flex gap-4">
                  <h4 className="text-xs font-base mb-2 text-primary  tracking-wide leading-4  font-light">
                    Scope
                    <span className="text-error">*</span>
                  </h4>
                  <div>
                    <BookNumberTag>
                      {(canonSpecification?.currentScope).length}
                    </BookNumberTag>
                  </div>
                </div>

                {/* <div className="relative"> */}
                <div>
                  {/* <CustomList
                    selected={canonSpecification}
                    setSelected={setcanonSpecification}
                    options={canonList}
                    show
                  /> */}

                  <div className="py-5 flex gap-3 uppercase text-sm font-medium">
                    <div
                      className={canonSpecification.title === 'All Books' ? 'bg-primary hover:bg-secondary text-white px-3 py-1 rounded-full cursor-pointer whitespace-nowrap' : 'bg-gray-200 hover:bg-primary hover:text-white px-3 py-1 rounded-full cursor-pointer whitespace-nowrap'}
                      onClick={() => selectCanon(canonList[0])}
                      role="button"
                      tabIndex="0"
                    >
                      All Books
                    </div>
                    <div
                      className={canonSpecification.title === 'Old Testament (OT)' ? 'bg-primary hover:bg-secondary text-white px-3 py-1 rounded-full cursor-pointer whitespace-nowrap' : 'bg-gray-200 hover:bg-primary hover:text-white px-3 py-1 rounded-full cursor-pointer whitespace-nowrap'}
                      onClick={() => selectCanon(canonList[1])}
                      role="button"
                      tabIndex="0"
                    >
                      Old Testament (OT)
                    </div>
                    <div
                      className={canonSpecification.title === 'New Testament (NT)' ? 'bg-primary hover:bg-secondary text-white px-3 py-1 rounded-full cursor-pointer whitespace-nowrap' : 'bg-gray-200 hover:bg-primary hover:text-white px-3 py-1 rounded-full cursor-pointer whitespace-nowrap'}
                      onClick={() => selectCanon(canonList[2])}
                      role="button"
                      aria-label="new-testament"
                      tabIndex="0"
                    >
                      New Testament (NT)
                    </div>
                    <div
                      className={canonSpecification.title === 'Other' ? 'bg-primary hover:bg-secondary text-white px-3 py-1 rounded-full cursor-pointer whitespace-nowrap' : 'bg-gray-200 hover:bg-primary hover:text-white px-3 py-1 rounded-full cursor-pointer whitespace-nowrap'}
                      onClick={() => selectCanon(canonList[3])}
                      role="button"
                      tabIndex="0"
                    >
                      Custom
                    </div>
                  </div>
                  {/* <button
                    type="button"
                    className="mt-8 focus:outline-none bg-primary h-8 w-8
                    flex items-center justify-center rounded-full"
                    onClick={() => openBibleNav('edit')}
                  >
                    <PencilAltIcon
                      className="h-5 w-5 text-white"
                      aria-hidden="true"
                    />
                  </button> */}
                  {/* </div> */}
                </div>
              </div>

              <h4 className="text-xs font-base mt-4 text-primary  tracking-wide leading-4  font-light">
                Versification Scheme
                <span className="text-error">*</span>
              </h4>
              <div className="mt-2">
                <CustomList selected={versificationScheme} setSelected={setVersificationScheme} options={versification} show={call === 'new'} />
              </div>

              <h4 className="text-xs font-base mt-4 text-primary  tracking-wide leading-4  font-light">
                Licence
                <span className="text-error">*</span>
              </h4>
              <div className="flex gap-3 mt-2">
                <CustomList
                  selected={copyright}
                  setSelected={(value) => setALicense(value.title, true)}
                  options={licenceList}
                  show
                />
                <div className="w-8">
                  <LicencePopover call={call} />
                </div>
              </div>
            </div>
          )}
      </div>
      {bibleNav && (
        <CustomCanonSpecification
          bibleNav={bibleNav}
          closeBibleNav={() => closeBooks()}
          handleNav={handleNav}
        />
      )}
    </>
  );
}
BookNumberTag.propTypes = {
  children: PropTypes.number,
};
AdvancedSettingsDropdown.propTypes = {
  call: PropTypes.string,
  project: PropTypes.object,
};
