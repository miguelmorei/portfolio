
const webpackConfig = require('./webconfig.dev');

webpackConfig.stats = 'none';

module.exports = function(config) {
    config.set({
  
      // base path that will be used to resolve all patterns (eg. files, exclude)
      basePath: '../',
      frameworks: ['jasmine'],
  
      // frameworks to use
      // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
      // or can be: ['jasmine'],
  
      // list of files / patterns to load in the browser
      files: [
        'src/js/**/*.js'
      ],
  
  
      // list of files to exclude
      exclude: [
      ],
      
      webpack : webpackConfig,
      webpackMiddleware : {
          stats : 'none'
      },
  
      preprocessors: {
        ['src/js/**/*.js']: ['webpack'],
      },
      plugins : ['karma-chrome-launcher', 'karma-jasmine', 'karma-webpack', 'karma-jasmine-html-reporter'],
  
      // test results reporter to use
      // possible values: 'dots', 'progress'
      // available reporters: https://npmjs.org/browse/keyword/karma-reporter
      reporters: ['kjhtml'],
  
  
      // web server port
      port: 9876,
  
  
      // enable / disable colors in the output (reporters and logs)
      colors: true,
  
  
      // enable / disable watching file and executing tests 
      // whenever any file changes
      autoWatch: true,
  
  
      // start these browsers
      // available browser launchers: 
      //  https://npmjs.org/browse/keyword/karma-launcher
      browsers: ['Chrome'],
  
  
      // Continuous Integration mode
      // if true, Karma captures browsers, runs the tests and exits
      singleRun: false
    });
  };