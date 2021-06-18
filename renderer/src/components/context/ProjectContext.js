/* eslint-disable no-console */
import React from 'react';
import PropTypes from 'prop-types';
import { isElectron } from '../../core/handleElectron';
import * as logger from '../../logger';
import saveProjectsMeta from '../../core/projects/saveProjetcsMeta';

const path = require('path');
const advanceSettings = require('../../lib/AdvanceSettings.json');

export const ProjectContext = React.createContext();

const ProjectContextProvider = ({ children }) => {
    const [drawer, setDrawer] = React.useState(false);
    const [sideTabTitle, setSideTabTitle] = React.useState('New');
    const [languages] = React.useState(advanceSettings.languages);
    const [language, setLanguage] = React.useState({
      scriptDirection: 'LTR',
      language: advanceSettings.languages[0].title,
    });
    const [canonList, setCanonList] = React.useState();
    const [licenceList, setLicenseList] = React.useState();
    const [selectedVersion, setSelectedVersion] = React.useState('');
    const [version, setVersion] = React.useState({
      name: '',
      abbreviation: '',
    });
    const [copyright, setCopyRight] = React.useState(advanceSettings.copyright[0]);
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

    const [selectedProject, setSelectedProject] = React.useState('newprodir');

    const handleProjectFields = (prop) => (event) => {
      setNewProjectFields({ ...newProjectFields, [prop]: event.target.value });
    };
    const uniqueSetting = (list, title) => list.some((obj) => obj.title === title);
    const loadSettings = () => {
      const newpath = localStorage.getItem('userPath');
      const fs = window.require('fs');
      const file = path.join(newpath, 'autographa', 'users', 'username', 'usersetting.json');
      if (fs.existsSync(file)) {
        fs.readFile(file, (err, data) => {
          logger.debug('ProjectContext.js', 'Successfully read the data from file');
          const json = JSON.parse(data);
          // (json.currentSetting).push(currentSetting);
          setCanonList((advanceSettings.canonSpecification).concat(json.canonSpecification));
          setLicenseList((advanceSettings.copyright).concat(json.copyright));
        });
      } else {
        setCanonList(advanceSettings.canonSpecification);
        setLicenseList(advanceSettings.copyright);
      }
    };
    // Json for storing advance settings
    // eslint-disable-next-line no-unused-vars
    const updateJson = (currentSettings) => {
      const newpath = localStorage.getItem('userPath');
      const fs = window.require('fs');
      const file = path.join(newpath, 'autographa', 'users', 'username', 'usersetting.json');
      if (fs.existsSync(file)) {
        // fs.mkdirSync(file);
        fs.readFile(file, 'utf8', (err, data) => {
          if (err) {
            logger.error('ProjectContext.js', 'Failed to read the data from file');
          } else {
            logger.debug('ProjectContext.js', 'Successfully read the data from file');
            const json = JSON.parse(data);
            const currentSetting = (currentSettings === 'copyright' ? copyright : canonSpecification);
            console.log(json[currentSettings], currentSetting.title);
            if (uniqueSetting(json[currentSettings], currentSetting.title)) {
              (json[currentSettings]).forEach((setting) => {
                if (setting.title === currentSetting.title) {
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
            console.log('pushing to file', json);
            fs.writeFileSync(file, JSON.stringify(json));
            logger.debug('ProjectContext.js', 'Loading new settings from file');
            loadSettings();
          }
        });
      } else {
        const json = {
          canonSpecification: [
            {
              title: (currentSettings === 'canonSpecification' ? canonSpecification.title : ''),
              currentScope: (currentSettings === 'canonSpecification' ? canonSpecification.currentScope : []),
            },
          ],
          copyright: [
            {
              id: 'custom',
              title: (currentSettings === 'copyright' ? copyright.title : ''),
              licence: (currentSettings === 'copyright' ? copyright.licence : ''),
            },
          ],
        };
        fs.writeFileSync(file, JSON.stringify(json));
      }
    };
    const createProject = () => {
      console.log(canonList);
      if (!uniqueSetting(canonList, canonSpecification.title)) {
        updateJson('canonSpecification');
      }
      if (!uniqueSetting(licenceList, copyright.title)) {
        updateJson('copyright');
      }
      saveProjectsMeta(
        newProjectFields,
        version,
        language,
        versificationScheme.title,
        canonSpecification,
        copyright,
      );
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
