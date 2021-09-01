import React, { useContext, useEffect } from 'react';
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
          openResource1,
          openResource2,
          openResource3,
          openResource4,
        },
        actions: {
          setLayout,
        },
      } = useContext(ReferenceContext);

    useEffect(() => {
      if ((openResource1 === true && openResource2 === true
        && openResource3 === true && openResource4 === true)) {
          if (layout === 1) {
            setLayout(0);
          }
        }
    });

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
