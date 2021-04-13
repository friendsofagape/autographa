import React from 'react';
import Sync from './Sync';
import parseFetchProjects from '../../core/projects/parseFetchProjects';

const List = () => {
  const [projects, setProjects] = React.useState([]);
  const projectList = [];
  React.useEffect(() => {
    parseFetchProjects()
    .then((res) => {
      res.forEach((project) => {
        console.log('projects', project.get('projectName'), project.get('canoncontent').length);
        // eslint-disable-next-line prefer-const
        let file = [];
        // const count = project.get('canoncontent').length;
        project.get('canoncontent').forEach((val, i) => {
          file.push({ filename: val, meta: project.get(`file${i + 1}`) });
        });
        console.log('file', file);
        projectList.push({ project: project.get('projectName'), files: file });
      });
    }).finally(() => {
      setProjects(projectList);
    });
  }, []);
  return (
    <div>
      <Sync projects={projects} />
    </div>
  );
};

export default List;
