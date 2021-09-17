import React from 'react';
import CustomAutocomplete from '@/modules/projects/CustomAutocomplete';
import PropTypes from 'prop-types';
import { ChevronDownIcon } from '@heroicons/react/solid';
import { PencilAltIcon } from '@heroicons/react/outline';

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
export default function AdvancedSettingsDropdown() {
  const {
    states: {
      canonSpecification,
      canonList,
      licenceList,
      versification,
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
              <div className="flex gap-5 mt-8">
                <CustomAutocomplete label="Versification Scheme" list={versification} setValue={setValue} />

              </div>
              <div className="mt-8">

                <div className="flex gap-4">

                  <div>
                    <BookNumberTag>
                      {(canonSpecification.currentScope).length}
                    </BookNumberTag>
                  </div>
                </div>

                <div className="relative">
                  <div className="flex">

                    <CustomAutocomplete label="Canon Specification" list={canonList} setValue={setValue} />
                    <div className="flex gap-3 ml-3">

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
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <CustomAutocomplete label="Licence" list={licenceList} setValue={setValue} />
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
