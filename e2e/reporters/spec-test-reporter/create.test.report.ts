import { chain, countBy, find, forEach, remove, uniqBy } from 'lodash';

const minimist = require("minimist");
const fs = require("fs");
const csv = require('csv-parser');
const { Parser } = require('json2csv');
const INPUT_FILE = '../../reports/spec-json-report/spec-json-report.json';
const ANNOTATION_FILE = 'e2e/reporters/spec-test-reporter/TestTrackAnnotations.csv';
const OUTPUT_PATH = 'e2e/reports/spec-test-report/';

export interface InputType {
    testId: string;
    description: string;
    status: string;
}

export interface TestDetails {
    TestID: string;
    Description: string;
    ExecutionStatus: string;
    Priority: string;
    Component: string
}

export class CreateTestReport {
    inputFile: string;
    annotation = [];
    passTest: InputType[] = [];
    failTest: InputType[] = [];
    skipTest: InputType[] = [];
    invalidTest: TestDetails[] = [];
    validTests: TestDetails[] = [];
    componentArray = [];
    result: any;

    async run() {
        this.loadConfig();
        this.filterInputFile();
        await this.readAnnotationFile().then((resolve) => {
            if (resolve) {
                this.addAnnotations(this.passTest);
                this.addAnnotations(this.failTest);
                this.addAnnotations(this.skipTest);
            }
        });
        this.result = chain(this.componentArray).groupBy("component").map(function (v, i) {
            return {
                [i]: countBy(v, 'status')
            }
        }).value();
        this.result = Object.assign({}, ...this.result);
        let passCount = 0, failCount = 0, skipCount = 0, totalCount = 0;
        for (let key in this.result) {
            let total = 0;
            ['skipped', 'failed', 'passed'].forEach(status => {
                if (!this.result[key][status]) this.result[key][status] = 0;
                total += this.result[key][status];
                if (status == 'passed') passCount += this.result[key][status];
                if (status == 'failed') failCount += this.result[key][status];
                if (status == 'skipped') skipCount += this.result[key][status];
            });
            this.result[key]['total'] = total;
            totalCount += total;
        }
        this.result.Total = { 'passed': passCount, 'failed': failCount, 'skipped': skipCount, 'total': totalCount };
        let passPercent: number = Math.round(passCount * 100 / totalCount);

        console.log("Test Pass % ==> " + passPercent);
        console.log("Passed tests ====> " + passCount);
        console.log("Failed tests ====> " + failCount);
        console.log("Skipped tests ====> " + skipCount);
        console.log("Total Executed tests ====> " + totalCount);

        this.generateOutputFile();
    }

    loadConfig() {
        let configParam = minimist(process.argv.slice(2));
        this.inputFile = configParam.inputfile || INPUT_FILE;
    }

    async readAnnotationFile() {
        return new Promise((resolve) => {
            fs.createReadStream(ANNOTATION_FILE)
                .pipe(csv())
                .on('data', (row) => {
                    this.annotation.push(row);
                })
                .on('end', () => {
                    console.log('Annotation file successfully processed');
                    resolve(true);
                });
        });
    }

    filterInputFile() {
        let executionReportJson = require(this.inputFile);
        executionReportJson.forEach((testResult: InputType) => {

            let testIdRegx = /^(\d+,?)/g;
            let testIdMatches = testResult.testId.match(testIdRegx);

            if (testIdMatches) {
                if (testResult.status == 'passed') {
                    this.passTest.push(testResult);

                } else if (testResult.status == 'failed') {
                    this.failTest.push(testResult);

                } else {
                    this.skipTest.push(testResult);
                    testResult.status = 'skipped'
                }
            } else {
                this.invalidTest.push({
                    TestID: testResult.testId,
                    Description: testResult.description,
                    ExecutionStatus: testResult.status,
                    Priority: "NA",
                    Component: "NA",
                });
            }
        });
        // Remove duplicate values within array
        this.passTest = uniqBy(this.passTest, function (record: InputType) { return record.testId; });
        this.failTest = uniqBy(this.failTest, function (record: InputType) { return record.testId; });
        this.skipTest = uniqBy(this.skipTest, function (record: InputType) { return record.testId; });
        // remove duplicate between failed and passed array
        forEach(this.failTest, (failEntry: InputType) => {
            remove(this.passTest, (passEntry: InputType) => {
                return failEntry.testId == passEntry.testId;
            });
        });
        // remove duplicate between failed and skipped array
        forEach(this.failTest, (failEntry: InputType) => {
            remove(this.skipTest, (skipEntry: InputType) => {
                return failEntry.testId == skipEntry.testId;
            });
        });
    }

    addAnnotations(testArray: InputType[]) {
        // Add annotations and populate componentArray
        let replaceExp = /[^a-zA-Z0-9]/gi; // replace spaces, special chars
        testArray.forEach(eachTest => {
            let testAnnotation = find(this.annotation, ['Number', eachTest.testId]);
            if (testAnnotation) {
                let components: string[] = (testAnnotation['Folders']).split(',');
                let componentName = components[0].replace(replaceExp, "");
                this.componentArray.push({ component: componentName, status: eachTest.status });
                this.validTests.push({
                    TestID: eachTest.testId,
                    Description: eachTest.description,
                    ExecutionStatus: eachTest.status,
                    Priority: testAnnotation['Type'],
                    Component: componentName
                });
            } else {
                this.validTests.push({
                    TestID: eachTest.testId,
                    Description: eachTest.description,
                    ExecutionStatus: eachTest.status,
                    Priority: 'NA',
                    Component: 'NA'
                });
            }
        });
    }

    generateOutputFile() {

        console.log("************OUTPUT FILES**************");

        if (!fs.existsSync(OUTPUT_PATH)) {
            fs.mkdirSync(OUTPUT_PATH);
        }

        // write result csv file
        const fields = ['TestID', 'Description', 'ExecutionStatus', 'Priority', 'Component'];
        const json2csvParser = new Parser({ fields });
        // fs.writeFileSync(OUTPUT_PATH + 'test-report.csv', json2csvParser.parse(this.allTests)); // write only valid entries in CSV file
        fs.writeFileSync(OUTPUT_PATH + 'test-report.csv', json2csvParser.parse(this.validTests.concat(this.invalidTest))); //write valid-invalid entries in file

        // write component JSON file
        fs.writeFileSync(OUTPUT_PATH + 'summary-report.json', JSON.stringify(this.result));
    }
}

export default new CreateTestReport();