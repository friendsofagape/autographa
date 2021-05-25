const nodeExternals = require('webpack-node-externals');

module.exports = {

  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      // eslint-disable-next-line no-param-reassign
      config.resolve.fallback.fs = false;
    }
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    });
    config.module.rules.push({
      test: /\.svg$/,
      use: [{
        loader: '@svgr/webpack',
        options: {
          svgoConfig: {
            plugins: [{
              removeViewBox: false,
            },
            { removeDimensions: true },
            {
              removeAttrs: {
                attrs: ['fill'],
              },
            }],
          },
        },
      },
      ],
    });

    return config;
  },
  externals: [nodeExternals()],
  target: 'serverless',
  future: {
    webpack5: true,
  },
  fallback: {
    fs: false,
  },
};
