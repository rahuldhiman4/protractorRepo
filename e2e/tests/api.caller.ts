import { ProtractorExpectedConditions, protractor } from "protractor";
import apiHelper from "../api/api.helper";
import apiCoreUtil from '../api/api.core.util';

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
            "templateName": "global case template 1",
            "templateSummary": "global case template summary 1",
            "templateStatus": "Active",
            "company": '- Global -'
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
            "company": '- Global -'
        }

        await apiHelper.apiLogin('qkatawazi');
        var manualTaskTemplate = await apiHelper.createManualTaskTemplate(templateData);
        console.log("active task Template is created===", manualTaskTemplate.id);
        console.log("active task Template is created===", manualTaskTemplate.displayId);
    });

    it('create external task template', async () => {
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
            "templateName": "case template name 5",
            "templateSummary": "case template summary 5",
            "templateStatus": "Active",
        }
        var newCaseTemplate = await apiHelper.createCaseTemplate(caseTemplateData);
        var manualTaskTemplateData = {
            "templateName": "manual task template name 5",
            "templateSummary": "manual task template summary 5",
            "templateStatus": "Active",
        }
        var manualTaskTemplate = await apiHelper.createManualTaskTemplate(manualTaskTemplateData);

        var autoTaskTemplateData = {
            "templateName": "auto task template 5",
            "templateSummary": "auto task template summary 5",
            "templateStatus": "Active",
            "processBundle": "com.bmc.dsm.case-lib",
            "processName": "Case Process 5",
        }
        var autoTaskTemplate = await apiHelper.createAutomatedTaskTemplate(autoTaskTemplateData);

        console.log(newCaseTemplate.id, "\ntaskID\n", manualTaskTemplate.id, "\ntaskID\n", autoTaskTemplate.id);
        console.log(newCaseTemplate.displayId, "\ntaskID\n", manualTaskTemplate.displayId, "\ntaskID\n", autoTaskTemplate.displayId);

        await apiHelper.associateCaseTemplateWithOneTaskTemplate(newCaseTemplate.displayId, manualTaskTemplate.displayId);
        await apiHelper.associateCaseTemplateWithTwoTaskTemplate(newCaseTemplate.displayId, manualTaskTemplate.displayId, autoTaskTemplate.displayId, "sequential");
        await apiHelper.associateCaseTemplateWithTwoTaskTemplate(newCaseTemplate.displayId, manualTaskTemplate.displayId, autoTaskTemplate.displayId, "parallel");
        //await apiHelper.associateCaseTemplateWithOneTaskTemplate('CTPL-0000000214', 'TTPL-0000000506');
        //await apiHelper.associateCaseTemplateWithTwoTaskTemplate('CTPL-0000000215', 'TTPL-0000000517', 'TTPL-0000000518', "sequential");
    });

    it('create Email template', async () => {
        await apiHelper.apiLogin('tadmin');
        let randomStr = [...Array(4)].map(i=>(~~(Math.random()*36)).toString(36)).join('');
        let emailTemplateData = require('../data/ui/email/email.template.ui.json');
        let emailTemplateName: string = await emailTemplateData['emailTemplateWithMandatoryField'].TemplateName + randomStr;
        emailTemplateData['notesTemplateWithMandatoryField'].templateName = emailTemplateName; 
        await apiHelper.createEmailTemplate(emailTemplateData['emailTemplateWithMandatoryField']);
    });
    
    it('create notes template', async () => {
        await apiHelper.apiLogin('tadmin');
        let randomStr = [...Array(4)].map(i=>(~~(Math.random()*36)).toString(36)).join('');
        let notesTemplateData = require('../data/ui/social/notesTemplate.ui.json');
        let notesTemplateName: string = await notesTemplateData['notesTemplateWithMandatoryField'].templateName + randomStr;
        notesTemplateData['notesTemplateWithMandatoryField'].templateName = notesTemplateName; 
        await apiHelper.createNotesTemplate("People", notesTemplateData['notesTemplateWithMandatoryField']);
    });

    it('associate categories', async () => {
        // associate Briefings to Incident
        let globalCategName = 'DemoCateg1';
        let categName2 = 'DemoCateg2';
        let categName3 = 'DemoCateg3';
        let categName4 = 'DemoCateg4';
        await apiHelper.apiLogin('tadmin');
        await apiHelper.createOperationalCategory(globalCategName, true);
        await apiHelper.createOperationalCategory(categName2);
        await apiHelper.createOperationalCategory(categName3);
        await apiHelper.createOperationalCategory(categName4);
        await apiHelper.associateCategoryToCategory(globalCategName, categName2);
        await apiHelper.associateCategoryToCategory(categName2, categName3);
        await apiHelper.associateCategoryToCategory(categName3, categName4);
    });

    it('create menu item', async () => {
        await apiHelper.apiLogin('qkatawazi');
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let menuItemDataFile = require('../data/ui/ticketing/menuItem.ui.json');
        let menuItemName: string = await menuItemDataFile['sampleMenuItem'].menuItemName + randomStr;
        menuItemDataFile['sampleMenuItem'].menuItemName = menuItemName;
        await apiHelper.createNewMenuItem(menuItemDataFile['sampleMenuItem']);
    });

    it('delete all', async() => {
        await apiHelper.apiLogin('tadmin');
        var recDeleted = await apiHelper.deleteDynamicFieldAndGroup('FG2');
        console.log("Record deleted...", recDeleted);
        var deleted = await apiHelper.deleteDynamicFieldAndGroup();
        console.log("Records deleted...", deleted);
    });

    it('Get organization guid', async() => {
        await apiHelper.apiLogin('qkatawazi');
        let org1 = 'Petramco';
        let org2 = '- Global -';
        let orgGuid1  = await apiCoreUtil.getOrganizationGuid(org1);
        console.log("Org1 GUID...", org1, " ", orgGuid1);
        let orgGuid2  = await apiCoreUtil.getOrganizationGuid(org2);
        console.log("Org2 GUID...", org2, " ", orgGuid2);
    });
})
