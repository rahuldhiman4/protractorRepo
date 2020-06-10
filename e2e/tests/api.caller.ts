import { protractor, ProtractorExpectedConditions } from "protractor";
import apiCoreUtil from '../api/api.core.util';
import apiHelper from "../api/api.helper";

describe('Login and create case from API', () => {
    const EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    it('create case', async () => {
        let caseData =
        {
            "Requester": "qtao",
            "Summary": "Testing case creation with minimal input data"
        }
        await apiHelper.apiLogin('qtao');
        let newCaseTemplate = await apiHelper.createCase(caseData);
        console.log("case is created===", newCaseTemplate.id);
        console.log("case is created===", newCaseTemplate.displayId);
    });

    it('create case template', async () => {
        let templateData = {
            "templateName": "case template 6",
            "templateSummary": "case template summary 6",
            "templateStatus": "Draft",
            "company": '- Global -',
            "ownerCompany": 'Petramco',
            "ownerBU": 'Unites States Support',
            "ownerGroup": 'US Support 1',
        }

        let templateData2 = {
            "templateName": 'caseTemplateName13',
            "templateSummary": 'caseTemplateName13',
            "categoryTier1": "Purchasing Card",
            "categoryTier2": "Policies",
            "categoryTier3": "Card Issuance",
            "casePriority": "Low",
            "templateStatus": "Active",
            "company": "Petramco",
            "ownerCompany": "Petramco",
            "ownerBU": "Facilities Support",
            "ownerGroup": "Facilities",
            "assigneeCompany": "Petramco",
            "assigneeBU": "Facilities Support",
            "assigneeSupportGroup": "Facilities",
            "assignee": "Floretta",
        }

        await apiHelper.apiLogin('fritz');
        let newCaseTemplate = await apiHelper.createCaseTemplate(templateData2);
        console.log("active case Template is created===", newCaseTemplate.id);
        console.log("active case Template is created===", newCaseTemplate.displayId);
        let caseTemplateStatusUpdate = await apiHelper.updateCaseTemplateStatus(newCaseTemplate.id, 'Inactive');
        console.log("Case template status update==>", caseTemplateStatusUpdate);
    });

    it('create manual task template', async () => {
        let templateData = {
            "templateName": "task template 1",
            "templateSummary": "task template summary 1",
            "templateStatus": "Active",
            "taskCompany": "Petramco",
            "ownerCompany": "Petramco",
            "ownerBusinessUnit": "Facilities Support",
            "ownerGroup": "Facilities"
        }

        await apiHelper.apiLogin('qkatawazi');
        let manualTaskTemplate = await apiHelper.createManualTaskTemplate(templateData);
        console.log("active task Template is created===", manualTaskTemplate.id);
        console.log("active task Template is created===", manualTaskTemplate.displayId);
    });

    it('create external task template', async () => {
        let templateData = {
            "templateName": "external task template 2",
            "templateSummary": "external task template summary 2",
            "templateStatus": "Active",
            "taskCompany": "Petramco",
            "ownerCompany": "Petramco",
            "ownerBusinessUnit": "Facilities Support",
            "ownerGroup": "Facilities"
        }

        await apiHelper.apiLogin('qkatawazi');
        let externalTaskTemplate = await apiHelper.createExternalTaskTemplate(templateData);
        console.log("external task Template is created===", externalTaskTemplate.id);
        console.log("external task Template is created===", externalTaskTemplate.displayId);
    });

    it('create auto task template', async () => {
        let templateData = {
            "templateName": "task template new 1",
            "templateSummary": "task template summary new 1",
            "templateStatus": "Active",
            "processBundle": "com.bmc.dsm.case-lib",
            "processName": "Task Process new 1",
            "taskCompany": "Petramco",
            "ownerCompany": "Petramco",
            "ownerBusinessUnit": "Facilities Support",
            "ownerGroup": "Facilities"
        }

        await apiHelper.apiLogin('qkatawazi');
        let autoTaskTemplate = await apiHelper.createAutomatedTaskTemplate(templateData);
        console.log("active task Template is created===", autoTaskTemplate.id);
        console.log("active task Template is created===", autoTaskTemplate.displayId);
    });

    it('create user with psilon and petramco access', async () => {
        await apiHelper.apiLogin('tadmin');
        let userData = {
            "firstName": "Petramco2",
            "lastName": "Psilon2",
            "userId": "psilopetra2",
        }
        await apiHelper.createNewUser(userData);
        await apiHelper.associatePersonToCompany(userData.userId, "Petramco");
        await apiHelper.associatePersonToCompany(userData.userId, "Psilon");
    });

    fit('Associate task template to case template', async () => {

        await apiHelper.apiLogin('qkatawazi');

        let caseTemplateData = {
            "templateName": "case template name 1",
            "templateSummary": "case template summary 1",
            "templateStatus": "Active",
        }
        let newCaseTemplate = await apiHelper.createCaseTemplate(caseTemplateData);
        let manualTaskTemplateData = {
            "templateName": "manual task template name 1",
            "templateSummary": "manual task template summary 1",
            "templateStatus": "Active",
            "taskCompany": "Petramco",
            "ownerCompany": "Petramco",
            "ownerBusinessUnit": "Facilities Support",
            "ownerGroup": "Facilities"
        }
        let manualTaskTemplate = await apiHelper.createManualTaskTemplate(manualTaskTemplateData);

        let externalTaskTemplateData = {
            "templateName": "external task template name 1",
            "templateSummary": "external task template summary 1",
            "templateStatus": "Active",
            "taskCompany": "Petramco",
            "ownerCompany": "Petramco",
            "ownerBusinessUnit": "Facilities Support",
            "ownerGroup": "Facilities"
        }
        let externalTaskTemplate = await apiHelper.createExternalTaskTemplate(externalTaskTemplateData);

        let autoTaskTemplateData = {
            "templateName": "auto task template 1",
            "templateSummary": "auto task template summary 1",
            "templateStatus": "Active",
            "processBundle": "com.bmc.dsm.case-lib",
            "processName": "Case Process 1",
            "taskCompany": "Petramco",
            "ownerCompany": "Petramco",
            "ownerBusinessUnit": "Facilities Support",
            "ownerGroup": "Facilities"
        }
        let autoTaskTemplate = await apiHelper.createAutomatedTaskTemplate(autoTaskTemplateData);

        console.log(newCaseTemplate.id, "\ntaskID\n", manualTaskTemplate.id, "\ntaskID\n", autoTaskTemplate.id);
        console.log(newCaseTemplate.displayId, "\ntaskID\n", manualTaskTemplate.displayId, "\ntaskID\n", autoTaskTemplate.displayId);

        //await apiHelper.associateCaseTemplateWithOneTaskTemplate(newCaseTemplate.displayId, manualTaskTemplate.displayId);
        //await apiHelper.associateCaseTemplateWithTwoTaskTemplate(newCaseTemplate.displayId, manualTaskTemplate.displayId, autoTaskTemplate.displayId, "sequential");
        //await apiHelper.associateCaseTemplateWithTwoTaskTemplate(newCaseTemplate.displayId, manualTaskTemplate.displayId, autoTaskTemplate.displayId, "parallel");
        await apiHelper.associateCaseTemplateWithThreeTaskTemplate(newCaseTemplate.displayId, manualTaskTemplate.displayId, externalTaskTemplate.displayId, autoTaskTemplate.displayId);
        //await apiHelper.associateCaseTemplateWithOneTaskTemplate('CTPL-0000000214', 'TTPL-0000000506');
        //await apiHelper.associateCaseTemplateWithTwoTaskTemplate('CTPL-0000000215', 'TTPL-0000000517', 'TTPL-0000000518', "sequential");
    });

    it('create Email template', async () => {
        await apiHelper.apiLogin('tadmin');
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let emailTemplateData = require('../data/ui/email/email.template.ui.json');
        let emailTemplateName: string = await emailTemplateData['emailTemplateWithMandatoryField'].TemplateName + randomStr;
        emailTemplateData['notesTemplateWithMandatoryField'].templateName = emailTemplateName;
        await apiHelper.createEmailTemplate(emailTemplateData['emailTemplateWithMandatoryField']);
    });

    it('create notes template', async () => {
        await apiHelper.apiLogin('tadmin');
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
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

    it('delete all', async () => {
        await apiHelper.apiLogin('tadmin');
        let recDeleted = await apiHelper.deleteDynamicFieldAndGroup('FG2');
        console.log("Record deleted...", recDeleted);
        let deleted = await apiHelper.deleteDynamicFieldAndGroup();
        console.log("Records deleted...", deleted);
    });

    it('Get organization guid', async () => {
        await apiHelper.apiLogin('qkatawazi');
        let org1 = 'Petramco';
        let org2 = '- Global -';
        let orgGuid1 = await apiCoreUtil.getOrganizationGuid(org1);
        console.log("Org1 GUID...", org1, " ", orgGuid1);
        let orgGuid2 = await apiCoreUtil.getOrganizationGuid(org2);
        console.log("Org2 GUID...", org2, " ", orgGuid2);
    });

    it('create process lib config', async () => {
        await apiHelper.apiLogin('qkatawazi');
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');

        let processLibConfData = {
            applicationServicesLib: "com.bmc.arsys.rx.approval",
            processName: "com.bmc.arsys.rx.approval:ApprovalSampleFlow",
            processAliasName: `New Process${randomStr}`,
            company: "Petramco",
            description: `Test the data${randomStr}`,
            status: "Active"
        }
        let newProcess = await apiHelper.createProcessLibConfig(processLibConfData);
        if (newProcess.id) {
            console.log("Success");
        } else console.log("Failed");
    });
    it('Delete Process Lib Config', async () => {
        await apiHelper.apiLogin('tadmin');
        let processName = 'com.bmc.arsys.rx.approval:Approval Executor';
        let isDeleted = await apiHelper.deleteFlowsetProcessLibConfig(processName);
        console.log("Process Lib Config deleted?.. ", isDeleted);
    });

    it('Create doc lib', async () => {
        let docLibData = {
            docLibTitle: 'NewDocLib',
            company: 'Petramco',
            ownerGroup: 'Facilities',
            shareExternally: true
        }
        // delete if doc lib with same name exists
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteDocumentLibrary(docLibData.docLibTitle);
        await apiHelper.apiLogin('qkatawazi');
        let filePath = "e2e/data/api/attachment/demo.txt";
        let docLib = await apiHelper.createDocumentLibrary(docLibData, filePath);
        await apiHelper.apiLogin('fritz');   //Always login from the owner group member to assign access 
        let docLibReadAccess = await apiHelper.giveReadAccessToDocLib(docLib, "Compensation and Benefits");
        console.log("Read Access defined?..", docLibReadAccess)
        let docLibPublished = await apiHelper.publishDocumentLibrary(docLib);
        console.log("doc lib created, published?.. ", docLibPublished);
    });
});
