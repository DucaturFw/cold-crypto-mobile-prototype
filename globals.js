// Inject node globals into React Native global scope.
global.Buffer = require('buffer').Buffer;
process.browser = true;
