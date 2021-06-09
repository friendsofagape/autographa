import React from 'react';
import PropTypes from 'prop-types';
import { OT } from '../../lib/CanonSpecification';
import * as logger from '../../logger';

const path = require('path');
const advanceSettings = require('../../lib/AdvanceSettings.json');

export const ProjectContext = React.createContext();

const ProjectContextProvider = ({ children }) => {
  console.log(advanceSettings, advanceSettings.canonSpecification, advanceSettings.copyright);
  const newpath = localStorage.getItem('userPath');
  const fs = window.require('fs');
  const file = path.join(newpath, 'autographa', 'users', 'username', 'usersetting.json');
    const [drawer, setDrawer] = React.useState(false);
    const [sideTabTitle, setSideTabTitle] = React.useState('New');
    const [canonList, setCanonList] = React.useState();
    const [licenceList, setLicenseList] = React.useState();
    const [selectedVersion, setSelectedVersion] = React.useState('');
    const [version, setVersion] = React.useState({
      name: '',
      abbreviation: '',
    });
    const [copyright, setCopyRight] = React.useState({
      id: 'custom',
      title: '',
      licence: '',
    });
    const [canonSpecification, setcanonSpecification] = React.useState({
      title: '',
      currentScope: [],
    });
    const [content, setContent] = React.useState([OT]);
    const [versificationScheme, setVersificationScheme] = React.useState('kjv');
    const [newProjectFields, setNewProjectFields] = React.useState({
      language: '',
      projectName: '',
      scriptDirection: 'LTR',
      description: '',
    });

    const [selectedProject, setSelectedProject] = React.useState('newprodir');

    const handleProjectFields = (prop) => (event) => {
      setNewProjectFields({ ...newProjectFields, [prop]: event.target.value });
    };
    const uniqueSetting = (list, title) => list.some((obj) => obj.title === title);
    const loadSettings = () => {
      if (fs.existsSync(file)) {
        fs.readFile((file, data) => {
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
    const updateJson = (currentSetting) => {
      if (fs.existsSync(file)) {
        // fs.mkdirSync(file);
        fs.readFile(file, 'utf8', (err, data) => {
          if (err) {
            logger.error('ProjectContext.js', 'Failed to read the data from file');
          } else {
            logger.debug('ProjectContext.js', 'Successfully read the data from file');
            const json = JSON.parse(data);
            if (uniqueSetting(json.currentSetting, currentSetting.title)) {
              (json.currentSetting).forEach((setting) => {
                if (setting.title === currentSetting.title) {
                  const keys = Object.keys(setting);
                  keys.forEach((key) => {
                    // eslint-disable-next-line no-param-reassign
                    setting[key] = currentSetting[key];
                  });
                }
              });
            } else {
              (json.currentSetting).push(currentSetting);
            }
            logger.debug('ProjectContext.js', 'Upadting the settings in existing file');
            console.log('pushing to file', json);
            // fs.writeFileSync(file, JSON.stringify(json));
            logger.debug('ProjectContext.js', 'Loading new settings from file');
            loadSettings();
          }
        });
      } else {
        const json = {
          canonSpecification: [
            {
              title: (currentSetting === 'canonSpecification' ? canonSpecification.title : ''),
              currentScope: (currentSetting === 'canonSpecification' ? canonSpecification.currentScope : []),
            },
          ],
          copyright: [
            {
              id: 'custom',
              title: (currentSetting === 'copyright' ? copyright.title : ''),
              licence: (currentSetting === 'copyright' ? copyright.licence : ''),
            },
          ],
        };
        fs.writeFileSync(file, JSON.stringify(json));
      }
    };
    const createProject = () => {
      if (!uniqueSetting(canonList, canonSpecification.title)) {
        updateJson('canonSpecification');
      }
      if (!uniqueSetting(licenceList, copyright.title)) {
        updateJson('copyright');
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
        setContent([OT]);
        setVersificationScheme('kjv');
    };

    const context = {
        states: {
            newProjectFields,
            drawer,
            selectedVersion,
            copyright,
            canonSpecification,
            content,
            versificationScheme,
            sideTabTitle,
            selectedProject,
            canonList,
            licenceList,
            version,
        },
        actions: {
            setDrawer,
            setSelectedVersion,
            setCopyRight,
            setcanonSpecification,
            setContent,
            setVersificationScheme,
            handleProjectFields,
            resetProjectStates,
            setSideTabTitle,
            setSelectedProject,
            setVersion,
            createProject,
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
