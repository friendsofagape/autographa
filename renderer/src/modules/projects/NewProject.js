import ProjectsLayout from '@/layouts/projects/Layout';
import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import AdvancedSettingsDropdown from '@/components/ProjectsPage/CreateProject/AdvancedSettingsDropdown';
import { ProjectContext } from '@/components/context/ProjectContext';
import TargetLanguagePopover from '@/components/ProjectsPage/CreateProject/TargetLanguagePopover';
// import PopoverProjectType from '@/layouts/editor/PopoverProjectType';
import { SnackBar } from '@/components/SnackBar';
import LayoutIcon from '@/icons/basil/Outline/Interface/Layout.svg';
import BullhornIcon from '@/icons/basil/Outline/Communication/Bullhorn.svg';
import ProcessorIcon from '@/icons/basil/Outline/Devices/Processor.svg';
// import CheckIcon from '@/icons/basil/Outline/Interface/Check.svg';
import ImageIcon from '@/icons/basil/Outline/Files/Image.svg';
import { useRouter } from 'next/router';
// import { ChevronDownIcon } from '@heroicons/react/solid';
import projects from 'pages/projects';
import localforage from 'localforage';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';
import { AutographaContext } from '@/components/context/AutographaContext';
import * as logger from '../../logger';
import CustomAutocomplete from './CustomAutocomplete';
import ImportPopUp from './ImportPopUp';
import CustomList from './CustomList';

// eslint-disable-next-line no-unused-vars
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
    <>
      <button
        type="button"
        className="flex justify-center items-center px-5 py-1 text-white ml-5
        font-bold text-xs rounded-full leading-3 tracking-wider uppercase bg-primary"
      >
        <div className="w-7 h-4">Bible</div>
        {/* <ChevronDownIcon
          className="w-5 h-5 ml-2"
          aria-hidden="true"
        /> */}
      </button>
      {/* <PopoverProjectType items={solutions}> */}

      {/* </PopoverProjectType> */}
    </>

  );
}

export default function NewProject({ call, project, closeEdit }) {
  console.log(call, project);
  const {
    states: {
      newProjectFields,
      languages,
      language,
    },
    actions: {
      setLanguage,
      createProject,
      setNewProjectFields,
    },
  } = React.useContext(ProjectContext);
  const router = useRouter();
  const [snackBar, setOpenSnackBar] = React.useState(false);
  const [snackText, setSnackText] = React.useState('');
  const [notify, setNotify] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [metadata, setMetadata] = React.useState();
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

  const handleProjectName = (e) => {
    const abbreviation = getAbbreviation(e.target.value);
    setNewProjectFields({ ...newProjectFields, projectName: e.target.value, abbreviation });
  };

  const setValue = async (value) => {
    if (value.label === 'Target Language') {
      languages.forEach((l) => {
        if (l.title === value.data) {
          setLanguage(l);
        }
      });
    }
  };

  const validate = () => {
    logger.debug('NewProject.js', 'Validating the fields.');
    setLoading(true);
    let create = false;
    if (newProjectFields.projectName && newProjectFields.abbreviation) {
      create = true;
    } else {
      create = false;
    }
    if (create === true) {
      logger.debug('NewProject.js', 'Creating new project.');
      const value = createProject(call, metadata);
      value.then((status) => {
        logger.debug('NewProject.js', status[0].value);
        setLoading(false);
        setNotify(status[0].type);
        setSnackText(status[0].value);
        setOpenSnackBar(true);
        if (status[0].type === 'success') {
          router.push('/projects');
        }
      });
    } else {
      logger.debug('NewProject.js', 'Validation Failed - Fill all the required fields.');
      setLoading(false);
      setNotify('warning');
      setSnackText('Fill all the fields');
      setOpenSnackBar(true);
    }
  };
  const [openPopUp, setOpenPopUp] = React.useState(false);

  function openImportPopUp() {
    setOpenPopUp(true);
  }

  function closeImportPopUp() {
    setOpenPopUp(false);
  }
  const loadData = async (project) => {
    setNewProjectFields({ projectName: project.identification.name.en, abbreviation: project.identification.abbreviation.en, description: project.project.textTranslation.description });
    setValue({ label: 'Target Language', data: project.languages[0].name.en });
    setMetadata(project);
  };
  useEffect(() => {
    if (call === 'edit') {
      loadData(project);
    }
  }, [call]);

  return (
    <ProjectsLayout
      title={call === 'new' ? 'new project' : 'edit project'}
      header={BibleHeaderTagDropDown()}
    >
      {loading === true
        ? (
          <div className="h-full items-center justify-center flex">
            <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
          )
        : (
          <div className=" rounded-md border shadow-sm mt-4 ml-5 mr-5 mb-5">
            <div className="grid grid-cols-1 lg:grid-cols-3 m-10 gap-5">

              <div>
                <h4 className="text-xs font-base mb-2 text-primary  tracking-wide leading-4  font-light">
                  Project Name
                  <span style={{ color: 'red' }}>*</span>
                </h4>
                <input
                  type="text"
                  name="project_name"
                  id=""
                  value={newProjectFields.projectName}
                  onChange={(e) => {
                    handleProjectName(e);
                  }}
                  disabled={call !== 'new'}
                  className="w-52 lg:w-80 block rounded shadow-sm sm:text-sm focus:border-primary border-gray-300"
                />
                <h4 className="mt-5 text-xs font-base mb-2 text-primary leading-4 tracking-wide  font-light">Description</h4>
                <textarea
                  type="text"
                  name="Description"
                  id=""
                  value={newProjectFields.description}
                  onChange={(e) => {
                    setNewProjectFields({ ...newProjectFields, description: e.target.value });
                  }}
                  className="bg-white w-52 lg:w-80 h-28  block rounded shadow-sm sm:text-sm focus:border-primary border-gray-300"
                />
              </div>

              <div className="col-span-2">
                <div className="flex gap-5">
                  <div>
                    <h4 className="text-xs font-base mb-2 text-primary  tracking-wide leading-4  font-light">
                      Abbreviation
                      <span style={{ color: 'red' }}>*</span>
                    </h4>
                    <input
                      type="text"
                      name="version_abbreviated"
                      id=""
                      value={newProjectFields.abbreviation}
                      onChange={(e) => {
                        setNewProjectFields({ ...newProjectFields, abbreviation: e.target.value });
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
                    <h4 className="text-xs font-base mb-2 text-primary  tracking-wide leading-4  font-light">
                      Target Language
                      <span style={{ color: 'red' }}>*</span>
                    </h4>
                    {/* <CustomAutocomplete label="Target Language" list={languages} setValue={setValue} /> */}
                    <CustomList selected={language} setSelected={setLanguage} options={languages} show />
                  </div>
                  <div className="mt-8">
                    <TargetLanguagePopover />
                  </div>
                </div>
                <div className="mt-5">
                  <button
                    type="button"
                    className="rounded-full px-3 py-1 bg-primary hover:bg-black
                      text-white text-xs uppercase font-semibold"
                    onClick={openImportPopUp}
                  >
                    Import books
                  </button>
                  <ImportPopUp open={openPopUp} closePopUp={closeImportPopUp} />
                </div>
              </div>

              <div>
                <AdvancedSettingsDropdown call={call} project={project} />
                {call === 'new'
                  ? (
                    <div>
                      <button
                        type="button"
                        className="w-40 h-10 my-5 bg-success leading-loose rounded shadow text-xs font-base text-white tracking-wide font-light uppercase"
                        onClick={() => validate()}
                      >
                        Create Project
                      </button>
                    </div>
)
                : (
                  <div className="p-3 flex gap-5 justify-end">
                    <button
                      type="button"
                      className="w-40 h-10  bg-error leading-loose rounded shadow text-xs font-base  text-white tracking-wide  font-light uppercase"
                      onClick={() => closeEdit()}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="w-40 h-10  bg-success leading-loose rounded shadow text-xs font-base  text-white tracking-wide  font-light uppercase"
                      onClick={() => validate()}
                    >
                      Save
                    </button>
                  </div>
)}
              </div>
            </div>
          </div>
      )}
      <SnackBar
        openSnackBar={snackBar}
        snackText={snackText}
        setOpenSnackBar={setOpenSnackBar}
        setSnackText={setSnackText}
        error={notify}
      />
    </ProjectsLayout>
  );
}

TargetLanguageTag.propTypes = {
  children: PropTypes.string,
};
