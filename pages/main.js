import { initializeParse } from '@parse/react-ssr';
import { environment } from '../renderer/environment';
import Main from '../renderer/src/components/main';

initializeParse(
  environment.SERVER_URL,
  environment.APPLICATION_ID,
  environment.MASTER_KEY,
);

const main = () => (
  <div>
    <Main />
  </div>
);

export default main;
