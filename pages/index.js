import Meta from '../renderer/src/Meta';

const index = () => (
  <div>
    <Meta />
    {/* Commented for development purpose */}
    <meta httpEquiv="refresh" content="0;url=\login" />
    {/* <meta httpEquiv="refresh" content="0;url=http://127.0.1.1:4433/self-service/login/browser" /> */}
  </div>
);

export default index;
