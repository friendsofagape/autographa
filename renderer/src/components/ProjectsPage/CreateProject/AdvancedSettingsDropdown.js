/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { ChevronDownIcon } from '@heroicons/react/solid';

import CustomList from '@/modules/projects/CustomList';
import { ProjectContext } from '../../context/ProjectContext';
import CustomCanonSpecification from './CustomCanonSpecification';
import LicencePopover from './LicencePopover';

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
    if ((project.type.flavorType.canonType).length === 2) {
      if (Object.keys(project.type.flavorType.currentScope).length === 66) {
        const vals = Object.keys(project.type.flavorType.currentScope).map((key) => key);
        setcanonSpecification({ title: 'All Books', currentScope: vals });
      } else {
        const vals = Object.keys(project.type.flavorType.currentScope).map((key) => key);
        setcanonSpecification({ title: 'Others', currentScope: vals });
      }
    } else if ((project.type.flavorType.canonType).length === 1) {
      if (project.type.flavorType.canonType[0] === 'ot') {
        if (Object.keys(project.type.flavorType.currentScope).length === 39) {
          const vals = Object.keys(project.type.flavorType.currentScope).map((key) => key);
          setcanonSpecification({ title: 'Old Testament (OT)', currentScope: vals });
        } else {
          const vals = Object.keys(project.type.flavorType.currentScope).map((key) => key);
          setcanonSpecification({ title: 'Others', currentScope: vals });
        }
      } else if (project.type.flavorType.canonType[0] === 'nt') {
        if (Object.keys(project.type.flavorType.currentScope).length === 27) {
          const vals = Object.keys(project.type.flavorType.currentScope).map((key) => key);
          setcanonSpecification({ title: 'Old Testament (OT)', currentScope: vals });
        } else {
          const vals = Object.keys(project.type.flavorType.currentScope).map((key) => key);
          setcanonSpecification({ title: 'Others', currentScope: vals });
        }
      }
    }
  };
  const loadLicence = () => {
    const title = project.project.textTranslation.copyright;
    let myLicence = {};
    if (title === 'Custom') {
      myLicence.title = 'Custom';
      myLicence.locked = false;
      myLicence.id = 'Other';
      myLicence.licence = project.copyright.fullStatementPlain.en;
    } else {
      myLicence = licenceList.find((item) => item.title === title);
      // eslint-disable-next-line import/no-dynamic-require
      const licensefile = require(`../../../lib/license/${title}.md`);
      myLicence.licence = licensefile.default;
    }
    setCopyRight(myLicence);
  };
  useEffect(() => {
    if (canonSpecification.title === 'Others' && call === 'new') {
      openBibleNav('edit');
    }
  }, [canonSpecification]);
  useEffect(() => {
    if (call === 'edit') {
      loadScope(project);
      loadLicence(project);
    }
  }, []);
  // const [openPopUp, setOpenPopUp] = useState(false);

  // function openImportPopUp() {
  //   setOpenPopUp(true);
  // }

  // function closeImportPopUp() {
  //   setOpenPopUp(false);
  // }

  return (
    <>
      <div>
        <button
          className="min-w-max flex justify-between items-center pt-3 shadow tracking-wider leading-none h-10 px-4 py-2 w-96 text-sm font-medium text-black bg-gray-100 rounded-sm hover:bg-gray-200 focus:outline-none"
          onClick={handleClick}
          type="button"
        >
          <h3>Advanced Settings</h3>
          <ChevronDownIcon
            className="h-5 w-5 text-primary"
            aria-hidden="true"
          />
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
                      {(canonSpecification.currentScope).length}
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
                    <div className="bg-gray-200 hover:bg-primary hover:text-white px-3 py-1 rounded-full cursor-pointer whitespace-nowrap">All Books</div>
                    <div className="bg-gray-200 hover:bg-primary hover:text-white px-3 py-1 rounded-full cursor-pointer whitespace-nowrap">OT Old Testament</div>
                    <div className="bg-gray-200 hover:bg-primary hover:text-white px-3 py-1 rounded-full cursor-pointer whitespace-nowrap">NT New Testament</div>
                    <div
                      className="bg-primary hover:bg-secondary text-white px-3 py-1 rounded-full cursor-pointer whitespace-nowrap"
                      onClick={() => openBibleNav('edit')}
                      role="button"
                      tabIndex="0"
                    >
                      Custom
                    </div>
                  </div>

                  {/* <button
                    type="button"
                    className="mt-8 focus:outline-none bg-primary h-8 w-8 flex items-center justify-center rounded-full"
                    onClick={() => openBibleNav('edit')}
                  >
                    <PencilAltIcon
                      className="h-5 w-5 text-white"
                      aria-hidden="true"
                    />
                  </button> */}
                  {/* </div> */}
                </div>
                {/* </div> */}
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
                  setSelected={setCopyRight}
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
          closeBibleNav={() => closeBooks}
          handleNav={handleNav}
        />
      )}
    </>
  );
}
BookNumberTag.propTypes = {
  children: PropTypes.number,
};
