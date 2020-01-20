import axios from "axios";
import { find } from 'lodash';
import * as config from './jira.util.config';

const minimist = require("minimist");
const fs = require("fs");
const { Parser } = require('json2csv');

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
    version: string;
    priority: string;
    totalExecution: number;
    passPercent: number;
}

export interface JiraTestDetails {
    JiraId: string,
    Description: string,
    ExecutionStatus: string,
    TotalExecution?: number,
    PassPercent?: number,
    Version?: string,
    Priority?: string,
    JiraStatus?: string,
}

export class CreateJiraCycle {
    time = new Date();
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

    async run() {
        this.loadConfig();
        this.filterInputFile();
        let isCycleAndFolderCreated: boolean = await this.createCycleAndFolder();
        if (isCycleAndFolderCreated) {
            await this.addExecutionToCycle(this.skipJiraTest);
            await this.addExecutionToCycle(this.passJiraTest);
            await this.addExecutionToCycle(this.failJiraTest);
        }
        this.generateOutputFile(isCycleAndFolderCreated);
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
                    TotalExecution: "NA",
                    PassPercent: "NA",
                    Version: "NA",
                    Priority: "NA",
                    JiraStatus: "NA",
                });
            }
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

        // create folder inside cycle
        let timestamp = `${this.time.getFullYear()}-${this.time.getMonth()}-${this.time.getDate()} ${this.time.getHours()}:${this.time.getMinutes()}`;
        this.folderName = `${this.folderName} ${timestamp}`;

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
    }

    async addExecutionToCycle(testInput): Promise<void> {
        // create new execution
        let executionIdList = [];
        let apiStatus = -1;
        for (let i = 0; i < testInput.length; i++) {
            let issueDetails = await this.getIssueDetails(testInput[i].jiraId);
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
                ExecutionStatus: testInput[i].status,
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
        console.log('IssueKey Details API Status =============>', issueDetails.status);

        if (issueDetails.status == 200) {
            let issueId = issueDetails.data.id;
            let passDetails = 0;
            let totalExe = 0;

            // calculate pass percentage
            if (this.generateStats == 'true') {
                let passPercent = await this.getTotalExecutionAndPassPercent(issueId);
                passDetails = passPercent.passPercentage;
                totalExe = passPercent.totalExecution;
            }
            return {
                issueKey: issueKey,
                issueId: issueId,
                version: issueDetails.data.fields.fixVersions[0].name,
                priority: issueDetails.data.fields.priority.name,
                totalExecution: totalExe,
                passPercent: passDetails,
            }

        } else console.log("Issue details not found....", issueKey);
    }

    async getTotalExecutionAndPassPercent(issueId: string): Promise<ExecutionDetails> {
        let passPercent: number;
        let executions: number;
        let executionDetails = await axios.get(
            "/rest/zapi/latest/execution?issueId=" + issueId
        );
        console.log('IssueId Details API Status =============>', executionDetails.status);

        if (executionDetails.status == 200) {
            executions = executionDetails.data.recordsCount;
            let allExecutions = executionDetails.data.executions;
            let allPassExecution = allExecutions.filter((execution) => {
                return execution.executionStatus === '1';
            });
            passPercent = allPassExecution.length * 100 / executions;
        } else {
            console.log("Issue details not found....", issueId);
        }
        return {
            totalExecution: executions,
            passPercentage: passPercent
        };
    }

    generateOutputFile(isCycleAndFolder: boolean) {

        console.log("************OUTPUT**************");

        if (!fs.existsSync('e2e/reports/spec-jira-report')) {
            fs.mkdirSync('e2e/reports/spec-jira-report');
        }
        if (isCycleAndFolder) {
            const fields = ['JiraId', 'Description', 'ExecutionStatus', 'TotalExecution', 'PassPercent', 'Version', 'Priority', 'JiraStatus'];
            const json2csvParser = new Parser({ fields });
            fs.writeFileSync('e2e/reports/spec-jira-report/jira-report.csv', json2csvParser.parse(this.jiraReport.concat(this.invalidJiraTest)));
        }
        else {
            fs.writeFileSync('e2e/reports/spec-jira-report/jira-report.csv', 'Jira report failure!!! Test cycle and or folder is not created');
            console.log('Jira report failure!!! Test cycle and or folder is not created');
            console.log(`###### Test Cycle details ###### \n Test cycle Name >> ${this.testCycleName} \n Test cycle Id >> ${this.testCycleId}`);
            console.log(`Folder Name >> ${this.folderName} \n Folder Id >> ${this.folderId}`);
        }
    }

    async writeExecutionSummary() {
        let cycleExecutionSummary = await axios.get(
            "rest/zapi/latest/cycle/" + this.testCycleId + "/folders?projectId=" + this.projectId + "&versionId=" + this.versionId
        );
        console.log('Test Cycle Summary API Status =============>', cycleExecutionSummary.status);
    }
}

export default new CreateJiraCycle();