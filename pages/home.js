import dynamic from 'next/dynamic';
import BibleNavigationInit from '../renderer/src/components/EditorPage/Navigation/BibleNavigationInit';
import Meta from '../renderer/src/Meta';

const DynamicComponentWithNoSSR = dynamic(
  () => import('../renderer/src/components/EditorPage/Navigation/BibleNavigationInit'),
  { ssr: false },
);

const home = () => (
  <div>
    <DynamicComponentWithNoSSR />
  </div>
);

export default home;
