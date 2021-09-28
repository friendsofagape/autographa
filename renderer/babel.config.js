const { dependencies } = require('../package.json');

module.exports = {
  presets: [
    [
      'next/babel',
      {
        'preset-env': {
          targets: {
            electron: dependencies.electronite.replace(/^\^|~/, ''),
          },
        },
      },
    ],
  ],
};
