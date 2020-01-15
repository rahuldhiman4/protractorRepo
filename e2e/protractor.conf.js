// @ts-check
// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require('jasmine-spec-reporter');
var HtmlReporter = require('protractor-beautiful-reporter');
const specJsonReporter = require('./jasmine-spec-json-reporter');
const fs = require('fs');

function resetJasminSpecJsonReport() {
  const jsonReportPath = 'e2e/reports/spec-json-report.json';
  const csvReportPath = 'e2e/reports/spec-csv-report.csv';
  if (fs.existsSync(jsonReportPath)) {
    fs.unlinkSync(jsonReportPath);
  }

  if (fs.existsSync(csvReportPath)) {
    fs.unlinkSync(csvReportPath);
  }

  if (!fs.existsSync('e2e/reports')) {
    fs.mkdirSync('e2e/reports');
  }

  try {
    fs.writeFileSync(jsonReportPath, JSON.stringify([]));
  } catch (error) {
    console.log(error);
  }
}
/**
 * @type { import("protractor").Config }
 */
exports.config = {
  allScriptsTimeout: 5000,
  getPageTimeout: 20000,

  capabilities: {
    browserName: 'chrome',
    'shardTestFiles': true,
    'maxInstances': 1,
    'idle-duration': 5,
  },

  suites: {
    full: [
      './tests/**/*.e2e-spec.ts',
    ]
  },

  directConnect: false,
  baseUrl: 'http://clm-pun-t3erts.bmc.com:8008',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 80000,
    print: function () { }
  },

  async onPrepare() {
    let globals = require('protractor/built');
    let browser = globals.browser;
    browser.ignoreSynchronization = true;
    await browser.waitForAngularEnabled(false);

    //Implicitly wait
    await browser.manage().timeouts().implicitlyWait(5000);

    var width = 1300;
    var height = 700;
    browser.driver.manage().window().setSize(width, height);
    //browser.driver.manage().window().maximize();

    // Disable NG&css animation
    // var disableAnimation = function () {
    //   angular.module('disableAnimation', []).run(function ($animate) {
    //     // disable css animations
    //     var style = document.createElement('style');
    //     style.type = 'text/css';
    //     style.innerHTML = '* {' +
    //       '-webkit-transition: none !important;' +
    //       '-moz-transition: none !important;' +
    //       '-o-transition: none !important;' +
    //       '-ms-transition: none !important;' +
    //       'transition: none !important;' +
    //       '}';
    //     document.getElementsByTagName('head')[0].appendChild(style);
    //     // disable angular ng animations
    //     $animate.enabled(false);
    //   });
    // };
    // browser.addMockModule('disableAnimation', disableAnimation);

    require('ts-node').register({
      project: require('path').join(__dirname, './tsconfig.json')
    });

    jasmine.getEnv().addReporter(new SpecReporter({
      spec: {
        displayStacktrace: true
      }
    }));

    jasmine.getEnv().addReporter(new HtmlReporter({
      baseDirectory: 'reports/screenshots'
    }).getJasmine2Reporter());

    jasmine.getEnv().addReporter(specJsonReporter);
    resetJasminSpecJsonReport();
  }
};