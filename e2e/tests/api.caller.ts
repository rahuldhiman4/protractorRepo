import { ProtractorExpectedConditions, protractor } from "protractor";
import apiHelper from "../api/api.helper";

describe('Login and create case from API', () => {
    const EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    it('create case', async () => {
        var caseData = 
        {
            "Requester": "qtao",
            "Summary": "Testing case creation with minimal input data"
        }
        await apiHelper.apiLogin('qtao');
        var newCaseTemplate = await apiHelper.createCase(caseData);
        console.log("case is created===", newCaseTemplate.id);
        console.log("case is created===", newCaseTemplate.displayId);
    });

    it('create case template', async () => {
        var templateData = {
            "templateName": "case template 2",
            "templateSummary": "case template summary 2",
            "templateStatus": "Active",
        }

        await apiHelper.apiLogin('qkatawazi');
        var newCaseTemplate = await apiHelper.createCaseTemplate(templateData);
        console.log("active case Template is created===", newCaseTemplate.id);
        console.log("active case Template is created===", newCaseTemplate.displayId);
    });

    it('create manual task template', async () => {
        var templateData = {
            "templateName": "task template 1",
            "templateSummary": "task template summary 1",
            "templateStatus": "Active",
        }

        await apiHelper.apiLogin('qkatawazi');
        var manualTaskTemplate = await apiHelper.createManualTaskTemplate(templateData);
        console.log("active task Template is created===", manualTaskTemplate.id);
        console.log("active task Template is created===", manualTaskTemplate.displayId);
    });

    fit('create external task template', async () => {
        var templateData = {
            "templateName": "external task template 2",
            "templateSummary": "external task template summary 2",
            "templateStatus": "Active",
        }

        await apiHelper.apiLogin('qkatawazi');
        var externalTaskTemplate = await apiHelper.createExternalTaskTemplate(templateData);
        console.log("external task Template is created===", externalTaskTemplate.id);
        console.log("external task Template is created===", externalTaskTemplate.displayId);
    });

    it('create auto task template', async () => {
        var templateData = {
            "templateName": "task template 1",
            "templateSummary": "task template summary 1",
            "templateStatus": "Active",
            "processBundle": "com.bmc.arsys.rx.approval",
            "processName": "Approval Process 1",
        }

        await apiHelper.apiLogin('qkatawazi');
        var autoTaskTemplate = await apiHelper.createAutomatedTaskTemplate(templateData);
        console.log("active task Template is created===", autoTaskTemplate.id);
        console.log("active task Template is created===", autoTaskTemplate.displayId);
    });

    it('create user with psilon and petramco access', async () => {
        await apiHelper.apiLogin('tadmin');
        var userData = {
            "firstName": "Petramco2",
            "lastName": "Psilon2",
            "userId": "psilopetra2",
        }
        await apiHelper.createNewUser(userData);
        await apiHelper.associatePersonToCompany(userData.userId, "Petramco");
        await apiHelper.associatePersonToCompany(userData.userId, "Psilon");
    });

    it('Associate task template to case template', async () => {

        await apiHelper.apiLogin('qkatawazi');

        var caseTemplateData = {
            "templateName": "case template name 6",
            "templateSummary": "case template summary 6",
            "templateStatus": "Active",
        }
        var newCaseTemplate = await apiHelper.createCaseTemplate(caseTemplateData);
        var taskTemplateData = {
            "templateName": "task template name 6",
            "templateSummary": "task template summary 6",
            "templateStatus": "Active",
        }
        var manualTaskTemplate = await apiHelper.createManualTaskTemplate(taskTemplateData);

        console.log(newCaseTemplate.id, "\ntaskID\n", manualTaskTemplate.id);
        console.log(newCaseTemplate.displayId, "\ntaskID\n", manualTaskTemplate.displayId);

        await apiHelper.associateCaseTemplateWithOneTaskTemplate(newCaseTemplate.displayId, manualTaskTemplate.displayId);
        //await apiHelper.associateCaseTemplateWithOneTaskTemplate('CTPL-0000000214', 'TTPL-0000000506');
    });
})
