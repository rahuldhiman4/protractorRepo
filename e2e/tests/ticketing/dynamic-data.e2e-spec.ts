import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import caseConsolePo from '../../pageobject/case/case-console.po';
import previewCasePo from '../../pageobject/case/case-preview.po';
import createCasePo from '../../pageobject/case/create-case.po';
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
import consoleDocumentTemplatePo from '../../pageobject/settings/document-management/console-document-template.po';
import createDocumentTemplatePo from '../../pageobject/settings/document-management/create-document-template.po';
import consoleEmailTemplatePo from '../../pageobject/settings/email/console-email-template.po';
import createEmailTemplatePo from '../../pageobject/settings/email/create-email-template.po';
import consoleNotificationTemplatePo from '../../pageobject/settings/notification-config/console-notification-template.po';
import createNotificationTemplatePo from '../../pageobject/settings/notification-config/create-notification-template.po';
import editNotificationTemplatePo from '../../pageobject/settings/notification-config/edit-notification-template.po';
import editTaskPo from '../../pageobject/task/edit-task.po';
import manageTaskBladePo from '../../pageobject/task/manage-task-blade.po';
import viewTaskPo from '../../pageobject/task/view-task.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilCommon from '../../utils/util.common';
import utilGrid from '../../utils/util.grid';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';

describe('Dynamic data', () => {
    const randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
    const manageNotificationTempNavigation = 'Notification Configuration--Manage Templates';
    const notifTempGridPageTitle = 'Manage Notification Template - Business Workflows';
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('fritz');
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    afterEach(async () => {
        await utilityCommon.refresh();
    });

    it('[DRDMV-19353]: Accessibility of Dynamic Fields in Notification and Dynamic Templates', async () => {
        await apiHelper.apiLogin('tadmin');
        let recDeleted = await apiHelper.deleteDynamicFieldAndGroup();
        console.log("Record deleted...", recDeleted);
        let caseTemplateName = 'caseTemplate' + randomStr;
        let caseTemaplateSummary = 'caseTemplate' + randomStr;
        let casetemplateData = {
            "templateName": `${caseTemplateName}`,
            "templateSummary": `${caseTemaplateSummary}`,
            "templateStatus": "Active",
            "assignee": "Fritz",
            "company": "Petramco",
            "businessUnit": "Facilities Support",
            "ownerBU": "Facilities Support",
            "supportGroup": "Facilities",
            "ownerGroup": "Facilities"
        }
        await apiHelper.apiLogin('fritz');
        let newCaseTemplate = await apiHelper.createCaseTemplate(casetemplateData);
        await apiHelper.createDynamicDataOnTemplate(newCaseTemplate.id, 'SAVE_EXISTING_AND_NEW_CASE_DYNAMIC_DATA_DEFINITION');
        let globalcaseTemplateName = 'globalcasetempalte' + randomStr;
        let gloablcaseTemaplateSummary = 'gloabalcasetemplate' + randomStr;
        let globaltemplateData = {
            "templateName": `${globalcaseTemplateName}`,
            "templateSummary": `${gloablcaseTemaplateSummary}`,
            "templateStatus": "Active",
            "company": "- Global -",
        }
        let globaltemplate = await apiHelper.createCaseTemplate(globaltemplateData);
        await apiHelper.createDynamicDataOnTemplate(globaltemplate.id, 'GLOBAL_DYNAMIC_DATA_CASE_TEMPLATE');

        let taskTemplateName = 'Manual  task' + randomStr;
        let manualTaskSummary = 'ManualSummary' + randomStr;
        let templateData = {
            "templateName": `${taskTemplateName}`,
            "templateSummary": `${manualTaskSummary}`,
            "templateStatus": "Active",
            "taskCompany": 'Petramco',
            "ownerCompany": "Petramco",
            "ownerBusinessUnit": "Facilities Support",
            "ownerGroup": "Facilities"
        }
        let tasktemplate = await apiHelper.createManualTaskTemplate(templateData);
        await apiHelper.createDynamicDataOnTemplate(tasktemplate.id, 'DYNAMIC_DATA_FOR_TASK_TEMPLATE');
        let globalTaskTemplateName = 'Global  task' + randomStr;
        let globalmanualTaskSummary = 'GlobalTaskSummary' + randomStr;
        let gloabalTaskData = {
            "templateName": `${globalTaskTemplateName}`,
            "templateSummary": `${globalmanualTaskSummary}`,
            "templateStatus": "Active",
            "taskCompany": '- Global -',
            "ownerCompany": "Petramco",
            "ownerBusinessUnit": "Facilities Support",
            "ownerGroup": "Facilities"
        }

        let globalTasktemplate = await apiHelper.createManualTaskTemplate(gloabalTaskData);
        await apiHelper.createDynamicDataOnTemplate(globalTasktemplate.id, 'GLOBAL_TASK_TEMPLATE');
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem(manageNotificationTempNavigation, notifTempGridPageTitle);
        await consoleNotificationTemplatePo.clickOnCreateNotificationTemplate();
        await createNotificationTemplatePo.selectEvent('Case Assignments');
        await createNotificationTemplatePo.selectModuleName('Cases');
        await createNotificationTemplatePo.clickOnInsertFieldOfAlert();
        await addFieldsPopPo.navigateToDynamicFieldInCaseTemplate(globalcaseTemplateName);
        expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('GlobalField1')).toBeTruthy();
        expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('GlobalField2')).toBeTruthy();
        expect(await addFieldsPopPo.isCaseTemplatePresent(caseTemplateName)).toBeFalsy();
        await addFieldsPopPo.clickOnOkButtonOfEditor();
        await createNotificationTemplatePo.selectEvent('Approval');
        await createNotificationTemplatePo.selectModuleName('Cases');
        await createNotificationTemplatePo.clickOnInsertFieldOfAlert();
        await addFieldsPopPo.navigateToDynamicFieldInCaseTemplate(caseTemplateName);
        expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('casePetramco1')).toBeTruthy();
        expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('casePetramco2')).toBeTruthy();
        await addFieldsPopPo.clickOnOkButtonOfEditor();
        await createNotificationTemplatePo.clickOnInsertFieldOfAlert();
        await addFieldsPopPo.navigateToDynamicFieldInCaseTemplate(globalcaseTemplateName);
        expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('GlobalField1')).toBeTruthy();
        expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('GlobalField2')).toBeTruthy();
        await addFieldsPopPo.clickOnOkButtonOfEditor();
        await createNotificationTemplatePo.selectEvent('Case Assignments');
        await createNotificationTemplatePo.selectModuleName('Tasks');
        await createNotificationTemplatePo.clickOnInsertFieldOfAlert();
        await addFieldsPopPo.navigateToDynamicFieldInTaskTemplate(globalTaskTemplateName);
        expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('GlobalTaskField1')).toBeTruthy();
        expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('GlobalTaskField2')).toBeTruthy();
        expect(await addFieldsPopPo.isCaseTemplatePresent(taskTemplateName)).toBeFalsy();
        await addFieldsPopPo.clickOnOkButtonOfEditor();
        await createNotificationTemplatePo.selectEvent('Approval');
        await createNotificationTemplatePo.selectModuleName('Tasks');
        await createNotificationTemplatePo.clickOnInsertFieldOfAlert();
        await addFieldsPopPo.navigateToDynamicFieldInTaskTemplate(taskTemplateName);
        expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('ddfield1')).toBeTruthy();
        expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('ddfield2')).toBeTruthy();
        await addFieldsPopPo.clickOnOkButtonOfEditor();
        await createNotificationTemplatePo.clickOnInsertFieldOfAlert();
        await addFieldsPopPo.navigateToDynamicFieldInTaskTemplate(globalTaskTemplateName);
        expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('GlobalTaskField1')).toBeTruthy();
        expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('GlobalTaskField2')).toBeTruthy();
        await addFieldsPopPo.clickOnOkButtonOfEditor();
        await createNotificationTemplatePo.clickOnCancelButton();
        await utilCommon.clickOnWarningOk();
        await browser.navigate().back();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Document Management--Templates', 'Document Templates - Business Workflows');
        await consoleDocumentTemplatePo.clickOnCreateDocumentTemplate();
        await createDocumentTemplatePo.setCompany('- Global -');
        await createDocumentTemplatePo.setTemplateName(randomStr);
        await createDocumentTemplatePo.clickOnInsertFieldOfDocumentBody();
        await addFieldsPopPo.navigateToDynamicFieldInCaseTemplate(globalcaseTemplateName);
        expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('GlobalField1')).toBeTruthy();
        expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('GlobalField2')).toBeTruthy();
        expect(await addFieldsPopPo.isCaseTemplatePresent(caseTemplateName)).toBeFalsy();
        await addFieldsPopPo.clickOnOkButtonOfEditor();
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
        await utilCommon.clickOnWarningOk();
    }, 1100 * 1000);

    it('[DRDMV-19270]: Associated and Dynamic fields usage on Notification/Email/Activity Templates', async () => {
        await apiHelper.apiLogin('tadmin');
        let recDeleted = await apiHelper.deleteDynamicFieldAndGroup();
        console.log("Record deleted...", recDeleted);
        let caseTemplateName = 'caseTempRDMV-192700lp3ir' + randomStr;
        let caseTemaplateSummary = 'caseTempRDMV-19270Template' + randomStr;
        let casetemplateData = {
            "templateName": `${caseTemplateName}`,
            "templateSummary": `${caseTemaplateSummary}`,
            "templateStatus": "Active",
            "assignee": "Fritz",
            "company": "Petramco",
            "businessUnit": "Facilities Support",
            "ownerBU": "Facilities Support",
            "supportGroup": "Facilities",
            "ownerGroup": "Facilities"
        }
        await apiHelper.apiLogin('fritz');
        let newCaseTemplate = await apiHelper.createCaseTemplate(casetemplateData);
        await apiHelper.createDynamicDataOnTemplate(newCaseTemplate.id, 'CASE_TEMPLATE_WITH_CONFIDENTIAL');
        let taskTemplateName = 'ManualtaskDRDMV-19270' + randomStr;
        let manualTaskSummary = 'ManualSummaryDRDMV-19270' + randomStr;
        let templateData = {
            "templateName": `${taskTemplateName}`,
            "templateSummary": `${manualTaskSummary}`,
            "templateStatus": "Active",
            "taskCompany": 'Petramco',
            "ownerCompany": "Petramco",
            "ownerBusinessUnit": "Facilities Support",
            "ownerGroup": "Facilities"
        }
        let tasktemplate = await apiHelper.createManualTaskTemplate(templateData);
        await apiHelper.createDynamicDataOnTemplate(tasktemplate.id, 'TASK_TEMPLATE_WITH_CONFIDENTIAL');
        await navigationPage.gotoCaseConsole();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem(manageNotificationTempNavigation, notifTempGridPageTitle);
        await consoleNotificationTemplatePo.clickOnCreateNotificationTemplate();
        await createNotificationTemplatePo.selectEvent('Approval Rejection');
        await createNotificationTemplatePo.selectModuleName('Cases');
        await createNotificationTemplatePo.setTemplateName("Notification" + randomStr);
        await createNotificationTemplatePo.setDescription("Notification Description " + randomStr);
        await createNotificationTemplatePo.clickOnInsertFieldOfAlert();
        await addFieldsPopPo.navigateToDynamicFieldInCaseTemplate(caseTemplateName);
        expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('OuterConfidential')).toBeTruthy();
        expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('OuterNonConfidential')).toBeTruthy();
        expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('ListOfDataName')).toBeTruthy();
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
        await createNotificationTemplatePo.clickOnTab();
        await createNotificationTemplatePo.setSubject(randomStr);
        await createNotificationTemplatePo.clickOnInsetFieldOfEmail();
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
        await addFieldsPopPo.clickOnAssocitionAndSelectField('DynamicTicketData', 'Confidential data');
        await addFieldsPopPo.clickOnAssocitionAndSelectField('Site to Ticket', 'Additional Site Details');
        await addFieldsPopPo.clickOnOkButtonOfEditor();
        expect(await createNotificationTemplatePo.isDynamicFieldDisplayedInAlertBody('Confidential data')).toBeTruthy();
        expect(await createNotificationTemplatePo.isDynamicFieldDisplayedInAlertBody('Additional Site Details')).toBeTruthy();
        await createNotificationTemplatePo.clickOnTab();
        await createNotificationTemplatePo.clickOnInsetFieldOfEmail();
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
        expect(await createNotificationTemplatePo.isDynamicFieldDisplayedInEmailBody('SLM Status')).toBeTruthy();
        expect(await createNotificationTemplatePo.isDynamicFieldDisplayedInEmailBody('Visible to All Organization')).toBeTruthy();
        await createNotificationTemplatePo.clickOnSaveButton();
        expect(await editNotificationTemplatePo.getHeaderText()).toContain('Edit Notification Template');
        await editNotificationTemplatePo.clickOnCancelButton();
        await navigationPage.gotoCaseConsole();
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteEmailOrNotificationTemplate("NotificationNew" + randomStr);
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Email--Templates', 'Email Template Console - Business Workflows');
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
        await utilGrid.searchRecord('emailTemp' + randomStr);
        expect(await consoleEmailTemplatePo.getSelectedGridRecordValue('Template Name')).toContain('emailTemp' + randomStr, 'value is not displaying in Grid');
        await navigationPage.gotoCaseConsole();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Notes Template', 'Activity Notes Template Console - Task - Business Workflows');
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
        expect(await utilCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy();
    }, 850 * 1000);

    it('[DRDMV-13567]: [Dynamic Data] [Attachment] - Case UI when it has Dynamic Fields including Attachment', async () => {
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteDynamicFieldAndGroup();
        let caseTemplateName = 'caseTemplateDRDMV-13567' + randomStr;
        let caseTemaplateSummary = 'caseTemplateDRDMV-13567' + randomStr;
        let casetemplateData = {
            "templateName": `${caseTemplateName}`,
            "templateSummary": `${caseTemaplateSummary}`,
            "templateStatus": "Active",
            "assignee": "Fritz",
            "company": "Petramco",
            "businessUnit": "Facilities Support",
            "ownerBU": "Facilities Support",
            "supportGroup": "Facilities",
            "ownerGroup": "Facilities"
        }
        await apiHelper.apiLogin('fritz');
        let newCaseTemplate = await apiHelper.createCaseTemplate(casetemplateData);
        await apiHelper.createDynamicDataOnTemplate(newCaseTemplate.id, 'CASE_TEMPLATE_DYNAMIC_FIELDS');
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
        let fileName1: string[] = ['articleStatus.png', 'bwfJpg.jpg', 'bwfJpg1.jpg', 'bwfJpg2.jpg', 'bwfJpg3.jpg', 'bwfJpg4.jpg', 'bwfJson1.json', 'bwfJson2.json', 'bwfJson3.json', 'bwfJson4.json', 'bwfJson5.json'];
        let filesToUpload1 = fileName1.map((file) => { return `../../data/ui/attachment/${file}` });
        await editCasePo.addAttachment('attachment1', filesToUpload1);
        //attachment3 add 1 file 
        let fileName2: string[] = ['bwfWord1.rtf', 'bwfPdf.pdf', 'bwfPdf1.pdf', 'bwfPdf2.pdf', 'bwfPdf3.pdf', 'bwfPdf4.pdf', 'bwfWord2.rtf'];
        let filesToUpload2 = fileName2.map((file1) => { return `../../data/ui/attachment/${file1}` });
        await editCasePo.addAttachment('attachment1', filesToUpload2);
        await editCasePo.addAttachment('attachment2', ['../../data/ui/attachment/demo.txt']);
        await editCasePo.clickSaveCase();
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
    }, 300 * 1000);

    it('[DRDMV-13947]: [Dynamic Data] [Attachment] - Task UI when it has Dynamic Fields including Attachment', async () => {
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteDynamicFieldAndGroup();
        let taskTemplateName = 'ManualtaskDRDMV-13947' + randomStr;
        let manualTaskSummary = 'ManualSummaryDRDMV-13947' + randomStr;
        let templateData = {
            "templateName": `${taskTemplateName}`,
            "templateSummary": `${manualTaskSummary}`,
            "templateStatus": "Active",
            "taskCompany": 'Petramco',
            "ownerCompany": "Petramco",
            "ownerBusinessUnit": "Facilities Support",
            "ownerGroup": "Facilities"
        }
        let tasktemplate = await apiHelper.createManualTaskTemplate(templateData);
        await apiHelper.createDynamicDataOnTemplate(tasktemplate.id, 'TASK_TEMPLATE__DYNAMIC_FIELDS');
        await navigationPage.gotoCreateCase();
        await createCasePo.selectRequester('qkatawazi');
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

    it('[DRDMV-13948]: [Dynamic Data] [Attachment] - Add different type of files in attachment fields', async () => {
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteDynamicFieldAndGroup();
        let caseTemplateName = 'caseTemplateDRDMV-13948' + randomStr;
        let caseTemaplateSummary = 'caseTemplateDRDMV-13948' + randomStr;
        let casetemplateData = {
            "templateName": `${caseTemplateName}`,
            "templateSummary": `${caseTemaplateSummary}`,
            "templateStatus": "Active",
            "assignee": "Fritz",
            "company": "Petramco",
            "businessUnit": "Facilities Support",
            "ownerBU": "Facilities Support",
            "supportGroup": "Facilities",
            "ownerGroup": "Facilities"
        }
        await apiHelper.apiLogin('fritz');
        let newCaseTemplate = await apiHelper.createCaseTemplate(casetemplateData);
        await apiHelper.createDynamicDataOnTemplate(newCaseTemplate.id, 'CASE_TEMPLATE_DYNAMIC_FIELDS');
        await navigationPage.gotoCaseConsole();
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
        let fileName1: string[] = ['articleStatus.png', 'bwfJpg4.jpg', 'bwfJson1.json', 'bwfPdf4.pdf', 'bwfWord1.rtf'];
        const filesToUpload1 = fileName1.map((file) => { return `../../data/ui/attachment/${file}` });
        await editCasePo.addAttachment('attachment1', filesToUpload1);
        await editCasePo.clickSaveCase();
        await viewCasePo.clickShowMoreShowLessLink('attachment1');
        //download the file
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
        for (let i: number = 0; i <= fileName1.length; i++) {
            expect(await utilityCommon.deleteAlreadyDownloadedFile(`${fileName1[i]}`)).toBeTruthy('FailuerMsg: File is delete sucessfully');
        }
        await apiHelper.apiLogin('tadmin');
        let recDeleted = await apiHelper.deleteDynamicFieldAndGroup();
        console.log("Record deleted...", recDeleted);
        let taskTemplateName = 'ManualtaskDRDMV-13948' + randomStr;
        let manualTaskSummary = 'ManualSummaryDRDMV-13948' + randomStr;
        let templateData = {
            "templateName": `${taskTemplateName}`,
            "templateSummary": `${manualTaskSummary}`,
            "templateStatus": "Active",
            "taskCompany": 'Petramco',
            "ownerCompany": "Petramco",
            "ownerBusinessUnit": "Facilities Support",
            "ownerGroup": "Facilities"
        }
        let tasktemplate = await apiHelper.createManualTaskTemplate(templateData);
        await apiHelper.createDynamicDataOnTemplate(tasktemplate.id, 'TASK_TEMPLATE__DYNAMIC_FIELDS');
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
        //attachment3 add 1 file 
        let fileName2: string[] = ['bwfJpg.jpg', 'bwfPdf.pdf', 'bwfWord2.rtf'];
        const filesToUpload2 = fileName2.map((file) => { return `../../data/ui/attachment/${file}` });
        await editTaskPo.addAttachmentInDynamicField('attachment1', filesToUpload2);
        await editTaskPo.clickOnSaveButton();
        await viewTaskPo.clickShowMoreShowLessLink('attachment1');
        await viewCasePo.clickOnDownloadFile('bwfJpg.jpg');
        expect(await utilityCommon.isFileDownloaded('bwfJpg.jpg')).toBeTruthy('failureMsg: bwfJpg.jpg File is not downloaded.');
        await viewCasePo.clickOnDownloadFile('bwfPdf.pdf');
        expect(await utilityCommon.isFileDownloaded('bwfPdf.pdf')).toBeTruthy('failureMsg: bwfPdf.pdf File is not downloaded.');
        await viewCasePo.clickOnDownloadFile('bwfWord2.rtf');
        expect(await utilityCommon.isFileDownloaded('bwfWord2.rtf')).toBeTruthy('failureMsg: bwfWord2.rtf File is not downloaded.');
        for (let i: number = 0; i <= fileName2.length; i++) {
            expect(await utilityCommon.deleteAlreadyDownloadedFile(`${fileName2[i]}`)).toBeTruthy('FailuerMsg: File is delete sucessfully');
        }
    }, 320 * 1000);

    it('[DRDMV-13161]: [-ve] [Dynamic Data] - Task UI with dynamic data having long description/labels with large data in different fields', async () => {
        let dynamicfield1 = 'theNewDynamicFieldsIsgettingMouseOveredMouseOvered';
        let dynamicfield2 = 'theSecondDynamicFieldsIsgettingMouseOveredMouseOvered';
        let dynamicfield3 = 'theThirdDynamicFieldsIsgettingMouseOveredMouseOvered';
        let dynamicfield4 = 'temp1theNewDynamicFieldsIsgettingMouseOveredMouseOvered';
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteDynamicFieldAndGroup();
        let taskTemplateName = 'ManualtaskDRDMV-13161' + randomStr;
        let manualTaskSummary = 'ManualSummaryDRDMV-13161' + randomStr;
        let templateData = {
            "templateName": `${taskTemplateName}`,
            "templateSummary": `${manualTaskSummary}`,
            "templateStatus": "Active",
            "taskCompany": 'Petramco',
            "ownerCompany": "Petramco",
            "ownerBusinessUnit": "Facilities Support",
            "ownerGroup": "Facilities"
        }
        let tasktemplate = await apiHelper.createManualTaskTemplate(templateData);
        await apiHelper.createDynamicDataOnTemplate(tasktemplate.id, 'TASK_TEMPLATE_LONG__DYNAMIC_FIELDS');
        let externalTask = 'externalTaskDRDMV-13161' + randomStr;
        let externalTaskSummary = 'externalSummaryDRDMV-13161' + randomStr;
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteDynamicFieldAndGroup();
        let externalTemplateData = {
            "templateName": `${externalTask}`,
            "templateSummary": `${externalTaskSummary}`,
            "templateStatus": "Active",
            "taskCompany": "Petramco",
            "ownerCompany": "Petramco",
            "ownerBusinessUnit": "Facilities Support",
            "ownerGroup": "Facilities"
        }
        await apiHelper.apiLogin('qkatawazi');
        let externalTaskTemplate = await apiHelper.createExternalTaskTemplate(externalTemplateData);
        await apiHelper.createDynamicDataOnTemplate(externalTaskTemplate.id, 'EXTERNAL_TASK_TEMPLATE_LONG__DYNAMIC');
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteDynamicFieldAndGroup();
        let automatedTask = 'automatedTaskDRDMV-13161' + randomStr;
        let automatedTaskSummary = 'automatedSummaryDRDMV-13161' + randomStr;
        let processName = 'automated process' + randomStr;
        let automationTemplateData = {
            "templateName": `${automatedTask}`,
            "templateSummary": `${automatedTaskSummary}`,
            "templateStatus": "Active",
            "processBundle": "com.bmc.dsm.case-lib",
            "processName": `${processName}`,
            "taskCompany": "Petramco",
            "ownerCompany": "Petramco",
            "ownerBusinessUnit": "Facilities Support",
            "ownerGroup": "Facilities"
        }
        await apiHelper.apiLogin('qkatawazi');
        let autoTaskTemplate = await apiHelper.createAutomatedTaskTemplate(automationTemplateData);
        await apiHelper.createDynamicDataOnTemplate(autoTaskTemplate.id, 'AUTOMATED_TASK_TEMPLATE_LONG__DYNAMIC');
        await navigationPage.gotoCaseConsole();
        await navigationPage.gotoCreateCase();
        await createCasePo.selectRequester('qkatawazi');
        await createCasePo.clickAssignToMeButton();
        await createCasePo.setSummary('new cases');
        await createCasePo.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        let caseId = await viewCasePo.getCaseID();
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
        await viewTaskPo.clickOnEditTask();
        await editTaskPo.setDynamicFieldValue(dynamicfield1, dynamicfield2);
        await editTaskPo.setDynamicFieldValue(dynamicfield2, dynamicfield1);
        await editTaskPo.clickOnAssignToMe();
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
        await updateStatusBladePo.changeCaseStatus('In Progress');
        await updateStatusBladePo.clickSaveStatus('In Progress');
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
        await editTaskPo.clickOnAssignToMe();
        await editTaskPo.clickOnSaveButton();
        //verify input field values are peresent are not 
        expect(await viewTaskPo.getDynamicFieldValue('temp1theNewExternalDynamicFieldsIsgettingMouseOveredMouseOvered')).toContain('200');
        expect(await viewTaskPo.getDynamicFieldValue('theSecondExternalDynamicFieldsIsgettingMouseOveredMouseOvered')).toContain('temp1theNewExternalDynamicFieldsIsgettingMouseOveredMouseOvered');
        await navigationPage.gotoCaseConsole();
        await utilityGrid.clearFilter();
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
    }, 400 * 1000);

    // ptidke
    it('[DRDMV-13128]: [Dynamic Data] - Create Case with Case Template having dynamic fields and Update dynamic fields data in Case', async () => {
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteDynamicFieldAndGroup();
        let caseTemplateName = randomStr + 'caseTemplateDRDMV-13128';
        let caseTemaplateSummary = randomStr + 'caseTemplateDRDMV-13128';
        let casetemplateData = {
            "templateName": `${caseTemplateName}`,
            "templateSummary": `${caseTemaplateSummary}`,
            "templateStatus": "Active",
            "assignee": "Fritz",
            "company": "Petramco",
            "businessUnit": "Facilities Support",
            "ownerBU": "Facilities Support",
            "supportGroup": "Facilities",
            "ownerGroup": "Facilities"
        }
        await apiHelper.apiLogin('fritz');
        let newCaseTemplate = await apiHelper.createCaseTemplate(casetemplateData);
        await apiHelper.createDynamicDataOnTemplate(newCaseTemplate.id, 'CASE_TEMPLATE_DYNAMIC_FIELDS');
        await navigationPage.gotoQuickCase();
        await quickCasePo.selectRequesterName('qkatawazi');
        await quickCasePo.selectCaseTemplate(caseTemplateName);
        await quickCasePo.createCaseButton();
        await quickCasePo.gotoCaseButton();
        await utilCommon.waitUntilSpinnerToHide();
        await viewCasePo.clickEditCaseButton();
        await editCasePo.setDynamicFieldValue('temp', 'newtemp');
        await editCasePo.setDynamicFieldValue('temp1', '333');
        await editCasePo.setDateValueInDynamicField('2020-03-01');
        await editCasePo.clickOnTrueValueOfDynamicField();
        await editCasePo.addAttachment('attachment2', ['../../data/ui/attachment/demo.txt']);
        await editCasePo.setDateTimeDynamicFieldValue('04-01-2022 05:11 PM');
        await editCasePo.setTimeInDynamicField('02');
        await editCasePo.selectValueFromList('dynamicList', 'listvalues');
        await editCasePo.clickSaveCase();
        await utilCommon.closePopUpMessage();
        //verify update values on case view
        expect(await viewCasePo.getValueOfDynamicFields('temp')).toBe('newtemp');
        expect(await viewCasePo.getValueOfDynamicFields('temp1')).toBe('333');
        expect(await viewCasePo.getValueOfDynamicFields('temp2')).toContain('Mar 1, 2020');
        expect(await viewCasePo.getValueOfDynamicFields('temp4')).toContain('Mar 4, 2020 12:00 AM');
        expect(await viewCasePo.getValueOfDynamicFields('temp3')).toContain('True');
        expect(await viewCasePo.getValueOfDynamicFields('temp5')).toContain('2:00 AM');
        expect(await viewCasePo.getValueOfDynamicFields('dynamicList')).toContain('listvalues');
        expect(await viewCasePo.getValueOfDynamicFields('attachment2')).toContain('demo.txt');
    });//, 230 * 1000);

    // ptidke
    it('[DRDMV-13127]: [Dynamic Data] - Create Case from Create Case with Template having dynamic fields and also have field with source as Requester', async () => {
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteDynamicFieldAndGroup();
        let caseTemplateName = randomStr + 'caseTemplateDRDMV-13127';
        let caseTemaplateSummary = randomStr + 'caseTemplateDRDMV-13127';
        let casetemplateData = {
            "templateName": `${caseTemplateName}`,
            "templateSummary": `${caseTemaplateSummary}`,
            "templateStatus": "Active",
            "assignee": "Fritz",
            "company": "Petramco",
            "businessUnit": "Facilities Support",
            "ownerBU": "Facilities Support",
            "supportGroup": "Facilities",
            "ownerGroup": "Facilities"
        }
        await apiHelper.apiLogin('fritz');
        let newCaseTemplate = await apiHelper.createCaseTemplate(casetemplateData);
        await apiHelper.createDynamicDataOnTemplate(newCaseTemplate.id, 'CASE_TEMPLATE_REQUESTER_DYNAMIC_FIELDS');
        await navigationPage.gotoCaseConsole();
        await navigationPage.gotoCreateCase();
        await createCasePo.selectRequester('qkatawazi');
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
    }, 250 * 1000);

    //ptidke
    it('[DRDMV-13158]: [-ve] [UI] [Dynamic Data] - Update Task dynamic fields with invalid data', async () => {
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteDynamicFieldAndGroup();
        let taskTemplateName = 'ManualtaskDRDMV-13158' + randomStr;
        let manualTaskSummary = 'ManualSummaryDRDMV-13158' + randomStr;
        let templateData = {
            "templateName": `${taskTemplateName}`,
            "templateSummary": `${manualTaskSummary}`,
            "templateStatus": "Active",
            "taskCompany": 'Petramco',
            "ownerCompany": "Petramco",
            "ownerBusinessUnit": "Facilities Support",
            "ownerGroup": "Facilities"
        }
        let tasktemplate = await apiHelper.createManualTaskTemplate(templateData);
        await apiHelper.createDynamicDataOnTemplate(tasktemplate.id, 'TASK_TEMPLATE__DYNAMIC_FIELDS');
        let externalTask = 'externalTaskDRDMV-13158' + randomStr;
        let externalTaskSummary = 'externalSummaryDRDMV-13158' + randomStr;
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteDynamicFieldAndGroup();
        let externalTemplateData = {
            "templateName": `${externalTask}`,
            "templateSummary": `${externalTaskSummary}`,
            "templateStatus": "Active",
            "taskCompany": "Petramco",
            "ownerCompany": "Petramco",
            "ownerBusinessUnit": "Facilities Support",
            "ownerGroup": "Facilities"
        }
        await apiHelper.apiLogin('qkatawazi');
        let externalTaskTemplate = await apiHelper.createExternalTaskTemplate(externalTemplateData);
        await apiHelper.createDynamicDataOnTemplate(externalTaskTemplate.id, 'EXTERNAL_TASK_TEMPLATE__DYNAMIC_FIELDS');
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteDynamicFieldAndGroup();
        let automatedTask = 'automatedTaskDRDMV-13158' + randomStr;
        let automatedTaskSummary = 'automatedSummaryDRDMV-13158' + randomStr;
        let automationTemplateData = {
            "templateName": `${automatedTask}`,
            "templateSummary": `${automatedTaskSummary}`,
            "templateStatus": "Active",
            "processBundle": "ccom.bmc.dsm.case-lib",
            "processName": "Case Managment 1",
            "taskCompany": "Petramco",
            "ownerCompany": "Petramco",
            "ownerBusinessUnit": "Facilities Support",
            "ownerGroup": "Facilities"
        }
        await apiHelper.apiLogin('qkatawazi');
        let autoTaskTemplate = await apiHelper.createAutomatedTaskTemplate(automationTemplateData);
        await apiHelper.createDynamicDataOnTemplate(autoTaskTemplate.id, 'AUTOMATED_TASK_TEMPLATE__DYNAMIC_FIELDS');
        await navigationPage.gotoCreateCase();
        await createCasePo.selectRequester('qkatawazi');
        await createCasePo.setSummary('new cases');
        await createCasePo.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        await viewCasePo.clickAddTaskButton();
        await manageTaskBladePo.addTaskFromTaskTemplate(taskTemplateName);
        await manageTaskBladePo.addTaskFromTaskTemplate(automatedTask);
        await manageTaskBladePo.addTaskFromTaskTemplate(externalTask);
        await utilCommon.closePopUpMessage();
        await manageTaskBladePo.clickTaskLink(manualTaskSummary);
        //verify dynamic field
        await viewTaskPo.clickOnEditTask();
        await editTaskPo.setDynamicFieldValue('temp', 'sssssss');
        await editTaskPo.setDynamicFieldValue('temp1', 'sssssss');
        await editTaskPo.clickOnAssignToMe();
        await editTaskPo.setDateValueInDynamicField('wrong date');
        await editTaskPo.clickOnSaveButton();
        expect(await utilityCommon.isPopUpMessagePresent('Resolve the field validation errors and then try again.')).toBeTruthy("Wrong pop up message");
        await editTaskPo.setDateTimeDynamicFieldValue('wrongdatetime');
        await editTaskPo.clickOnSaveButton();
        expect(await utilityCommon.isPopUpMessagePresent('Resolve the field validation errors and then try again.')).toBeTruthy("Wrong pop up message");
        //  await utilCommon.closePopUpMessage();
        await editTaskPo.clickOnCancelButton();
        await utilCommon.clickOnWarningOk();
        await viewTaskPo.clickOnEditTask();
        await editTaskPo.setDateValueInDynamicField('2020-03-01');
        await editTaskPo.setDateTimeDynamicFieldValue('2020-03-04');
        await editTaskPo.clickOnAssignToMe();
        await editTaskPo.setDynamicFieldValue('temp1', 'sssssss');
        await editTaskPo.clickOnSaveButton();
        await utilCommon.closePopUpMessage();
        //verify update values on case view
        expect(await viewTaskPo.getDynamicFieldValue('temp2')).toBe('Mar 1, 2020');
        expect(await viewTaskPo.getDynamicFieldValue('temp4')).toBe('Mar 4, 2020 12:00 AM');
        expect(await viewTaskPo.getDynamicFieldValue('temp1')).toBe('-');

        await viewTaskPo.clickOnViewCase();
        await viewCasePo.clickAddTaskButton();
        await manageTaskBladePo.clickTaskLink(externalTaskSummary);

        await viewTaskPo.clickOnEditTask();
        await editTaskPo.setDynamicFieldValue('externalText', 'sssssss');
        await editTaskPo.clickOnAssignToMe();
        await editTaskPo.setDateValueInDynamicField('wrong date');
        await editTaskPo.clickOnSaveButton();
        expect(await utilityCommon.isPopUpMessagePresent('Resolve the field validation errors and then try again.')).toBeTruthy("Wrong pop up message");
        await editTaskPo.setDateTimeDynamicFieldValue('wrongdatetime');
        await editTaskPo.clickOnSaveButton();
        expect(await utilityCommon.isPopUpMessagePresent('Resolve the field validation errors and then try again.')).toBeTruthy("Wrong pop up message");
        await editTaskPo.clickOnCancelButton();
        await utilCommon.clickOnWarningOk();
        await viewTaskPo.clickOnEditTask();
        await editTaskPo.setDateValueInDynamicField('2020-03-01');
        await editTaskPo.setDateTimeDynamicFieldValue('2020-03-04');
        await editTaskPo.clickOnAssignToMe();
        await editTaskPo.setDynamicFieldValue('externalNumber', 'sssssss');
        await editTaskPo.clickOnSaveButton();
        await utilCommon.closePopUpMessage();
        //verify update values on case view
        expect(await viewTaskPo.getDynamicFieldValue('externalDate')).toBe('Mar 1, 2020');
        expect(await viewTaskPo.getDynamicFieldValue('externalDateTime')).toBe('Mar 4, 2020 12:00 AM');
        expect(await viewTaskPo.getDynamicFieldValue('externalNumber')).toBe('');
        await viewTaskPo.clickOnViewCase();
        await viewCasePo.clickEditCaseButton();
        await editCasePo.clickOnAssignToMe();
        await editCasePo.clickSaveCase();
        await utilCommon.closePopUpMessage();
        await updateStatusBladePo.changeCaseStatus('In Progress');
        await updateStatusBladePo.clickSaveStatus('In Progress');
        await utilityCommon.closePopUpMessage();
        await viewCasePo.clickAddTaskButton();
        await manageTaskBladePo.clickTaskLink(automatedTaskSummary);
        await viewTaskPo.clickOnEditTask();
        await editTaskPo.setDynamicFieldValue('automatedText', 'sssssss');
        await editTaskPo.setDateValueInDynamicField('wrong date');
        await editTaskPo.clickOnSaveButton();
        expect(await utilityCommon.isPopUpMessagePresent('Resolve the field validation errors and then try again.')).toBeTruthy("Wrong pop up message");
        await editTaskPo.setDateTimeDynamicFieldValue('wrongdatetime');
        await editTaskPo.clickOnSaveButton();
        expect(await utilityCommon.isPopUpMessagePresent('Resolve the field validation errors and then try again.')).toBeTruthy("Wrong pop up message");
        await editTaskPo.clickOnCancelButton();
        await utilCommon.clickOnWarningOk();
        await viewTaskPo.clickOnEditTask();
        await editTaskPo.setDateValueInDynamicField('2020-03-01');
        await editTaskPo.setDateTimeDynamicFieldValue('2020-03-04');
        await editTaskPo.setDynamicFieldValue('automatedNumber', 'values');
        await editTaskPo.clickOnSaveButton();
        await utilityCommon.closePopUpMessage();
        //verify update values on case view
        expect(await viewTaskPo.getDynamicFieldValue('automatedDate')).toBe('Mar 1, 2020');
        expect(await viewTaskPo.getDynamicFieldValue('automatedDateTime')).toBe('Mar 4, 2020 12:00 AM');
        expect(await viewTaskPo.getDynamicFieldValue('automatedNumber')).toBe('');
    }, 270 * 1000);

    //ptidke
    it('[DRDMV-13116]:[-ve] [Dynamic Data] - Add 2 or more new fields in Case Template with same Name (ID)', async () => {
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateName = 'caseTemplateName13116' + randomStr;
        let casTemplateSummary = 'CaseSummarySummary13116' + randomStr;
        let templateData = {
            "templateName": `${caseTemplateName}`,
            "templateSummary": `${casTemplateSummary}`,
            "templateStatus": "Draft",
            "assignee": "Fritz",
            "company": "Petramco",
            "businessUnit": "Facilities Support",
            "ownerBU": "Facilities Support",
            "supportGroup": "Facilities",
            "ownerGroup": "Facilities"
        }
        await apiHelper.apiLogin('fritz');
        await apiHelper.createCaseTemplate(templateData);
        await navigationPage.gotoCaseConsole();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        await utilGrid.searchAndOpenHyperlink(caseTemplateName);
        await viewCasetemplatePo.clickOnMangeDynamicFieldLink();
        await dynamicFieldsPo.clickOnDynamicField();
        await dynamicFieldsPo.setFieldName('news' + randomStr);
        await dynamicFieldsPo.setDescriptionName('newDescri' + randomStr);
        await dynamicFieldsPo.clickSaveButton();
        //duplicate
        await viewCasetemplatePo.clickOnMangeDynamicFieldLink();
        await dynamicFieldsPo.clickOnDynamicField();
        await dynamicFieldsPo.setFieldName('news' + randomStr);
        await dynamicFieldsPo.setDescriptionName('newDescri' + randomStr);
        await dynamicFieldsPo.clickSaveButton();
        expect(await utilCommon.isPopUpMessagePresent('ERROR (970): Message not found, [bundleId = Ticketing-AppID, messageNum = 970] Duplicate Attributes Please remove duplicates and save again.')).toBeTruthy("Wrong pop up message");
        await utilCommon.closePopUpMessage();
        await dynamicFieldsPo.setFieldName('newName' + randomStr);
        await dynamicFieldsPo.setDescriptionName('NewDescription' + randomStr);
        await dynamicFieldsPo.clickSaveButton();
        expect(await viewCasetemplatePo.isDynamicFieldDisplayed('NewDescription' + randomStr)).toBeTruthy();
        expect(await viewCasetemplatePo.isDynamicFieldDisplayed('newDescri' + randomStr)).toBeTruthy();
        await viewCasetemplatePo.clickOnMangeDynamicFieldLink();
        await dynamicFieldsPo.clickOnDynamicField();
        await dynamicFieldsPo.setFieldName('newName' + randomStr);
        await dynamicFieldsPo.setDescriptionName('NewDescription' + randomStr);
        await dynamicFieldsPo.clickSaveButton();
        expect(await utilCommon.isPopUpMessagePresent('ERROR (970): Message not found, [bundleId = Ticketing-AppID, messageNum = 970] Duplicate Attributes Please remove duplicates and save again.')).toBeTruthy('Wrong pop up message');
        await utilCommon.closePopUpMessage();
        await dynamicFieldsPo.setFieldName('newNameUpdate' + randomStr);
        await dynamicFieldsPo.setDescriptionName('NewUpdatedDescription' + randomStr);
        await dynamicFieldsPo.clickSaveButton();
        expect(await viewCasetemplatePo.isDynamicFieldDisplayed('NewUpdatedDescription' + randomStr)).toBeTruthy();
    });//, 180 * 1000);

    //ptidke
    it('[DRDMV-13132,DRDMV-13124]:[-ve] [Dynamic Data] [UI] - Update Case dynamic fields with invalid data', async () => {
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteDynamicFieldAndGroup();
        let caseTemplateName = randomStr + 'caseTemplateDRDMV-13132';
        let caseTemaplateSummary = randomStr + 'caseTemplateDRDMV-13132';
        let casetemplateData = {
            "templateName": `${caseTemplateName}`,
            "templateSummary": `${caseTemaplateSummary}`,
            "templateStatus": "Active",
        }
        await apiHelper.apiLogin('fritz');
        let newCaseTemplate = await apiHelper.createCaseTemplate(casetemplateData);
        await apiHelper.createDynamicDataOnTemplate(newCaseTemplate.id, 'CASE_TEMPLATE_DYNAMIC_FIELDS');
        await navigationPage.gotoQuickCase();
        await quickCasePo.selectRequesterName('qkatawazi');
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
        await viewCasePo.clickEditCaseButton();
        await editCasePo.setDynamicFieldValue('temp', 'newtemp');
        await editCasePo.setDynamicFieldValue('temp1', 'newtempres');
        await editCasePo.clickSaveCase();
        expect(await utilityCommon.isPopUpMessagePresent('Resolve the field validation errors and then try again.')).toBeTruthy("Wrong pop up message");
        await editCasePo.setDateValueInDynamicField('wrong date');
        await editCasePo.clickSaveCase();
        expect(await utilityCommon.isPopUpMessagePresent('Resolve the field validation errors and then try again.')).toBeTruthy("Wrong pop up message");
        await editCasePo.setDateTimeDynamicFieldValue('wrongdatetime');
        await editCasePo.clickSaveCase();
        expect(await utilityCommon.isPopUpMessagePresent('Resolve the field validation errors and then try again.')).toBeTruthy("Wrong pop up message");
        await editCasePo.clickOnCancelCaseButton();
        await utilCommon.clickOnWarningOk();
        expect(await viewCasePo.getValueOfDynamicFields('temp1')).toBe('-', 'field should be empty');
        expect(await viewCasePo.getValueOfDynamicFields('temp2')).toBe('-', 'field should be empty');
        expect(await viewCasePo.getValueOfDynamicFields('temp4')).toBe('-', 'field should be empty');
    }, 940 * 1000);

    //ptidke
    it('[DRDMV-13125]:[Dynamic Data] - Create Case from Create Case with Template having dynamic fields but does not have field with source as Requester', async () => {
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteDynamicFieldAndGroup();
        let caseTemplateName = randomStr + 'caseTemplateDRDMV-13125';
        let caseTemaplateSummary = randomStr + 'caseTemplateDRDMV-13125';
        let casetemplateData = {
            "templateName": `${caseTemplateName}`,
            "templateSummary": `${caseTemaplateSummary}`,
            "templateStatus": "Active",
            "assignee": "Fritz",
            "company": "Petramco",
            "businessUnit": "Facilities Support",
            "ownerBU": "Facilities Support",
            "supportGroup": "Facilities",
            "ownerGroup": "Facilities"
        }
        await apiHelper.apiLogin('fritz');
        let newCaseTemplate = await apiHelper.createCaseTemplate(casetemplateData);
        await apiHelper.createDynamicDataOnTemplate(newCaseTemplate.id, 'CASE_TEMPLATE_DYNAMIC_FIELDS');
        await navigationPage.gotoCaseConsole();
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
    });//, 150 * 1000);
});
