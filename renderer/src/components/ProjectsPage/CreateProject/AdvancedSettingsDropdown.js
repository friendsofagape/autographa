import React, { useEffect } from 'react';
import CustomAutocomplete from '@/modules/projects/CustomAutocomplete';
import PropTypes from 'prop-types';
import { ChevronDownIcon } from '@heroicons/react/solid';
import { PencilAltIcon } from '@heroicons/react/outline';

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
  const setValue = async (value) => {
    if (value.label === 'Versification Scheme') {
      versification.forEach((v) => {
        if (v.title === value.data) {
          setVersificationScheme(v);
        }
      });
    }
    if (value.label === 'Canon Specification') {
      canonList.forEach((c) => {
        if (c.title === value.data) {
          if (value.data === 'Custom') {
            openBibleNav('edit');
          }
          setcanonSpecification(c);
        }
      });
    }
    if (value.label === 'Licence') {
      licenceList.forEach((l) => {
        if (l.title === value.data) {
          // eslint-disable-next-line import/no-dynamic-require
          const licencefile = require(`../../../lib/license/${l.id}.md`);
          // eslint-disable-next-line no-param-reassign
          l.licence = licencefile.default;
          setCopyRight(l);
        }
      });
    }
  };
  const loadScope = (project) => {
    console.log(project.type.flavorType.canonType, project.type.flavorType.currentScope, (project.type.flavorType.canonType).length === 1);
    if ((project.type.flavorType.canonType).length === 2) {
      console.log((Object.keys(project.type.flavorType.currentScope).length));
      if (Object.keys(project.type.flavorType.currentScope).length === 66) {
        const vals = Object.keys(project.type.flavorType.currentScope).map((key) => key);
        console.log({ title: 'All Books', currentScope: vals });
        setcanonSpecification({ title: 'All Books', currentScope: vals });
      } else {
        const vals = Object.keys(project.type.flavorType.currentScope).map((key) => key);
        console.log({ title: 'Others', currentScope: vals });
        setcanonSpecification({ title: 'Others', currentScope: vals });
      }
    } else if ((project.type.flavorType.canonType).length === 1) {
      if (project.type.flavorType.canonType[0] === 'ot') {
        console.log((Object.keys(project.type.flavorType.currentScope).length));
        if (Object.keys(project.type.flavorType.currentScope).length === 39) {
          const vals = Object.keys(project.type.flavorType.currentScope).map((key) => key);
          console.log({ title: 'Old Testament (OT)', currentScope: vals });
          setcanonSpecification({ title: 'Old Testament (OT)', currentScope: vals });
        } else {
          const vals = Object.keys(project.type.flavorType.currentScope).map((key) => key);
          console.log({ title: 'Others', currentScope: vals });
          setcanonSpecification({ title: 'Others', currentScope: vals });
        }
      } else if (project.type.flavorType.canonType[0] === 'nt') {
        console.log((Object.keys(project.type.flavorType.currentScope).length));
        if (Object.keys(project.type.flavorType.currentScope).length === 27) {
          const vals = Object.keys(project.type.flavorType.currentScope).map((key) => key);
          console.log({ title: 'Old Testament (OT)', currentScope: vals });
          setcanonSpecification({ title: 'Old Testament (OT)', currentScope: vals });
        } else {
          const vals = Object.keys(project.type.flavorType.currentScope).map((key) => key);
          console.log({ title: 'Others', currentScope: vals });
          setcanonSpecification({ title: 'Others', currentScope: vals });
        }
      }
    }
  };
  const loadLicence = () => {
    console.log('licence', project, licenceList);
    const title = project.project.textTranslation.copyright;
    let myLicence = {};
    if (title === 'Custom') {
      myLicence.title = 'Custom';
      myLicence.locked = false;
      myLicence.id = 'Other';
      myLicence.licence = project.copyright.fullStatementPlain.en;
    } else {
      myLicence = licenceList.find((item) => item.title === title);
      const licensefile = require(`../../../lib/license/${title}.md`);
      myLicence.licence = licensefile.default;
    }
    console.log(myLicence);
    setCopyRight(myLicence);
  };
useEffect(() => {
  console.log(call, project);
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
console.log('copyright', copyright);
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
                    <span style={{ color: 'red' }}>*</span>
                  </h4>
                  <div>
                    <BookNumberTag>
                      {(canonSpecification.currentScope).length}
                    </BookNumberTag>
                  </div>
                </div>

                {/* <div className="relative"> */}
                <div className="flex gap-4">
                  <CustomList selected={canonSpecification} setSelected={setcanonSpecification} options={canonList} show />
                  {/* <div className="flex gap-3 ml-3"> */}

                  <button
                    type="button"
                    className="mt-8 focus:outline-none bg-primary h-8 w-8 flex items-center justify-center rounded-full"
                    onClick={() => openBibleNav('edit')}
                  >
                    <PencilAltIcon
                      className="h-5 w-5 text-white"
                      aria-hidden="true"
                    />
                  </button>
                  {/* </div> */}
                </div>
                {/* </div> */}
              </div>
              <h4 className="text-xs font-base mb-2 text-primary  tracking-wide leading-4  font-light">
                Versification Scheme
                <span style={{ color: 'red' }}>*</span>
              </h4>
              <div className="flex gap-5 mt-8">
                {/* <CustomAutocomplete label="Versification Scheme" list={versification} setValue={setValue} /> */}
                <CustomList selected={versificationScheme} setSelected={setVersificationScheme} options={versification} show={call === 'new'} />
              </div>
              <h4 className="text-xs font-base mb-2 text-primary  tracking-wide leading-4  font-light">
                Licence
                <span style={{ color: 'red' }}>*</span>
              </h4>
              <div className="flex gap-3 mt-5">
                <CustomList selected={copyright} setSelected={setCopyRight} options={licenceList} show />
                {/* <CustomAutocomplete label="Licence" list={licenceList} setValue={setValue} /> */}
                <div className="mt-8 w-8 min-w-max">
                  <LicencePopover />
                </div>
              </div>
            </div>
          )}
      </div>
      {bibleNav && (
        <CustomCanonSpecification
          bibleNav={bibleNav}
          closeBibleNav={closeBooks}
          handleNav={handleNav}
        />
      )}
    </>
  );
}
BookNumberTag.propTypes = {
  children: PropTypes.number,
};
