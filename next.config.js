const nodeExternals = require('webpack-node-externals');
const withTM = require('next-transpile-modules')(['usfm-editor']);
const path = require('path');

module.exports = withTM({
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    });
    config.module.rules.push({
      include: path.resolve(__dirname, 'node_modules/canvas'),
      use: 'null-loader',
    });
    config.module.rules.push({
      include: path.resolve(__dirname, 'node_modules/canvas'),
      use: 'null-loader',
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
  images: {
    // limit of 25 deviceSizes values
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // limit of 25 imageSizes values
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // limit of 50 domains values
    domains: [],
    path: '',
    // loader can be 'default', 'imgix', 'cloudinary', 'akamai', or 'custom'
    loader: 'akamai',
    // minimumCacheTTL is in seconds, must be integer 0 or more
    minimumCacheTTL: 60,
  },
  webpack5: true,
  externals: [nodeExternals()],
});
