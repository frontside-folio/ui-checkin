var path = require('path')
module.exports = (config) => {
  const testIndex = './test/pact-testing/pact-testing.spec.js';
  const preprocessors = {};
  preprocessors[`${testIndex}`] = ['webpack'];

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

    preprocessors,
    pact:[{
      consumer: 'ui-checkin',
      provider: 'mod-circulation',
      port: 9130,
      log: path.resolve(process.cwd(), 'logs', 'pact.log'),
      dir: path.resolve(process.cwd(), 'pacts'),
      logLevel: 'DEBUG',
      spec: 3
    }]
  };

  config.set(configuration);
};
