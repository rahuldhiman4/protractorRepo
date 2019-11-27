import axios, { AxiosResponse } from "axios";
import apiUtil from "../api/utils/api.common";

export interface ITemplate {
    id: string;
    displayId: string;
}

const recordInstanceUri = "/api/rx/application/record/recordinstance";

class CreateRecordInstanceApi {
    async createCaseTemplateWithRequiredFields(templateName: string, status: string): Promise<ITemplate> {
        var templateDataFile = await require('../data/api/case.template.api.json');
        var templateData = await templateDataFile.CaseTemplateRequiredData;
        if (status.toLowerCase() == 'draft') {
            templateData.fieldInstances[7].value = 1000;
        } else if (status.toLowerCase() == 'active') {
            templateData.fieldInstances[7].value = 2000;
        }

        templateData.fieldInstances[8].value = templateName;
        templateData.fieldInstances[1000001437].value = templateName;

        const newCaseTemplate = await axios.post(
            recordInstanceUri,
            templateData
        );

        console.log('Create Case Template API Status =============>', newCaseTemplate.status);
        const caseTemplateDetails = await axios.get(
            newCaseTemplate.headers.location
        );
        console.log('New Case Template Details API Status =============>', caseTemplateDetails.status);

        return {
            id: caseTemplateDetails.data.id,
            displayId: caseTemplateDetails.data.displayId
        };
    }

    async createManualTaskTemplateWithRequiredFields(templateName: string, status: string): Promise<ITemplate> {
        var templateDataFile = await require('../data/api/task.template.api.json');
        var templateData = await templateDataFile.ManualTaskTemplateRequiredData;
        if (status.toLowerCase() == 'draft') {
            templateData.fieldInstances[7].value = 1000;
        } else if (status.toLowerCase() == 'active') {
            templateData.fieldInstances[7].value = 2000;
        }

        templateData.fieldInstances[8].value = templateName;
        templateData.fieldInstances[1000001437].value = templateName;

        const newTaskTemplate = await axios.post(
            recordInstanceUri,
            templateData
        );

        console.log('Create Manual Task Template API Status =============>', newTaskTemplate.status);
        const taskTemplateDetails = await axios.get(
            newTaskTemplate.headers.location
        );
        console.log('New Manual Task Template Details API Status =============>', taskTemplateDetails.status);

        return {
            id: taskTemplateDetails.data.id,
            displayId: taskTemplateDetails.data.displayId
        };
    }

    async createAutoTaskTemplateNewProcessWithRequiredFields(templateName: string, processBundle: string, processName: string, status: string): Promise<ITemplate> {
        var templateDataFile = await require('../data/api/task.template.api.json');
        var templateData = await templateDataFile.AutoTaskTemplateNewProcessRequiredData;
        if (status.toLowerCase() == 'draft') {
            templateData.fieldInstances[7].value = 1000;
        } else if (status.toLowerCase() == 'active') {
            templateData.fieldInstances[7].value = 2000;
        }

        templateData.fieldInstances[8].value = templateName;
        templateData.fieldInstances[1000001437].value = templateName;
        templateData.fieldInstances[450000154].value = processBundle;
        templateData.fieldInstances[450000141].value = processName;

        const newTaskTemplate = await axios.post(
            recordInstanceUri,
            templateData
        );

        console.log('Create Automated Task Template API Status =============>', newTaskTemplate.status);
        const taskTemplateDetails = await axios.get(
            newTaskTemplate.headers.location
        );
        console.log('New Automated Task Template Details API Status =============>', taskTemplateDetails.status);

        return {
            id: taskTemplateDetails.data.id,
            displayId: taskTemplateDetails.data.displayId
        };
    }

    async createNewUser(firstName: string, userId: string): Promise<string> {
        var personGuid = await apiUtil.getPersonGuid(userId);
        if (personGuid == null) {
            var userDataFile = await require('../data/api/new.user.api.json');
            var userData = await userDataFile.NewUser;
            userData.fieldInstances[1000000019].value = firstName;
            userData.fieldInstances[1000000018].value = userId;
            userData.fieldInstances[4].value = userId;
            userData.fieldInstances[1000000048].value = `${userId}@petramco.com`;

            const newUser = await axios.post(
                recordInstanceUri,
                userData
            );
            console.log('New User Details API Status =============>', newUser.status);

            const userDetails = await axios.get(
                newUser.headers.location
            );
            console.log('New User Details API Status =============>', userDetails.status);
            var recordName: string = userDetails.data.recordDefinitionName;
            var recordGUID: string = userDetails.data.id;
            var recordDisplayId: string = userDetails.data.displayId;

            var updateUser = await userDataFile.EnableUser;
            updateUser.displayId = recordDisplayId;
            updateUser.id = recordGUID;

            const userUpdate = await axios.put(
                recordInstanceUri + "/" + recordName + "/" + recordGUID,
                updateUser
            );
            console.log('Enable User API Status =============>', userUpdate.status);
            return recordGUID;
        } else {
            console.log('New User API Status =============> User already exists =============> ', personGuid);
            return personGuid;
        }
    }
}

export default new CreateRecordInstanceApi();