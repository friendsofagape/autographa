import React, { useContext } from 'react';
import dynamic from 'next/dynamic';
import SectionPlaceholder1 from './SectionPlaceholder1';
import SectionPlaceholder2 from './SectionPlaceholder2';
import { ReferenceContext } from '@/components/context/ReferenceContext';

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
    <div className="bg-white ml-1 mr-1 border-b-2 border-secondary rounded-md shadow overflow-hidden">
      <UsfmEditor />
    </div>
  </div>
  );
};
export default SectionContainer;
