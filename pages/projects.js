import Projects from '../renderer/src/components/Modules/Projects/Projects';
import AuthenticationContextProvider from '../renderer/src/components/Login/AuthenticationContextProvider';

const projects = () => (
  <AuthenticationContextProvider>
    <Projects />
  </AuthenticationContextProvider>
);

export default projects;
