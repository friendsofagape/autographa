/* eslint-disable no-console */
import React from 'react';
import PropTypes from 'prop-types';
import * as localforage from 'localforage';
import { useRouter } from 'next/router';
import { isElectron } from '../../core/handleElectron';
import * as logger from '../../logger';
import saveProjectsMeta from '../../core/projects/saveProjetcsMeta';

const path = require('path');
const advanceSettings = require('../../lib/AdvanceSettings.json');

export const ProjectContext = React.createContext();

const ProjectContextProvider = ({ children }) => {
  const router = useRouter();
    const [drawer, setDrawer] = React.useState(false);
    const [scrollLock, setScrollLock] = React.useState(false);
    // const []
    const [sideTabTitle, setSideTabTitle] = React.useState('New');
    const [languages, setLanguages] = React.useState(advanceSettings.languages);
    const [language, setLanguage] = React.useState(advanceSettings.languages[0]);
    const [selectedVersion, setSelectedVersion] = React.useState('');
    const [version, setVersion] = React.useState({
      name: '',
      abbreviation: '',
    });
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
    const [newProjectFields, setNewProjectFields] = React.useState({
      projectName: '',
      description: '',
    });
    const [username, setUsername] = React.useState('Michael');
    const [selectedProject, setSelectedProject] = React.useState('newprodir');

    const handleProjectFields = (prop) => (event) => {
      setNewProjectFields({ ...newProjectFields, [prop]: event.target.value });
    };

    const uniqueId = (list, id) => list.some((obj) => obj.id === id);
    const loadSettings = async () => {
      const newpath = localStorage.getItem('userPath');
      let currentUser;
      await localforage.getItem('userProfile').then((value) => {
        currentUser = value?.username;
      });
      if (!currentUser) {
        return;
      }
      const fs = window.require('fs');
      const file = path.join(newpath, 'autographa', 'users', currentUser, 'usersetting.json');
      if (fs.existsSync(file)) {
        fs.readFile(file, (err, data) => {
          logger.debug('ProjectContext.js', 'Successfully read the data from file');
          const json = JSON.parse(data);
          // (json.currentSetting).push(currentSetting);
          setCanonList(json.canonSpecification
            ? (advanceSettings.canonSpecification).concat(json.canonSpecification)
            : advanceSettings.canonSpecification);
          setLicenseList(json.copyright
            ? (advanceSettings.copyright).concat(json.copyright)
            : advanceSettings.copyright);
          setLanguages(json.languages
            ? (advanceSettings.languages).concat(json.languages)
            : advanceSettings.languages);
        });
      } else {
        setCanonList(advanceSettings.canonSpecification);
        setLicenseList(advanceSettings.copyright);
        setLanguages(advanceSettings.languages);
        const json = { canonSpecification: [], copyright: [], languages: [] };
        fs.writeFileSync(file, JSON.stringify(json));
      }
    };
    // Json for storing advance settings
    // eslint-disable-next-line no-unused-vars
    const updateJson = async (currentSettings) => {
      const newpath = localStorage.getItem('userPath');
      let currentUser;
      await localforage.getItem('userProfile').then((value) => {
        currentUser = value.username;
      });
      const fs = window.require('fs');
      const file = path.join(newpath, 'autographa', 'users', currentUser, 'usersetting.json');
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
            if (json[currentSettings] && uniqueId(json[currentSettings], currentSetting.id)) {
              (json[currentSettings]).forEach((setting) => {
                if (setting.id === currentSetting.id) {
                  const keys = Object.keys(setting);
                  keys.forEach((key) => {
                    // eslint-disable-next-line no-param-reassign
                    setting[key] = currentSetting[key];
                  });
                }
              });
            } else {
              // updating the canon
              (json[currentSettings]).push(currentSetting);
            }
            logger.debug('ProjectContext.js', 'Upadting the settings in existing file');
            fs.writeFileSync(file, JSON.stringify(json));
            logger.debug('ProjectContext.js', 'Loading new settings from file');
            loadSettings();
          }
        });
      }
    };
    const createProject = async () => {
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
      // Add / update canon into current list.
      if (uniqueId(canonList, canonSpecification.id)) {
        canonList.forEach((canon) => {
          if (canon.id === canonSpecification.id) {
            if (canon.title !== canonSpecification.title
              || canon.currentScope !== canonSpecification.currentScope) {
              updateJson('canonSpecification');
            }
          }
        });
      } else {
        updateJson('canonSpecification');
      }
      // Add / update licence into current list.
      if (uniqueId(licenceList, copyright.id)) {
        licenceList.forEach((licence) => {
          if (licence.id === copyright.id) {
            if (licence.title !== copyright.title
              || licence.licence !== copyright.licence) {
              updateJson('copyright');
            }
          }
        });
      } else {
        updateJson('copyright');
      }
      const status = await saveProjectsMeta(
        newProjectFields,
        version,
        language,
        versificationScheme.title,
        canonSpecification,
        copyright,
      );
      if (status[0].type === 'success') {
        router.push('/projects');
      }
    };
    const resetProjectStates = () => {
      const initialState = {
        language: '',
        projectName: '',
        scriptDirection: 'LTR',
      };
        setNewProjectFields({ ...initialState });
        setSelectedVersion('');
        setCopyRight();
        setcanonSpecification('OT');
        setVersificationScheme('kjv');
    };
    React.useEffect(() => {
      if (isElectron()) {
        loadSettings();
      }
    }, []);
    const context = {
        states: {
            newProjectFields,
            drawer,
            selectedVersion,
            copyright,
            canonSpecification,
            versification,
            versificationScheme,
            sideTabTitle,
            selectedProject,
            canonList,
            licenceList,
            version,
            languages,
            language,
            scrollLock,
            username,
        },
        actions: {
            setDrawer,
            setSelectedVersion,
            setCopyRight,
            setcanonSpecification,
            setVersificationScheme,
            handleProjectFields,
            resetProjectStates,
            setSideTabTitle,
            setSelectedProject,
            setVersion,
            createProject,
            setLanguage,
            setScrollLock,
            setUsername,
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
