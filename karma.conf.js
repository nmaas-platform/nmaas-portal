const puppeteer = require('puppeteer');
process.env.CHROME_BIN = puppeteer.executablePath();

module.exports = function (config) {
    config.set({
            basePath: '',
            frameworks: ['jasmine', '@angular-devkit/build-angular'],
            plugins: [
                require('karma-jasmine'),
                require('karma-coverage'),
                require('karma-chrome-launcher'),
                require('karma-jasmine-html-reporter'),
                require('@angular-devkit/build-angular/plugins/karma'),
            ],
            customLaunchers: {
                ChromeHeadless: {
                    base: 'Chrome',
                    flags: [
                        '--headless',
                        '--disable-gpu',
                        // Without a remote debugging port, Google Chrome exits immediately.
                        '--remote-debugging-port=9222',
                        '--no-sandbox'
                    ],
                }
            },
            client: {
                clearContext: false
            },
            files: [],
            preprocessors: {},
            mime: {
                'text/x-typescript': ['ts', 'tsx']
            },
            coverageReporter: {
                dir: 'coverage',
                reporters: [
                    {type: 'html', subdir: '.'},
                    {type: 'lcovonly', subdir: '.', file: 'lcov.info'},
                ],
                check: {
                    global: {
                        statements: 75,
                        branches: 75,
                        functions: 75,
                        lines: 75,
                    },
                }
            },

            reporters: ['progress'],
            port: 9876,
            colors: true,
            logLevel: config.LOG_WARN,
            autoWatch: false,
            browsers: ['Chrome', 'ChromeHeadless'],
            singleRun: false
        }
    );
};
