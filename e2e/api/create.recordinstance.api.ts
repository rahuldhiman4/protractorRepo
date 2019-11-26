import axios, { AxiosResponse } from "axios";

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
}

export default new CreateRecordInstanceApi();