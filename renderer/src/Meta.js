import Head from 'next/head';
import i18n from './translations/i18n';

const Meta = () => (
  <Head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta charSet="utf-8" />
    {/* <link rel="shortcut icon" href="/static/favicon.png" /> */}
    <link rel="stylesheet" type="text/css" href="/static/nprogress.css" />
    <title>{i18n.t('app-name')}</title>
  </Head>
);
export default Meta;