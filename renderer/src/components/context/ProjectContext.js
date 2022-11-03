/* eslint-disable react/jsx-no-constructed-context-values */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import * as localforage from 'localforage';
import { isElectron } from '../../core/handleElectron';
import * as logger from '../../logger';
import saveProjectsMeta from '../../core/projects/saveProjetcsMeta';
import { environment } from '../../../environment';

const path = require('path');
const advanceSettings = require('../../lib/AdvanceSettings.json');

export const ProjectContext = React.createContext();

const ProjectContextProvider = ({ children }) => {
    const [editorSave, setEditorSave] = React.useState('');
    const [drawer, setDrawer] = React.useState(false);
    const [scrollLock, setScrollLock] = React.useState(false);
    const [sideTabTitle, setSideTabTitle] = React.useState('New');
    const [languages, setLanguages] = React.useState(advanceSettings.languages);
    const [language, setLanguage] = React.useState(advanceSettings.languages[0]);
    const [licenceList, setLicenseList] = React.useState(advanceSettings.copyright);
    const [copyright, setCopyRight] = React.useState(advanceSettings.copyright[0]);
    const [canonList, setCanonList] = React.useState(advanceSettings.canonSpecification);
    const [canonSpecification, setcanonSpecification] = React.useState(
      advanceSettings.canonSpecification[0],
    );
    const [versification] = React.useState(advanceSettings.versification);
    const [versificationScheme, setVersificationScheme] = React.useState(
      advanceSettings.versification[0],
    );
    const [openSideBar, setOpenSideBar] = React.useState(false);
    const [newProjectFields, setNewProjectFields] = React.useState({
      projectName: '',
      description: '',
      abbreviation: '',
    });
    const [username, setUsername] = React.useState();
    const [selectedProject, setSelectedProject] = React.useState();
    const [importedFiles, setImportedFiles] = React.useState([]);
    const [sideBarTab,setSideBarTab] = useState('')

    const handleProjectFields = (prop) => (event) => {
      setNewProjectFields({ ...newProjectFields, [prop]: event.target.value });
    };

    const uniqueId = (list, id) => list.some((obj) => obj.id === id);

    const createSettingJson = (fs, file) => {
      logger.debug('ProjectContext.js', 'Loading data from AdvanceSetting.json file');
      setCanonList(advanceSettings.canonSpecification);
      setLicenseList((advanceSettings.copyright).push({
        id: 'Other', title: 'Custom', licence: '', locked: false,
      }));
      setLanguages(advanceSettings.languages);
      const json = {
        version: environment.AG_USER_SETTING_VERSION,
        history: {
          copyright: [{
            id: 'Other', title: 'Custom', licence: '', locked: false,
          }],
          languages: [],
          textTranslation: {
            canonSpecification: [{
            id: 4, title: 'Other', currentScope: [], locked: false,
            }],
          },
        },
        appLanguage: 'en',
        theme: 'light',
        userWorkspaceLocation: '',
        commonWorkspaceLocation: '',
        resources: {
          door43: {
            translationNotes: [],
            translationQuestions: [],
            translationWords: [],
            obsTranslationNotes: [],
          },
        },
        sync: { services: { door43: [] } },
      };
      logger.debug('ProjectContext.js', 'Creating a ag-user-settings.json file');
      fs.writeFileSync(file, JSON.stringify(json));
    };

    const loadSettings = async () => {
      logger.debug('ProjectContext.js', 'In loadSettings');
      const newpath = localStorage.getItem('userPath');
      let currentUser;
      await localforage.getItem('userProfile').then((value) => {
        currentUser = value?.username;
        setUsername(currentUser);
      });
      if (!currentUser) {
        logger.error('ProjectContext.js', 'Unable to find current user');
        return;
      }
      const fs = window.require('fs');
      const file = path.join(newpath, 'autographa', 'users', currentUser, 'ag-user-settings.json');
      if (fs.existsSync(file)) {
        fs.readFile(file, (err, data) => {
          logger.debug('ProjectContext.js', 'Successfully read the data from file');
          const json = JSON.parse(data);
          if (json.version === environment.AG_USER_SETTING_VERSION) {
            // Checking whether any custom copyright id available (as expected else will
            // create a new one) or not
            if (json.history?.copyright) {
              if (json.history?.copyright?.licence) {
                setLicenseList((advanceSettings.copyright)
                  .concat(json.history?.copyright));
              } else {
                const newObj = (advanceSettings.copyright).filter((item) => item.Id !== 'Other');
                newObj.push({
                  id: 'Other', title: 'Custom', licence: '', locked: false,
                });
                setLicenseList(newObj);
              }
            } else {
              setLicenseList(advanceSettings.copyright);
            }
            setCanonList(json.history?.textTranslation.canonSpecification
              ? (advanceSettings.canonSpecification)
              .concat(json.history?.textTranslation.canonSpecification)
              : advanceSettings.canonSpecification);
            setLanguages(json.history?.languages
              ? (advanceSettings.languages)
              .concat(json.history?.languages)
              : advanceSettings.languages);
          } else {
            createSettingJson(fs, file);
          }
        });
      } else {
        createSettingJson(fs, file);
      }
    };
    // Json for storing advance settings
    const updateJson = async (currentSettings) => {
      logger.debug('ProjectContext.js', 'In updateJson');
      const newpath = localStorage.getItem('userPath');
      let currentUser;
      await localforage.getItem('userProfile').then((value) => {
        currentUser = value.username;
        setUsername(value.username);
      });
      const fs = window.require('fs');
      const file = path.join(newpath, 'autographa', 'users', currentUser, 'ag-user-settings.json');
      if (fs.existsSync(file)) {
        fs.readFile(file, 'utf8', (err, data) => {
          if (err) {
            logger.error('ProjectContext.js', 'Failed to read the data from file');
          } else {
            logger.debug('ProjectContext.js', 'Successfully read the data from file');
            const json = JSON.parse(data);
            // eslint-disable-next-line no-nested-ternary
            const currentSetting = (currentSettings === 'copyright' ? copyright
            : (currentSettings === 'languages' ? language : canonSpecification));
            if (currentSettings === 'canonSpecification') {
              (json.history?.textTranslation[currentSettings])?.push(currentSetting);
            } else if (json.history[currentSettings]
                && uniqueId(json.history[currentSettings], currentSetting.id)) {
                (json.history[currentSettings]).forEach((setting) => {
                  if (setting.id === currentSetting.id) {
                    const keys = Object.keys(setting);
                    keys.forEach((key) => {
                      setting[key] = currentSetting[key];
                    });
                  }
                });
              } else {
                // updating the canon
                (json.history[currentSettings]).push(currentSetting);
              }
            json.version = environment.AG_USER_SETTING_VERSION;
            json.sync.services.door43 = json?.sync?.services?.door43 ? json?.sync?.services?.door43 : [];
            logger.debug('ProjectContext.js', 'Upadting the settings in existing file');
            fs.writeFileSync(file, JSON.stringify(json));
            logger.debug('ProjectContext.js', 'Loading new settings from file');
            loadSettings();
          }
        });
      }
    };

    // common functions for create projects
    const createProjectCommonUtils = async () => {
      logger.debug('ProjectContext.js', 'In createProject common utils');
      // Add / update language into current list.
      if (uniqueId(languages, language.id)) {
        languages.forEach((lang) => {
          if (lang.id === language.id) {
            if (lang.title !== language.title
              || lang.scriptDirection !== language.scriptDirection) {
              updateJson('languages');
            }
          }
        });
      } else {
        updateJson('languages');
      }
      // Update Custom licence into current list.
      if (copyright.title === 'Custom') {
        updateJson('copyright');
      } else {
        const myLicence = Array.isArray(licenceList) ? licenceList.find((item) => item.title === copyright.title) : [];
        // eslint-disable-next-line import/no-dynamic-require
        const licensefile = require(`../../lib/license/${copyright.title}.md`);
        myLicence.licence = licensefile.default;
        setCopyRight(myLicence);
      }
    };

    // common functions for create projects
    const createProjectTranslationUtils = async () => {
      logger.debug('ProjectContext.js', 'In createProject Translation utils');
      // Update Custom canon into current list.
      if (canonSpecification.title === 'Other') {
        updateJson('canonSpecification');
      }
    };

    const createProject = async (call, project, update, projectType) => {
      logger.debug('ProjectContext.js', 'In createProject');
      createProjectCommonUtils();
      // common props pass for all project type
      const projectMetaObj = {
        newProjectFields,
        language,
        copyright,
        importedFiles,
        call,
        project,
        update,
        projectType,
      };
      if (projectType !== 'OBS') {
        createProjectTranslationUtils();
        const temp_obj = {
          versificationScheme: versificationScheme.title,
          canonSpecification,
        };
        Object.assign(projectMetaObj, temp_obj);
      }
      logger.debug('ProjectContext.js', 'Calling saveProjectsMeta with required props');
      const status = await saveProjectsMeta(projectMetaObj);
      return status;
    };

    const resetProjectStates = () => {
      const initialState = {
        language: '',
        projectName: '',
        scriptDirection: 'LTR',
      };
        setNewProjectFields({ ...initialState });
        setCopyRight();
        setcanonSpecification('OT');
        setVersificationScheme('kjv');
    };

    React.useEffect(() => {
      if (isElectron()) {
        loadSettings();
        localforage.getItem('userProfile').then((value) => {
          setUsername(value?.username);
        });
          localforage.getItem('currentProject').then((projectName) => {
            setSelectedProject(projectName);
          });
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const context = {
        states: {
            newProjectFields,
            drawer,
            copyright,
            canonSpecification,
            versification,
            versificationScheme,
            sideTabTitle,
            selectedProject,
            canonList,
            licenceList,
            languages,
            language,
            scrollLock,
            username,
            openSideBar,
            editorSave,
            sideBarTab,
        },
        actions: {
            setDrawer,
            setCopyRight,
            setcanonSpecification,
            setVersificationScheme,
            handleProjectFields,
            resetProjectStates,
            setSideTabTitle,
            setSelectedProject,
            createProject,
            setLanguage,
            setScrollLock,
            setUsername,
            setOpenSideBar,
            setNewProjectFields,
            setImportedFiles,
            setLanguages,
            setEditorSave,
            setSideBarTab,
        },
    };

    return (
      <ProjectContext.Provider value={context}>
        {children}
      </ProjectContext.Provider>
    );
};
export default ProjectContextProvider;
ProjectContextProvider.propTypes = {
  children: PropTypes.node,
};
