const { paths, when, whenDev, whenProd, whenTest, ESLINT_MODES, POSTCSS_MODES } = require("@craco/craco");
 
module.exports = {

    style: {
        
        modules: {
            localIdentName: "",
            
        },
       
        
          css: {
             options: { sourceMap: true }
          },
          sass: {
             options: { sourceMap: false }
          }
        // css: {
        //     loaderOptions: { /* Any css-loader configuration options: https://github.com/webpack-contrib/css-loader. */ },
        //     loaderOptions: (cssLoaderOptions, { env, paths }) => { return cssLoaderOptions; }
        // },
        // sass: {
        //     loaderOptions: { /* Any sass-loader configuration options: https://github.com/webpack-contrib/sass-loader. */ },
        //     loaderOptions: (sassLoaderOptions, { env, paths }) => { return sassLoaderOptions; }
        // },
        // postcss: {
        //     mode: "extends" /* (default value) */ || "file",
        //     plugins: [],
        //     env: {
        //         autoprefixer: { /* Any autoprefixer options: https://github.com/postcss/autoprefixer#options */ },
        //         stage: 3, /* Any valid stages: https://cssdb.org/#staging-process. */
        //         features: { /* Any CSS features: https://preset-env.cssdb.org/features. */ }
        //     },
        //     loaderOptions: { /* Any postcss-loader configuration options: https://github.com/postcss/postcss-loader. */ },
        //     loaderOptions: (postcssLoaderOptions, { env, paths }) => { return postcssLoaderOptions; }
        // }
    },
    eslint: {
        enable: true /* (default value) */,
        mode: "extends" /* (default value) */ || "file",
        configure: { /* Any eslint configuration options: https://eslint.org/docs/user-guide/configuring */ },
        //configure: (eslintConfig, { env, paths }) => { return eslintConfig; },
        //loaderOptions: { /* Any eslint-loader configuration options: https://github.com/webpack-contrib/eslint-loader. */ },
        //loaderOptions: (eslintOptions, { env, paths }) => { return eslintOptions; }
    },
    babel: {
        presets: [],
        plugins: [ [ "react-intl", {
            "messagesDir": "/src/translation"
        }], [ "@babel/plugin-proposal-decorators", { "legacy": true } ], "@babel/plugin-transform-runtime", "@babel/plugin-transform-modules-commonjs"],
       
        //loaderOptions: { /* Any babel-loader configuration options: https://github.com/babel/babel-loader. */ },
        //loaderOptions: (babelLoaderOptions, { env, paths }) => { return babelLoaderOptions; }
    },
    typescript: {
        enableTypeChecking: true /* (default value)  */
    },
    webpack: {
        alias: {},
        plugins: [
            
                
            
        ],
        sourceMap: false,

        configure: {
            node: {
                __dirname: true,
                __filename: true
            },
            target: 'electron-renderer'
            

        },
        
    },/* Any webpack configuration options: https://webpack.js.org/configuration */ 
        
        
    
    jest: {
        babel: {
            addPresets: true, /* (default value) */
            addPlugins: true  /* (default value) */
        },
       
        configure: (jestConfig, { env, paths, resolve, rootDir }) => { return jestConfig; }
    }
    
};