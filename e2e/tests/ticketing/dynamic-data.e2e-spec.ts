import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import caseConsolePo from '../../pageobject/case/case-console.po';
import previewCasePo from '../../pageobject/case/case-preview.po';
import createCasePo from '../../pageobject/case/create-case.po';
import changeAssignmentPage from '../../pageobject/common/change-assignment.po';
import editCasePo from '../../pageobject/case/edit-case.po';
import quickCasePo from '../../pageobject/case/quick-case.po';
import requesterResponseBladePo from '../../pageobject/case/requester-response-blade.po';
import selectCasetemplateBladePo from '../../pageobject/case/select-casetemplate-blade.po';
import viewCasePo from '../../pageobject/case/view-case.po';
import addFieldsPopPo from '../../pageobject/common/add-fields-pop.po';
import dynamicFieldsPo from '../../pageobject/common/dynamic-fields.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import updateStatusBladePo from '../../pageobject/common/update.status.blade.po';
import viewCasetemplatePo from '../../pageobject/settings/case-management/view-casetemplate.po';
import consoleNotestemplatePo from '../../pageobject/settings/common/console-notestemplate.po';
import createNotestemplatePo from '../../pageobject/settings/common/create-notestemplate.po';
import createDocumentTemplatePo from '../../pageobject/settings/document-management/create-document-template.po';
import consoleDocumentTemplatePo from '../../pageobject/settings/document-management/document-template-console.po';
import consoleEmailTemplatePo from '../../pageobject/settings/email/console-email-template.po';
import createEmailTemplatePo from '../../pageobject/settings/email/create-email-template.po';
import consoleNotificationTemplatePo from '../../pageobject/settings/notification-config/console-notification-template.po';
import createNotificationTemplatePo from '../../pageobject/settings/notification-config/create-notification-template.po';
import editNotificationTemplatePo from '../../pageobject/settings/notification-config/edit-notification-template.po';
import editTaskPo from '../../pageobject/task/edit-task.po';
import manageTaskBladePo from '../../pageobject/task/manage-task-blade.po';
import viewTaskPo from '../../pageobject/task/view-task.po';
import { BWF_BASE_URL, BWF_PAGE_TITLES } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';

describe('Dynamic data', () => {
    const manageNotificationTempNavigation = 'Notification Configuration--Manage Templates';
    const petramcoEventName = 'Petramco Event';
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');

    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    describe('[3861]: Accessibility of Dynamic Fields in Notification and Dynamic Templates', async () => {
        const randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateName = 'caseTemplate' + randomStr;
        let globalcaseTemplateName, globalTaskTemplateName, taskTemplateName, caseTemaplateSummary = 'caseTemplate' + randomStr;
        beforeAll(async () => {
            let eventData = {
                eventName: petramcoEventName,
                company: 'Petramco'
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createNotificationEvent(eventData);
            let casetemplateData = {
                "templateName": `${caseTemplateName}`,
                "templateSummary": `${caseTemaplateSummary}`,
                "templateStatus": "Active",
                "assignee": "qkatawazi",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "ownerBU": "United States Support",
                "supportGroup": "US Support 3",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            await apiHelper.apiLogin('qkatawazi');
            let newCaseTemplate = await apiHelper.createCaseTemplate(casetemplateData);
            await apiHelper.createDynamicDataOnTemplate(newCaseTemplate.id, 'SAVE_EXISTING_AND_NEW_CASE_DYNAMIC_DATA_DEFINITION');
            globalcaseTemplateName = 'globalcasetempalte' + randomStr;
            let gloablcaseTemaplateSummary = 'gloabalcasetemplate' + randomStr;
            let globaltemplateData = {
                "templateName": `${globalcaseTemplateName}`,
                "templateSummary": `${gloablcaseTemaplateSummary}`,
                "templateStatus": "Active",
                "company": "- Global -",
            }
            let globaltemplate = await apiHelper.createCaseTemplate(globaltemplateData);
            await apiHelper.createDynamicDataOnTemplate(globaltemplate.id, 'GLOBAL_DYNAMIC_DATA_CASE_TEMPLATE');

            taskTemplateName = 'Manual  task' + randomStr;
            let manualTaskSummary = 'ManualSummary' + randomStr;
            let templateData = {
                "templateName": `${taskTemplateName}`,
                "templateSummary": `${manualTaskSummary}`,
                "templateStatus": "Active",
                "taskCompany": 'Petramco',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3"
            }
            let tasktemplate = await apiHelper.createManualTaskTemplate(templateData);
            await apiHelper.createDynamicDataOnTemplate(tasktemplate.id, 'DYNAMIC_DATA_FOR_TASK_TEMPLATE');
            globalTaskTemplateName = 'Global  task' + randomStr;
            let globalmanualTaskSummary = 'GlobalTaskSummary' + randomStr;
            let gloabalTaskData = {
                "templateName": `${globalTaskTemplateName}`,
                "templateSummary": `${globalmanualTaskSummary}`,
                "templateStatus": "Active",
                "taskCompany": '- Global -',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3"
            }
            let globalTasktemplate = await apiHelper.createManualTaskTemplate(gloabalTaskData);
            await apiHelper.createDynamicDataOnTemplate(globalTasktemplate.id, 'GLOBAL_TASK_TEMPLATE');
        });
        it('[3861]: Accessibility of Dynamic Fields in Notification and Dynamic Templates', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem(manageNotificationTempNavigation, BWF_PAGE_TITLES.NOTIFICATION_CONFIGURATION.MANAGE_TEMPLATES);
            await consoleNotificationTemplatePo.clickOnCreateNotificationTemplate();
            await createNotificationTemplatePo.selectEvent('Agent Assignment');
            await createNotificationTemplatePo.selectModuleName('Cases');
            await createNotificationTemplatePo.clickOnInsertFieldOfAlert();
            await addFieldsPopPo.navigateToDynamicFieldInCaseTemplate(globalcaseTemplateName);
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('GlobalField1')).toBeTruthy();
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('GlobalField2')).toBeTruthy();
            expect(await addFieldsPopPo.isCaseTemplatePresent(caseTemplateName)).toBeFalsy();
            await addFieldsPopPo.clickOnOkButtonOfEditor();
            await createNotificationTemplatePo.selectEvent(petramcoEventName);
            await createNotificationTemplatePo.selectModuleName('Cases');
            await createNotificationTemplatePo.clickOnInsertFieldOfAlert();
            await addFieldsPopPo.navigateToDynamicFieldInCaseTemplate(caseTemplateName);
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('casePetramco1')).toBeTruthy();
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('casePetramco2')).toBeTruthy();
            await addFieldsPopPo.clickOnOkButtonOfEditor();
        });
        it('[3861]: Accessibility of Dynamic Fields in Notification and Dynamic Templates', async () => {
            await createNotificationTemplatePo.clickOnInsertFieldOfAlert();
            await addFieldsPopPo.navigateToDynamicFieldInCaseTemplate(globalcaseTemplateName);
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('GlobalField1')).toBeTruthy();
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('GlobalField2')).toBeTruthy();
            await addFieldsPopPo.clickOnOkButtonOfEditor();
            await createNotificationTemplatePo.selectEvent('Agent Assignment');
            await createNotificationTemplatePo.selectModuleName('Tasks');
            await createNotificationTemplatePo.clickOnInsertFieldOfAlert();
            await addFieldsPopPo.navigateToDynamicFieldInTaskTemplate(globalTaskTemplateName);
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('GlobalTaskField1')).toBeTruthy();
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('GlobalTaskField2')).toBeTruthy();
            expect(await addFieldsPopPo.isCaseTemplatePresent(taskTemplateName)).toBeFalsy();
            await addFieldsPopPo.clickOnOkButtonOfEditor();
            await createNotificationTemplatePo.selectEvent(petramcoEventName);
            await createNotificationTemplatePo.selectModuleName('Tasks');
            await createNotificationTemplatePo.clickOnInsertFieldOfAlert();
            await addFieldsPopPo.navigateToDynamicFieldInTaskTemplate(taskTemplateName);
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('ddfield1')).toBeTruthy();
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('ddfield2')).toBeTruthy();
            await addFieldsPopPo.clickOnOkButtonOfEditor();
        });
        it('[3861]: Accessibility of Dynamic Fields in Notification and Dynamic Templates', async () => {
            await createNotificationTemplatePo.clickOnInsertFieldOfAlert();
            await addFieldsPopPo.navigateToDynamicFieldInTaskTemplate(globalTaskTemplateName);
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('GlobalTaskField1')).toBeTruthy();
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('GlobalTaskField2')).toBeTruthy();
            await addFieldsPopPo.clickOnOkButtonOfEditor();
            await createNotificationTemplatePo.clickOnCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
            await browser.navigate().back();
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Document Management--Templates', BWF_PAGE_TITLES.DOCUMENT_MANAGEMENT.TEMPLATES);
            await consoleDocumentTemplatePo.clickCreateDocumentTemplate();
            await createDocumentTemplatePo.setCompany('- Global -');
            await createDocumentTemplatePo.setTemplateName(randomStr);
            await createDocumentTemplatePo.clickOnInsertFieldOfDocumentBody();
            await addFieldsPopPo.navigateToDynamicFieldInCaseTemplate(globalcaseTemplateName);
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('GlobalField1')).toBeTruthy();
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('GlobalField2')).toBeTruthy();
            expect(await addFieldsPopPo.isCaseTemplatePresent(caseTemplateName)).toBeFalsy();
            await addFieldsPopPo.clickOnOkButtonOfEditor();
        });
        it('[3861]: Accessibility of Dynamic Fields in Notification and Dynamic Templates', async () => {
            await createDocumentTemplatePo.setCompany('Petramco');
            await createDocumentTemplatePo.clickOnInsertFieldOfDocumentBody();
            await addFieldsPopPo.navigateToDynamicFieldInCaseTemplate(caseTemplateName);
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('casePetramco1')).toBeTruthy();
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('casePetramco2')).toBeTruthy();
            await addFieldsPopPo.clickOnOkButtonOfEditor();
            await createDocumentTemplatePo.clickOnInsertFieldOfDocumentBody();
            await addFieldsPopPo.navigateToDynamicFieldInCaseTemplate(globalcaseTemplateName);
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('GlobalField1')).toBeTruthy();
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('GlobalField2')).toBeTruthy();
            await addFieldsPopPo.clickOnOkButtonOfEditor();
            await createDocumentTemplatePo.clickOnCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        });
    });

    describe('[3875]: Associated and Dynamic fields usage on Notification/Email/Activity Templates', async () => {
        const randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');

        let caseTemplateName = 'caseTempRDMV192700lp3ir' + randomStr;
        let caseTemaplateSummary = 'caseTempRDMV19270Template' + randomStr;
        let taskTemplateName = 'ManualtaskDRDMV19270' + randomStr;
        let manualTaskSummary = 'ManualSummaryDRDMV19270' + randomStr;
        beforeAll(async () => {
            let casetemplateData = {
                "templateName": `${caseTemplateName}`,
                "templateSummary": `${caseTemaplateSummary}`,
                "templateStatus": "Active",
                "caseStatus": "InProgress",
                "ownerBU": 'United States Support',
                "ownerGroup": "US Support 3",
                "assignee": "qkatawazi",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            await apiHelper.apiLogin('qkatawazi');
            let newCaseTemplate = await apiHelper.createCaseTemplate(casetemplateData);
            await apiHelper.createDynamicDataOnTemplate(newCaseTemplate.id, 'CASE_TEMPLATE_WITH_CONFIDENTIAL');

            let templateData = {
                "templateName": `${taskTemplateName}`,
                "templateSummary": `${manualTaskSummary}`,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('qkatawazi');
            let tasktemplate = await apiHelper.createManualTaskTemplate(templateData);
            await apiHelper.createDynamicDataOnTemplate(tasktemplate.id, 'TASK_TEMPLATE_WITH_CONFIDENTIAL');
        });
        it('[3875]: Associated and Dynamic fields usage on Notification/Email/Activity Templates', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem(manageNotificationTempNavigation, BWF_PAGE_TITLES.NOTIFICATION_CONFIGURATION.MANAGE_TEMPLATES);
            await consoleNotificationTemplatePo.clickOnCreateNotificationTemplate();
            await createNotificationTemplatePo.selectEvent('Approve');
            await createNotificationTemplatePo.selectModuleName('Cases');
            await createNotificationTemplatePo.setTemplateName("Notification" + randomStr);
            await createNotificationTemplatePo.setDescription("Notification Description " + randomStr);
            await createNotificationTemplatePo.clickOnInsertFieldOfAlert();
            await addFieldsPopPo.navigateToDynamicFieldInCaseTemplate(caseTemplateName);
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('OuterConfidential')).toBeTruthy();
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('OuterNonConfidential')).toBeTruthy();
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('ListOfDataName')).toBeTruthy();
        });
        it('[3875]: Associated and Dynamic fields usage on Notification/Email/Activity Templates', async () => {
            await addFieldsPopPo.selectDynamicField('OuterConfidential');
            await addFieldsPopPo.clickOnGroupName('GroupLocalCaseTemplate');
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('LocalNonConfidential')).toBeTruthy();
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('LocalConfidentail')).toBeTruthy();
            await addFieldsPopPo.selectDynamicField('LocalNonConfidential');
            await addFieldsPopPo.clickOnGroupName('PulishCaseTemplateData');
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('nonConfidentialPulic')).toBeTruthy();
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('confidentialPublic')).toBeTruthy();
            await addFieldsPopPo.selectDynamicField('confidentialPublic');
            await addFieldsPopPo.clickOnOkButtonOfEditor();
            expect(await createNotificationTemplatePo.isDynamicFieldDisplayedInAlertBody('OuterConfidential')).toBeTruthy();
            expect(await createNotificationTemplatePo.isDynamicFieldDisplayedInAlertBody('LocalNonConfidential')).toBeTruthy();
            expect(await createNotificationTemplatePo.isDynamicFieldDisplayedInAlertBody('confidentialPublic')).toBeTruthy();
            await createNotificationTemplatePo.clickOnEmailTab();
        });
        it('[3875]: Associated and Dynamic fields usage on Notification/Email/Activity Templates', async () => {
            await createNotificationTemplatePo.setSubject(randomStr);
            await createNotificationTemplatePo.clickOnInsertFieldOfEmail();
            await addFieldsPopPo.navigateToDynamicFieldInCaseTemplate(caseTemplateName);
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('OuterConfidential')).toBeTruthy();
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('OuterNonConfidential')).toBeTruthy();
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('ListOfDataName')).toBeTruthy();
            await addFieldsPopPo.selectDynamicField('OuterNonConfidential');
            await addFieldsPopPo.clickOnGroupName('GroupLocalCaseTemplate');
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('LocalNonConfidential')).toBeTruthy();
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('LocalConfidentail')).toBeTruthy();
            await addFieldsPopPo.selectDynamicField('LocalConfidentail');
            await addFieldsPopPo.clickOnGroupName('PulishCaseTemplateData');
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('nonConfidentialPulic')).toBeTruthy();
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('confidentialPublic')).toBeTruthy();
            await addFieldsPopPo.selectDynamicField('nonConfidentialPulic');
            await addFieldsPopPo.clickOnOkButtonOfEditor();
        });
        it('[3875]: Associated and Dynamic fields usage on Notification/Email/Activity Templates', async () => {
            expect(await createNotificationTemplatePo.isDynamicFieldDisplayedInEmailBody('nonConfidentialPulic')).toBeTruthy();
            expect(await createNotificationTemplatePo.isDynamicFieldDisplayedInEmailBody('LocalConfidentail')).toBeTruthy();
            expect(await createNotificationTemplatePo.isDynamicFieldDisplayedInEmailBody('OuterNonConfidential')).toBeTruthy();
            await createNotificationTemplatePo.clickOnSaveButton();
            expect(await editNotificationTemplatePo.getHeaderText()).toContain('Edit Notification Template');
            await editNotificationTemplatePo.clickOnCancelButton();
            await consoleNotificationTemplatePo.clickOnCreateNotificationTemplate();
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteEmailOrNotificationTemplate("Notification" + randomStr);
            await createNotificationTemplatePo.selectModuleName('Cases');
            await createNotificationTemplatePo.selectEvent('Approve');
            await createNotificationTemplatePo.setTemplateName("NotificationNew" + randomStr);
            await createNotificationTemplatePo.setDescription("NotificationNew Description " + randomStr);
            await createNotificationTemplatePo.clickOnInsertFieldOfAlert();
            await addFieldsPopPo.navigateToAssociationsInCase();
            expect(await addFieldsPopPo.isAssocitionDisplayed('Case Origin Lookup Assoc')).toBeTruthy();
            expect(await addFieldsPopPo.isAssocitionDisplayed('Case Template to Case')).toBeTruthy();
            expect(await addFieldsPopPo.isAssocitionDisplayed('Case to Overall SLA Status')).toBeTruthy();
            expect(await addFieldsPopPo.isAssocitionDisplayed('Case to Resolution Code Association')).toBeTruthy();
            expect(await addFieldsPopPo.isAssocitionDisplayed('DynamicTicketData')).toBeTruthy();
            expect(await addFieldsPopPo.isAssocitionDisplayed('Label To Ticket')).toBeTruthy();
            expect(await addFieldsPopPo.isAssocitionDisplayed('Region to Ticket')).toBeTruthy();
            expect(await addFieldsPopPo.isAssocitionDisplayed('Site to Ticket')).toBeTruthy();
            expect(await addFieldsPopPo.isAssocitionDisplayed('Ticket - Assigned Company')).toBeTruthy();
            expect(await addFieldsPopPo.isAssocitionDisplayed('Ticket Field - Agent')).toBeTruthy();
            expect(await addFieldsPopPo.isAssocitionDisplayed('Ticket Field - Assigned Business Unit')).toBeTruthy();
            expect(await addFieldsPopPo.isAssocitionDisplayed('Ticket Field - Assigned Department')).toBeTruthy();
            expect(await addFieldsPopPo.isAssocitionDisplayed('Ticket Field - Company')).toBeTruthy();
            expect(await addFieldsPopPo.isAssocitionDisplayed('Ticket Field - Operational Category Tier 4')).toBeTruthy();
            expect(await addFieldsPopPo.isAssocitionDisplayed('Ticket To Overall SLA Status')).toBeTruthy();
        });
        it('[3875]: Associated and Dynamic fields usage on Notification/Email/Activity Templates', async () => {
            await addFieldsPopPo.clickOnAssocitionAndSelectField('DynamicTicketData', 'Confidential data');
            await addFieldsPopPo.clickOnAssocitionAndSelectField('Site to Ticket', 'Additional Site Details');
            await addFieldsPopPo.clickOnOkButtonOfEditor();
            expect(await createNotificationTemplatePo.isDynamicFieldDisplayedInAlertBody('Confidential data')).toBeTruthy();
            expect(await createNotificationTemplatePo.isDynamicFieldDisplayedInAlertBody('Additional Site Details')).toBeTruthy();
            await createNotificationTemplatePo.clickOnEmailTab();
            await createNotificationTemplatePo.clickOnInsertFieldOfEmail();
            await createNotificationTemplatePo.setSubject(randomStr);
            await addFieldsPopPo.navigateToAssociationsInCase();
            expect(await addFieldsPopPo.isAssocitionDisplayed('Case Origin Lookup Assoc')).toBeTruthy();
            expect(await addFieldsPopPo.isAssocitionDisplayed('Case Template to Case')).toBeTruthy();
            expect(await addFieldsPopPo.isAssocitionDisplayed('Ticket Field - Contact')).toBeTruthy();
            expect(await addFieldsPopPo.isAssocitionDisplayed('Case to Resolution Code Association')).toBeTruthy();
            expect(await addFieldsPopPo.isAssocitionDisplayed('Ticket Field - Operational Category  Tier 2')).toBeTruthy();
            expect(await addFieldsPopPo.isAssocitionDisplayed('Ticket Field - Operational Category Tier 1')).toBeTruthy();
            expect(await addFieldsPopPo.isAssocitionDisplayed('Ticket Field - Operational Category Tier 3')).toBeTruthy();
            expect(await addFieldsPopPo.isAssocitionDisplayed('Ticket Field - Requester')).toBeTruthy();
            expect(await addFieldsPopPo.isAssocitionDisplayed('Ticket Field - Status')).toBeTruthy();
            expect(await addFieldsPopPo.isAssocitionDisplayed('Ticket Field - Status Reason')).toBeTruthy();
            expect(await addFieldsPopPo.isAssocitionDisplayed('Ticket Field - Support Group')).toBeTruthy();
            expect(await addFieldsPopPo.isAssocitionDisplayed('Ticket References Flowset')).toBeTruthy();
            expect(await addFieldsPopPo.isAssocitionDisplayed('Ticket To Overall SLA Status')).toBeTruthy();
            expect(await addFieldsPopPo.isAssocitionDisplayed('Ticket Field - Operational Category Tier 4')).toBeTruthy();
            expect(await addFieldsPopPo.isAssocitionDisplayed('Ticket To Overall SLA Status')).toBeTruthy();
            await addFieldsPopPo.clickOnAssocitionAndSelectField('Ticket To Overall SLA Status', 'SLM Status');
            await addFieldsPopPo.clickOnAssocitionAndSelectField('Ticket Field - Operational Category Tier 1', 'Visible to All Organization');
            await addFieldsPopPo.clickOnOkButtonOfEditor();
        });
        it('[3875]: Associated and Dynamic fields usage on Notification/Email/Activity Templates', async () => {
            expect(await createNotificationTemplatePo.isDynamicFieldDisplayedInEmailBody('SLM Status')).toBeTruthy();
            expect(await createNotificationTemplatePo.isDynamicFieldDisplayedInEmailBody('Visible to All Organization')).toBeTruthy();
            await createNotificationTemplatePo.clickOnSaveButton();
            expect(await editNotificationTemplatePo.getHeaderText()).toContain('Edit Notification Template');
            await editNotificationTemplatePo.clickOnCancelButton();
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteEmailOrNotificationTemplate("NotificationNew" + randomStr);
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Templates', BWF_PAGE_TITLES.EMAIL.TEMPLATES);
            await consoleEmailTemplatePo.clickOnAddEmailTemplateButton();
            await createEmailTemplatePo.selectCompany('Petramco');
            await createEmailTemplatePo.setTemplateName('emailTemp' + randomStr);
            await createEmailTemplatePo.setDescription('Email Description' + randomStr);
            await createEmailTemplatePo.setSubject('Email Subject' + randomStr);
            await createEmailTemplatePo.clickOnInsertField();
            await addFieldsPopPo.navigateToDynamicFieldInCaseTemplate(caseTemplateName);
            expect(addFieldsPopPo.isDynamicFieldPresentInTemplate('OuterConfidential')).toBeFalsy();
            expect(addFieldsPopPo.isDynamicFieldPresentInTemplate('OuterNonConfidential')).toBeTruthy();
            expect(addFieldsPopPo.isDynamicFieldPresentInTemplate('ListOfDataName')).toBeTruthy();
        });
        it('[3875]: Associated and Dynamic fields usage on Notification/Email/Activity Templates', async () => {
            await addFieldsPopPo.selectDynamicField('OuterNonConfidential');
            await addFieldsPopPo.clickOnGroupName('GroupLocalCaseTemplate');
            expect(addFieldsPopPo.isDynamicFieldPresentInTemplate('LocalNonConfidential')).toBeTruthy();
            expect(addFieldsPopPo.isDynamicFieldPresentInTemplate('LocalConfidentail')).toBeFalsy();
            await addFieldsPopPo.selectDynamicField('LocalNonConfidential');
            await addFieldsPopPo.clickOnGroupName('PulishCaseTemplateData');
            expect(addFieldsPopPo.isDynamicFieldPresentInTemplate('nonConfidentialPulic')).toBeTruthy();
            expect(addFieldsPopPo.isDynamicFieldPresentInTemplate('confidentialPublic')).toBeFalsy();
            await addFieldsPopPo.selectDynamicField('nonConfidentialPulic');
            await addFieldsPopPo.clickOnOkButtonOfEditor();
            expect(await createEmailTemplatePo.isDynamicFieldDisplayedInBody('OuterNonConfidential')).toBeTruthy();
            expect(await createEmailTemplatePo.isDynamicFieldDisplayedInBody('LocalNonConfidential')).toBeTruthy();
            expect(await createEmailTemplatePo.isDynamicFieldDisplayedInBody('nonConfidentialPulic')).toBeTruthy();
            await createEmailTemplatePo.clickOnSaveButton();
            await utilityGrid.searchRecord('emailTemp' + randomStr);
            expect(await consoleEmailTemplatePo.getSelectedGridRecordValue('Template Name')).toContain('emailTemp' + randomStr, 'value is not displaying in Grid');
        });
        it('[3875]: Associated and Dynamic fields usage on Notification/Email/Activity Templates', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Notes Template', BWF_PAGE_TITLES.TASK_MANAGEMENT.NOTES_TEMPLATES);
            await consoleNotestemplatePo.clickOnCreateNotesTemplate();
            await createNotestemplatePo.setCompanyValue('Petramco');
            await createNotestemplatePo.setTemplateName('NotesTemplate' + randomStr);
            await createNotestemplatePo.clickOnInsertFieldLink();
            await addFieldsPopPo.navigateToDynamicFieldInTaskTemplate(taskTemplateName);
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('TaskOuterNonConfidential')).toBeTruthy();
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('TaskListOfDataName')).toBeTruthy();
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('TaskOuterConfidential')).toBeFalsy();
            await addFieldsPopPo.selectDynamicField('TaskOuterNonConfidential');
            await addFieldsPopPo.clickOnGroupName('TaskGroupLocalCaseTemplate');
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('TaskLocalNonConfidential')).toBeTruthy();
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('TaskLocalConfidentail')).toBeFalsy();
            await addFieldsPopPo.selectDynamicField('TaskLocalNonConfidential');
            await addFieldsPopPo.clickOnGroupName('TaskPulishCaseTemplateData');
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('TasknonConfidentialPulic')).toBeTruthy();
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('TaskconfidentialPublic')).toBeFalsy();
            await addFieldsPopPo.selectDynamicField('TasknonConfidentialPulic');
            await addFieldsPopPo.clickOnOkButtonOfEditor();
            expect(await createNotestemplatePo.isDynamicFieldDisplayedInBody('TaskOuterNonConfidential')).toBeTruthy();
            expect(await createNotestemplatePo.isDynamicFieldDisplayedInBody('TaskLocalNonConfidential')).toBeTruthy();
            expect(await createNotestemplatePo.isDynamicFieldDisplayedInBody('TasknonConfidentialPulic')).toBeTruthy();
        });
        it('[3875]: Associated and Dynamic fields usage on Notification/Email/Activity Templates', async () => {
            await createNotestemplatePo.clickOnInsertFieldLink();
            await addFieldsPopPo.navigateToAssociationsInTask();
            expect(await addFieldsPopPo.isAssocitionDisplayed('Case to Task')).toBeTruthy();
            expect(await addFieldsPopPo.isAssocitionDisplayed('DynamicTicketData')).toBeTruthy();
            expect(await addFieldsPopPo.isAssocitionDisplayed('Label To Ticket')).toBeTruthy();
            expect(await addFieldsPopPo.isAssocitionDisplayed('Region to Ticket')).toBeTruthy();
            expect(await addFieldsPopPo.isAssocitionDisplayed('Site to Ticket')).toBeTruthy();
            expect(await addFieldsPopPo.isAssocitionDisplayed('Task Template - Task')).toBeTruthy();
            expect(await addFieldsPopPo.isAssocitionDisplayed('Task to Overall SLA Status')).toBeTruthy();
            expect(await addFieldsPopPo.isAssocitionDisplayed('Ticket - Assigned Company')).toBeTruthy();
            expect(await addFieldsPopPo.isAssocitionDisplayed('Ticket Field - Agent')).toBeTruthy();
            expect(await addFieldsPopPo.isAssocitionDisplayed('Ticket Field - Contact')).toBeTruthy();
            expect(await addFieldsPopPo.isAssocitionDisplayed('Ticket Field - Operational Category  Tier 2')).toBeTruthy();
            expect(await addFieldsPopPo.isAssocitionDisplayed('Ticket Field - Operational Category Tier 1')).toBeTruthy();
            expect(await addFieldsPopPo.isAssocitionDisplayed('Ticket Field - Operational Category Tier 3')).toBeTruthy();
            expect(await addFieldsPopPo.isAssocitionDisplayed('Ticket Field - Operational Category Tier 4')).toBeTruthy();
            expect(await addFieldsPopPo.isAssocitionDisplayed('Ticket Field - Requester')).toBeTruthy();
            expect(await addFieldsPopPo.isAssocitionDisplayed('Ticket Field - Status')).toBeTruthy();
            expect(await addFieldsPopPo.isAssocitionDisplayed('Ticket Field - Status Reason')).toBeTruthy();
            expect(await addFieldsPopPo.isAssocitionDisplayed('Ticket Field - Support Group')).toBeTruthy();
            expect(await addFieldsPopPo.isAssocitionDisplayed('Ticket References Flowset')).toBeTruthy();
            expect(await addFieldsPopPo.isAssocitionDisplayed('Ticket To Overall SLA Status')).toBeTruthy();
            expect(await addFieldsPopPo.isAssocitionDisplayed('Ticket to Task')).toBeTruthy();
            await addFieldsPopPo.clickOnAssocitionAndSelectField('DynamicTicketData', 'Confidential data');
            await addFieldsPopPo.clickOnAssocitionAndSelectField('Site to Ticket', 'Additional Site Details');
            await addFieldsPopPo.clickOnOkButtonOfEditor();
            expect(await createNotestemplatePo.isDynamicFieldDisplayedInBody('Confidential data')).toBeTruthy();
            expect(await createNotestemplatePo.isDynamicFieldDisplayedInBody('Additional Site Details')).toBeTruthy();
            await createNotestemplatePo.clickOnSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy();
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
        });
    });

    describe('[4721]: [Dynamic Data] [Attachment] - Case UI when it has Dynamic Fields including Attachment', async () => {
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateName = 'caseTemplateDRDMV13567' + randomStr;
        let caseTemaplateSummary = 'caseTemplateDRDMV13567' + randomStr;
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            let casetemplateData = {
                "templateName": `${caseTemplateName}`,
                "templateSummary": `${caseTemaplateSummary}`,
                "templateStatus": "Active",
                "assignee": "qkatawazi",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "ownerBU": "United States Support",
                "supportGroup": "US Support 3",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('qkatawazi');
            let newCaseTemplate = await apiHelper.createCaseTemplate(casetemplateData);
            await apiHelper.createDynamicDataOnTemplate(newCaseTemplate.id, 'CASE_TEMPLATE_DYNAMIC_FIELDS');
        });

        it('[4721]: [Dynamic Data] [Attachment] - Case UI when it has Dynamic Fields including Attachment', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('adam');
            await createCasePo.setSummary('new cases');
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName);
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePo.clickEditCaseButton();
            //dynamic fields
            expect(await editCasePo.isDynamicFieldDisplayed('temp')).toBeTruthy('field is not present');
            expect(await editCasePo.isDynamicFieldDisplayed('temp1')).toBeTruthy('field is not present');
            expect(await editCasePo.isDynamicFieldDisplayed('temp2')).toBeTruthy('field is not present');
            expect(await editCasePo.isDynamicFieldDisplayed('temp3')).toBeTruthy('field is not present');
            expect(await editCasePo.isDynamicFieldDisplayed('temp4')).toBeTruthy('field is not present');
            expect(await editCasePo.isDynamicFieldDisplayed('attachment1')).toBeTruthy('field is not present');
            expect(await editCasePo.isDynamicFieldDisplayed('attachment2')).toBeTruthy('field is not present');
            expect(await editCasePo.isDynamicFieldDisplayed('attachment3')).toBeTruthy('field is not present');
        });

        it('[4721]: [Dynamic Data] [Attachment] - Case UI when it has Dynamic Fields including Attachment', async () => {
            // attach files in field 1
            let fileName1: string[] = ['articleStatus.png', 'bwfJpg.jpg', 'bwfJpg1.jpg', 'bwfJpg2.jpg', 'bwfJpg3.jpg', 'bwfJpg4.jpg', 'bwfJson1.json', 'bwfJson2.json', 'bwfJson3.json', 'bwfJson4.json', 'bwfJson5.json', 'bwfWord1.rtf'];
            let filesToUpload1 = fileName1.map((file) => { return `../../data/ui/attachment/${file}` });
            await editCasePo.addAttachment('attachment1', filesToUpload1);
            await browser.sleep(7000); // sleep added to wait until files gets uploaded
            await editCasePo.addAttachment('attachment2', ['../../data/ui/attachment/demo.txt']);
            await browser.sleep(3000); // sleep added to wait until files gets uploaded
            await editCasePo.clickSaveCase();
            //verify show more and show less button
        });

        it('[4721]: [Dynamic Data] [Attachment] - Case UI when it has Dynamic Fields including Attachment', async () => {
            //verify show more and show less button
            expect(await viewCasePo.getShowMoreLessAttachmentsLinkText('attachment1')).toContain('more');
            await viewCasePo.clickShowMoreShowLessLink('attachment1');
            //verify attached files on case view
            expect(await viewCasePo.isFileDisplayed('bwfJpg3.jpg')).toBeTruthy('File is not present');
            expect(await viewCasePo.isFileDisplayed('bwfJpg.jpg')).toBeTruthy('File is not present');
            expect(await viewCasePo.isFileDisplayed('demo.txt')).toBeTruthy('File is not present');
            expect(await viewCasePo.isFileDisplayed('bwfWord1.rtf')).toBeTruthy('File is not present');
            expect(await viewCasePo.isFileDisplayed('articleStatus.png')).toBeTruthy('File is not present');
            expect(await viewCasePo.getShowMoreLessAttachmentsLinkText('attachment1')).toContain('Show less');
        });

        afterAll(async () => {
            await utilityCommon.closeAllBlades();
        });
    });

    it('[4605]: [Dynamic Data] [Attachment] - Task UI when it has Dynamic Fields including Attachment', async () => {
        const randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteDynamicFieldAndGroup();
        let taskTemplateName = 'ManualtaskDRDMV13947' + randomStr;
        let manualTaskSummary = 'ManualSummaryDRDMV13947' + randomStr;
        let templateData = {
            "templateName": taskTemplateName,
            "templateSummary": manualTaskSummary,
            "templateStatus": "Active",
            "taskCompany": 'Petramco',
            "ownerCompany": "Petramco",
            "ownerBusinessUnit": "United States Support",
            "ownerGroup": "US Support 3"
        }
        await apiHelper.apiLogin('qkatawazi');
        let tasktemplate = await apiHelper.createManualTaskTemplate(templateData);
        await apiHelper.createDynamicDataOnTemplate(tasktemplate.id, 'TASK_TEMPLATE__DYNAMIC_FIELDS');
        await navigationPage.gotoCreateCase();
        await createCasePo.selectRequester('adam');
        await createCasePo.setSummary('new cases');
        await createCasePo.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        await viewCasePo.clickAddTaskButton();
        await manageTaskBladePo.addTaskFromTaskTemplate(taskTemplateName);
        await manageTaskBladePo.clickTaskLink(manualTaskSummary);
        await viewTaskPo.clickOnEditTask();
        //dynamic fields
        expect(await editTaskPo.isDynamicFieldDisplayed('temp')).toBeTruthy('field is not present');
        expect(await editTaskPo.isDynamicFieldDisplayed('temp1')).toBeTruthy('field is not present');
        expect(await editTaskPo.isDynamicFieldDisplayed('temp2')).toBeTruthy('field is not present');
        expect(await editTaskPo.isDynamicFieldDisplayed('temp3')).toBeTruthy('field is not present');
        expect(await editTaskPo.isDynamicFieldDisplayed('temp4')).toBeTruthy('field is not present');
        expect(await editTaskPo.isDynamicFieldDisplayed('attachment1')).toBeTruthy('field is not present');
        expect(await editTaskPo.isDynamicFieldDisplayed('attachment2')).toBeTruthy('field is not present');
        expect(await editTaskPo.isDynamicFieldDisplayed('attachment3')).toBeTruthy('field is not present');
        await editTaskPo.clickOnAssignToMe();
        // attach files in field 1
        let fileName1: string[] = ['articleStatus.png', 'bwfJpg.jpg', 'bwfJpg1.jpg', 'bwfJpg2.jpg', 'bwfJpg3.jpg', 'bwfJpg4.jpg', 'bwfJson1.json', 'bwfJson2.json', 'bwfJson3.json', 'bwfJson4.json', 'bwfJson5.json'];
        const filesToUpload1 = fileName1.map((file) => { return `../../data/ui/attachment/${file}` });
        await editTaskPo.addAttachmentInDynamicField('attachment1', filesToUpload1);
        //attachment2 add 1 file 
        await editTaskPo.addAttachmentInDynamicField('attachment2', ['../../data/ui/attachment/demo.txt']);
        //attachment3 add 1 file 
        let fileName2: string[] = ['bwfWord1.rtf', 'bwfPdf.pdf', 'bwfPdf1.pdf', 'bwfPdf2.pdf', 'bwfPdf3.pdf', 'bwfPdf4.pdf', 'bwfWord2.rtf'];
        let filesToUpload2 = fileName2.map((file) => { return `../../data/ui/attachment/${file}` });
        await editTaskPo.addAttachmentInDynamicField('attachment1', filesToUpload2);
        await editTaskPo.clickOnSaveButton();
        await utilityCommon.closePopUpMessage();
        await viewCasePo.clickOnRefreshTaskList();
        //verify show more and show less button
        expect(await viewTaskPo.getShowMoreLessAttachmentsLinkText('attachment1')).toContain('more');
        await viewTaskPo.clickShowMoreShowLessLink('attachment1');
        //verify attached files on case view
        expect(await viewTaskPo.isFileDisplayed('bwfJpg3.jpg')).toBeTruthy('File is not present');
        expect(await viewTaskPo.isFileDisplayed('bwfJpg.jpg')).toBeTruthy('File is not present');
        expect(await viewTaskPo.isFileDisplayed('demo.txt')).toBeTruthy('File is not present');
        expect(await viewTaskPo.isFileDisplayed('bwfWord1.rtf')).toBeTruthy('File is not present');
        expect(await viewTaskPo.isFileDisplayed('articleStatus.png')).toBeTruthy('File is not present');
        expect(await viewTaskPo.getShowMoreLessAttachmentsLinkText('attachment1')).toContain('Show less');
    });

    describe('[4604]: [Dynamic Data] [Attachment] - Add different type of files in attachment fields', async () => {
        const randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let fileName1: string[] = ['articleStatus.png', 'bwfJpg4.jpg', 'bwfJson1.json', 'bwfPdf4.pdf', 'bwfWord1.rtf'];
        const filesToUpload1 = fileName1.map((file) => { return `../../data/ui/attachment/${file}` });
        let fileName2: string[] = ['bwfJpg.jpg', 'bwfPdf.pdf', 'bwfWord2.rtf'];
        const filesToUpload2 = fileName2.map((file) => { return `../../data/ui/attachment/${file}` });
        let caseTemplateName = randomStr + 'caseTemplateDRDMV13948';
        let caseTemaplateSummary = randomStr + 'caseTemplateDRDMV13948';
        let taskTemplateName = randomStr + 'DRDMV13948';
        let manualTaskSummary = randomStr + 'DRDMV13948';
        //delete existing files
        beforeAll(async () => {
            for (let i: number = 0; i <= fileName1.length; i++) {
                await utilityCommon.deleteAlreadyDownloadedFile(`${fileName1[i]}`);
            }
            for (let i: number = 0; i <= fileName2.length; i++) {
                await utilityCommon.deleteAlreadyDownloadedFile(`${fileName2[i]}`);
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            let casetemplateData = {
                "templateName": `${caseTemplateName}`,
                "templateSummary": `${caseTemaplateSummary}`,
                "templateStatus": "Active",
                "assignee": "qkatawazi",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "ownerBU": "United States Support",
                "supportGroup": "US Support 3",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('qkatawazi');
            let newCaseTemplate = await apiHelper.createCaseTemplate(casetemplateData);
            await apiHelper.createDynamicDataOnTemplate(newCaseTemplate.id, 'CASE_TEMPLATE_DYNAMIC_FIELDS');
        });
        it('[4604]: [Dynamic Data] [Attachment] - Add different type of files in attachment fields', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('qkatawazi');
            await createCasePo.setSummary('new cases');
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName);
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePo.clickEditCaseButton();
            //dynamic fields
            expect(await editCasePo.isDynamicFieldDisplayed('temp')).toBeTruthy('field is not present');
            expect(await editCasePo.isDynamicFieldDisplayed('temp1')).toBeTruthy('field is not present');
            expect(await editCasePo.isDynamicFieldDisplayed('temp2')).toBeTruthy('field is not present');
            expect(await editCasePo.isDynamicFieldDisplayed('temp3')).toBeTruthy('field is not present');
            expect(await editCasePo.isDynamicFieldDisplayed('temp4')).toBeTruthy('field is not present');
            expect(await editCasePo.isDynamicFieldDisplayed('attachment1')).toBeTruthy('field is not present');
            expect(await editCasePo.isDynamicFieldDisplayed('attachment2')).toBeTruthy('field is not present');
            expect(await editCasePo.isDynamicFieldDisplayed('attachment3')).toBeTruthy('field is not present');
            // attach files in field 1
            await editCasePo.addAttachment('attachment1', filesToUpload1);
            await editCasePo.clickSaveCase();
        });
        it('[4604]: [Dynamic Data] [Attachment] - Add different type of files in attachment fields', async () => {
            await viewCasePo.clickShowMoreShowLessLink('attachment1');
            await viewCasePo.clickOnDownloadFile('articleStatus.png');
            expect(await utilityCommon.isFileDownloaded('articleStatus.png')).toBeTruthy('failureMsg: articleStatus.png File is not downloaded.');
            await viewCasePo.clickOnDownloadFile('bwfJpg4.jpg');
            expect(await utilityCommon.isFileDownloaded('bwfJpg4.jpg')).toBeTruthy('failureMsg: bwfJpg4.jpg File is not downloaded.');
            await viewCasePo.clickOnDownloadFile('bwfJson1.json');
            expect(await utilityCommon.isFileDownloaded('bwfJson1.json')).toBeTruthy('failureMsg: bwfJson1.json File is not downloaded.');
            await viewCasePo.clickOnDownloadFile('bwfPdf4.pdf');
            expect(await utilityCommon.isFileDownloaded('bwfPdf4.pdf')).toBeTruthy('failureMsg: bwfPdf4.pdf File is not downloaded.');
            await viewCasePo.clickOnDownloadFile('bwfWord1.rtf');
            expect(await utilityCommon.isFileDownloaded('bwfWord1.rtf')).toBeTruthy('failureMsg: bwfWord1.rtf File is not downloaded.');
            //delete downloaded files
            for (let i: number = 0; i <= fileName1.length; i++) {
                await utilityCommon.deleteAlreadyDownloadedFile(`${fileName1[i]}`);
            }
            await apiHelper.apiLogin('tadmin');
            let recDeleted = await apiHelper.deleteDynamicFieldAndGroup();
            console.log("Record deleted...", recDeleted);

            let templateData = {
                "templateName": `${taskTemplateName}`,
                "templateSummary": `${manualTaskSummary}`,
                "templateStatus": "Active",
                "taskCompany": 'Petramco',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('qkatawazi');
            let tasktemplate = await apiHelper.createManualTaskTemplate(templateData);
            await apiHelper.createDynamicDataOnTemplate(tasktemplate.id, 'TASK_TEMPLATE__DYNAMIC_FIELDS_DRDMV_13948');
        });
        it('[4604]: [Dynamic Data] [Attachment] - Add different type of files in attachment fields', async () => {
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.addTaskFromTaskTemplate(taskTemplateName);
            await manageTaskBladePo.clickTaskLink(manualTaskSummary);
            await viewTaskPo.clickOnEditTask();
            //dynamic fields
            expect(await editTaskPo.isDynamicFieldDisplayed('temp')).toBeTruthy('field is not present');
            expect(await editTaskPo.isDynamicFieldDisplayed('temp1')).toBeTruthy('field is not present');
            expect(await editTaskPo.isDynamicFieldDisplayed('temp2')).toBeTruthy('field is not present');
            expect(await editTaskPo.isDynamicFieldDisplayed('temp3')).toBeTruthy('field is not present');
            expect(await editTaskPo.isDynamicFieldDisplayed('temp4')).toBeTruthy('field is not present');
            expect(await editTaskPo.isDynamicFieldDisplayed('attachment4')).toBeTruthy('field is not present');
            expect(await editTaskPo.isDynamicFieldDisplayed('attachment5')).toBeTruthy('field is not present');
            expect(await editTaskPo.isDynamicFieldDisplayed('attachment6')).toBeTruthy('field is not present');
            await editTaskPo.clickOnAssignToMe();
            //attachment3 add 1 file 
            await editTaskPo.addAttachmentInDynamicField('attachment4', filesToUpload2);
            await editTaskPo.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
            await viewTaskPo.clickOnDownloadFile('bwfJpg.jpg');
            expect(await utilityCommon.isFileDownloaded('bwfJpg.jpg')).toBeTruthy('failureMsg: bwfJpg.jpg File is not downloaded.');
            await viewTaskPo.clickOnDownloadFile('bwfPdf.pdf');
            expect(await utilityCommon.isFileDownloaded('bwfPdf.pdf')).toBeTruthy('failureMsg: bwfPdf.pdf File is not downloaded.');
            await viewTaskPo.clickShowMoreShowLessLink();
            await viewTaskPo.clickOnDownloadFile('bwfWord2.rtf');
            expect(await utilityCommon.isFileDownloaded('bwfWord2.rtf')).toBeTruthy('failureMsg: bwfWord2.rtf File is not downloaded.');
            //delete downloaded files
            for (let i: number = 0; i <= fileName2.length; i++) {
                await utilityCommon.deleteAlreadyDownloadedFile(`${fileName2[i]}`);
            }
        });
    });

    describe('[4825]: [-ve] [Dynamic Data] - Task UI with dynamic data having long description/labels with large data in different fields', async () => {
        const randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let dynamicfield1 = 'theNewDynamicFieldsIsgettingMouseOveredMouseOvered';
        let dynamicfield2 = 'theSecondDynamicFieldsIsgettingMouseOveredMouseOvered';
        let dynamicfield3 = 'theThirdDynamicFieldsIsgettingMouseOveredMouseOvered';
        let dynamicfield4 = 'temp1theNewDynamicFieldsIsgettingMouseOveredMouseOvered';

        let taskTemplateName = 'ManualtaskDRDMV13161' + randomStr;
        let manualTaskSummary = 'ManualSummaryDRDMV13161' + randomStr;
        let externalTask = 'externalTaskDRDMV13161' + randomStr;
        let externalTaskSummary = 'externalSummaryDRDMV13161' + randomStr;
        let automatedTask = 'automatedTaskDRDMV13161' + randomStr;
        let automatedTaskSummary = 'automatedSummaryDRDMV13161' + randomStr;
        let caseId, processName = 'automated process' + randomStr;

        beforeAll(async () => {
            let templateData = {
                "templateName": `${taskTemplateName}`,
                "templateSummary": `${manualTaskSummary}`,
                "templateStatus": "Active",
                "taskCompany": 'Petramco',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            await apiHelper.apiLogin('qkatawazi');
            let tasktemplate = await apiHelper.createManualTaskTemplate(templateData);
            await apiHelper.createDynamicDataOnTemplate(tasktemplate.id, 'TASK_TEMPLATE_LONG__DYNAMIC_FIELDS');
            let externalTemplateData = {
                "templateName": `${externalTask}`,
                "templateSummary": `${externalTaskSummary}`,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('qkatawazi');
            let externalTaskTemplate = await apiHelper.createExternalTaskTemplate(externalTemplateData);
            await apiHelper.createDynamicDataOnTemplate(externalTaskTemplate.id, 'EXTERNAL_TASK_TEMPLATE_LONG__DYNAMIC');
            let automationTemplateData = {
                "templateName": `${automatedTask}`,
                "templateSummary": `${automatedTaskSummary}`,
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": `${processName}`,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('qkatawazi');
            let autoTaskTemplate = await apiHelper.createAutomatedTaskTemplate(automationTemplateData);
            await apiHelper.createDynamicDataOnTemplate(autoTaskTemplate.id, 'AUTOMATED_TASK_TEMPLATE_LONG__DYNAMIC');
        });
        it('[4825]: [-ve] [Dynamic Data] - Task UI with dynamic data having long description/labels with large data in different fields', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('adam');
            await createCasePo.setSummary('new cases');
            await changeAssignmentPage.setAssignee("US Support 3", "Qadim Katawazi");
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            caseId = await viewCasePo.getCaseID();
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.addTaskFromTaskTemplate(automatedTask);
            await manageTaskBladePo.addTaskFromTaskTemplate(taskTemplateName);
            await manageTaskBladePo.addTaskFromTaskTemplate(externalTask);
            await utilityCommon.closePopUpMessage();
            await manageTaskBladePo.clickTaskLink(manualTaskSummary);
            //verify dynamic field
            expect(await viewTaskPo.getDynamicFieldName(dynamicfield1)).toContain(dynamicfield1);
            expect(await viewTaskPo.getDynamicFieldName(dynamicfield2)).toContain(dynamicfield2);
            expect(await viewTaskPo.getDynamicFieldName(dynamicfield3)).toContain(dynamicfield3);
            expect(await viewTaskPo.getDynamicFieldName(dynamicfield4)).toContain(dynamicfield4);
        });
        it('[4825]: [-ve] [Dynamic Data] - Task UI with dynamic data having long description/labels with large data in different fields', async () => {
            await viewTaskPo.clickOnEditTask();
            await editTaskPo.setDynamicFieldValue(dynamicfield1, dynamicfield2);
            await editTaskPo.setDynamicFieldValue(dynamicfield2, dynamicfield1);
            await changeAssignmentPage.setAssignee("US Support 3", "Qadim Katawazi");
            await editTaskPo.setDynamicFieldValue(dynamicfield4, '100');
            await editTaskPo.setDynamicFieldValue(dynamicfield3, dynamicfield4);
            await editTaskPo.clickOnSaveButton();
            //verify input field values are peresent are not 
            expect(await viewTaskPo.getDynamicFieldValue(dynamicfield1)).toContain(dynamicfield2);
            expect(await viewTaskPo.getDynamicFieldValue(dynamicfield2)).toContain(dynamicfield1);
            expect(await viewTaskPo.getDynamicFieldValue(dynamicfield3)).toContain(dynamicfield4);
            expect(await viewTaskPo.getDynamicFieldValue(dynamicfield4)).toContain('100');
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(caseId);
            await updateStatusBladePo.changeStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus('In Progress');
        });
        it('[4825]: [-ve] [Dynamic Data] - Task UI with dynamic data having long description/labels with large data in different fields', async () => {
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.clickTaskLink(externalTaskSummary);
            //verify dynamic field on external task
            expect(await viewTaskPo.getDynamicFieldName('theExternalDynamicFieldsIsgettingMouseOveredMouseOvered')).toContain('theExternalDynamicFieldsIsgettingMouseOveredMouseOvered');
            expect(await viewTaskPo.getDynamicFieldName('theSecondExternalDynamicFieldsIsgettingMouseOveredMouseOvered')).toContain('theSecondExternalDynamicFieldsIsgettingMouseOveredMouseOvered');
            expect(await viewTaskPo.getDynamicFieldName('theThirdDynamicExternalFieldsIsgettingMouseOveredMouseOvered')).toContain('theThirdDynamicExternalFieldsIsgettingMouseOveredMouseOvered');
            expect(await viewTaskPo.getDynamicFieldName('temp1theNewExternalDynamicFieldsIsgettingMouseOveredMouseOvered')).toContain('temp1theNewExternalDynamicFieldsIsgettingMouseOveredMouseOvered');
            await viewTaskPo.clickOnEditTask();
            await editTaskPo.setDynamicFieldValue('temp1theNewExternalDynamicFieldsIsgettingMouseOveredMouseOvered', '200');
            await editTaskPo.setDynamicFieldValue('theSecondExternalDynamicFieldsIsgettingMouseOveredMouseOvered', 'temp1theNewExternalDynamicFieldsIsgettingMouseOveredMouseOvered');
            await changeAssignmentPage.setAssignee("US Support 3", "Qadim Katawazi");
            await editTaskPo.clickOnSaveButton();
            //verify input field values are peresent are not 
            expect(await viewTaskPo.getDynamicFieldValue('temp1theNewExternalDynamicFieldsIsgettingMouseOveredMouseOvered')).toContain('200');
            expect(await viewTaskPo.getDynamicFieldValue('theSecondExternalDynamicFieldsIsgettingMouseOveredMouseOvered')).toContain('temp1theNewExternalDynamicFieldsIsgettingMouseOveredMouseOvered');
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            await viewCasePo.clickOnTaskLink(automatedTaskSummary);
            expect(await viewTaskPo.getDynamicFieldName('theautomatedDynamicFieldsIsgettingMouseOveredMouseOvered')).toContain('theautomatedDynamicFieldsIsgettingMouseOveredMouseOvered');
            expect(await viewTaskPo.getDynamicFieldName('theSecondautomatedDynamicFieldsIsgettingMouseOveredMouseOvered')).toContain('theSecondautomatedDynamicFieldsIsgettingMouseOveredMouseOvered');
            expect(await viewTaskPo.getDynamicFieldName('theThirdDynamicautomatedFieldsIsgettingMouseOveredMouseOvered')).toContain('theThirdDynamicautomatedFieldsIsgettingMouseOveredMouseOvered');
            expect(await viewTaskPo.getDynamicFieldName('temp1theNewautomatedDynamicFieldsIsgettingMouseOveredMouseOvered')).toContain('temp1theNewautomatedDynamicFieldsIsgettingMouseOveredMouseOvered');
            await viewTaskPo.clickOnEditTask();
            await editTaskPo.setDynamicFieldValue('temp1theNewautomatedDynamicFieldsIsgettingMouseOveredMouseOvered', '300');
            await editTaskPo.setDynamicFieldValue('theautomatedDynamicFieldsIsgettingMouseOveredMouseOvered', 'theautomatedDynamicFieldsIsgettingMouseOveredMouseOvered');
            await editTaskPo.clickOnSaveButton();
            //verify input field values are peresent are not 
            expect(await viewTaskPo.getDynamicFieldValue('temp1theNewautomatedDynamicFieldsIsgettingMouseOveredMouseOvered')).toContain('300');
            expect(await viewTaskPo.getDynamicFieldValue('theautomatedDynamicFieldsIsgettingMouseOveredMouseOvered')).toContain('theautomatedDynamicFieldsIsgettingMouseOveredMouseOvered');
        });
    });

    // ptidke
    describe('[4853]: [Dynamic Data] - Create Case with Case Template having dynamic fields and Update dynamic fields data in Case', async () => {
        const randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateName = randomStr + 'caseTemplateDRDMV13128';
        let caseTemaplateSummary = randomStr + 'caseTemplateDRDMV13128';
        beforeAll(async () => {
            let casetemplateData = {
                "templateName": `${caseTemplateName}`,
                "templateSummary": `${caseTemaplateSummary}`,
                "templateStatus": "Active",
                "assignee": "qkatawazi",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "ownerBU": "United States Support",
                "supportGroup": "US Support 3",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            await apiHelper.apiLogin('qkatawazi');
            let newCaseTemplate = await apiHelper.createCaseTemplate(casetemplateData);
            await apiHelper.createDynamicDataOnTemplate(newCaseTemplate.id, 'CASE_TEMPLATE_DYNAMIC_FIELDS');
        });
        it('[4853]: [Dynamic Data] - Create Case with Case Template having dynamic fields and Update dynamic fields data in Case', async () => {
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('adam');
            await quickCasePo.selectCaseTemplate(caseTemplateName);
            await quickCasePo.createCaseButton();
            await quickCasePo.gotoCaseButton();
            await viewCasePo.clickEditCaseButton();
            await editTaskPo.setDateTimeDynamicFieldValue('2020-03-04');
            await editCasePo.setDynamicFieldValue('temp', 'newtemp');
            await editCasePo.setDynamicFieldValue('temp1', '333');
            await editCasePo.setDateValueInDynamicField('2020-03-01');
            await editCasePo.clickOnTrueValueOfDynamicField();
            await editCasePo.addAttachment('attachment2', ['../../data/ui/attachment/demo.txt']);
            await editCasePo.setTimeInDynamicField('02');
            await editCasePo.selectValueFromList('dynamicList', 'listvalues');
            await editCasePo.clickSaveCase();
            await utilityCommon.closePopUpMessage();
        });
        it('[4853]: [Dynamic Data] - Create Case with Case Template having dynamic fields and Update dynamic fields data in Case', async () => {
            //verify update values on case view
            expect(await viewCasePo.getValueOfDynamicFields('temp')).toBe('newtemplistvalues');
            expect(await viewCasePo.getValueOfDynamicFields('temp1')).toBe('333');
            expect(await viewCasePo.getValueOfDynamicFields('temp2')).toContain('Jan 20, 2020');
            expect(await viewCasePo.getValueOfDynamicFields('temp4')).toContain('Mar 4, 2020 12:00 AM');
            expect(await viewCasePo.getValueOfDynamicFields('temp3')).toContain('Yes');
            expect(await viewCasePo.getValueOfDynamicFields('temp5')).toContain('2:00 AM');
            expect(await viewCasePo.getValueOfDynamicFields('dynamicList')).toContain('listvalues');
            expect(await viewCasePo.getDynamicAttachmentValue()).toContain('demo.txt');
        });
    });

    // ptidke
    describe('[4854]: [Dynamic Data] - Create Case from Create Case with Template having dynamic fields and also have field with source as Requester', async () => {
        const randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateName = randomStr + 'caseTemplateDRDMV13127';
        let caseTemaplateSummary = randomStr + 'caseTemplateDRDMV13127';
        beforeAll(async () => {
            let casetemplateData = {
                "templateName": `${caseTemplateName}`,
                "templateSummary": `${caseTemaplateSummary}`,
                "templateStatus": "Active",
                "assignee": "qkatawazi",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "ownerBU": "United States Support",
                "supportGroup": "US Support 3",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            await apiHelper.apiLogin('qkatawazi');
            let newCaseTemplate = await apiHelper.createCaseTemplate(casetemplateData);
            await apiHelper.createDynamicDataOnTemplate(newCaseTemplate.id, 'CASE_TEMPLATE_REQUESTER_DYNAMIC_FIELDS');
        });
        it('[4854]: [Dynamic Data] - Create Case from Create Case with Template having dynamic fields and also have field with source as Requester', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('adam');
            await createCasePo.setSummary('Summary');
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName);
            await createCasePo.clickAssignToMeButton();
            await createCasePo.clickSaveCaseButton();
            expect(await requesterResponseBladePo.getBladeHeading()).toContain("Requester's Response");
            expect(await requesterResponseBladePo.isDynamicFieldDisplayed('temp')).toBeTruthy('field not present');
            expect(await requesterResponseBladePo.isDynamicFieldDisplayed('temp1')).toBeTruthy('field not present');
            expect(await requesterResponseBladePo.isDynamicFieldDisplayed('temp2')).toBeTruthy('field not present');
            expect(await requesterResponseBladePo.isDynamicFieldDisplayed('temp3')).toBeTruthy('field not present');
            expect(await requesterResponseBladePo.isDynamicFieldDisplayed('temp4')).toBeTruthy('field not present');
            expect(await requesterResponseBladePo.isDynamicFieldDisplayed('temp5')).toBeTruthy('field not present');
            expect(await requesterResponseBladePo.isDynamicFieldDisplayed('dynamicList')).toBeTruthy('field not present');
            expect(await requesterResponseBladePo.isDynamicFieldDisplayed('attachment1')).toBeFalsy('field is present');
            await requesterResponseBladePo.clickOkButton();
            await previewCasePo.clickGoToCaseButton();
            let empty = '-';
            //verify fields shoule be empty values on case view
            expect(await viewCasePo.getValueOfDynamicFields('temp')).toBe(empty);
            expect(await viewCasePo.getValueOfDynamicFields('temp1')).toBe(empty);
            expect(await viewCasePo.getValueOfDynamicFields('temp2')).toBe(empty);
            expect(await viewCasePo.getValueOfDynamicFields('temp4')).toBe(empty);
            expect(await viewCasePo.getValueOfDynamicFields('temp3')).toBe(empty);
            expect(await viewCasePo.getValueOfDynamicFields('temp5')).toBe(empty);
            expect(await viewCasePo.getValueOfDynamicFields('dynamicList')).toBe(empty);
            expect(await viewCasePo.getValueOfDynamicFields('attachment1')).toBe(empty);
        });
    });

    //ptidke
    describe('[4827]: [-ve] [UI] [Dynamic Data] - Update Task dynamic fields with invalid data', async () => {
        const randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let manualTaskTemplateData, externalTaskTemplateData, automationTaskTemplateData;
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            manualTaskTemplateData = {
                "templateName": 'ManualtaskDRDMV13158' + randomStr,
                "templateSummary": 'ManualSummaryDRDMV13158' + randomStr,
                "templateStatus": "Active",
                "taskCompany": 'Petramco',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('qkatawazi');
            let tasktemplate = await apiHelper.createManualTaskTemplate(manualTaskTemplateData);
            await apiHelper.createDynamicDataOnTemplate(tasktemplate.id, 'TASK_TEMPLATE__DYNAMIC_FIELDS');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            externalTaskTemplateData = {
                "templateName": 'ExternalTaskDRDMV13158' + randomStr,
                "templateSummary": 'ExternalSummaryDRDMV13158' + randomStr,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('qkatawazi');
            let externalTaskTemplate = await apiHelper.createExternalTaskTemplate(externalTaskTemplateData);
            await apiHelper.createDynamicDataOnTemplate(externalTaskTemplate.id, 'EXTERNAL_TASK_TEMPLATE__DYNAMIC_FIELDS');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            automationTaskTemplateData = {
                "templateName": 'AutomatedTaskDRDMV13158' + randomStr,
                "templateSummary": 'AutomatedSummaryDRDMV13158' + randomStr,
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": "Case Process " + randomStr,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3"
            }

            await apiHelper.apiLogin('qkatawazi');
            let autoTaskTemplate = await apiHelper.createAutomatedTaskTemplate(automationTaskTemplateData);
            await apiHelper.createDynamicDataOnTemplate(autoTaskTemplate.id, 'AUTOMATED_TASK_TEMPLATE__DYNAMIC_FIELDS');
        });
        it('[4827]: [-ve] [UI] [Dynamic Data] - Update Task dynamic fields with invalid data', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('adam');
            await createCasePo.setSummary('new cases');
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.addTaskFromTaskTemplate(automationTaskTemplateData.templateSummary);
            await manageTaskBladePo.waitUntilNumberOfTaskLinkAppear(1);
            await manageTaskBladePo.addTaskFromTaskTemplate(manualTaskTemplateData.templateSummary);
            await manageTaskBladePo.waitUntilNumberOfTaskLinkAppear(2);
            await manageTaskBladePo.addTaskFromTaskTemplate(externalTaskTemplateData.templateSummary);
            await manageTaskBladePo.waitUntilNumberOfTaskLinkAppear(3);
            await utilityCommon.closePopUpMessage();
        });
        it('[4827]: [-ve] [UI] [Dynamic Data] - Update Task dynamic fields with invalid data', async () => {
            await manageTaskBladePo.clickTaskLink(manualTaskTemplateData.templateSummary);
            //verify dynamic field
            await viewTaskPo.clickOnEditTask();
            await editTaskPo.setDynamicFieldValue('temp1', 'eee');
            let msg: string[] = ["Number is invalid"];
            expect(await utilityCommon.isPopupMsgsMatches(msg)).toBeTruthy();
            await editTaskPo.setDateValueInDynamicField('eee');
            await editTaskPo.clickOnSaveButton();
            expect(await editTaskPo.getErrorMsgOnDynamicFiled()).toContain("Invalid value");
            await editTaskPo.setDateValueInDynamicField('2020-03-01');
            await editTaskPo.setDateTimeDynamicFieldValue('2020-03-04');
            await editTaskPo.setDynamicFieldValue('temp', 'sssssss');
            await changeAssignmentPage.setAssignee("US Support 3", "Qadim Katawazi");
            await editTaskPo.clickOnSaveButton();
            //verify update values on case view
            expect(await viewTaskPo.getDynamicFieldValue('temp2')).toBe('Jan 20, 2020');
            expect(await viewTaskPo.getDynamicFieldValue('temp4')).toBe('Mar 4, 2020 12:00 AM');
            expect(await viewTaskPo.getDynamicFieldValue('temp1')).toBe('-');
        });
        it('[4827]: [-ve] [UI] [Dynamic Data] - Update Task dynamic fields with invalid data', async () => {
            await viewTaskPo.clickOnViewCase();
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.clickTaskLink(externalTaskTemplateData.templateSummary);
            await viewTaskPo.clickOnEditTask();
            await editTaskPo.setDynamicFieldValue('externalNumber', 'eee');
            let msg: string[] = ["Number is invalid"];
            expect(await utilityCommon.isPopupMsgsMatches(msg)).toBeTruthy();
            await editTaskPo.setDateValueInDynamicField('eee');
            await editTaskPo.clickOnSaveButton();
            expect(await editTaskPo.getErrorMsgOnDynamicFiled()).toContain("Invalid value");
            await editTaskPo.setDateValueInDynamicField('2020-03-01');
            await editTaskPo.setDateTimeDynamicFieldValue('2020-03-04');
            await editTaskPo.setDynamicFieldValue('externalText', 'sssssss');
            await changeAssignmentPage.setAssignee("US Support 3", "Qadim Katawazi");
            await editTaskPo.clickOnSaveButton();
            //verify update values on case view
            expect(await viewTaskPo.getDynamicFieldValue('externalDate')).toBe('Jan 20, 2020');
            expect(await viewTaskPo.getDynamicFieldValue('externalDateTime')).toBe('Mar 4, 2020 12:00 AM');
            expect(await viewTaskPo.getDynamicFieldValue('externalNumber')).toBe('-');
        });
        it('[4827]: [-ve] [UI] [Dynamic Data] - Update Task dynamic fields with invalid data', async () => {
            await viewTaskPo.clickOnViewCase();
            await viewCasePo.clickEditCaseButton();
            await changeAssignmentPage.setAssignee("US Support 3", "Qadim Katawazi");
            await editCasePo.clickSaveCase();
            await utilityCommon.closePopUpMessage();
            await updateStatusBladePo.changeStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus('In Progress');
            await utilityCommon.closePopUpMessage();
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.clickTaskLink(automationTaskTemplateData.templateSummary);
            await viewTaskPo.clickOnEditTask();
            await editTaskPo.setDynamicFieldValue('automatedNumber', 'eee');
            let msg: string[] = ["Number is invalid"];
            expect(await utilityCommon.isPopupMsgsMatches(msg)).toBeTruthy();
            await editTaskPo.setDateValueInDynamicField('eee');
            await editTaskPo.clickOnSaveButton();
            expect(await editTaskPo.getErrorMsgOnDynamicFiled()).toContain("Invalid value");
            await editTaskPo.setDateValueInDynamicField('2020-03-01');
            await editTaskPo.setDateTimeDynamicFieldValue('2020-03-04');
            await editTaskPo.setDynamicFieldValue('automatedText', 'sssssss');
            await editTaskPo.clickOnSaveButton();
            //verify update values on case view
            expect(await viewTaskPo.getDynamicFieldValue('automatedDate')).toBe('Jan 20, 2020');
            expect(await viewTaskPo.getDynamicFieldValue('automatedDateTime')).toBe('Mar 4, 2020 12:00 AM');
            expect(await viewTaskPo.getDynamicFieldValue('automatedNumber')).toBe('-');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
        })
    });

    //ptidke
    describe('[4864]:[-ve] [Dynamic Data] - Add 2 or more new fields in Case Template with same Name (ID)', async () => {
        it('[4864]:[-ve] [Dynamic Data] - Add 2 or more new fields in Case Template with same Name (ID)', async () => {
            let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let templateData = {
                "templateName": 'CaseTemplateName13116' + randomStr,
                "templateSummary": 'CaseSummarySummary13116' + randomStr,
                "templateStatus": "Draft",
                "assignee": "qkatawazi",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "ownerBU": "United States Support",
                "supportGroup": "US Support 3",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createCaseTemplate(templateData);
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
            await utilityGrid.searchAndOpenHyperlink(templateData.templateName);
            await viewCasetemplatePo.clickOnMangeDynamicFieldLink();
            await dynamicFieldsPo.clickOnDynamicField();
            await dynamicFieldsPo.setFieldName('news' + randomStr);
            await dynamicFieldsPo.setDescriptionName('newDescri' + randomStr);
            await dynamicFieldsPo.clickSaveButton();
            await utilityCommon.closePopUpMessage();
            //duplicate
            await viewCasetemplatePo.clickOnMangeDynamicFieldLink();
            await dynamicFieldsPo.clickOnDynamicField();
            await dynamicFieldsPo.setFieldName('news' + randomStr);
            await dynamicFieldsPo.setDescriptionName('newDescri' + randomStr);
            await dynamicFieldsPo.clickSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('A dynamic field with the same name already exists in the dynamic group.')).toBeTruthy("Wrong pop up message");
            await utilityCommon.closePopUpMessage();
            await dynamicFieldsPo.setFieldName('newName' + randomStr);
            await dynamicFieldsPo.setDescriptionName('NewDescription' + randomStr);
            await dynamicFieldsPo.clickSaveButton();
            await utilityCommon.closePopUpMessage();
            expect(await viewCasetemplatePo.isDynamicFieldDisplayed('NewDescription' + randomStr)).toBeTruthy();
            expect(await viewCasetemplatePo.isDynamicFieldDisplayed('newDescri' + randomStr)).toBeTruthy();
            await viewCasetemplatePo.clickOnMangeDynamicFieldLink();
            await dynamicFieldsPo.clickOnDynamicField();
            await dynamicFieldsPo.setFieldName('newName' + randomStr);
            await dynamicFieldsPo.setDescriptionName('NewDescription' + randomStr);
            await dynamicFieldsPo.clickSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('A dynamic field with the same name already exists in the dynamic group.')).toBeTruthy('Wrong pop up message');
            await utilityCommon.closePopUpMessage();
            await dynamicFieldsPo.setFieldName('newNameUpdate' + randomStr);
            await dynamicFieldsPo.setDescriptionName('NewUpdatedDescription' + randomStr);
            await dynamicFieldsPo.clickSaveButton();
            await utilityCommon.closePopUpMessage();
            expect(await viewCasetemplatePo.isDynamicFieldDisplayed('NewUpdatedDescription' + randomStr)).toBeTruthy();
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await viewCasetemplatePo.clickBackArrowBtn();
        });

    });

    //ptidke
    describe('[4850,4857]:[-ve] [Dynamic Data] [UI] - Update Case dynamic fields with invalid data', async () => {
        const randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateName = randomStr + 'caseTemplateDRDMV13132';
        let caseTemaplateSummary = randomStr + 'caseTemplateDRDMV13132';
        beforeAll(async () => {
            let casetemplateData = {
                "templateName": `${caseTemplateName}`,
                "templateSummary": `${caseTemaplateSummary}`,
                "templateStatus": "Active",
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            await apiHelper.apiLogin('qkatawazi');
            let newCaseTemplate = await apiHelper.createCaseTemplate(casetemplateData);
            await apiHelper.createDynamicDataOnTemplate(newCaseTemplate.id, 'CASE_TEMPLATE_DYNAMIC_FIELDS');
        });
        it('[4850,4857]:[-ve] [Dynamic Data] [UI] - Update Case dynamic fields with invalid data', async () => {
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('adam');
            await quickCasePo.selectCaseTemplate(caseTemplateName);
            await quickCasePo.createCaseButton();
            await quickCasePo.gotoCaseButton();
            expect(await viewCasePo.isDynamicFieldDisplayed('temp')).toBeTruthy('dynamic fields not present');
            expect(await viewCasePo.isDynamicFieldDisplayed('temp1')).toBeTruthy('dynamic fields not present');
            expect(await viewCasePo.isDynamicFieldDisplayed('temp2')).toBeTruthy('dynamic fields not present');
            expect(await viewCasePo.isDynamicFieldDisplayed('temp3')).toBeTruthy('dynamic fields not present');
            expect(await viewCasePo.isDynamicFieldDisplayed('temp4')).toBeTruthy('dynamic fields not present');
            expect(await viewCasePo.isDynamicFieldDisplayed('temp5')).toBeTruthy('dynamic fields not present');
            expect(await viewCasePo.isDynamicFieldDisplayed('attachment1')).toBeTruthy('dynamic fields not present');
            expect(await viewCasePo.isDynamicFieldDisplayed('attachment2')).toBeTruthy('dynamic fields not present');
            expect(await viewCasePo.isDynamicFieldDisplayed('attachment3')).toBeTruthy('dynamic fields not present');
            expect(await viewCasePo.isDynamicFieldDisplayed('dynamicList')).toBeTruthy('dynamic fields not present');
        });
        it('[4850,4857]:[-ve] [Dynamic Data] [UI] - Update Case dynamic fields with invalid data', async () => {
            await viewCasePo.clickEditCaseButton();
            await editCasePo.setDynamicFieldValue('temp1', 'eee');
            let msg: string[] = ["Number is invalid"];
            expect(await utilityCommon.isPopupMsgsMatches(msg)).toBeTruthy();
            await editCasePo.setDateValueInDynamicField('eee');
            await editCasePo.clickSaveCase();
            expect(await editTaskPo.getErrorMsgOnDynamicFiled()).toContain("Invalid value");
            await editCasePo.setDateValueInDynamicField('2020-03-01');
            await editCasePo.setDynamicFieldValue('temp', 'sssssss');
            await editCasePo.clickOnAssignToMe();
            await editCasePo.clickSaveCase();
            //verify update values on case view
            expect(await viewCasePo.getValueOfDynamicFields('temp2')).toBe('Jan 20, 2020');
            expect(await viewCasePo.getValueOfDynamicFields('temp1')).toBe('-');
        });
    });

    //ptidke
    it('[4856]:[Dynamic Data] - Create Case from Create Case with Template having dynamic fields but does not have field with source as Requester', async () => {
        const randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteDynamicFieldAndGroup();
        let caseTemplateName = randomStr + 'caseTemplateDRDMV13125';
        let caseTemaplateSummary = randomStr + 'caseTemplateDRDMV13125';
        let casetemplateData = {
            "templateName": `${caseTemplateName}`,
            "templateSummary": `${caseTemaplateSummary}`,
            "templateStatus": "Active",
            "assignee": "qkatawazi",
            "company": "Petramco",
            "businessUnit": "United States Support",
            "ownerBU": "United States Support",
            "supportGroup": "US Support 3",
            "ownerGroup": "US Support 3"
        }
        await apiHelper.apiLogin('qkatawazi');
        let newCaseTemplate = await apiHelper.createCaseTemplate(casetemplateData);
        await apiHelper.createDynamicDataOnTemplate(newCaseTemplate.id, 'CASE_TEMPLATE_DYNAMIC_FIELDS');
        await navigationPage.gotoCreateCase();
        await createCasePo.selectRequester('qdu');
        await createCasePo.setSummary('new cases');
        await createCasePo.clickSelectCaseTemplateButton();
        await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName);
        await createCasePo.clickSaveCaseButton();
        expect(await requesterResponseBladePo.isRequesterBladePresent()).toBeFalsy('requester Blade is not present');
        await previewCasePo.clickGoToCaseButton();
        expect(await viewCasePo.isDynamicFieldDisplayed('temp')).toBeTruthy('dynamic fields not present');
        expect(await viewCasePo.isDynamicFieldDisplayed('temp1')).toBeTruthy('dynamic fields not present');
        expect(await viewCasePo.isDynamicFieldDisplayed('temp2')).toBeTruthy('dynamic fields not present');
        expect(await viewCasePo.isDynamicFieldDisplayed('temp3')).toBeTruthy('dynamic fields not present');
        expect(await viewCasePo.isDynamicFieldDisplayed('temp4')).toBeTruthy('dynamic fields not present');
        expect(await viewCasePo.isDynamicFieldDisplayed('temp5')).toBeTruthy('dynamic fields not present');
        expect(await viewCasePo.isDynamicFieldDisplayed('attachment1')).toBeTruthy('dynamic fields not present');
        expect(await viewCasePo.isDynamicFieldDisplayed('attachment2')).toBeTruthy('dynamic fields not present');
        expect(await viewCasePo.isDynamicFieldDisplayed('attachment3')).toBeTruthy('dynamic fields not present');
        expect(await viewCasePo.isDynamicFieldDisplayed('dynamicList')).toBeTruthy('dynamic fields not present');
    });

    describe('[59945]: Verify Dynamic Fields for Task are populated if Case template has been changed', () => {
        const randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseId, caseTemplatePetramcoWithTaskFlowData, caseTemplatePetramcoWithoutTaskFlowData, manualTaskTemplateData, externalTaskTemplateData, automatedTaskTemplateData;
        beforeAll(async () => {
            await apiHelper.apiLogin('qkatawazi');
            caseTemplatePetramcoWithTaskFlowData = {
                "templateName": `TaskFlow ${randomStr}`,
                "templateSummary": randomStr + ' caseTemplate with TF',
                "templateStatus": "Active",
                "casePriority": "Low",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qkatawazi",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3"
            }
            let caseTemplateResponse = await apiHelper.createCaseTemplate(caseTemplatePetramcoWithTaskFlowData);

            caseTemplatePetramcoWithoutTaskFlowData = {
                "templateName": `Simple flow ${randomStr}`,
                "templateSummary": randomStr + ' caseTemplate without TF',
                "templateStatus": "Active",
                "casePriority": "Low",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qkatawazi",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.createCaseTemplate(caseTemplatePetramcoWithoutTaskFlowData);

            manualTaskTemplateData = {
                "templateName": `DRDMV14901Manual${randomStr}`,
                "templateSummary": `DRDMV14901Manual${randomStr}`,
                "templateStatus": "Active",
                "category1": 'Applications',
                "category2": 'Help Desk',
                "category3": 'Incident',
                "taskCompany": 'Petramco',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qkatawazi",
                "description": randomStr
            }
            let manualTasktemplateResponse = await apiHelper.createManualTaskTemplate(manualTaskTemplateData);
            await apiHelper.createDynamicDataOnTemplate(manualTasktemplateResponse.id, 'TASK_TEMPLATE__DYNAMIC_FIELDS_MANUAL');

            externalTaskTemplateData = {
                "templateName": `DRDMV14901External${randomStr}`,
                "templateSummary": `DRDMV14901External${randomStr}`,
                "templateStatus": "Active",
                "category1": 'Applications',
                "category2": 'Help Desk',
                "category3": 'Incident',
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qkatawazi",
                "description": randomStr
            }
            let externalTasktemplateResponse = await apiHelper.createExternalTaskTemplate(externalTaskTemplateData);
            await apiHelper.createDynamicDataOnTemplate(externalTasktemplateResponse.id, 'TASK_TEMPLATE__DYNAMIC_FIELDS_EXTERNAL');

            automatedTaskTemplateData = {
                "templateName": `DRDMV14901Automated${randomStr}`,
                "templateSummary": `DRDMV14901Automated${randomStr}`,
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "category1": 'Applications',
                "category2": 'Help Desk',
                "category3": 'Incident',
                "processName": 'Auto Proces' + randomStr,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qkatawazi",
                "description": randomStr
            }
            let automatedTasktemplateResponse = await apiHelper.createAutomatedTaskTemplate(automatedTaskTemplateData);
            await apiHelper.createDynamicDataOnTemplate(automatedTasktemplateResponse.id, 'TASK_TEMPLATE__DYNAMIC_FIELDS_AUTOMATED');
            await apiHelper.associateCaseTemplateWithThreeTaskTemplate(caseTemplateResponse.displayId, automatedTasktemplateResponse.displayId, manualTasktemplateResponse.displayId, externalTasktemplateResponse.displayId);
        });
        it('[59945]: Verify Dynamic Fields for Task are populated if Case template has been changed', async () => {
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('adam');
            await createCasePo.setSummary('Summary of Customer defect' + randomStr);
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplatePetramcoWithoutTaskFlowData.templateName);
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            caseId = await viewCasePo.getCaseID();
            await viewCasePo.clickEditCaseButton();
            await editCasePo.clickOnChangeCaseTemplate();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplatePetramcoWithTaskFlowData.templateName);
            await editCasePo.clickSaveCase();
        });
        it('[59945]: Verify Dynamic Fields for Task are populated if Case template has been changed', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId)
            await viewCasePo.clickOnTaskLink(manualTaskTemplateData.templateName);
            expect(await viewTaskPo.isDynamicFieldDisplayed('manualtempTextC')).toBeTruthy();
            expect(await viewTaskPo.isDynamicFieldDisplayed('manualtempNumberC')).toBeTruthy();
            expect(await viewTaskPo.isDynamicFieldDisplayed('manualtempDateC')).toBeTruthy();
            expect(await viewTaskPo.isDynamicFieldDisplayed('manualtempBooleanC')).toBeTruthy();
            expect(await viewTaskPo.isDynamicFieldDisplayed('manualtempDateTimeC')).toBeTruthy();
            expect(await viewTaskPo.isDynamicFieldDisplayed('manualtempTimeC')).toBeTruthy();
            expect(await viewTaskPo.isDynamicFieldDisplayed('manualtempAttachmentC')).toBeFalsy();
            expect(await viewTaskPo.isDynamicFieldDisplayed('manualtempText')).toBeTruthy();
            expect(await viewTaskPo.isDynamicFieldDisplayed('manualtempNumber')).toBeTruthy();
            expect(await viewTaskPo.isDynamicFieldDisplayed('manualtempDate')).toBeTruthy();
            expect(await viewTaskPo.isDynamicFieldDisplayed('manualtempBoolean')).toBeTruthy();
            expect(await viewTaskPo.isDynamicFieldDisplayed('manualtempDateTime')).toBeTruthy();
            expect(await viewTaskPo.isDynamicFieldDisplayed('manualtempTime')).toBeTruthy();
            expect(await viewTaskPo.isDynamicFieldDisplayed('manualtempAttachment')).toBeTruthy();
            await viewTaskPo.clickOnViewCase();

            await viewCasePo.clickOnTaskLink(externalTaskTemplateData.templateName);
            expect(await viewTaskPo.isDynamicFieldDisplayed('externaltempTextC')).toBeTruthy();
            expect(await viewTaskPo.isDynamicFieldDisplayed('externaltempNumberC')).toBeTruthy();
            expect(await viewTaskPo.isDynamicFieldDisplayed('externaltempDateC')).toBeTruthy();
            expect(await viewTaskPo.isDynamicFieldDisplayed('externaltempBooleanC')).toBeTruthy();
            expect(await viewTaskPo.isDynamicFieldDisplayed('externaltempDateTimeC')).toBeTruthy();
            expect(await viewTaskPo.isDynamicFieldDisplayed('externaltempTimeC')).toBeTruthy();
            expect(await viewTaskPo.isDynamicFieldDisplayed('externaltempAttachmentC')).toBeFalsy();
            expect(await viewTaskPo.isDynamicFieldDisplayed('externaltempText')).toBeTruthy();
            expect(await viewTaskPo.isDynamicFieldDisplayed('externaltempNumber')).toBeTruthy();
            expect(await viewTaskPo.isDynamicFieldDisplayed('externaltempDate')).toBeTruthy();
            expect(await viewTaskPo.isDynamicFieldDisplayed('externaltempBoolean')).toBeTruthy();
            expect(await viewTaskPo.isDynamicFieldDisplayed('externaltempDateTime')).toBeTruthy();
            expect(await viewTaskPo.isDynamicFieldDisplayed('externaltempTime')).toBeTruthy();
            expect(await viewTaskPo.isDynamicFieldDisplayed('externaltempAttachment')).toBeTruthy();
            await viewTaskPo.clickOnViewCase();

            await viewCasePo.clickOnTaskLink(automatedTaskTemplateData.templateName);
            expect(await viewTaskPo.isDynamicFieldDisplayed('automatedtempTextC')).toBeTruthy();
            expect(await viewTaskPo.isDynamicFieldDisplayed('automatedtempNumberC')).toBeTruthy();
            expect(await viewTaskPo.isDynamicFieldDisplayed('automatedtempDateC')).toBeTruthy();
            expect(await viewTaskPo.isDynamicFieldDisplayed('automatedtempBooleanC')).toBeTruthy();
            expect(await viewTaskPo.isDynamicFieldDisplayed('automatedtempDateTimeC')).toBeFalsy();
            expect(await viewTaskPo.isDynamicFieldDisplayed('automatedtempTimeC')).toBeTruthy();
            expect(await viewTaskPo.isDynamicFieldDisplayed('automatedtempAttachmentC')).toBeFalsy();
            expect(await viewTaskPo.isDynamicFieldDisplayed('automatedtempText')).toBeTruthy();
            expect(await viewTaskPo.isDynamicFieldDisplayed('automatedtempNumber')).toBeTruthy();
            expect(await viewTaskPo.isDynamicFieldDisplayed('automatedtempDate')).toBeTruthy();
            expect(await viewTaskPo.isDynamicFieldDisplayed('automatedtempBoolean')).toBeTruthy();
            expect(await viewTaskPo.isDynamicFieldDisplayed('automatedtempDateTime')).toBeFalsy();
            expect(await viewTaskPo.isDynamicFieldDisplayed('automatedtempTime')).toBeTruthy();
            expect(await viewTaskPo.isDynamicFieldDisplayed('automatedtempAttachment')).toBeFalsy();
            await viewTaskPo.clickOnViewCase();
        });
    });
});
