import axios, { AxiosResponse } from "axios";
import { browser } from 'protractor';
import { ICaseTemplate } from "../data/api/interface/case.template.interface.api";
import coreApi from "../api/api.core.util";
import { CaseTemplate } from "../api/constant.api";
import { TaskTemplate } from "../api/constant.api";
import { ITaskTemplate } from 'e2e/data/api/interface/task.template.interface.api';
import { IPerson } from 'e2e/data/api/interface/person.interface.api';

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
            "/api/rx/authentication/loginrequest",
            { "userName": username, "password": password },
        )
        console.log('Login API Status =============>', response.status);
        axios.defaults.headers.common['Cookie'] = `AR-JWT=${response.data}`;
    }

    async createCase(body: string): Promise<IIDs> {
        const newCase = await axios.post(
            "/api/com.bmc.dsm.case-lib/cases",
            body
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

        templateData.fieldInstances[8].value = data.templateName;
        templateData.fieldInstances[1000001437].value = CaseTemplate[data.templateStatus];
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

        console.log('Create Task Template API Status =============>', newTaskTemplate.status);
        const taskTemplateDetails = await axios.get(
            await newTaskTemplate.headers.location
        );
        console.log('New Task Template Details API Status =============>', taskTemplateDetails.status);

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

        console.log('Create Task Template API Status =============>', newTaskTemplate.status);
        const taskTemplateDetails = await axios.get(
            await newTaskTemplate.headers.location
        );
        console.log('New Task Template Details API Status =============>', taskTemplateDetails.status);

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
        coreApi.associateFoundationElements("Agent Supports Primary Organization", userGuid, companyGuid);
    }
}

export default new ApiHelper();