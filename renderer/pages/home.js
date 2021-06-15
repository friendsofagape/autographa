import ProjectContextProvider from '@/components/context/ProjectContext';
import ReferenceContextProvider from '@/components/context/ReferenceContext';
import EditorLayout from '@/layouts/editor/Layout';
import BibleNavigation from '@/modules/biblenavigation/BibleNavigation';
import EditorSectionSmall from '@/modules/projects/SmallEditorSection';
import dynamic from 'next/dynamic';
import Meta from '../src/Meta';

const TranslationHelps = dynamic(
  () => import('../src/components/EditorPage/Reference/TranslationHelps'),
  { ssr: false },
);
const UsfmEditor = dynamic(
  () => import('@/components/EditorPage/UsfmEditor/UsfmEditor'),
  { ssr: false },
);

const home = () => (
  <div>
    <Meta />
    <ProjectContextProvider>
      <ReferenceContextProvider>
        <EditorLayout>
          <BibleNavigation />
          {/* <TranslationHelps /> */}
          <EditorSectionSmall />
          <UsfmEditor />
        </EditorLayout>
      </ReferenceContextProvider>
    </ProjectContextProvider>

    {/* <DynamicComponentWithNoSSR /> */}
  </div>
);

export default home;
