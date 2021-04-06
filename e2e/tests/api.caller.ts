import axios from "axios";
import { protractor, ProtractorExpectedConditions } from "protractor";
import apiCoreUtil from '../api/api.core.util';
import apiHelper from "../api/api.helper";
import { NOTES_TEMPLATE_MANDATORY_FIELD } from '../data/ui/Social/notesTemplate.api';

describe('Login and create case from API', () => {
    const EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
    it('create case', async () => {
        let caseData =
        {
            "Requester": "qtao",
            "Summary": "case in progress " + randomStr,
            "Assigned Company": "Petramco",
            "Business Unit": "United States Support",
            "Support Group": "US Support 3",
            "Assignee": "qkatawazi",
            "Status": "In Progress",
        }
        await apiHelper.apiLogin('qkatawazi');
        let newCaseTemplate = await apiHelper.createCase(caseData);
        console.log("case is created===", newCaseTemplate.id);
        console.log("case is created===", newCaseTemplate.displayId);
    });

    it('create lob', async () => {
        let lob =
        {
            "lobName": "Checking1234",
            "description": "checking1234 description",
        }
        await apiHelper.apiLogin('tadmin');
        let newCaseTemplate = await apiHelper.createLineOfBuisness(lob);

    });

    it('create case with DWP', async () => {
        let caseData =
        {
            "requester": "qtao",
            "summary": "Testing case creation with minimal input data"
        }
        await apiHelper.apiLogin('qkatawazi');
        let newCaseTemplate = await apiHelper.createCaseFromDwp(caseData);
        console.log("case is created===", newCaseTemplate.id);
        console.log("case is created===", newCaseTemplate.displayId);
    });

    it('update case status', async () => {
        let caseData = {
            "Requester": "Fritz",
            "Summary": "Test case for inProgress task",
            "Assigned Company": "Petramco",
            "Business Unit": "United States Support",
            "Support Group": "US Support 3",
            "Assignee": "qkatawazi"
        };
        await apiHelper.apiLogin('qkatawazi');
        let newCase = await apiHelper.createCase(caseData);
        let newCase2 = await apiHelper.createCase(caseData);
        console.log("case is created===", newCase.displayId, newCase2.displayId);
        await apiHelper.updateCaseStatus(newCase.id, "Pending", 'Customer Canceled');
        await apiHelper.updateCaseStatus(newCase2.id, "InProgress");
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
            "ownerBU": "United States Support",
            "ownerGroup": "US Support 1",
            "assigneeCompany": "Petramco",
            "assigneeBU": "United States Support",
            "assigneeSupportGroup": "US Support 1",
            "assignee": "qtao",
        }

        await apiHelper.apiLogin('qkatawazi');
        let newCaseTemplate = await apiHelper.createCaseTemplate(templateData2);
        console.log("active case Template is created===", newCaseTemplate.id);
        console.log("active case Template is created===", newCaseTemplate.displayId);
        let caseTemplateStatusUpdate = await apiHelper.updateCaseTemplateStatus(newCaseTemplate.id, 'Inactive');
        console.log("Case template status update==>", caseTemplateStatusUpdate);
    });

    it('create manual task template', async () => {
        let templateData = {
            "templateName": "task template 2",
            "templateSummary": "task template summary 2",
            "templateStatus": "Active",
            "taskCompany": "Petramco",
            "ownerCompany": "Petramco",
            "ownerBusinessUnit": "United States Support",
            "ownerGroup": "US Support 3"
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
            "ownerBusinessUnit": "United States Support",
            "ownerGroup": "US Support 3"
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
            "userPermission": ["Case Business Analyst", "Human Resource"]
        }
        await apiHelper.createNewUser(userData);
        await apiHelper.associatePersonToCompany(userData.userId, "Petramco");
        await apiHelper.associatePersonToCompany(userData.userId, "Psilon");
    });

    it('Associate task template to case template', async () => {
        await apiHelper.apiLogin('qkatawazi');

        let caseTemplateData1 = {
            "templateName": "case template1 " + randomStr,
            "templateSummary": "case template1 summary " + randomStr,
            "templateStatus": "Active",
        }
        let newCaseTemplate1 = await apiHelper.createCaseTemplate(caseTemplateData1);

        let caseTemplateData2 = {
            "templateName": "case template2 " + randomStr,
            "templateSummary": "case template2 summary " + randomStr,
            "templateStatus": "Active",
        }
        let newCaseTemplate2 = await apiHelper.createCaseTemplate(caseTemplateData2);

        let caseTemplateData3 = {
            "templateName": "case template3 " + randomStr,
            "templateSummary": "case template3 summary " + randomStr,
            "templateStatus": "Active",
        }
        let newCaseTemplate3 = await apiHelper.createCaseTemplate(caseTemplateData3);

        let caseTemplateData4 = {
            "templateName": "case template4 " + randomStr,
            "templateSummary": "case template4 summary " + randomStr,
            "templateStatus": "Active",
        }
        let newCaseTemplate4 = await apiHelper.createCaseTemplate(caseTemplateData4);

        let manualTaskTemplateData = {
            "templateName": "manual task template name " + randomStr,
            "templateSummary": "manual task template summary " + randomStr,
            "templateStatus": "Active",
            "taskCompany": "Petramco",
            "ownerCompany": "Petramco",
            "ownerBusinessUnit": "United States Support",
            "ownerGroup": "US Support 3"
        }
        let manualTaskTemplate = await apiHelper.createManualTaskTemplate(manualTaskTemplateData);

        let externalTaskTemplateData = {
            "templateName": "external task template name " + randomStr,
            "templateSummary": "external task template summary " + randomStr,
            "templateStatus": "Active",
            "taskCompany": "Petramco",
            "ownerCompany": "Petramco",
            "ownerBusinessUnit": "United States Support",
            "ownerGroup": "US Support 3"
        }
        let externalTaskTemplate = await apiHelper.createExternalTaskTemplate(externalTaskTemplateData);

        let autoTaskTemplateData = {
            "templateName": "auto task template " + randomStr,
            "templateSummary": "auto task template summary " + randomStr,
            "templateStatus": "Active",
            "processBundle": "com.bmc.dsm.case-lib",
            "processName": "Case Process " + randomStr,
            "taskCompany": "Petramco",
            "ownerCompany": "Petramco",
            "ownerBusinessUnit": "United States Support",
            "ownerGroup": "US Support 3"
        }
        let autoTaskTemplate = await apiHelper.createAutomatedTaskTemplate(autoTaskTemplateData);

        console.log("Case Template with one task: ", caseTemplateData1.templateName, manualTaskTemplate.displayId);
        await apiHelper.associateCaseTemplateWithOneTaskTemplate(newCaseTemplate1.displayId, manualTaskTemplate.displayId);
        console.log("Case Template with two sequence task: ", caseTemplateData2.templateName, manualTaskTemplate.displayId, autoTaskTemplate.displayId);
        await apiHelper.associateCaseTemplateWithTwoTaskTemplate(newCaseTemplate2.displayId, manualTaskTemplate.displayId, autoTaskTemplate.displayId, "sequential");
        console.log("Case Template with two parallel task: ", caseTemplateData3.templateName, externalTaskTemplate.displayId, autoTaskTemplate.displayId);
        await apiHelper.associateCaseTemplateWithTwoTaskTemplate(newCaseTemplate3.displayId, externalTaskTemplate.displayId, autoTaskTemplate.displayId, "parallel");
        console.log("Case Template with three sequential task: ", caseTemplateData4.templateName, manualTaskTemplate.displayId, externalTaskTemplate.displayId, autoTaskTemplate.displayId);
        await apiHelper.associateCaseTemplateWithThreeTaskTemplate(newCaseTemplate4.displayId, manualTaskTemplate.displayId, externalTaskTemplate.displayId, autoTaskTemplate.displayId);
        // await apiHelper.associateCaseTemplateWithOneTaskTemplate('CTPL-0000000214', 'TTPL-0000000506');
        // await apiHelper.associateCaseTemplateWithTwoTaskTemplate('CTPL-0000000215', 'TTPL-0000000517', 'TTPL-0000000518', "sequential");
    });

    it('create Email template', async () => {
        await apiHelper.apiLogin('tadmin');
        let emailTemplateData = require('../../data/ui/email/email.template.ui.json');
        let emailTemplateName: string = await emailTemplateData['emailTemplateWithMandatoryField'].TemplateName + randomStr;
        emailTemplateData['notesTemplateWithMandatoryField'].templateName = emailTemplateName;
        await apiHelper.createEmailTemplate(emailTemplateData['emailTemplateWithMandatoryField']);
    });

    it('create Email config', async () => {
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteAllEmailConfiguration();
        await apiHelper.createEmailBox('incoming');
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.createEmailConfiguration();
    });

    it('create notes template', async () => {
        await apiHelper.apiLogin('tadmin');
        NOTES_TEMPLATE_MANDATORY_FIELD.templateName = NOTES_TEMPLATE_MANDATORY_FIELD.templateName + randomStr;
        await apiHelper.createNotesTemplate("People", NOTES_TEMPLATE_MANDATORY_FIELD);
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

    it('create process lib config', async () => {
        await apiHelper.apiLogin('qkatawazi');

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

    it('Cognitive APIs', async () => {
        let apiKey = "jE9dMMf2WMx-M4nNWk8KoJ8lF0AfBRw-8QQHagg4jk40";
        let templateDataSet = "My Template Data Set";
        let categoryDataSet = "My Category Data Set";
        let created = await apiHelper.addWatsonAccount(apiKey);
        console.log("Watson Account Added ==> ", created);
        let dataSetMappingDeleted = await apiHelper.deleteCognitiveDataSetMapping();
        console.log("All DataSet Mapping Deleted ==> ", dataSetMappingDeleted);
        let dataSetDeleted = await apiHelper.deleteCognitiveDataSet();
        console.log("All DataSet Deleted ==> ", dataSetDeleted);
        let templateDataSetCreated = await apiHelper.createCognitiveDataSet("template", { name: templateDataSet });
        console.log("Template DataSet Created ==> ", templateDataSetCreated);
        let categoryDataSetCreated = await apiHelper.createCognitiveDataSet("category", { name: categoryDataSet });
        console.log("Category DataSet Created ==> ", categoryDataSetCreated);
        let templateDataSetTrained = await apiHelper.trainCognitiveDataSet(templateDataSet);
        console.log("Template DataSet Created ==> ", templateDataSetTrained);
        let categoryDataSetTrained = await apiHelper.trainCognitiveDataSet(categoryDataSet);
        console.log("Category DataSet Created ==> ", categoryDataSetTrained);
        let templateDataSetMapping = {
            name: "Petramco Template Dataset Mapping",
            company: "Petramco",
            enable: true,
            dataset: templateDataSet,
            confidenceLevelAutomatic: 60,
            confidenceLevelAgent: 70
        }
        let templateDataSetMappingStatus = await apiHelper.createCognitiveDataSetMapping("template", templateDataSetMapping);
        console.log("Template DataSet Mapping Created ==> ", templateDataSetMappingStatus);
        let categoryDataSetMapping = {
            name: "Petramco Category Dataset Mapping",
            company: "Petramco",
            dataset: categoryDataSet,
            enable: false,
            confidenceLevelAutomatic: 90,
            confidenceLevelAgent: 80
        }
        let categoryDataSetMappingStatus = await apiHelper.createCognitiveDataSetMapping("category", categoryDataSetMapping);
        console.log("Category DataSet Mapping Created ==> ", categoryDataSetMappingStatus);
    });

    it('Create adhoc task', async () => {
        await apiHelper.apiLogin('qkatawazi');
        let caseData = {
            "Requester": "qdu",
            "Summary": "Toggle False, case without template" + "_" + randomStr,
            "Assigned Company": "Petramco",
            "Business Unit": "United States Support",
            "Support Group": "US Support 3",
            "Assignee": "qfeng",
        }
        let taskData = {
            "taskName": "Toggle False, task created without template" + "_" + randomStr,
            "company": "Petramco",
            "priority": "Low",
            "businessUnit": "United States Support",
            "supportGroup": "US Support 1",
            "assignee": "qtao",
        }
        let newCase1 = await apiHelper.createCase(caseData);
        newCase1.displayId;
        await apiHelper.createAdhocTask(newCase1.id, taskData);
    });

    it('Create dynamic data', async () => {
        await apiHelper.apiLogin('tadmin');
        let recDeleted = await apiHelper.deleteDynamicFieldAndGroup();
        console.log("Record deleted...", recDeleted);
        let caseTemplateName = 'CaseTemplateName' + randomStr;
        let caseTemaplateSummary = 'CaseTemplateSummary' + randomStr;
        let casetemplateData = {
            "templateName": `${caseTemplateName}`,
            "templateSummary": `${caseTemaplateSummary}`,
            "templateStatus": "Active",
        }
        await apiHelper.apiLogin('qkatawazi');
        let newCaseTemplate = await apiHelper.createCaseTemplate(casetemplateData);
        await apiHelper.createDynamicDataOnTemplate(newCaseTemplate.id, 'CASE_TEMPLATE_WITH_CONFIDENTIAL');
    });

    it('Generating the userlist with no LOB Access(Required by Pravin)', async () => {
        let autArray: string[] = ["qdu", "Franz", "Elizabeth", "sbadree", "qkatawazi", "Fritz", "qtao", "kayo", "kkohri", "KMills", "KWilliamson", "gwixillian", "qliu", "khardison", "Peter", "hhaas", "qyuan", "qannis", "qfeng", "qstrong", "gderuno", "werusha", "qheroux", "qquettawala", "Frieda", "qcolumbcille", "qgeorge", "kwilson", "kdiva", "kjenner", "kbell", "kwethington", "kwilliams", "rrovnitov", "Fabian", "dbomei", "jbarnes", "ppeter", "Monika", "ncage", "rwillie", "sbruce", "ttristan", "sherbert", "qcespedes", "cbarton", "ajoshi", "mcarney", "Morwenna", "smoran", "umiguelde", "jstuart", "yhenny"];
        let manualArray: string[] = ["qdu", "Franz", "Elizabeth", "sbadree", "qkatawazi", "Fritz", "qtao", "kayo", "kkohri", "KMills", "KWilliamson", "gwixillian", "qliu", "khardison", "Peter", "hhaas", "qyuan", "qannis", "qfeng", "qstrong", "gderuno", "werusha", "qheroux", "qquettawala", "Frieda", "qcolumbcille", "qgeorge", "kwilson", "kdiva", "kjenner", "kbell", "kwethington", "kwilliams", "rrovnitov", "Fabian", "dbomei", "jbarnes", "ppeter", "Monika", "ncage", "rwillie", "sbruce", "ttristan", "sherbert", "qcespedes", "cbarton", "ajoshi", "mcarney", "Morwenna", "smoran", "umiguelde", "jstuart", "yhenny"];
        let userArray = autArray;
        let userArrayWithNoLOB: string[] = [];
        let userArrayWithNoAccess: string[] = [];
        for (let i = 0; i < userArray.length; i++) {
            try {
                await apiHelper.apiLogin(userArray[i], 'Password_1234');
            }
            catch (ex) { userArrayWithNoAccess.push(userArray[i]); }
            try {
                let response = await axios.get(
                    'api/rx/application/datapage?dataPageType=com.bmc.arsys.rx.application.namedlist.datapage.NamedListDataPageQuery&pageSize=-1&startIndex=0&namedlistdefinition=com.bmc.dsm.shared-services-lib%3ALine%20of%20Business%20-%20Active%20And%20Deprecated%20Status'
                );
                if (response.data.totalSize == 0) userArrayWithNoLOB.push(userArray[i]);
            }
            catch (ex) { userArrayWithNoLOB.push(userArray[i]); }
        }
        console.log('User with no LOB access', userArrayWithNoLOB);
        console.log('User doesnt exist', userArrayWithNoAccess);
    });
});
