import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import * as localforage from 'localforage';
import { useRouter } from 'next/router';
import { readRefMeta } from '../../core/reference/readRefMeta';
import { readRefBurrito } from '../../core/reference/readRefBurrito';
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
    const [openSideBar, setOpenSideBar] = React.useState(false);
    const [newProjectFields, setNewProjectFields] = React.useState({
      projectName: '',
      description: '',
    });
    const [username, setUsername] = React.useState('Asher');
    const [selectedProject, setSelectedProject] = React.useState('Test Burrito Project');

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
        const json = {
          canonSpecification: [{
          id: 4, title: 'Custom', currentScope: [], locked: false,
          }],
          copyright: [],
          languages: [],
        };
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
        setUsername(value.username);
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
      // Update Custom canon into current list.
      if (canonSpecification.title === 'Custom') {
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

    useEffect(() => {
      if (isElectron()) {
        const path = require('path');
        const newpath = localStorage.getItem('userPath');
        const projectsDir = path.join(
          newpath, 'autographa', 'users', username, 'reference',
        );
        const parseData = [];
        readRefMeta({
          projectsDir,
        }).then((refs) => {
          refs.forEach((ref) => {
            const metaPath = path.join(
              newpath, 'autographa', 'users', username, 'reference', ref, 'metadata.json',
            );
            readRefBurrito({
              metaPath,
            }).then((data) => {
              if (data) {
                const burrito = {};
                burrito.projectDir = ref;
                burrito.value = JSON.parse(data);
                parseData.push(burrito);
                localforage.setItem('refBibleBurrito', parseData).then(
                  () => localforage.getItem('refBibleBurrito'),
                ).catch((err) => {
                  // we got an error
                  throw err;
                });
              }
            });
          });
        });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
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
            openSideBar,
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
            setOpenSideBar,
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
