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
    <>
      <SectionPlaceholder1 />
      <SectionPlaceholder2 />
      <div className="bg-white border-b-2 border-secondary rounded-md shadow overflow-hidden">
        <UsfmEditor />
      </div>
    </>
  );
};

export default SectionContainer;
