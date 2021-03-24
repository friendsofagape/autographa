import React from 'react';
import PropTypes from 'prop-types';
import { OT } from '../../../lib/CanonSpecification';

export const ProjectContext = React.createContext();

const ProjectContextProvider = ({ children }) => {
    const [drawer, setDrawer] = React.useState(false);
    const [sideTabTitle, setSideTabTitle] = React.useState('Profile');
    const [selectedVersion, setSelectedVersion] = React.useState('');
    const [license, setLicense] = React.useState();
    const [canonSpecification, setcanonSpecification] = React.useState('OT');
    const [content, setContent] = React.useState([OT]);
    const [versificationScheme, setVersificationScheme] = React.useState('kjv');
    const [newProjectFields, setNewProjectFields] = React.useState({
      language: '',
      projectName: '',
      scriptDirection: 'LTR',
    });

    const handleProjectFields = (prop) => (event) => {
      setNewProjectFields({ ...newProjectFields, [prop]: event.target.value });
    };

    const resetProjectStates = () => {
      const initialState = {
        language: '',
        projectName: '',
        scriptDirection: 'LTR',
      };
        setNewProjectFields({ ...initialState });
        setSelectedVersion('');
        setLicense();
        setcanonSpecification('OT');
        setContent([OT]);
        setVersificationScheme('kjv');
    };

    const context = {
        states: {
            newProjectFields,
            drawer,
            selectedVersion,
            license,
            canonSpecification,
            content,
            versificationScheme,
            sideTabTitle,
        },
        actions: {
            setDrawer,
            setSelectedVersion,
            setLicense,
            setcanonSpecification,
            setContent,
            setVersificationScheme,
            handleProjectFields,
            resetProjectStates,
            setSideTabTitle,
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
