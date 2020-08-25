import axios, { AxiosResponse } from "axios";
import { filter, find, forEach, get, isArray, remove, uniqBy, chain, countBy } from 'lodash';
import * as config from './jira.util.config';

const minimist = require("minimist");
const fs = require("fs");
const { Parser } = require('json2csv');
const pug = require('pug');
const juice = require('juice');

export interface InputType {
    jiraId: string;
    description: string;
    status: string;
}

export interface ExecutionDetails {
    totalExecution: number;
    passPercentage: number;
}

export interface IssueKeyDetails {
    issueKey: string;
    issueId: string;
    component: string;
    version: string;
    priority: string;
    lastExecutionStatus: string;
    totalExecution: number;
    passPercent: number;
}

export interface JiraTestDetails {
    JiraId: string,
    Description: string,
    ExecutionStatus: string,
    IsNewExecutionStatus?: string,
    TotalExecution?: number,
    PassPercent?: number,
    Version?: string,
    Priority?: string,
    JiraStatus?: string,
}

export class CreateJiraCycle {
    testCycleName: string;
    testCycleId: string;
    folderName: string;
    folderId: string;
    build: string;
    env: string;
    baseUri: string;
    projectId: string;
    versionId: string;
    inputFile: string;
    generateStats: string;
    userName: string;
    password: string;
    passJiraTest = [];
    failJiraTest = [];
    skipJiraTest = [];
    invalidJiraTest = [];
    jiraReport = [];

    componentArray = [];
    result: any;
    async run() {
        let startTime = this.getTimeStamp();
        this.loadConfig();
        this.filterInputFile();
        let isCycleAndFolderCreated: boolean = await this.createCycleAndFolder();
        if (isCycleAndFolderCreated) {
            if (this.skipJiraTest.length)
                await this.addExecutionToCycle(this.skipJiraTest);
            if (this.passJiraTest.length)
                await this.addExecutionToCycle(this.passJiraTest);
            if (this.failJiraTest.length)
                await this.addExecutionToCycle(this.failJiraTest);
            this.result = chain(this.componentArray).groupBy("component").map(function (v, i) {
                return {
                    [i]: countBy(v, 'status')
                }
            }).value();
            this.result = Object.assign({}, ...this.result);
            for (let key in this.result) {
                ['skipped', 'failed', 'passed'].forEach(status => {
                    if (!this.result[key][status]) this.result[key][status] = 0;
                })
            }
            this.generateOutputFile();
            this.writeExecutionSummary();
        } else {
            console.log('FAILURE:: Test cycle and or folder is not created');
            console.log(`FAILURE::###### Test Cycle details ###### \nFAILURE::Test cycle Name >> ${this.testCycleName} \nFAILURE::Test cycle Id >> ${this.testCycleId}`);
            console.log(`FAILURE::Folder Name >> ${this.folderName} \nFAILURE::Folder Id >> ${this.folderId}`);
        }
        console.log("Start time ==>", startTime);
        console.log("End time ==>", this.getTimeStamp());
    }

    loadConfig() {
        let configParam = minimist(process.argv.slice(2));
        this.testCycleName = configParam.cycle || config.TEST_CYCLE_NAME;
        this.folderName = configParam.folder || config.TEST_CYCLE_SUBFOLDER_NAME;
        this.build = configParam.build || config.BUILD;
        this.env = configParam.env || config.ENV;
        this.baseUri = configParam.baseuri || config.BASE_URI;
        this.projectId = configParam.projectid || config.PROJECT_ID;
        this.versionId = configParam.versionid || config.VERSION_ID;
        this.inputFile = configParam.inputfile || config.INPUT_FILE;
        this.generateStats = configParam.stats || config.GENERATE_STATS;
        this.userName = configParam.username || config.USERNAME;
        this.password = configParam.password || config.PASSWORD;

        let encodeAuth = Buffer.from(this.userName + ":" + this.password).toString('base64');
        axios.defaults.baseURL = this.baseUri;
        axios.defaults.headers.common['Authorization'] = " Basic " + encodeAuth;
        axios.defaults.headers.common['Content-Type'] = 'application/json';
    }

    filterInputFile() {
        let executionReportJson = require(this.inputFile);
        executionReportJson.forEach((testResult: InputType) => {

            let jiraRegx = /(DRDMV-\d+,?)/g;
            let jiraIdMatches = testResult.jiraId.match(jiraRegx);

            if (jiraIdMatches) {
                if (testResult.status == 'passed') {
                    this.passJiraTest.push(testResult);

                } else if (testResult.status == 'failed') {
                    this.failJiraTest.push(testResult);

                } else if (testResult.status == 'disabled') {
                    this.skipJiraTest.push(testResult);
                    testResult.status = 'skipped'
                }
            } else {
                this.invalidJiraTest.push({
                    JiraId: testResult.jiraId,
                    Description: testResult.description,
                    ExecutionStatus: testResult.status,
                    IsNewExecutionStatus: "NA",
                    TotalExecution: "NA",
                    PassPercent: "NA",
                    Version: "NA",
                    Priority: "NA",
                    JiraStatus: "NA",
                });
            }
        });
        // Remove duplicate values within array
        this.passJiraTest = uniqBy(this.passJiraTest, function (record: InputType) { return record.jiraId; });
        this.failJiraTest = uniqBy(this.failJiraTest, function (record: InputType) { return record.jiraId; });
        this.skipJiraTest = uniqBy(this.skipJiraTest, function (record: InputType) { return record.jiraId; });
        // remove duplicate between failed and passed array
        // this.passJiraTest = compact(this.passJiraTest.map(passedItem => find(this.failJiraTest, { 'jiraId': passedItem.jiraId }) ? undefined : passedItem));
        forEach(this.failJiraTest, (failEntry: InputType) => {
            remove(this.passJiraTest, (passEntry: InputType) => {
                return failEntry.jiraId == passEntry.jiraId;
            });
        });
        // remove duplicate between failed and skipped array
        forEach(this.failJiraTest, (failEntry: InputType) => {
            remove(this.skipJiraTest, (skipEntry: InputType) => {
                return failEntry.jiraId == skipEntry.jiraId;
            });
        });
    }

    async createCycleAndFolder(): Promise<boolean> {
        let jiraCycleInfo = await axios.get(
            "/rest/zapi/latest/cycle?projectId=" + this.projectId + "&versionId=" + this.versionId
        );

        let isCyclePresent = find(jiraCycleInfo.data, (cycle, key) => {
            if (cycle.name === this.testCycleName) {
                this.testCycleId = key;
                return true;
            }
        });

        // create cycle
        if (!isCyclePresent) {
            let cyclePayload = {
                "name": `${this.testCycleName}`,
                "build": `${this.build}`,
                "environment": `${this.env}`,
                "projectId": `${this.projectId}`,
                "versionId": `${this.versionId}`,
            }
            const newCycle = await axios.post(
                "/rest/zapi/latest/cycle",
                cyclePayload
            );
            console.log('Create Test Cycle API Status =============>', newCycle.status, " ", this.testCycleName);
            if (newCycle.status == 200) {
                this.testCycleId = newCycle.data.id;
            } else return false;
        } else console.log("Cycle already present...", this.testCycleName);

        // if folder name has timestamp verify folder is present
        let isFolderPresent = false;
        let hasNumber = /\d/;
        if (hasNumber.test(this.folderName)) {
            //verify folder is present in the cycle
            let jiraFolderInfo = await axios.get(
                "/rest/zapi/latest/cycle/" + this.testCycleId + "/folders?projectId=" + this.projectId + "&versionId=" + this.versionId
            );

            isFolderPresent = find(jiraFolderInfo.data, (folder) => {
                if (folder.folderName === this.folderName) {
                    this.folderId = folder.folderId;
                    return true;
                }
            });
        } else {
            let timestamp = this.getTimeStamp();
            this.folderName = `${this.folderName} ${timestamp}`;
        }

        if (!isFolderPresent) {
            // create folder inside cycle
            let folderPayload = {
                "cycleId": `${this.testCycleId}`,
                "name": `${this.folderName}`,
                "description": `${this.env}`,
                "projectId": `${this.projectId}`,
                "versionId": `${this.versionId}`,
            }
            const newFolder = await axios.post(
                "/rest/zapi/latest/folder/create",
                folderPayload
            );
            console.log('Create Test Folder API Status =============>', newFolder.status, " ", this.folderName);
            if (newFolder.status == 200) {
                this.folderId = newFolder.data.id;
                return true;
            } else return false;
        } else {
            console.log("Folder already present...");
            console.log(`Folder Name >> ${this.folderName} \nFolder Id >> ${this.folderId}`);
            return true;
        }
    }

    async addExecutionToCycle(testInput: any[]): Promise<void> {
        // create new execution
        let executionIdList = [];
        let apiStatus = -1;
        let isNewExecutionStatus = "NA";

        for (let i = 0; i < testInput.length; i++) {
            let issueDetails = await this.getIssueDetails(testInput[i].jiraId);
            this.componentArray.push({ component: issueDetails.component, status: testInput[i].status });
            testInput[i].status != issueDetails.lastExecutionStatus ? isNewExecutionStatus = "Yes" : isNewExecutionStatus = "No";
            let executionPayload = {
                "cycleId": `${this.testCycleId}`,
                "issueId": `${issueDetails.issueId}`,
                "assigneeType": "assignee",
                "assignee": `${this.userName}`,
                "folderId": `${this.folderId}`,
                "projectId": `${this.projectId}`,
                "versionId": `${this.versionId}`,
            }
            const newExecution = await axios.post(
                "/rest/zapi/latest/execution",
                executionPayload
            );
            console.log('Create New Execution Status =============>', newExecution.status);
            console.log('Create New Execution KEY =============>', Object.keys(newExecution.data)[0]);
            let jiraAddStatus = "NA";

            if (newExecution.status == 200) {
                let executionId = Object.keys(newExecution.data)[0];
                jiraAddStatus = "SUCCESS";
                executionIdList.push(executionId);
            } else {
                jiraAddStatus = "FAILED";
                console.log("Failed to add IssueID in test cycle");
            }

            this.jiraReport.push({
                JiraId: testInput[i].jiraId,
                Description: testInput[i].description,
                Component: issueDetails.component,
                ExecutionStatus: testInput[i].status,
                IsNewExecutionStatus: isNewExecutionStatus,
                TotalExecution: issueDetails.totalExecution,
                PassPercent: issueDetails.passPercent,
                Version: issueDetails.version,
                Priority: issueDetails.priority,
                JiraStatus: jiraAddStatus
            });
        }

        if (testInput[0].status == 'passed') apiStatus = 1;
        if (testInput[0].status == 'failed') apiStatus = 2;

        let testStatusPayload = {
            "executions": executionIdList,
            "status": apiStatus
        }

        const newTestExecution = await axios.put(
            "/rest/zapi/latest/execution/updateBulkStatus",
            testStatusPayload
        );
        console.log('Add Test Execution API Status =============>', newTestExecution.status);
        if (newTestExecution.status == 200) {
            console.log("Test case execution added");
        } else console.log("Test case NOT added");
    }

    async getIssueDetails(issueKey: string): Promise<IssueKeyDetails> {
        let issueDetails = await axios.get(
            "/rest/api/latest/issue/" + issueKey
        );
        console.log('IssueKey Details API Status =============>', issueDetails.status, issueKey);

        if (issueDetails.status == 200) {
            let issueId = issueDetails.data.id;
            let passDetails = 0;
            let totalExe = 0;
            let lastExecutionStatus = undefined;

            // read issue component
            const issueComponentArray = await issueDetails.data.fields.components;
            let issueComponent: string = "None";
            if (issueComponentArray[0]) {
                issueComponent = await issueComponentArray[0].name;
            }
            // get issue id details
            if (this.generateStats.toLowerCase() == 'true') {
                let issueIdApiResponse = await this.getIssueIdDetails(issueId);
                if (issueIdApiResponse) {
                    // Is new execution status
                    let lastExecution = "passed";
                    const sameCycleExecutions = filter(await issueIdApiResponse.data.executions, { cycleName: this.testCycleName });
                    if (sameCycleExecutions[0]) {
                        lastExecution = await sameCycleExecutions[0].executionStatus;
                        lastExecution == "1" ? (lastExecutionStatus = "passed")
                            : ((lastExecution == "2") ? (lastExecutionStatus = "failed")
                                : (lastExecutionStatus = "skipped"));

                        // calculate pass percentage
                        let passPercent = await this.getTotalExecutionAndPassPercent(issueIdApiResponse);
                        passDetails = passPercent.passPercentage;
                        totalExe = passPercent.totalExecution;
                    }
                }
            }
            const { fixVersions } = issueDetails.data.fields;
            return {
                issueKey: issueKey,
                issueId: issueId,
                component: issueComponent,
                version: fixVersions && isArray(fixVersions) ? get(fixVersions[0], 'name') : null,
                priority: issueDetails.data.fields.priority.name ? issueDetails.data.fields.priority.name : 'NA',
                lastExecutionStatus,
                totalExecution: totalExe,
                passPercent: passDetails,
            }

        } else console.log("Issue details not found....", issueKey);
    }

    async getIssueIdDetails(issueId: string): Promise<AxiosResponse> {
        let issueIdDetails = await axios.get(
            "/rest/zapi/latest/execution?issueId=" + issueId
        );
        console.log('IssueId Details API Status =============>', issueIdDetails.status);

        if (issueIdDetails.status == 200) return issueIdDetails;
        else {
            console.log("Issue details not found....", issueId);
            return undefined;
        }
    }

    async getTotalExecutionAndPassPercent(executionDetails: AxiosResponse): Promise<ExecutionDetails> {
        let passPercent: number;
        let executions: number;
        executions = executionDetails.data.recordsCount;
        let allExecutions = executionDetails.data.executions;
        let allPassExecution = allExecutions.filter((execution: { executionStatus: string; }) => {
            return execution.executionStatus === '1';
        });
        passPercent = allPassExecution.length * 100 / executions;
        return {
            totalExecution: executions,
            passPercentage: passPercent
        };
    }

    generateOutputFile() {

        console.log("************OUTPUT**************");

        if (!fs.existsSync('e2e/reports/spec-jira-report')) {
            fs.mkdirSync('e2e/reports/spec-jira-report');
        }
        const fields = ['JiraId', 'Description', 'Component', 'ExecutionStatus', 'IsNewExecutionStatus', 'TotalExecution', 'PassPercent', 'Version', 'Priority', 'JiraStatus'];
        const json2csvParser = new Parser({ fields });
        //fs.writeFileSync('e2e/reports/spec-jira-report/jira-report.csv', json2csvParser.parse(this.jiraReport.concat(this.invalidJiraTest))); write invalid entries in file
        fs.writeFileSync('e2e/reports/spec-jira-report/jira-report.csv', json2csvParser.parse(this.jiraReport)); // write only valid entries in CSV file
    }

    async writeExecutionSummary() {
        let cycleExecutionSummary = await axios.get(
            "rest/zapi/latest/cycle/" + this.testCycleId + "/folders?projectId=" + this.projectId + "&versionId=" + this.versionId
        );
        console.log('Test Cycle Summary API Status =============>', cycleExecutionSummary.status);

        if (cycleExecutionSummary.status == 200) {

            let folderExecutionInfo = filter(cycleExecutionSummary.data, (folder) => {
                return folder.folderName === this.folderName;
            });
            let totalExecution: number = folderExecutionInfo[0].totalExecutions;

            let skipCount: number = find(folderExecutionInfo[0].executionSummaries.executionSummary, (status) => {
                return status.statusName === "UNEXECUTED";
            }).count;

            let passCount: number = find(folderExecutionInfo[0].executionSummaries.executionSummary, (status) => {
                return status.statusName === "PASS";
            }).count;

            let failCount: number = totalExecution - passCount - skipCount;
            let cyclePassPercent: number = Math.round(passCount * 100 / totalExecution);

            // write JSON file
            this.result.Total = { 'passed': passCount, 'failed': failCount, 'skipped': skipCount };
            fs.writeFileSync('e2e/reports/spec-jira-report/summary-report.json', JSON.stringify(this.result));

            console.log("Cycle name ==> " + this.testCycleName);
            console.log("Folder name ==> " + this.folderName);
            console.log("Test Cycle Pass % ==> " + cyclePassPercent);
            console.log("Passed tests ==> " + passCount);
            console.log("Failed tests ==> " + failCount);
            console.log("Skipped tests ==> " + skipCount);
            console.log("Total Executed tests ==> " + totalExecution);

            let exeSummary = {
                cycle: this.testCycleName,
                folder: this.folderName,
                cyclePassPercent,
                pass: passCount,
                fail: failCount,
                skip: skipCount,
                total: totalExecution,
            }
            this.createHtmlReport(exeSummary);

        } else console.log("************FAILED to get Test Execution Summary**************");
    }

    getTimeStamp(): string {
        let now = new Date();
        let year = "" + now.getFullYear();
        let month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
        let day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
        let hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
        let minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
        return year + "-" + month + "-" + day + " " + hour + ":" + minute;
    }

    createHtmlReport(summary: { cycle: string; folder: string; cyclePassPercent: number; pass: number; fail: number; skip: number; total: number; }) {
        let html = pug.renderFile('e2e/reporters/spec-jira-reporter/email-report.pug', summary);
        fs.writeFileSync('e2e/reports/spec-jira-report/CycleReport.html', juice(html));
    }
}

export default new CreateJiraCycle();