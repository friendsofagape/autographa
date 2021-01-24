import Home from '../src/Home';
import Meta from '../src/Meta';
import AuthenticationContextProvider from '../src/components/Login/AuthenticationContextProvider';

const index = () => (
  <>
    <Meta />
    <AuthenticationContextProvider>
      <Home />
    </AuthenticationContextProvider>
  </>
);

export default index;
