module.exports = (config) => {
  const testIndex = './test/pact-testing/pact-index.js';
  const preprocessors = {};
  preprocessors[`${testIndex}`] = ['webpack'];

  const configuration = {
    files: [
      { pattern: testIndex, watched: false },
    ],

    preprocessors
  };

  config.set(configuration);
};
