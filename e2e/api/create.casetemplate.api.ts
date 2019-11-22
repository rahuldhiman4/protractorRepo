import axios, { AxiosResponse } from "axios";

export interface ICaseTemplate {
    id: string;
    displayId: string;
}

class CaseTemplateApi {
    async createCaseTemplate(templateName: string, status: string): Promise<ICaseTemplate> {
        var templateDataFile = require('../data/api/case.template.api.json');
        if (status.toLowerCase() == 'draft') {
            var templateData = templateDataFile.draftTemplate;
        } else if (status.toLowerCase() == 'active') {
            var templateData = templateDataFile.activeTemplate;
        }
        templateData.fieldInstances[8].value = templateName;
        templateData.fieldInstances[1000001437].value = templateName;

        const newCaseTemplate = await axios.post(
            "/api/rx/application/record/recordinstance",
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
}

export default new CaseTemplateApi();