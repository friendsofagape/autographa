import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import localforage from 'localforage';
import SectionPlaceholder1 from './SectionPlaceholder1';
import SectionPlaceholder2 from './SectionPlaceholder2';
import ObsEditor from '@/components/EditorPage/ObsEditor/ObsEditor';

const UsfmEditor = dynamic(
  () => import('@/components/EditorPage/UsfmEditor/UsfmEditor'),
  { ssr: false },
);
const SectionContainer = () => {
  const [editor, setEditor] = useState();
  useEffect(() => {
    localforage.getItem('userProfile').then((value) => {
      const username = value?.username;
      localforage.getItem('currentProject').then((projectName) => {
        const path = require('path');
        const fs = window.require('fs');
        const newpath = localStorage.getItem('userPath');
        const metaPath = path.join(
          newpath, 'autographa', 'users', username, 'projects', projectName, 'metadata.json',
        );
        const data = fs.readFileSync(metaPath, 'utf-8');
        const metadata = JSON.parse(data);
        setEditor(metadata.type.flavorType.flavor.name);
      });
    });
  });
  return (
    <div className="grid grid-flow-col auto-cols-fr m-3 gap-2">
      <SectionPlaceholder1 />
      <SectionPlaceholder2 />
      {(editor === 'textTranslation' && <UsfmEditor />)
      || (editor === 'textStories' && <ObsEditor />)}
    </div>
  );
};
export default SectionContainer;
