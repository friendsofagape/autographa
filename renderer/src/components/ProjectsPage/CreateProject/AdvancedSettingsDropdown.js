import React from 'react';
import CustomAutocomplete from '@/modules/projects/CustomAutocomplete';
import PropTypes from 'prop-types';
import { ProjectContext } from '../../context/ProjectContext';
import CustomCanonSpecification from './CustomCanonSpecification';
import LicencePopover from './LicencePopover';

function BookNumberTag(props) {
  const { children } = props;

  return (
    <div className="rounded-full  px-3 py-1 bg-gray-200 text-xs uppercase font-semibold">
      <div className="flex">
        <span>
          {' '}
          {children}
          {' '}
          <span> books</span>
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
          className="min-w-max flex justify-between pt-3 shadow tracking-wider leading-none h-10
          px-4 py-2 w-96 text-sm
          font-medium text-black bg-gray-100 rounded-sm hover:bg-gray-200 focus:outline-none"
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
          <div className="flex relative gap-5 mt-5">
            <div className="absolute left-72 ml-4">
              <BookNumberTag>
                {(canonSpecification.currentScope).length}
              </BookNumberTag>
            </div>

            <CustomAutocomplete label="Canon Specificationse" list={canonList} setValue={setValue} />
            <button
              className="mt-5 flex-shrink-0"
              type="button"
              label="na"
              onClick={() => openBibleNav('new')}
            >
              <img
                className="min-w-10"
                src="illustrations/add-button.svg"
                alt="add button"
              />
            </button>
            <button
              className="mt-5 flex-shrink-0"
              type="button"
              label="na"
              onClick={() => openBibleNav('edit')}
            >
              <img
                className=" w-10 h-10"
                src="illustrations/edit.svg"
                alt="add button"
              />
            </button>
          </div>
          <div className="flex gap-5 mt-5">
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
