module.exports = (config) => {
  const testIndex = './test/pact-testing/pact-testing.spec.js';
  const preprocessors = {};
  preprocessors[`${testIndex}`] = ['webpack'];

  const configuration = {
    frameworks:['mocha',"chai",'pact'],
    plugins: [
      'karma-*',
      '@pact-foundation/karma-pact'
    ],
    files: [
      'node_modules/@pact-foundation/pact-web/pact-web.js',
      './test/pact-testing/pact-testing.spec.js',
    ],

    preprocessors,
    pact:[{
      consumer: 'ui-checkin',
      provider: 'mod-circulation',
      port: API_PORT,
      log: path.resolve(process.cwd(), 'logs', 'pact.log'),
      dir: path.resolve(process.cwd(), 'pacts'),
      logLevel: LOG_LEVEL,
      spec: 3
    }]
  };

  config.set(configuration);
};
