import ProjectContextProvider from '@/components/context/ProjectContext';
import ReferenceContextProvider from '@/components/context/ReferenceContext';
import EditorLayout from '@/layouts/editor/Layout';
import BibleNavigation from '@/modules/biblenavigation/BibleNavigation';
import dynamic from 'next/dynamic';
import Meta from '../renderer/src/Meta';

const TranslationHelps = dynamic(
  () => import('../renderer/src/components/EditorPage/Reference/TranslationHelps'),
  { ssr: false },
);
// const UsfmEditor = dynamic(
//   () => import('@/components/EditorPage/UsfmEditor/UsfmEditor'),
//   { ssr: false },
// );

const home = () => (
  <div>
    <Meta />
    <ProjectContextProvider>
      <ReferenceContextProvider>
        <EditorLayout>
          <BibleNavigation />
          <TranslationHelps />
          {/* <UsfmEditor /> */}
        </EditorLayout>
      </ReferenceContextProvider>
    </ProjectContextProvider>

    {/* <DynamicComponentWithNoSSR /> */}
  </div>
);

export default home;
