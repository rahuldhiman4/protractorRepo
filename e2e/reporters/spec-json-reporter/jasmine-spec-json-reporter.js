const fs = require('fs');

var specResult = [];
var jiraRegx = /\[(\s*DRDMV-\d+\s*,?)+\]/g;
var specJsonReporter = {
    specDone: function (result) {
        let jiraIdMatches = result.description.match(jiraRegx);
        let jiraIdPattern = null;
        if (jiraIdMatches && jiraIdMatches.length) {
            jiraIdPattern = jiraIdMatches[0].replace('[', '').replace(']', '');
        } else {
            jiraIdPattern = ''
        }
        let jiraIds = jiraIdPattern.split(',');
        jiraIds.forEach((id) => {
            specResult.push({
                jiraId: id.trim(),
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