import { ProtractorExpectedConditions, protractor } from "protractor";
import apiHelper from "../api/api.helper";

describe('Login and create case from API', () => {
    const EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    xit('create case template', async () => {
        var templateData = {
            "templateName": "case template 2",
            "templateStatus": "Active",
        }

        await apiHelper.apiLogin('qkatawazi');
        var newCaseTemplate = await apiHelper.createCaseTemplate(templateData);
        console.log("active case Template is created===", newCaseTemplate.id);
        console.log("active case Template is created===", newCaseTemplate.displayId);
    });

    xit('create manual task template', async () => {
        var templateData = {
            "templateName": "task template 1",
            "templateSummary": "task template summary 1",
            "templateStatus": "Active",
        }

        await apiHelper.apiLogin('qkatawazi');
        var manualTaskTemplate = await apiHelper.createManualTaskTemplate(templateData);
        console.log("active case Template is created===", manualTaskTemplate.id);
        console.log("active case Template is created===", manualTaskTemplate.displayId);
    });

    xit('create auto task template', async () => {
        var templateData = {
            "templateName": "task template 1",
            "templateSummary": "task template summary 1",
            "templateStatus": "Active",
            "processBundle": "com.bmc.arsys.rx.approval",
            "processName": "Approval Process 1",
        }

        await apiHelper.apiLogin('qkatawazi');
        var autoTaskTemplate = await apiHelper.createAutomatedTaskTemplate(templateData);
        console.log("active case Template is created===", autoTaskTemplate.id);
        console.log("active case Template is created===", autoTaskTemplate.displayId);
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
})
