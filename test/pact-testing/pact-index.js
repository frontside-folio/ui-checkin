import 'babel-polyfill';


// require all modules ending in "-test" from the current directory and
// all subdirectories
const requirePactTest = require.context('./', true, /-testing/);
requirePactTest.keys().forEach(requirePactTest);