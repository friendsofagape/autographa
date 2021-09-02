import ProjectsLayout from '@/layouts/projects/Layout';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import AdvancedSettingsDropdown from '@/components/ProjectsPage/CreateProject/AdvancedSettingsDropdown';
import { ProjectContext } from '@/components/context/ProjectContext';
import TargetLanguagePopover from '@/components/ProjectsPage/CreateProject/TargetLanguagePopover';
import PopoverProjectType from '@/layouts/editor/PopoverProjectType';

import LayoutIcon from '@/icons/basil/Outline/Interface/Layout.svg';
import BullhornIcon from '@/icons/basil/Outline/Communication/Bullhorn.svg';
import ProcessorIcon from '@/icons/basil/Outline/Devices/Processor.svg';
// import CheckIcon from '@/icons/basil/Outline/Interface/Check.svg';
import ImageIcon from '@/icons/basil/Outline/Files/Image.svg';

// import ImportPopUp from './ImportPopUp';
import CustomAutocomplete from './CustomAutocomplete';

const solutions = [
  {
    name: 'Translation',
    href: '##',
    icon: LayoutIcon,
  },
  {
    name: 'Audio',
    href: '##',
    icon: BullhornIcon,
  },
  {
    name: 'MT',
    href: '##',
    icon: ProcessorIcon,
  },
  {
    name: 'OBS',
    href: '##',
    icon: ImageIcon,
  },
];

function TargetLanguageTag(props) {
  const { children } = props;
  return (
    <div className="rounded-full px-3 py-1  bg-gray-200 text-xs uppercase font-semibold">{children}</div>
  );
}

function BibleHeaderTagDropDown() {
  return (

    <PopoverProjectType items={solutions}>
      <button type="button" className="flex text-white ml-5 font-bold text-xs px-3 py-2 rounded-full leading-3 tracking-wider uppercase bg-primary">
        <div>Bible</div>
        <img
          className=" w-3 h-3 ml-2"
          src="illustrations/down-arrow.svg"
          alt="down arrow"
        />
      </button>
    </PopoverProjectType>
  );
}

export default function NewProject() {
  const {
    states: {
      newProjectFields,
      version,
      languages,
      language,
    },
    actions: {
      handleProjectFields,
      setVersion,
      setLanguage,
      createProject,
    },
  } = React.useContext(ProjectContext);

  function getAbbreviation(text) {
    if (typeof text !== 'string' || !text) {
      return '';
    }
    const abbr = [];
    const splitText = text.trim().split(' ');
    splitText.forEach((t) => {
      abbr.push(t.charAt(0));
    });
    return abbr.join('').toUpperCase();
  }

  const handleVersion = (e) => {
    const abbreviation = getAbbreviation(e.target.value);
    setVersion({ ...version, name: e.target.value, abbreviation });
  };

  const setValue = async (value) => {
    if (value.label === 'Target Langauge') {
      languages.forEach((l) => {
        if (l.title === value.data) {
          setLanguage(l);
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
    <ProjectsLayout
      title="new project"
      header={BibleHeaderTagDropDown()}
    >
      <div className=" rounded-md border shadow-sm mt-4 ml-5 mr-5 mb-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 m-10 gap-5">

          <div>
            <h4 className="text-xs font-base mb-2 text-primary  tracking-wide leading-4  font-light">Project Name</h4>
            <input
              type="text"
              name="project_name"
              id=""
              value={newProjectFields.projectName}
              onChange={handleProjectFields('projectName')}
              className="w-52 lg:w-80 block rounded shadow-sm sm:text-sm focus:border-primary border-gray-300"
            />
            <h4 className="mt-5 text-xs font-base mb-2 text-primary leading-4 tracking-wide  font-light">Description</h4>
            <textarea
              type="text"
              name="Description"
              id=""
              value={version.description}
              onChange={handleProjectFields('description')}
              className="bg-white w-52 lg:w-80 h-28  block rounded shadow-sm sm:text-sm focus:border-primary border-gray-300"
            />
          </div>

          <div className="col-span-2">
            <div className="flex gap-5">
              <div>
                <h4 className="text-xs font-base mb-2 text-primary  tracking-wide leading-4  font-light">Version</h4>
                <input
                  type="text"
                  name="version"
                  id=""
                  value={version.name}
                  onChange={(e) => {
                    handleVersion(e);
                  }}
                  className="bg-white w-52 lg:w-80 block rounded shadow-sm sm:text-sm focus:border-primary border-gray-300"
                />
              </div>
              <div>
                <h4 className="text-xs font-base mb-2 text-primary  tracking-wide leading-4  font-light">Abbreviation</h4>
                <input
                  type="text"
                  name="version_abbreviated"
                  id=""
                  value={version.abbreviation}
                  onChange={(e) => {
                    setVersion({ ...version, abbreviation: e.target.value });
                  }}
                  className="bg-white w-24 block rounded  sm:text-sm focus:border-primary border-gray-300"
                />
              </div>
            </div>
            <div className="flex gap-5 mt-5">
              <div className="relative">
                <div className="absolute top-0 right-0">
                  <TargetLanguageTag>
                    {language.scriptDirection ? language.scriptDirection : 'LTR'}
                  </TargetLanguageTag>
                </div>
                <CustomAutocomplete label="Target Langauge" list={languages} setValue={setValue} />
              </div>
              <div className="mt-8">
                <TargetLanguagePopover />
              </div>
            </div>
            {/* <div className="mt-5">
              <button
                type="button"
                className="rounded-full px-3 py-1 bg-primary hover:bg-black
                text-white text-xs uppercase font-semibold"
                onClick={openImportPopUp}
              >
                22 books imported
              </button>
              <ImportPopUp open={openPopUp} closePopUp={closeImportPopUp} />
            </div> */}
          </div>

          <div>
            <AdvancedSettingsDropdown />
            <div>
              <button
                type="button"
                className="w-40 h-10 my-5 bg-success leading-loose rounded shadow text-xs font-base text-white tracking-wide font-light uppercase"
                onClick={() => createProject()}
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProjectsLayout>
  );
}

TargetLanguageTag.propTypes = {
  children: PropTypes.string,
};
