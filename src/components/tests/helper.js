
import { IntlProvider } from 'react-intl';
import React from 'react';

const enTranslationData = require('../../translations/en.json');

function intl(component, locale) {
  return (
    <IntlProvider
      locale={locale}
      messages={enTranslationData}
    >
      {React.cloneElement(component)}
    </IntlProvider>
  );
}

export default intl;