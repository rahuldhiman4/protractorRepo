const fs = require('fs');

var specResult = [];
var testIdRegx = /\[(\s*\d+\s*,?)+\]/g;
var specJsonReporter = {
    specDone: function (result) {
        let testIdMatches = result.description.match(testIdRegx);
        let testIdPattern = null;
        if (testIdMatches && testIdMatches.length) {
            testIdPattern = testIdMatches[0].replace('[', '').replace(']', '');
        } else {
            testIdPattern = ''
        }
        let testIds = testIdPattern.split(',');
        testIds.forEach((id) => {
            specResult.push({
                testId: id.trim(),
                description: result.description,
                status: result.status
            });
        });
    },
    jasmineDone: function (result) {
        if (!fs.existsSync('e2e/reports/spec-json-report')) {
            fs.mkdirSync('e2e/reports/spec-json-report', { recursive: true });
        }

        const jsonReportPath = 'e2e/reports/spec-json-report/spec-json-report.json';
        if (!fs.existsSync(jsonReportPath)) {
            fs.writeFileSync(jsonReportPath, JSON.stringify([]));
        }

        var rawFileString = fs.readFileSync(jsonReportPath);
        var data = JSON.parse(rawFileString);
        data = data.concat(specResult);
        fs.writeFileSync(jsonReportPath, JSON.stringify(data, null, '\t'));
    }
};
module.exports = specJsonReporter;