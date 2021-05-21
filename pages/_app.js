/* eslint-disable react/prop-types */
import NProgress from 'nprogress';
import Router from 'next/router';
import '../styles/nprogress.css';
import '../styles/globals.css';
import { initializeParse } from '@parse/react-ssr';
import { environment } from '../renderer/environment';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

initializeParse(
  environment.SERVER_URL,
  environment.APPLICATION_ID,
  environment.MASTER_KEY,
);

function Autographa({ Component, pageProps }) {
  return (
    <Component {...pageProps} />
  );
}

export default Autographa;
