import { IntlProvider } from 'react-intl';
import React from 'react';

const enTranslationData = require('../../translations/en.json');

function intl(component) {
  return (
    <IntlProvider locale="en" messages={enTranslationData}>
      {React.cloneElement(component)}
    </IntlProvider>
  );
}

export default intl;
