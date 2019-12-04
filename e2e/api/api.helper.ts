import axios, { AxiosResponse } from "axios";
import { browser } from 'protractor';
import { ICaseTemplate } from "../data/api/interface/case.template.interface.api";
import coreApi from "../api/api.core.util";
import { CaseTemplate } from "../api/constant.api";
import { TaskTemplate } from "../api/constant.api";
import { ITaskTemplate } from 'e2e/data/api/interface/task.template.interface.api';
import { IPerson } from 'e2e/data/api/interface/person.interface.api';
import apiCoreUtil from '../api/api.core.util';
import {INotesTemplate} from '../data/api/interface/notes.template.interface.api'

axios.defaults.baseURL = browser.baseUrl;
axios.defaults.headers.common['X-Requested-By'] = 'XMLHttpRequest';
axios.defaults.headers.common['Content-Type'] = 'application/json';

export interface IIDs {
    id: string;
    displayId: string;
}

class ApiHelper {
    async apiLogin(user: string): Promise<void> {
        var loginJson = await require('../data/userdata.json');
        var username: string = await loginJson[user].userName;
        var password: string = await loginJson[user].userPassword;
        let response = await axios.post(
            "api/rx/authentication/loginrequest",
            { "userName": username, "password": password },
        )
        console.log('Login API Status =============>', response.status);
        axios.defaults.headers.common['Cookie'] = `AR-JWT=${response.data}`;
    }

    async createCase(data: any): Promise<IIDs> {
        const newCase = await axios.post(
            "api/com.bmc.dsm.case-lib/cases",
            data
        );
        console.log('Create Case API Status =============>', newCase.status);
        const caseDetails = await axios.get(
            newCase.headers.location
        );
        console.log('New Case Details API Status =============>', caseDetails.status);

        return {
            id: caseDetails.data.id,
            displayId: caseDetails.data.displayId
        };
    }

    async createCaseTemplate(data: ICaseTemplate): Promise<IIDs> {

        var templateDataFile = await require('../data/api/case/case.template.api.json');
        var templateData = await templateDataFile.CaseTemplateData;

        templateData.fieldInstances[8].value = data.templateSummary;
        templateData.fieldInstances[1000001437].value = data.templateName;
        templateData.fieldInstances[7].value = CaseTemplate[data.templateStatus];
        //templateData.fieldInstances[301566300].value = this.getCompanyGuid(data.company);

        var newCaseTemplate: AxiosResponse = await coreApi.createRecordInstance(templateData);

        console.log('Create Case Template API Status =============>', newCaseTemplate.status);
        const caseTemplateDetails = await axios.get(
            await newCaseTemplate.headers.location
        );
        console.log('New Case Template Details API Status =============>', caseTemplateDetails.status);

        return {
            id: caseTemplateDetails.data.id,
            displayId: caseTemplateDetails.data.displayId
        };
    }

    async createManualTaskTemplate(data: ITaskTemplate): Promise<IIDs> {

        var templateDataFile = await require('../data/api/task/task.template.api.json');
        var templateData = await templateDataFile.ManualTaskTemplate;

        templateData.fieldInstances[7].value = TaskTemplate[data.templateStatus];
        templateData.fieldInstances[8].value = data.templateName;
        templateData.fieldInstances[1000001437].value = data.templateSummary;
        //data.company ? templateData.fieldInstances[301566300].value = data.templateSummary;

        var newTaskTemplate: AxiosResponse = await coreApi.createRecordInstance(templateData);

        console.log('Create Manual Task Template API Status =============>', newTaskTemplate.status);
        const taskTemplateDetails = await axios.get(
            await newTaskTemplate.headers.location
        );
        console.log('New Manual Task Template Details API Status =============>', taskTemplateDetails.status);

        return {
            id: taskTemplateDetails.data.id,
            displayId: taskTemplateDetails.data.displayId
        };
    }

    async createExternalTaskTemplate(data: ITaskTemplate): Promise<IIDs> {

        var templateDataFile = await require('../data/api/task/task.template.api.json');
        var templateData = await templateDataFile.ExternalTaskTemplate;

        templateData.fieldInstances[7].value = TaskTemplate[data.templateStatus];
        templateData.fieldInstances[8].value = data.templateName;
        templateData.fieldInstances[1000001437].value = data.templateSummary;

        var newTaskTemplate: AxiosResponse = await coreApi.createRecordInstance(templateData);

        console.log('Create External Task Template API Status =============>', newTaskTemplate.status);
        const taskTemplateDetails = await axios.get(
            await newTaskTemplate.headers.location
        );
        console.log('New External Task Template Details API Status =============>', taskTemplateDetails.status);

        return {
            id: taskTemplateDetails.data.id,
            displayId: taskTemplateDetails.data.displayId
        };
    }

    async createAutomatedTaskTemplate(data: ITaskTemplate): Promise<IIDs> {

        var templateDataFile = await require('../data/api/task/task.template.api.json');
        var templateData = await templateDataFile.AutoTaskTemplateNewProcess;

        templateData.fieldInstances[7].value = TaskTemplate[data.templateStatus];
        templateData.fieldInstances[8].value = data.templateSummary;
        templateData.fieldInstances[1000001437].value = data.templateName;
        templateData.fieldInstances[450000154].value = data.processBundle;
        templateData.fieldInstances[450000141].value = data.processName;
        //data.company ? templateData.fieldInstances[301566300].value = data.templateSummary;

        var newTaskTemplate: AxiosResponse = await coreApi.createRecordInstance(templateData);

        console.log('Create Automated Task Template API Status =============>', newTaskTemplate.status);
        const taskTemplateDetails = await axios.get(
            await newTaskTemplate.headers.location
        );
        console.log('New Automated Task Template Details API Status =============>', taskTemplateDetails.status);

        return {
            id: taskTemplateDetails.data.id,
            displayId: taskTemplateDetails.data.displayId
        };
    }

    async createNewUser(data: IPerson): Promise<string> {
        var personGuid = await coreApi.getPersonGuid(data.userId);
        if (personGuid == null) {
            var userDataFile = await require('../data/api/foundation/new.user.api.json');
            var userData = await userDataFile.NewUser;
            userData.fieldInstances[1000000019].value = data.firstName;
            userData.fieldInstances[1000000018].value = data.lastName;
            userData.fieldInstances[4].value = data.userId;
            //data.emailId ? userData.fieldInstances[1000000048].value = data.emailId : null;

            const newUser = await coreApi.createRecordInstance(userData);
            console.log('Create New User Details API Status =============>', newUser.status);

            const userDetails = await axios.get(
                newUser.headers.location
            );

            console.log('Get New User Details API Status =============>', userDetails.status);
            var recordName: string = userDetails.data.recordDefinitionName;
            var recordGUID: string = userDetails.data.id;
            var recordDisplayId: string = userDetails.data.displayId;

            var updateUser = await userDataFile.EnableUser;
            updateUser.displayId = recordDisplayId;
            updateUser.id = recordGUID;

            const userUpdate = await coreApi.updateRecordInstance(recordName, recordGUID, updateUser);
            console.log('Enable User API Status =============>', userUpdate.status);
            return recordGUID;
        } else {
            console.log('New User API Status =============> User already exists =============> ', personGuid);
            return personGuid;
        }
    }

    async associatePersonToCompany(userId: string, company: string): Promise<void> {
        let userGuid = await coreApi.getPersonGuid(userId);
        let companyGuid = await coreApi.getOrganizationGuid(company);
        await coreApi.associateFoundationElements("Agent Supports Primary Organization", userGuid, companyGuid);
    }

    async associatePersonToSupportGroup(userId: string, supportGroup: string): Promise<void> {
        let userGuid = await coreApi.getPersonGuid(userId);
        let supportGroupGuid = await coreApi.getSupportGroupGuid(supportGroup);
        await coreApi.associateFoundationElements("Person to Support Secondary Organization", userGuid, supportGroupGuid);
    }

    async associateCaseTemplateWithOneTaskTemplate(caseTemplateId: string, taskTemplateId: string): Promise<void> {
        var oneTaskFlowProcess = await require('../data/api/task/taskflow.one.process.api.json');
        var taskTemplateGuid = await coreApi.getTaskTemplateGuid(taskTemplateId);
        var randomString: string = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        oneTaskFlowProcess.name = await oneTaskFlowProcess.name + "_" + randomString;

        var taskTemplateJsonData = await apiCoreUtil.getRecordInstanceDetails("com.bmc.dsm.task-lib:Task Template", taskTemplateGuid);
        var taskSummary = taskTemplateJsonData.fieldInstances[8].value;

        oneTaskFlowProcess.flowElements.forEach(function (obj, index) {
            if (obj.inputMap) {
                obj.inputMap.forEach(function (innerObj: any) {
                    if (innerObj.expression == `"templateId"`) {
                        innerObj.expression = `"${taskTemplateGuid}"`;
                    }
                    if (innerObj.expression == "\"My one task process\"") {
                        innerObj.expression = `"${taskSummary}"`;
                    }
                });
            }
        });
        var processGuid = await coreApi.createProcess(oneTaskFlowProcess);
        console.log('New Process Created =============>', oneTaskFlowProcess.name, "=====GUID:", processGuid);
        var caseTemplateGuid = await coreApi.getCaseTemplateGuid(caseTemplateId);
        var caseTemplateJsonData = await apiCoreUtil.getRecordInstanceDetails("com.bmc.dsm.case-lib:Case Template", caseTemplateGuid);
        caseTemplateJsonData.fieldInstances[450000165].value = oneTaskFlowProcess.name;
        apiCoreUtil.updateRecordInstance("com.bmc.dsm.case-lib:Case Template", caseTemplateGuid, caseTemplateJsonData);
    }

    async associateCaseTemplateWithTwoTaskTemplate(caseTemplateId: string, taskTemplateId1: string, taskTemplateId2: string, order: string): Promise<void> {
        var twoTaskFlowProcess: any;
        if (order.toLocaleLowerCase() === 'sequential')
            twoTaskFlowProcess = await require('../data/api/task/taskflow.sequential.two.process.api.json');

        if (order.toLocaleLowerCase() === 'parallel')
            twoTaskFlowProcess = await require('../data/api/task/taskflow.parallel.two.process.api.json');

        var taskTemplateGuid1 = await coreApi.getTaskTemplateGuid(taskTemplateId1);
        var taskTemplateGuid2 = await coreApi.getTaskTemplateGuid(taskTemplateId2);
        var randomString: string = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        twoTaskFlowProcess.name = await twoTaskFlowProcess.name + "_" + randomString;

        twoTaskFlowProcess.flowElements.forEach(function (obj, index) {
            if (obj.inputMap) {
                obj.inputMap.forEach(function (innerObj: any) {
                    if (innerObj.expression == `"templateId1"`) {
                        innerObj.expression = `"${taskTemplateGuid1}"`;
                    }
                    if (innerObj.expression == `"templateId2"`) {
                        innerObj.expression = `"${taskTemplateGuid2}"`;
                    }
                });
            }
        });
        var processGuid = await coreApi.createProcess(twoTaskFlowProcess);
        console.log('New Process Created =============>', twoTaskFlowProcess.name, "=====GUID:", processGuid);
        var caseTemplateGuid = await coreApi.getCaseTemplateGuid(caseTemplateId);
        var caseTemplateJsonData = await apiCoreUtil.getRecordInstanceDetails("com.bmc.dsm.case-lib:Case Template", caseTemplateGuid);
        caseTemplateJsonData.fieldInstances[450000165].value = twoTaskFlowProcess.name;
        apiCoreUtil.updateRecordInstance("com.bmc.dsm.case-lib:Case Template", caseTemplateGuid, caseTemplateJsonData);
    }

    async createNotesTemplate(module: string, data: INotesTemplate): Promise<boolean> {
        let notesTemplateFile = await require('../data/api/social/notes.template.api.json');
        let templateData = await notesTemplateFile.NotesTemplateData;
        let companyGuid = await coreApi.getOrganizationGuid(data.company);
        templateData.processInputValues["Company"] = companyGuid;
        templateData.processInputValues["Template Name"] = data.templateName;
        templateData.processInputValues["Status"] = data.templateStatus;
        templateData.processInputValues["MessageBody"] = data.body;

        switch (module) {
            case "Case": {
                templateData.processInputValues["Module"] = "Cases";
                templateData.processInputValues["Source Definition Name"] = "com.bmc.dsm.case-lib:Case";
                templateData.processInputValues["Description"] = "CasesActivity Notes Template";
                break;
            }
            case "Task": {
                templateData.processInputValues["Module"] = "Tasks";
                templateData.processInputValues["Source Definition Name"] = "com.bmc.dsm.task-lib:Task";
                templateData.processInputValues["Description"] = "TasksActivity Notes Template";
                break;
            }
            case "People": {
                templateData.processInputValues["Module"] = "Person";
                templateData.processInputValues["Source Definition Name"] = "com.bmc.arsys.rx.foundation:Person";
                templateData.processInputValues["Description"] = "PersonActivity Notes Template";
                break;
            }
            case "Knowledge": {
                templateData.processInputValues["Module"] = "Knowledge";
                templateData.processInputValues["Source Definition Name"] = "com.bmc.dsm.knowledge:Knowledge Article";
                templateData.processInputValues["Description"] = "KnowledgeActivity Notes Template";
                break;
            }
            default: {
                console.log("Invalid module name");
                break;
            }
        }
        const newTemplate = await coreApi.createNotesTemplate(templateData);
        console.log('Create Notes Template API Status =============>', newTemplate.status);
        return newTemplate.status == 201;
    }

}

export default new ApiHelper();