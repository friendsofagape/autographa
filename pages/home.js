import BibleNavigation from '@/modules/biblenavigation/BibleNavigation';
import dynamic from 'next/dynamic';
import Meta from '../renderer/src/Meta';

const DynamicComponentWithNoSSR = dynamic(
  () => import('../renderer/src/components/EditorPage/Navigation/BibleNavigationInit'),
  { ssr: false },
);

const home = () => (
  <div>
    <Meta />
    <BibleNavigation />
    <DynamicComponentWithNoSSR />
  </div>
);

export default home;
