import ProjectContextProvider from '@/components/context/ProjectContext';
import dynamic from 'next/dynamic';
import ReferenceContextProvider from '../src/components/context/ReferenceContext';

const DynamicComponentWithNoSSR = dynamic(
  () => import('../src/components/EditorPage/Navigation/BibleNavigationInit'),
  { ssr: false },
);

const home = () => (
  <div>
    <ReferenceContextProvider>
      <ProjectContextProvider>
        <DynamicComponentWithNoSSR />
      </ProjectContextProvider>
    </ReferenceContextProvider>
  </div>
);

export default home;
