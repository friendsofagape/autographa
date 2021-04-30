/* eslint-disable react/prop-types */
import NProgress from 'nprogress';
import Router from 'next/router';
import '../styles/nprogress.css';
import '../styles/globals.css';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

function Autographa({ Component, pageProps }) {
  return (
    <Component {...pageProps} />
  );
}

export default Autographa;
