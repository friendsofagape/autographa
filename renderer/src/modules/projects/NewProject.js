/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import ProjectsLayout from '@/layouts/projects/Layout';
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
import useValidator from '@/components/hooks/useValidator';
import { classNames } from '../../util/classNames';
import * as logger from '../../logger';
import ImportPopUp from './ImportPopUp';
import CustomList from './CustomList';
import ConfirmationModal from '@/layouts/editor/ConfirmationModal';
import burrito from '../../lib/BurritoTemplete.json';
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
    <div className="rounded-full px-3 py-1 ml-28 bg-gray-200 text-xs uppercase font-semibold">{children}</div>
  );
}

function BibleHeaderTagDropDown() {
  return (
    <>
      <button
        type="button"
        className="flex justify-center items-center px-3 py-2 text-white ml-5
        font-bold text-xs rounded-full leading-3 tracking-wider uppercase bg-primary"
      >
        <div className="">Bible</div>
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
      setLanguages,
    },
  } = React.useContext(ProjectContext);
  const { action: { validateField, isLengthValidated, isTextValidated } } = useValidator();
  const [snackBar, setOpenSnackBar] = React.useState(false);
  const [snackText, setSnackText] = React.useState('');
  const [notify, setNotify] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [metadata, setMetadata] = React.useState();
  const [openModal, setOpenModal] = React.useState(false);
  const [error, setError] = React.useState({
    projectName: {},
    abbr: {},
    description: {},
  });
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
      setLanguage(value);
      languages.forEach((l) => {
        if (l.title !== value.title) {
          setLanguages(languages.concat(value));
        }
      });
    }
  };
  const createTheProject = (update) => {
    logger.debug('NewProject.js', 'Creating new project.');
    const value = createProject(call, metadata, update);
    value.then((status) => {
      logger.debug('NewProject.js', status[0].value);
      setLoading(false);
      setNotify(status[0].type);
      setSnackText(status[0].value);
      setOpenSnackBar(true);
      if (status[0].type === 'success') {
        closeEdit();
      }
    });
  };
  const validate = async () => {
    logger.debug('NewProject.js', 'Validating the fields.');
    setLoading(true);
    let create = true;
    if (newProjectFields.projectName && newProjectFields.abbreviation) {
      logger.debug('NewProject.js', 'Validating all the fields.');
      const checkName = await validateField([isLengthValidated(newProjectFields.projectName, { minLen: 5, maxLen: 40 }), isTextValidated(newProjectFields.projectName, 'nonSpecChar')]);
      if (checkName[0].isValid === false || checkName[1].isValid === false) {
        logger.warn('NewProject.js', 'Validation failed for Project Name.');
        create = false;
      }
      const checkAbbr = await validateField([isLengthValidated(newProjectFields.abbreviation, { minLen: 1, maxLen: 10 }), isTextValidated(newProjectFields.abbreviation, 'nonSpecChar')]);
      if (checkAbbr[0].isValid === false || checkAbbr[1].isValid === false) {
        logger.warn('NewProject.js', 'Validation failed for Abbreviation.');
        create = false;
      }
      // eslint-disable-next-line max-len
      const checkDesc = await validateField([isLengthValidated(newProjectFields.description, { minLen: 0, maxLen: 400 })]);
      if (checkDesc[0].isValid === false) {
        logger.warn('NewProject.js', 'Validation failed for Description.');
        create = false;
      }
      setError({
        ...error, projectName: checkName, abbr: checkAbbr, description: checkDesc,
      });
    } else {
      create = false;
      logger.warn('NewProject.js', 'Validation Failed - Fill all the required fields.');
      setNotify('warning');
      setSnackText('Fill all the fields');
      setOpenSnackBar(true);
    }
    if (create === true) {
      // Checking whether the burrito is of latest version
      logger.warn('NewProject.js', 'Checking whether the burrito is of latest version.');
      if (call === 'edit' && burrito?.meta?.version !== metadata?.meta?.version) {
        setOpenModal(true);
        setLoading(false);
      } else {
        logger.warn('NewProject.js', 'Calling createTheProject function');
        createTheProject(false);
      }
    } else {
      setLoading(false);
    }
  };
  const updateBurritoVersion = () => {
    setOpenModal(false);
    logger.warn('NewProject.js', 'Calling createTheProject function with burrito update');
    createTheProject(true);
  };
  const [openPopUp, setOpenPopUp] = React.useState(false);

  function openImportPopUp() {
    setOpenPopUp(true);
  }

  function closeImportPopUp() {
    setOpenPopUp(false);
  }
  const loadData = async (project) => {
    logger.debug('NewProject.js', 'In loadData for loading current project details in Edit page');
    setNewProjectFields({
      projectName: project.identification.name.en,
      abbreviation: project.identification.abbreviation.en,
      description: project.project.textTranslation.description,
    });
    setValue({ label: 'Target Language', title: project.languages[0].name.en });
    setMetadata(project);
  };
  useEffect(() => {
    if (call === 'edit') {
      loadData(project);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
                  <span className="text-error">*</span>
                </h4>
                <input
                  type="text"
                  name="project_name"
                  id="project_name"
                  value={newProjectFields.projectName}
                  onChange={(e) => {
                    handleProjectName(e);
                  }}
                  disabled={call !== 'new'}
                  className={classNames(call !== 'new' ? 'bg-gray-200' : '', 'w-52 lg:w-80 block rounded shadow-sm sm:text-sm focus:border-primary border-gray-300')}
                />
                <span className="text-error">{error.projectName[0]?.message || error.projectName[1]?.message}</span>
                <h4 className="mt-5 text-xs font-base mb-2 text-primary leading-4 tracking-wide  font-light">Description</h4>
                <textarea
                  type="text"
                  name="Description"
                  id="project_description"
                  value={newProjectFields.description}
                  onChange={(e) => {
                    setNewProjectFields({ ...newProjectFields, description: e.target.value });
                  }}
                  className="bg-white w-52 lg:w-80 h-28  block rounded shadow-sm sm:text-sm focus:border-primary border-gray-300"
                />
                <span className="text-error">{error.description[0]?.message}</span>
              </div>

              <div className="col-span-2">
                <div className="flex gap-5">
                  <div>
                    <h4 className="text-xs font-base mb-2 text-primary  tracking-wide leading-4  font-light">
                      Abbreviation
                      <span className="text-error">*</span>
                    </h4>
                    <input
                      type="text"
                      name="version_abbreviated"
                      id="version_abbreviated"
                      value={newProjectFields.abbreviation}
                      onChange={(e) => {
                        setNewProjectFields({ ...newProjectFields, abbreviation: e.target.value });
                      }}
                      className="bg-white w-24 block rounded  sm:text-sm focus:border-primary border-gray-300"
                    />
                    <span className="text-error">{error.abbr[0]?.message || error.abbr[1]?.message}</span>
                  </div>
                </div>
                <div className="flex gap-5 mt-5 items-center">
                  <div>
                    <div className="absolute">
                      <TargetLanguageTag>
                        {language.scriptDirection ? language.scriptDirection : 'LTR'}
                      </TargetLanguageTag>
                    </div>
                    <h4 className="text-xs font-base mb-2 text-primary  tracking-wide leading-4  font-light">
                      Target Language
                      <span className="text-error">*</span>
                    </h4>
                    <CustomList
                      selected={language}
                      setSelected={setLanguage}
                      options={languages}
                      show
                    />
                  </div>
                  <div className="mt-5">
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
                        aria-label="create"
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
                        aria-label="cancel-edit-project"
                        className="w-40 h-10  bg-error leading-loose rounded shadow text-xs font-base  text-white tracking-wide  font-light uppercase"
                        onClick={() => closeEdit()}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        aria-label="save-edit-project"
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
      <ConfirmationModal
        openModal={openModal}
        title="Update Burrito"
        setOpenModal={setOpenModal}
        confirmMessage={`Update the the burrito from ${metadata?.meta?.version} to ${burrito?.meta?.version}`}
        buttonName="Update"
        closeModal={() => updateBurritoVersion()}
      />
    </ProjectsLayout>
  );
}

TargetLanguageTag.propTypes = {
  children: PropTypes.string,
};
