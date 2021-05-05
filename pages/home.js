import dynamic from 'next/dynamic';
import BibleNavigationInit from '../renderer/src/components/EditorPage/Navigation/BibleNavigationInit';
import ReferenceContextProvider from '../renderer/src/components/context/ReferenceContext'

const DynamicComponentWithNoSSR = dynamic(
  () => import('../renderer/src/components/EditorPage/Navigation/BibleNavigationInit'),
  { ssr: false },
);

const home = () => (
  <div>
    <ReferenceContextProvider>
      <DynamicComponentWithNoSSR />
    </ReferenceContextProvider>
  </div>
);

export default home;
