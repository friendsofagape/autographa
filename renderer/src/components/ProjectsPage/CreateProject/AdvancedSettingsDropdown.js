import React from 'react';
import CustomAutocomplete from '@/modules/projects/CustomAutocomplete';
import PropTypes from 'prop-types';
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
    <div className="rounded-full  px-2 py-1 bg-gray-200 text-xs uppercase font-semibold">
      <div className="flex">
        <span>
          {' '}
          {children}
          {' '}
          <span>
            {' '}
            { numberOfBooks }
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
    if (value.label === 'Canon Specificationse') {
      canonList.forEach((c) => {
        if (c.title === value.data) {
          setcanonSpecification(c);
        }
      });
    }
    if (value.label === 'Licence') {
      licenceList.forEach((l) => {
        if (l.title === value.data) {
          setCopyRight(l);
        }
      });
    }
  };
  return (
    <>
      <div>
        <button
          className="min-w-max flex justify-between pt-3 shadow tracking-wider leading-none h-10 px-4 py-2 w-96 text-sm font-medium text-black bg-gray-100 rounded-sm hover:bg-gray-200 focus:outline-none"
          onClick={handleClick}
          type="button"
        >
          <h3>Advanced Settings</h3>
          <img
            className="justify-self-end mt-1"
            src="illustrations/arrow-down.svg"
            alt=""
          />
        </button>
        {!isShow
        && (
        <div>
          <div className="flex gap-5 mt-8">
            <CustomAutocomplete label="Versification Scheme" list={versification} setValue={setValue} />
            {/* <button
              className="mt-5 min-w-max"
              type="button"
              label="na"
            >
              <img
                src="illustrations/add-button.svg"
                alt="add button"
              />
            </button> */}
          </div>
          <div className="relative">
            <div className="absolute left-64">
              <BookNumberTag>
                {(canonSpecification.currentScope).length}
              </BookNumberTag>
            </div>
            <div className="mt-8 flex relative">
              <div className="flex">

                <CustomAutocomplete label="Canon Specification" list={canonList} setValue={setValue} />
                <div className="flex gap-3 ml-3">
                  <button
                    onClick={() => openBibleNav('new')}
                    type="button"
                    className="focus:outline-none pt-8"
                  >
                    <img
                      label="na"
                      src="illustrations/add-button.svg"
                      alt="add button"
                    />
                  </button>
                  <button
                    onClick={() => openBibleNav('edit')}
                    type="button"
                    className="focus:outline-none pt-8"
                  >
                    <img
                      src="illustrations/edit.svg"
                      alt="add button"
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
