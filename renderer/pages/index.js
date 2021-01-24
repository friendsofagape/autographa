import Home from '../src/components/Home';
import Meta from '../src/Meta';
import AuthenticationContextProvider from '../src/components/Login/AuthenticationContextProvider';

const index = () => (
  <div>
    <Meta />
    <AuthenticationContextProvider>
      <Home />
    </AuthenticationContextProvider>
  </div>
);

export default index;
