const path = require('path');
const webpack = require('webpack');

// Start with the base stripes webpack config.
// we'll need to make some changes in order to get
// karma-webpack to load properly.
const webpackConfig = require('@folio/stripes-core/webpack.config.cli.dev');

// This is not a separate platform, so we need to stub out our own
// stripes config. Whenever code in the application, or in stripes
// itself does `import 'stripes-config'`, it will find our test
// config.
//
webpackConfig.resolve.alias['stripes-config'] = path.resolve(__dirname, './stripes.config.js');

// make sure that the NODE_ENV is available in browser code.
webpackConfig.plugins.push(new webpack.EnvironmentPlugin({
  NODE_ENV: 'test',
}));
module.exports = (config) => {
  const testIndex = './test/pact-testing/pact-testing.spec.js';
  const preprocessors = {};
  preprocessors[`${testIndex}`] = ['webpack','babel'];

  const configuration = {
    frameworks:['mocha', 'pact'],
    plugins: [
      'karma-*',
      '@pact-foundation/karma-pact'
    ],
    files: [
      'node_modules/@pact-foundation/pact-web/pact-web.js',
      './test/pact-testing/pact-testing.js',
      './test/pact-testing/pact-testing.spec.js',
      
    ],
    webpack: webpackConfig,
    preprocessors : {
      './test/pact-testing/pact-testing.spec.js' : ['webpack'],
      './test/pact-testing/pact-testing.js' : ['webpack']
    },
    singleRun:true,
    pact:[{
      consumer: 'ui-checkin',
      provider: 'mod-circulation',
      port: 9130,
      log: path.resolve(process.cwd(), 'logs', 'pact.log'),
      dir: path.resolve(process.cwd(), 'pacts'),
      logLevel: 'DEBUG',
      spec: 3, 
      cors:true
    }]
  };

  config.set(configuration);
};
