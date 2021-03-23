import React from 'react';
import PropTypes from 'prop-types';
import { OT } from '../../../lib/CanonSpecification';

export const ProjectContext = React.createContext();

const ProjectContextProvider = ({ children }) => {
    const [biblename, setBiblename] = React.useState('');
    const [drawer, setDrawer] = React.useState(false);
    const [language, setLanguage] = React.useState('');
    const [projectName, setProjectName] = React.useState('');
    const [selectedVersion, setSelectedVersion] = React.useState('');
    const [scriptDirection, setScriptDirection] = React.useState('');
    const [license, setLicense] = React.useState();
    const [canonSpecification, setcanonSpecification] = React.useState('OT');
    const [content, setContent] = React.useState([OT]);
    const [versificationScheme, setVersificationScheme] = React.useState('kjv');

    const context = {
        states: {
            biblename,
            language,
            drawer,
            projectName,
            selectedVersion,
            scriptDirection,
            license,
            canonSpecification,
            content,
            versificationScheme,
        },
        actions: {
            setBiblename,
            setDrawer,
            setLanguage,
            setProjectName,
            setSelectedVersion,
            setScriptDirection,
            setLicense,
            setcanonSpecification,
            setContent,
            setVersificationScheme,
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
