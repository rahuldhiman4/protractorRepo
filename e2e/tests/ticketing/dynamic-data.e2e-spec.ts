
import { browser } from "protractor";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import utilCommon from '../../utils/util.common';
import apiHelper from '../../api/api.helper';
import consoleNotificationTemplatePo from '../../pageobject/notification/console-notificationTemplate.po';
import createNotificationTemplatePo from '../../pageobject/notification/create-notificationTemplate.po';
import addFieldsPopPo from '../../pageobject/common/add-fields-pop.po';
import consoleDocumentTemplatePo from '../../pageobject/settings/document-management/console-document-template.po';
import createDocumentTemplatePo from '../../pageobject/settings/document-management/create-document-template.po';
import consoleEmailTemplatePo from '../../pageobject/settings/email/console-email-template.po';
import createEmailTemplatePo from '../../pageobject/settings/email/create-email-template.po';
import consoleNotestemplatePo from '../../pageobject/settings/common/console-notestemplate.po';
import createNotestemplatePo from '../../pageobject/settings/common/create-notestemplate.po';

describe('Dynamic data', () => {
    const randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
    const manageNotificationTempNavigation = 'Notification Configuration--Manage Templates';
    const notifTempGridPageTitle = 'Manage Notification Template - Business Workflows';
    beforeAll(async () => {
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa');
        await loginPage.login('fritz');
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    afterEach(async () => {
        await browser.refresh();
        await utilCommon.waitUntilSpinnerToHide();
    });


    it('DRDMV-19353: Accessibility of Dynamic Fields in Notification and Dynamic Templates', async () => {
        let caseTemplateName = 'caseTemplate' + randomStr;
        let caseTemaplateSummary = 'caseTemplate' + randomStr;
        var casetemplateData = {
            "templateName": `${caseTemplateName}`,
            "templateSummary": `${caseTemaplateSummary}`,
            "templateStatus": "Active",
        }
        await apiHelper.apiLogin('fritz');
        var newCaseTemplate = await apiHelper.createCaseTemplate(casetemplateData);
        await apiHelper.createDyanmicDataOnTemplate(newCaseTemplate.id, 'SaveExistingAndNewCaseDynamicDataDefinition');

        let globalcaseTemplateName = 'globalcasetempalte' + randomStr;
        let gloablcaseTemaplateSummary = 'gloabalcasetemplate' + randomStr;
        var globaltemplateData = {
            "templateName": `${globalcaseTemplateName}`,
            "templateSummary": `${gloablcaseTemaplateSummary}`,
            "templateStatus": "Active",
            "company": "- Global -",
        }
        var globaltemplate = await apiHelper.createCaseTemplate(globaltemplateData);
        await apiHelper.createDyanmicDataOnTemplate(globaltemplate.id, 'GlobalDynamicDataCaseTemplate');

        let taskTemplateName = 'Manual  task' + randomStr;
        let manualTaskSummary = 'ManualSummary' + randomStr;
        var templateData = {
            "templateName": `${taskTemplateName}`,
            "templateSummary": `${manualTaskSummary}`,
            "templateStatus": "Active",
        }
        let tasktemplate = await apiHelper.createManualTaskTemplate(templateData);
        await apiHelper.createDyanmicDataOnTemplate(tasktemplate.id, 'DynamicdataForTaskTemplate');

        let globalTaskTemplateName = 'Global  task' + randomStr;
        let globalmanualTaskSummary = 'GlobalTaskSummary' + randomStr;
        var gloabalTaskData = {
            "templateName": `${globalTaskTemplateName}`,
            "templateSummary": `${globalmanualTaskSummary}`,
            "templateStatus": "Active",
            "company": "- Global -"
        }

        let globalTasktemplate = await apiHelper.createManualTaskTemplate(gloabalTaskData);
        await apiHelper.createDyanmicDataOnTemplate(globalTasktemplate.id, 'GlobalTaskTemplate');
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem(manageNotificationTempNavigation, notifTempGridPageTitle);
        await consoleNotificationTemplatePo.clickOnCreateNotificationTemplate();
        await createNotificationTemplatePo.selectEvent('Case Assignments');
        await createNotificationTemplatePo.selectModuleName('Cases');
        await createNotificationTemplatePo.clickOnInsertFieldOfAlert();
        await addFieldsPopPo.navigateToDynamicFieldInCaseTemplate(globalcaseTemplateName);
        expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('GlobalField1')).toBeTruthy();
        expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('GlobalField2')).toBeTruthy();
        expect(await addFieldsPopPo.isCaseTemplatePresent(caseTemplateName)).toBeFalsy()
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
        expect(await addFieldsPopPo.isCaseTemplatePresent(taskTemplateName)).toBeFalsy()
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
        await browser.refresh();
    }, 200 * 1000)

    it('DRDMV-19270: Associated and Dynamic fields usage on Notification/Email/Activity Templates', async () => {
        let caseTemplateName = 'caseTempRDMV-192700lp3ir' + randomStr;
        let caseTemaplateSummary = 'caseTempRDMV-19270Template' + randomStr;
        var casetemplateData = {
            "templateName": `${caseTemplateName}`,
            "templateSummary": `${caseTemaplateSummary}`,
            "templateStatus": "Active",
        }
        await apiHelper.apiLogin('fritz');
        var newCaseTemplate = await apiHelper.createCaseTemplate(casetemplateData);
        await apiHelper.createDyanmicDataOnTemplate(newCaseTemplate.id, 'CasetemplatewithConfidential');
        let taskTemplateName = 'ManualtaskDRDMV-19270' + randomStr;
        let manualTaskSummary = 'ManualSummaryDRDMV-19270' + randomStr;
        var templateData = {
            "templateName": `${taskTemplateName}`,
            "templateSummary": `${manualTaskSummary}`,
            "templateStatus": "Active",
        }
        let tasktemplate = await apiHelper.createManualTaskTemplate(templateData);
        await apiHelper.createDyanmicDataOnTemplate(tasktemplate.id, 'TasktemplatewithConfidential');
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem(manageNotificationTempNavigation, notifTempGridPageTitle);
        await consoleNotificationTemplatePo.clickOnCreateNotificationTemplate();
        await createNotificationTemplatePo.selectEvent('Approval');
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
        expect(await utilCommon.getPopUpMessage()).toContain('Saved successfully.');
        await consoleNotificationTemplatePo.clickOnCreateNotificationTemplate();
        await createNotificationTemplatePo.selectEvent('Approval');
        await createNotificationTemplatePo.selectModuleName('Cases');
        await createNotificationTemplatePo.setTemplateName("Notification" + randomStr);
        await createNotificationTemplatePo.setDescription("Notification Description " + randomStr);
        await createNotificationTemplatePo.setTemplateName("Notification" + randomStr);
        await createNotificationTemplatePo.setDescription("Notification Description " + randomStr);
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
        expect(await utilCommon.getPopUpMessage()).toContain('Saved successfully.');
        await navigationPage.gotoCaseConsole();
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
        expect(await utilCommon.getPopUpMessage()).toContain('Saved successfully.');
        await navigationPage.gotoCaseConsole();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Notes Template', 'Activity Notes Template Console - Task - Business Workflows');
        await consoleNotestemplatePo.clickOnCreateNotesTemplate();
        await createNotestemplatePo.setCompanyValue('Petramco');
        await createEmailTemplatePo.setTemplateName('NotesTemplate' + randomStr);
        await createEmailTemplatePo.clickOnInsertField();
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
        expect(await createEmailTemplatePo.isDynamicFieldDisplayedInBody('TaskOuterNonConfidential')).toBeTruthy();
        expect(await createEmailTemplatePo.isDynamicFieldDisplayedInBody('TaskLocalNonConfidential')).toBeTruthy();
        expect(await createEmailTemplatePo.isDynamicFieldDisplayedInBody('TasknonConfidentialPulic')).toBeTruthy();
        await createEmailTemplatePo.clickOnInsertField();
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
        expect(await addFieldsPopPo.isAssocitionDisplayed('Case to Resolution Code Association')).toBeTruthy();
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
        expect(await createEmailTemplatePo.isDynamicFieldDisplayedInBody('Confidential data')).toBeTruthy();
        expect(await createEmailTemplatePo.isDynamicFieldDisplayedInBody('Additional Site Details')).toBeTruthy();
        await createNotestemplatePo.clickOnSaveButton();
        expect(await utilCommon.getPopUpMessage()).toContain('Saved successfully.');
    }, 200 * 1000)
})