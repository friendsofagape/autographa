import React, { useContext } from 'react';
import dynamic from 'next/dynamic';
import { ReferenceContext } from '@/components/context/ReferenceContext';
import SectionPlaceholder1 from './SectionPlaceholder1';
import SectionPlaceholder2 from './SectionPlaceholder2';

const UsfmEditor = dynamic(
  () => import('@/components/EditorPage/UsfmEditor/UsfmEditor'),
  { ssr: false },
);
const SectionContainer = () => {
  const {
    state: {
      layout,
    },
  } = useContext(ReferenceContext);
  return (
    <div className={`grid grid-cols-${layout + 1} h-editor`}>
      <SectionPlaceholder1 />
      <SectionPlaceholder2 />
      <div className="m-3 ml-0 border-b-2 border-secondary rounded-md shadow overflow-hidden">
        <UsfmEditor />
      </div>
    </div>
  );
};

export default SectionContainer;
