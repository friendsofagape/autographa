<<<<<<< HEAD
import ProjectContextProvider from '@/components/context/ProjectContext';
import ReferenceContextProvider from '@/components/context/ReferenceContext';
import BibleNavigation from '@/modules/biblenavigation/BibleNavigation';
import dynamic from 'next/dynamic';
import Meta from '../renderer/src/Meta';

const TranslationHelps = dynamic(
  () => import('../renderer/src/components/EditorPage/Reference/TranslationHelps'),
  { ssr: false },
);
const UsfmEditor = dynamic(
  () => import('@/components/EditorPage/UsfmEditor/UsfmEditor'),
=======
import dynamic from 'next/dynamic';
import BibleNavigationInit from '../renderer/src/components/EditorPage/Navigation/BibleNavigationInit';
import Meta from '../renderer/src/Meta';

const DynamicComponentWithNoSSR = dynamic(
  () => import('../renderer/src/components/EditorPage/Navigation/BibleNavigationInit'),
>>>>>>> efc9f6e... code for basic translation helps feature with navigation
  { ssr: false },
);

const home = () => (
  <div>
<<<<<<< HEAD
    <Meta />
    <ProjectContextProvider>
      <ReferenceContextProvider>
        <TranslationHelps />
        <UsfmEditor />
        <BibleNavigation />
      </ReferenceContextProvider>
    </ProjectContextProvider>

    {/* <DynamicComponentWithNoSSR /> */}
=======
    <DynamicComponentWithNoSSR />
>>>>>>> efc9f6e... code for basic translation helps feature with navigation
  </div>
);

export default home;
