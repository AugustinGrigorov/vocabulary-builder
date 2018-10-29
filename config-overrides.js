const { injectBabelPlugin } = require('react-app-rewired');

module.exports = function override(config) {
  return injectBabelPlugin('babel-plugin-styled-components', config);
};
