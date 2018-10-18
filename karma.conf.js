const path = require('path');
const webpack = require('webpack');

// Start with the base stripes webpack config.
// we'll need to make some changes in order to get
// karma-webpack to load properly.
const webpackConfig = require('@folio/stripes-core/webpack.config.cli.dev');

// make sure that the NODE_ENV is available in browser code.
webpackConfig.plugins.push(new webpack.EnvironmentPlugin({
  NODE_ENV: 'test',
}));
module.exports = (config) => {


  const configuration = {
    frameworks:['mocha', 'pact'],
    plugins: [
      'karma-*',
      '@pact-foundation/karma-pact'
    ],
    files: [
      '../node_modules/@pact-foundation/pact-web/pact-web.js',
      '../node_modules/babel-polyfill/dist/polyfill.js',
      //'./test/pact-testing/pact-testing.js',
      './test/pact-testing/pact-testing.spec.js',
      //'./test/pact-testing/pact-testing-users.spec.js'
      
    ],
    webpack: webpackConfig,
    preprocessors : {
      './test/pact-testing/pact-testing.spec.js' : ['webpack'],
      //'./test/pact-testing/pact-testing-users.spec.js' : ['webpack'],
      //'./test/pact-testing/pact-testing.js' : ['webpack']
    },
    singleRun:false,
    pact:[{
      consumer: 'ui-checkin',
      provider: 'mod-circulation',
      port: 9130,
      log: path.resolve(process.cwd(), 'logs', 'pact.log'),
      dir: path.resolve(process.cwd(), 'pacts'),
      logLevel: 'INFO',
      spec: 3, 
      cors:true
    }], 
    /*browsers: ['Chrome_without_security'],
    customLaunchers: {
      Chrome_without_security: {
        base: 'Chrome',
        flags: ['--disable-web-security']
      }
      
    }*/
  };

  config.set(configuration);
};
