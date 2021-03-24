// @ts-check
// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require("jasmine-spec-reporter");
var HtmlReporter = require("protractor-beautiful-reporter");
const specJsonReporter = require("./reporters/spec-json-reporter/jasmine-spec-json-reporter");

/**
 * @type { import("protractor").Config }
 */

exports.config = {
  allScriptsTimeout: 40 * 1000,
  getPageTimeout: 60 * 1000,

  capabilities: {
    browserName: "chrome",
    chromeOptions: {
      prefs: {
        profile: {
          default_content_setting_values: { automatic_downloads: 1 }
        },
        download: {
          prompt_for_download: false,
          directory_upgrade: true,
          default_directory: process.cwd() + "\\e2e\\data\\downloads",
        },
      },
    },
  },

  suites: {
    attachment: ["./tests/attachment/*.e2e-spec.ts"],
    approvals: ["./tests/approvals/*.e2e-spec.ts"],
    case1: ["./tests/case1/*.e2e-spec.ts"],
    case2: ["./tests/case2/*.e2e-spec.ts"],
    cognitive: ["./tests/cognitive/*.e2e-spec.ts"],
    email: ["./tests/email/*.e2e-spec.ts"],
    filter: ["./tests/filter/*.e2e-spec.ts"],
    flowset: ["./tests/flowset/*.e2e-spec.ts"],
    knowledge: ["./tests/knowledge/*.e2e-spec.ts"],
    lob: ["./tests/lob/*.e2e-spec.ts"],
    notification: ["./tests/notification/*.e2e-spec.ts"],
    search: ["./tests/search/*.e2e-spec.ts"],
    slm: ["./tests/slm/*.e2e-spec.ts"],
    social: ["./tests/social/*.e2e-spec.ts"],
    task: ["./tests/task/*.e2e-spec.ts"],
    ticketing: ["./tests/ticketing/*.e2e-spec.ts"],
  },

  baseUrl: "http://clm-aus-u9x5do.bmc.com:8008",
  // baseUrl: "http://clm-aus-u9x5gh.bmc.com:8008",
  framework: "jasmine",
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 400 * 1000,
    print: function () { },
  },

  async onPrepare() {
    let globals = require("protractor/built");
    let browser = globals.browser;
    //await browser.waitForAngularEnabled(false);

    //Implicitly wait
    await browser.manage().timeouts().implicitlyWait(5000);

    var width = 1300;
    var height = 750;
    browser.driver.manage().window().setSize(width, height);
    // browser.driver.manage().window().maximize();

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

    require("ts-node").register({
      project: require("path").join(__dirname, "./tsconfig.json"),
    });

    jasmine.getEnv().addReporter(
      new SpecReporter({
        spec: {
          displayStacktrace: true,
        },
      })
    );

    jasmine.getEnv().addReporter(
      new HtmlReporter({
        baseDirectory: "e2e/reports/screenshots",
      }).getJasmine2Reporter()
    );

    jasmine.getEnv().addReporter(specJsonReporter);
  },
};
