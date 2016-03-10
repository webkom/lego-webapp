const webpackConfig = require('../webpack/test.config');

module.exports = config => {
  config.set({
    frameworks: ['mocha'],
    reporters: ['mocha'],
    browsers: ['Chrome'],
    autoWatch: false,
    singleRun: true,

    files: [{
      pattern: './test-bundler.js',
      watched: false,
      served: true,
      included: true
    }],

    preprocessors: {
      ['./test-bundler.js']: ['webpack', 'sourcemap']
    },

    webpack: webpackConfig,

    // make Webpack bundle generation quiet
    webpackMiddleware: {
      noInfo: true
    }
  });
};
