import { browser } from "protractor";
import apiHelper from "../../api/api.helper";
import { NOTES_TEMPLATE_MANDATORY_FIELD } from '../../data/ui/Social/notesTemplate.api';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import menuItemEditPage from "../../pageobject/settings/application-config/edit-menu-items-config.po";
import menuItemsConfigConsole from "../../pageobject/settings/application-config/menu-items-config-console.po";
import assignmentConfigConsole from "../../pageobject/settings/case-management/assignments-config-console.po";
import assignmentConfigEditPage from "../../pageobject/settings/case-management/edit-assignments-config.po";
import caseReadAccessConfigEditPage from "../../pageobject/settings/case-management/edit-read-access-config.po";
import caseReadAccessConfigConsole from "../../pageobject/settings/case-management/read-access-console.po";
import notesTemplateConsole from "../../pageobject/settings/common/console-notestemplate.po";
import editNotesTemplateConfig from "../../pageobject/settings/common/edit-notestemplate.po";
import statusConfig from "../../pageobject/settings/common/status-config.po";
import acknowledgementTemplateConsolePage from "../../pageobject/settings/email/console-acknowledgment-template.po";
import emailTemplateConsolePage from "../../pageobject/settings/email/console-email-template.po";
import editAcknowledementTemplatePage from "../../pageobject/settings/email/edit-acknowledgment-template.po";
import editEmailTemplatePage from "../../pageobject/settings/email/edit-email-template.po";
import flowsetConsole from "../../pageobject/settings/manage-flowset/console-flowset-config.po";
import flowsetEditPage from "../../pageobject/settings/manage-flowset/edit-flowset-config.po";
import processLibraryEditPage from "../../pageobject/settings/manage-flowset/edit-process-library-config.po";
import processLibraryConfigConsole from "../../pageobject/settings/manage-flowset/process-library-config-console.po";
import relationshipsConfigsPage from "../../pageobject/settings/relationship/relationships-configs.po";
import businessTimeSegmentConfigConsole from "../../pageobject/settings/slm/business-time-segment-console.po";
import businessTimeSharedEntityConfigConsole from "../../pageobject/settings/slm/business-time-shared-entity-console.po";
import configureDataSourceConfigConsole from "../../pageobject/settings/slm/configure-data-source-config-console.po";
import businessTimeSegmentConfigEditPage from "../../pageobject/settings/slm/edit-business-segment-config.po";
import businessTimeEntityConfigEditPage from "../../pageobject/settings/slm/edit-business-time-entity-config.po";
import configureDataSourceEditPage from "../../pageobject/settings/slm/edit-configure-data-source-config.po";
import goalTypeEditPage from "../../pageobject/settings/slm/edit-goal-type.po";
import goalTypeConfigConsole from "../../pageobject/settings/slm/goal-type-config-console.po";
import { BWF_BASE_URL } from '../../utils/constants';
import utilGrid from "../../utils/util.grid";
import utilityCommon from '../../utils/utility.common';
import serviceTargetConsolePage from '../../pageobject/settings/slm/service-target-viewconsole.po';
import editServiceTargetConfigPage from '../../pageobject/settings/slm/edit-service-target-config.po';
import serviceTargetGroupConsole from '../../pageobject/settings/slm/service-target-group-console.po';
import editServiceTargetGroupPage from '../../pageobject/settings/slm/edit-service-target-group-config.po';
import notificationTemplateConsolePage from '../../pageobject/settings/notification-config/console-notificationTemplate.po';
import editNotificationTemplatePage from '../../pageobject/settings/notification-config/edit-notification-template.po';
import approvalMappingConsolePO from '../../pageobject/settings/case-management/approval-mapping-console.po';
import editApprovalMappingPage from '../../pageobject/settings/case-management/edit-approval-mapping.po';
import utilCommon from '../../utils/util.common';
import editEmailConfiguration from '../../pageobject/settings/email/edit-email-config.po';
import emailConfigurationConsole from '../../pageobject/settings/email/console-email-configuration.po';
import caseTemplateConsolePage from '../../pageobject/settings/case-management/console-casetemplate.po';
import taskTemplateConsolePage from '../../pageobject/settings/task-management/console-tasktemplate.po';
import editCaseTemplatePage from '../../pageobject/settings/case-management/edit-casetemplate.po';
import editTaskTemplatePage from '../../pageobject/settings/task-management/edit-tasktemplate.po';
import viewTaskTemplatePage from '../../pageobject/settings/task-management/view-tasktemplate.po';
import documentTemplateConsolePo from '../../pageobject/settings/document-management/document-template-console.po';
import editDocumentTemplatePage from '../../pageobject/settings/document-management/edit-document-template.po';

describe('Case Manager Read-only Config', () => {
    let caseModule = 'Case';

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qdu');
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    afterEach(async () => {
        await utilityCommon.refresh();
    });

    // asahitya
    it('[DRDMV-18033]: Check Case manager is not able to perform Create Update Delete operation on Case Assignment Mapping', async () => {
        await navigationPage.gotoCaseConsole();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', 'Configure Case Assignments - Business Workflows');
        expect(await assignmentConfigConsole.isAddAssignmentsBtnDisplayed()).toBeFalsy();
        await utilGrid.searchAndSelectAllCheckBoxWOGrid("Benefits Assignment");
        expect(await assignmentConfigConsole.isDeleteAssignmentConfigBtnDisplayed()).toBeFalsy();
        await utilityCommon.refresh();
        await utilGrid.searchAndOpenHyperlink("Benefits Assignment");
        expect(await assignmentConfigEditPage.isEditAssignmentNameDisabled()).toBeTruthy();
        expect(await assignmentConfigEditPage.isDefaultToggleBtnDisabled()).toBeTruthy();
        expect(await assignmentConfigEditPage.isSaveBtnDisabled()).toBeTruthy();
        await utilityCommon.refresh();
    });

    // asahitya
    it('[DRDMV-18037]: Check Case manager is not able to perform Create Update Delete operation on Read Access mapping', async () => {
        await navigationPage.gotoCreateCase();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Read Access', 'Case Read Access Configuration - Business Workflows');
        expect(await caseReadAccessConfigConsole.isAddButtonDisplayed()).toBeFalsy();
        await utilGrid.searchAndSelectAllCheckBoxWOGrid("Relocation - Facilities Access Mapping");
        expect(await caseReadAccessConfigConsole.isDeleteButtonDisplayed()).toBeFalsy();
        await utilityCommon.refresh();
        await utilGrid.searchAndOpenHyperlink("Relocation - Facilities Access Mapping");
        expect(await caseReadAccessConfigEditPage.isAccessMappingNameDisabled()).toBeTruthy();
        expect(await caseReadAccessConfigEditPage.isDefaultToggleBtnDisabled()).toBeTruthy();
        expect(await caseReadAccessConfigEditPage.isSaveBtnDisabled()).toBeTruthy();
        await utilityCommon.refresh();
    });

    // asahitya
    it('[DRDMV-18072]: Check Case manager is not able to perform Create Update operation on Process Library configuration', async () => {
        await navigationPage.gotoCreateCase();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Process Library', 'Process Library - Console - Business Workflows');
        expect(await processLibraryConfigConsole.isRegisterProcessBtnDisplayed()).toBeFalsy();
        await utilGrid.searchAndOpenHyperlink("Facilities - Lifecycle Investigation");
        expect(await processLibraryEditPage.isDescriptionDisabled()).toBeTruthy("Description field is enabled");
        expect(await processLibraryEditPage.isStatusDisabled()).toBeTruthy("Status field is enabled");
        expect(await processLibraryEditPage.isSaveButtonDisabled()).toBeTruthy("Save button is enabled");
        await utilityCommon.refresh();
    });

    // asahitya
    it('[DRDMV-18069]: Check Case manager is not able to perform Create Update operation on Menu Items', async () => {
        await navigationPage.gotoCreateCase();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Application Configuration--Menu Items', 'Menu Items - Business Workflows');
        expect(await menuItemsConfigConsole.isAddButtonDisplayed()).toBeFalsy();
        await utilGrid.searchAndOpenHyperlink("Email");
        expect(await menuItemEditPage.isMenuItemsStatusDisabled()).toBeTruthy("Status field is enabled");
        expect(await menuItemEditPage.isDefaultToggleBtnDisabled()).toBeTruthy("Default Toggle is enabled");
        expect(await menuItemEditPage.isSaveButtonDisabled()).toBeTruthy("Save button is enabled");
        await utilityCommon.refresh();
    });

    // asahitya
    it('[DRDMV-18038]: Check Case manager is not able to perform Create Update Delete operation on Case-> Status Configuration', async () => {
        await navigationPage.gotoCreateCase();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Status Configuration', 'Configure Case Status Transition - Business Workflows');
        await statusConfig.setCompanyDropdown("Petramco", 'case');
        expect(await statusConfig.isEditLifeCycleBtnDisabled()).toBeTruthy("Edit Life Cycle button is enabled");
    });

    // asahitya
    it('[DRDMV-18057]: Check Case manager is not able to perform Create Update Delete operation on Task->Status Configuration', async () => {
        await navigationPage.gotoCaseConsole();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Status Configuration', 'Configure Task Status Tranistions - Business Workflows');
        await statusConfig.setCompanyDropdown("Petramco", 'task');
        expect(await statusConfig.isEditLifeCycleBtnDisabled()).toBeTruthy("Edit Life Cycle button is enabled");
    });

    // asahitya
    it('[DRDMV-18169]: Check Case manager is not able to perform Create Update operation on Goal Type', async () => {
        await navigationPage.gotoCreateCase();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Service Level Management--Goal Type', 'Goal Type - Business Workflows');
        expect(await goalTypeConfigConsole.isAddGoalTypeBtnDisplayed()).toBeFalsy("Add button is enabled");
        await utilGrid.searchAndOpenHyperlink("Case Resolution Time");
        expect(await goalTypeEditPage.isStatusFieldDisabled()).toBeTruthy("Status field is enabled");
        expect(await goalTypeEditPage.isSaveButtonDisabled()).toBeTruthy("Save button is enabled");
        await utilityCommon.refresh();
    });

    // asahitya
    it('[DRDMV-18095]: Check Case manager is not able to perform Create Update operation on Configure Data Source', async () => {
        await navigationPage.gotoCreateCase();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Service Level Management--Configure Data Source', 'Configure Data Source - Administration - Business Workflows');
        console.log("bbb");
        expect(await configureDataSourceConfigConsole.isConfigDataSourceBtnDisabled()).toBeTruthy("Add button is enabled");
        console.log("aaa");
        await utilGrid.searchAndOpenHyperlink("Case Management");
        await configureDataSourceEditPage.clickShowAdvancedSettings();
        expect(await configureDataSourceEditPage.isAssociationNameDisabled()).toBeTruthy("Association Name is enabled");
        expect(await configureDataSourceEditPage.isBuildExpressionBtnDisabled()).toBeTruthy("Build Expression button is enabled");
        expect(await configureDataSourceEditPage.isSaveBtnDisabled()).toBeTruthy("Save button is enabled");
        await utilityCommon.refresh();
    });

    // asahitya
    it('[DRDMV-18093]: Check Case manager is not able to perform Create Update operation on Business Time Shared Entity', async () => {
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.createBusinessTimeSharedEntity('India Business Hours');
        await navigationPage.gotoCreateCase();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Service Level Management--Business Time Shared Entity', 'Business Time Shared Entity Console - Business Workflows');
        expect(await businessTimeSharedEntityConfigConsole.isAddBtnDisplayed()).toBeFalsy("Add button is enabled");
        await utilGrid.searchAndOpenHyperlink("India Business Hours");
        await businessTimeEntityConfigEditPage.updateStatus("Pending");
        expect(await businessTimeEntityConfigEditPage.isSaveBtnDisabled()).toBeTruthy("Save button is enabled");
        expect(await businessTimeEntityConfigEditPage.isAddBusinessSegmentBtnDisabled()).toBeTruthy("Add business time segment button is enabled");
        await businessTimeEntityConfigEditPage.selectAllShortDescription();
        expect(await businessTimeEntityConfigEditPage.isRemoveBtnDisabled()).toBeTruthy("Remove button is enabled");
        await utilityCommon.refresh();
    });

    // asahitya
    it('[DRDMV-18083]: Check Case manager is not able to perform Create Update operation on Business Time Segment', async () => {
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.createBusinessTimeSegment('India Available M-F 9AM-5PM');
        await navigationPage.gotoCreateCase();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Service Level Management--Business Time Segment', 'Business Time Segment Console - Business Workflows');
        expect(await businessTimeSegmentConfigConsole.isAddBusinessSegmentBtnDisplayed()).toBeFalsy("Add Business Time Segment button is enabled");
        await utilGrid.searchAndOpenHyperlink("India Available M-F 9AM-5PM");
        await businessTimeSegmentConfigEditPage.updateStatus("Draft");
        await businessTimeSegmentConfigEditPage.clickNextButton();
        expect(await businessTimeSegmentConfigEditPage.isFinishButtonDisabled()).toBeTruthy("Finish button is enabled");
        await utilityCommon.refresh();
    });

    // asahitya
    it('[DRDMV-18034]: Check Case manager is not able to perform Create Update Delete operation on Note template', async () => {
        //API call to create the case notes template
        await apiHelper.apiLogin('qkatawazi');
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        NOTES_TEMPLATE_MANDATORY_FIELD.templateName = NOTES_TEMPLATE_MANDATORY_FIELD.templateName + randomStr;
        await apiHelper.createNotesTemplate("Case", NOTES_TEMPLATE_MANDATORY_FIELD);

        await navigationPage.gotoCreateCase();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Notes Template', 'Activity Notes Template Console - Case - Business Workflows');
        expect(await notesTemplateConsole.isAddNotesTemplateBtnDisplayed()).toBeFalsy("Add notes template button is enabled");
        await utilGrid.clickCheckBoxOfValueInGrid(NOTES_TEMPLATE_MANDATORY_FIELD.templateName);
        expect(await notesTemplateConsole.isDeleteNotesTemplateBtnDisplayed()).toBeFalsy("Delete notes template button is enabled");
        await utilityCommon.refresh();
        await utilGrid.searchAndOpenHyperlink(NOTES_TEMPLATE_MANDATORY_FIELD.templateName);
        expect(await editNotesTemplateConfig.isStatusFieldDisabled()).toBeTruthy("Status field is enabled");
        expect(await editNotesTemplateConfig.isDescriptionFieldDisabled()).toBeTruthy("Description field is enabled");
        await utilityCommon.refresh();
    });

    // asahitya
    it('[DRDMV-18056]: Check Case manager is not able to perform Create Update Delete operation on Task->Note Template', async () => {
        //API call to create the case notes template
        await apiHelper.apiLogin('qkatawazi');
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        NOTES_TEMPLATE_MANDATORY_FIELD.templateName = NOTES_TEMPLATE_MANDATORY_FIELD.templateName + randomStr;
        await apiHelper.createNotesTemplate("Task", NOTES_TEMPLATE_MANDATORY_FIELD);

        await navigationPage.gotoCreateCase();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Notes Template', 'Activity Notes Template Console - Task - Business Workflows');
        expect(await notesTemplateConsole.isAddNotesTemplateBtnDisplayed()).toBeFalsy("Add notes template button is enabled");
        await utilGrid.clickCheckBoxOfValueInGrid(NOTES_TEMPLATE_MANDATORY_FIELD.templateName);
        expect(await notesTemplateConsole.isDeleteNotesTemplateBtnDisplayed()).toBeFalsy("Delete notes template button is enabled");
        await utilityCommon.refresh();
        await utilGrid.searchAndOpenHyperlink(NOTES_TEMPLATE_MANDATORY_FIELD.templateName);
        expect(await editNotesTemplateConfig.isStatusFieldDisabled()).toBeTruthy("Status field is enabled");
        expect(await editNotesTemplateConfig.isDescriptionFieldDisabled()).toBeTruthy("Description field is enabled");
        await utilityCommon.refresh();
    });

    // asahitya
    it('[DRDMV-18042]: Check Case manager is not able to perform Create Update Delete operation on People->Note Template', async () => {
        //API call to create the case notes template
        await apiHelper.apiLogin('qkatawazi');
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        NOTES_TEMPLATE_MANDATORY_FIELD.templateName = NOTES_TEMPLATE_MANDATORY_FIELD.templateName + randomStr;
        await apiHelper.createNotesTemplate("People", NOTES_TEMPLATE_MANDATORY_FIELD);

        await navigationPage.gotoCreateCase();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('People--Notes Template', 'Activity Notes Template Console - Person - Business Workflows');
        expect(await notesTemplateConsole.isAddNotesTemplateBtnDisplayed()).toBeFalsy("Add notes template button is enabled");
        await utilGrid.clickCheckBoxOfValueInGrid(NOTES_TEMPLATE_MANDATORY_FIELD.templateName);
        expect(await notesTemplateConsole.isDeleteNotesTemplateBtnDisplayed()).toBeFalsy("Delete notes template button is enabled");
        await utilityCommon.refresh();
        await utilGrid.searchAndOpenHyperlink(NOTES_TEMPLATE_MANDATORY_FIELD.templateName);
        expect(await editNotesTemplateConfig.isStatusFieldDisabled()).toBeTruthy("Status field is enabled");
        expect(await editNotesTemplateConfig.isDescriptionFieldDisabled()).toBeTruthy("Description field is enabled");
        await utilityCommon.refresh();
    });

    // asahitya
    it('[DRDMV-18071]: Check Case manager is not able to perform Create Update operation on Define Flowset configuration', async () => {
        //API call to create the flowset
        await apiHelper.apiLogin('qkatawazi');
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let flowsetData = require('../../data/ui/case/flowset.ui.json');
        let flowsetName: string = await flowsetData['flowsetMandatoryFields'].flowsetName + randomStr;
        flowsetData['flowsetMandatoryFields'].flowsetName = flowsetName;
        await apiHelper.createNewFlowset(flowsetData['flowsetMandatoryFields']);

        await navigationPage.gotoCreateCase();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Define Flowsets', 'Flowsets - Console - Business Workflows');
        expect(await flowsetConsole.isAddFlowsetButtonDisplayed()).toBeFalsy("Add button is enabled");
        await utilGrid.searchAndOpenHyperlink(flowsetName);
        expect(await flowsetEditPage.isAddAssociationBtnDisabled()).toBeTruthy("Add Associate Category button is enabled");
        expect(await flowsetEditPage.isFlowsetNameDisabled()).toBeTruthy("Flowset name  is enabled");
        expect(await flowsetEditPage.isStatusFieldDisabled()).toBeTruthy("Add Associate Category button is enabled");
        expect(await flowsetEditPage.isSaveBtnDisabled()).toBeTruthy("Add Associate Category button is enabled");
        await flowsetEditPage.navigateToProcessTab();
        expect(await flowsetEditPage.isAddNewMappingBtnDisabled()).toBeTruthy("Add Associate Mapping button is enabled");
        await flowsetEditPage.navigateToCaseAccessTab();
        expect(await flowsetEditPage.isSelectCompanyFldDisabled()).toBeTruthy("Select company field is enabled");
        expect(await flowsetEditPage.isSelectAgentFldDisabled()).toBeTruthy("Select Agent field is enabled");
        await flowsetEditPage.navigateToResolutionCodesTab();
        expect(await flowsetEditPage.isAddResolutionCodeBtnDisabled()).toBeTruthy("Add Resolution Code button is enabled");
        expect(await flowsetEditPage.isAssociateResolutionCodeBtnDisabled()).toBeTruthy("Associate Resolution Code button is enabled");
        await utilityCommon.refresh();
    });

    // asahitya
    it('[DRDMV-18077]: Check Case manager is not able to perform Create Update operation on Case to Case Relationship', async () => {
        await navigationPage.gotoCreateCase();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Relationships--Case to Case', 'Case to Case Relationship Console - Business Workflows');
        expect(await relationshipsConfigsPage.isAddRelationButtonEnabled()).toBeFalsy('Add Button is enabled');
        expect(await relationshipsConfigsPage.isRelationshipNameFieldEnabled('Parent')).toBeFalsy('Parent name is enabled');
        expect(await relationshipsConfigsPage.isSaveButtonEnabled()).toBeFalsy('Save button is enabled');
    });

    // asahitya
    it('[DRDMV-18078]: Check Case manager is not able to perform Create Update operation on Case to Person Relationship', async () => {
        await navigationPage.gotoCreateCase();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Relationships--Case to Person', 'Case To Person Relationship Console - Business Workflows');
        expect(await relationshipsConfigsPage.isAddRelationButtonEnabled()).toBeFalsy('Add Button is enabled');
        expect(await relationshipsConfigsPage.isRelationshipNameFieldEnabled('Witness')).toBeFalsy('Witness name is enabled');
        expect(await relationshipsConfigsPage.isSaveButtonEnabled()).toBeFalsy('Save button is enabled');
    });

    // asahitya
    it('[DRDMV-18079]: Check Case manager is not able to perform Create Update operation on Person to Person Relationship', async () => {
        await navigationPage.gotoCreateCase();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Relationships--Person to Person', 'Person To Person Relationship console - Business Workflows');
        expect(await relationshipsConfigsPage.isAddRelationButtonEnabled()).toBeFalsy('Add Button is enabled');
        expect(await relationshipsConfigsPage.isRelationshipNameFieldEnabled('Former Manager')).toBeFalsy('Former Manager name is enabled');
        expect(await relationshipsConfigsPage.isSaveButtonEnabled()).toBeFalsy('Save button is enabled');
    });

    //asahitya
    it('[DRDMV-18063]: Check Case manager is not able to perform Create Update Delete operation on Email->Template', async () => {
        await apiHelper.apiLogin('qkatawazi');
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let emailTemplateData = require('../../data/ui/email/email.template.api.json');
        let emailTemplateName: string = await emailTemplateData['emailTemplateWithMandatoryField'].TemplateName + randomStr;
        emailTemplateData['emailTemplateWithMandatoryField'].TemplateName = emailTemplateName;
        await apiHelper.createEmailTemplate(emailTemplateData['emailTemplateWithMandatoryField']);

        await navigationPage.gotoCreateCase();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Email--Templates', 'Email Template Console - Business Workflows');
        expect(await emailTemplateConsolePage.isAddEmailTemplateButtonDisplayed()).toBeFalsy('Add Email Template Button is enabled');
        await utilGrid.searchRecord(emailTemplateName);
        await utilGrid.clickCheckBoxOfValueInGrid(emailTemplateName);
        expect(await emailTemplateConsolePage.isDeleteEmailTemplateButtonDisplayed()).toBeFalsy('Delete Template Button is enabled');
        await utilityCommon.refresh();
        await utilGrid.searchAndOpenHyperlink(emailTemplateName);
        expect(await editEmailTemplatePage.isTemplateNameEnabled()).toBeFalsy('Template Name is enabled');
        expect(await editEmailTemplatePage.isStatusFieldEnabled()).toBeFalsy('Status field is enabled');
        expect(await editEmailTemplatePage.isLocalizedMessageButtonEnabled()).toBeFalsy('Localized Message button is enabled');
        await editEmailTemplatePage.clickOnBodyCheckbox();
        expect(await editEmailTemplatePage.isEditButtonEnabled()).toBeFalsy('Edit Body button is enabled');
        await editEmailTemplatePage.clickOnSubjectCheckbox();
        expect(await editEmailTemplatePage.isEditButtonEnabled()).toBeFalsy('Edit Subject button is enabled');
        await utilityCommon.refresh();
    });

    //asahitya
    it('[DRDMV-18061]: Check Case manager is not able to perform Create Update and Delete operation on Email->Acknowledgement template', async () => {
        await apiHelper.apiLogin('qkatawazi');
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let emailTemplateData = require('../../data/ui/email/email.template.api.json');
        let emailTemplateName: string = await emailTemplateData['emailTemplateWithMandatoryField'].TemplateName + randomStr;
        emailTemplateData['emailTemplateWithMandatoryField'].TemplateName = emailTemplateName;
        await apiHelper.createEmailAcknowledgementTemplate(emailTemplateData['emailTemplateWithMandatoryField']);

        await navigationPage.gotoCreateCase();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Email--Acknowledgment Templates', 'Email Ack Template Console - Business Workflows');
        expect(await acknowledgementTemplateConsolePage.isAddAcknowledgeTemplateButtonDisplayed()).toBeFalsy('Add Email Template Button is enabled');
        await utilGrid.searchRecord(emailTemplateName);
        await utilGrid.clickCheckBoxOfValueInGrid(emailTemplateName);
        expect(await acknowledgementTemplateConsolePage.isDeleteAcknowledgementTemplateButtonDisplayed()).toBeFalsy('Delete Template Button is enabled');
        await utilityCommon.refresh();
        await utilGrid.searchAndOpenHyperlink(emailTemplateName);
        expect(await editAcknowledementTemplatePage.isTemplateNameEnabled()).toBeFalsy('Template Name is enabled');
        expect(await editAcknowledementTemplatePage.isStatusFieldEnabled()).toBeFalsy('Status field is enabled');
        expect(await editAcknowledementTemplatePage.isLocalizedMessageButtonEnabled()).toBeFalsy('Localized Message button is enabled');
        await editAcknowledementTemplatePage.clickOnBodyCheckbox();
        expect(await editAcknowledementTemplatePage.isEditButtonEnabled()).toBeFalsy('Edit Body button is enabled');
        await editAcknowledementTemplatePage.clickOnSubjectCheckbox();
        expect(await editAcknowledementTemplatePage.isEditButtonEnabled()).toBeFalsy('Edit Subject button is enabled');
        await utilityCommon.refresh();
    });

    //asahitya
    it('[DRDMV-18170]: Check Case manager is not able to perform Create Update operation on Service Target', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await apiHelper.apiLogin('qkatawazi');
        const svtData = {
            "terms": "'1000000063'=\"cb500f4763edeb302d4644e2d5cf22372543dedda74717135ffc927758066570c1a59648f541d5392790876c312fcf2a0501a76d13290562cce65a69c48e7356\"",
            "readableTerms": "'Company'=\"Petramco\"",
            "startWhen": "'450000021'=\"5000\"",
            "readableStartWhen": "'Status'=\"Resolved\"",
            "stopWhen": "'450000021'=\"7000\"",
            "readableStopWhen": "'Status'=\"Closed\"",
            "goalTimeMinutes": "4",
            "dataSource": "Case Management",
            "company": "Petramco",
            "svtName": "DRDMV-18170"
        }
        svtData.svtName = "DRDMV-18170" + randomStr;
        await apiHelper.createSVT(svtData);
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows');
        expect(await serviceTargetConsolePage.isAddSVTButtonEnabled()).toBeFalsy('Add SVT button is enabled');
        await utilGrid.searchAndOpenHyperlink("DRDMV-18170" + randomStr);
        expect(await editServiceTargetConfigPage.isStatusFieldDisabled()).toBeTruthy('Status field is enabled');
        expect(await editServiceTargetConfigPage.isBuildExpressionButtonEnabled()).toBeFalsy('Build Expression button is enabled');
        expect(await editServiceTargetConfigPage.isDescriptionFieldEnabled()).toBeFalsy('Description field is enabled');
        expect(await editServiceTargetConfigPage.isGoalDaysFieldEnabled()).toBeFalsy('Goal Days field is enabled');
        expect(await editServiceTargetConfigPage.isGoalHoursFieldEnabled()).toBeFalsy('Goal Hours field is enabled');
        expect(await editServiceTargetConfigPage.isGoalMinutesFieldEnabled()).toBeFalsy('Goal Minutes field is enabled');
        await editServiceTargetConfigPage.expandSection('Measurement');
        expect(await editServiceTargetConfigPage.isSetWarningstatusFieldEnabled()).toBeFalsy('Set Warning status field is enabled');
        expect(await editServiceTargetConfigPage.isStartWhenBuildExpressionButtonEnabled()).toBeFalsy('Build Expression button on Start when is enabled');
        await editServiceTargetConfigPage.expandSection('Milestones');
        expect(await editServiceTargetConfigPage.isAddMilestoneButtonEnabled()).toBeFalsy('Add Milestone button is enabled');
        expect(await editServiceTargetConfigPage.isEditMilestoneButtonEnabled()).toBeFalsy('Add Milestone button is enabled');
        expect(await editServiceTargetConfigPage.isAddMilestoneButtonEnabled()).toBeFalsy('Edit Milestone button is enabled');
        expect(await editServiceTargetConfigPage.isDeleteMilestoneButtonEnabled()).toBeFalsy('Delete Milestone button is enabled');
        expect(await editServiceTargetConfigPage.isSaveButtonEnabled()).toBeFalsy('Save button is enabled');
    });

    it('[DRDMV-18171]: Check Case manager is not able to perform Create Update Delete operation on Service Target Group', async () => {
        let svtGrpName = 'DRDMV-18171' + [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.createServiceTargetGroup(svtGrpName, 'Case Management');
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target Group', 'Service Target Group - Administration - Business Workflows');
        expect(await serviceTargetGroupConsole.isAddServiceTargetGroupBtnEnabled()).toBeFalsy('Add Button is enabled');
        await utilGrid.searchAndOpenHyperlink(svtGrpName);
        expect(await editServiceTargetGroupPage.isSVTGroupNameEnabled()).toBeFalsy('SVT Group name is enabled');
        expect(await editServiceTargetGroupPage.isSVTSelectRadioBtnDisabled()).toBeTruthy('SVT Selection is enabled');
        expect(await editServiceTargetGroupPage.isSaveBtnEnabled()).toBeFalsy('Save button is enabled');
        await editServiceTargetGroupPage.clickClose();
        await utilGrid.searchAndSelectGridRecord(svtGrpName);
        expect(await serviceTargetGroupConsole.isDeleteButtonEnabled()).toBeFalsy('Delete Button is enabled'); 
    });

    //asahitya
    it('[DRDMV-18041]: Check Case manager is not able to perform Create Update Delete operation on Notification Configuration', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Notification Configuration--Manage Templates', 'Manage Notification Template - Business Workflows');
        expect(await notificationTemplateConsolePage.isAddNotificationTemplateBtnDisplayed()).toBeFalsy('Add Button is enabled');
        await utilGrid.searchAndSelectGridRecord('Cancel Template');
        expect(await notificationTemplateConsolePage.isDeleteNotificationTemplateBtnDisplayed()).toBeFalsy('Delete Button is enabled');
        await utilGrid.clearGridSearchBox();
        await utilGrid.searchAndOpenHyperlink('Cancel Template');
        expect(await editNotificationTemplatePage.isDescriptionFieldDisabled()).toBeTruthy('Description field is enabled');
        expect(await editNotificationTemplatePage.isEventDropdownDisabled()).toBeTruthy('Event dropdown is enabled');
        expect(await editNotificationTemplatePage.isAddLocalizedButtonEnabled()).toBeFalsy('Add Localized button is enabled');
        expect(await editNotificationTemplatePage.isAddRecipientButtonEnabled()).toBeFalsy('Add Recipients button is enabled');
        expect(await editNotificationTemplatePage.isSaveButtonEnabled()).toBeFalsy('Save button is enabled');
        await editNotificationTemplatePage.openAlertEditMessageText();
        expect(await editNotificationTemplatePage.isAlertSubjectMessageDisabled()).toBeTruthy('Alert textbox is enabled');
        await editNotificationTemplatePage.cancelAlertMessageText();
        await editNotificationTemplatePage.clickOnEmailTab();
        await editNotificationTemplatePage.openEmailBodyEditMessageText();
        expect(await editNotificationTemplatePage.isEmailBodyMessageDisabled()).toBeTruthy('Email body textbox is enabled');
        await editNotificationTemplatePage.cancelEmailBodyBlade();
        await editNotificationTemplatePage.openEmailSubjectEditMessageText();
        expect(await editNotificationTemplatePage.isEmailSubjectMessageDisabled()).toBeTruthy('Email subject textbox is enabled');
        await editNotificationTemplatePage.cancelEmailSubjectBlade();
    });

    //asahitya
    it('[DRDMV-18032]: Check Case manager is not able to perform Create Update Delete operation on Case Approval Mapping', async () => {
        //Create Approval Mapping
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');

        await apiHelper.apiLogin('qkatawazi');
        let approvalMappingData = {
            "triggerStatus": "InProgress",
            "errorStatus": "Canceled",
            "approvedStatus": "Resolved",
            "noApprovalFoundStatus": "Pending",
            "rejectStatus": "Canceled",
            "company": "Petramco",
            "mappingName": "Approval Mapping Name" + randomStr
        }
        await apiHelper.deleteApprovalMapping(caseModule);
        await apiHelper.createApprovalMapping(caseModule,approvalMappingData);

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Approvals', 'Configure Case Approvals - Business Workflows');
        expect(await approvalMappingConsolePO.isAddApprovalMappingBtnDisplayed()).toBeFalsy('Add Config button is displayed');
        await utilGrid.searchAndOpenHyperlink("Approval Mapping Name" + randomStr);
        expect(await editApprovalMappingPage.isApprovalMappingNameDisabled()).toBeTruthy('Approval Mapping Name is editable');
        expect(await editApprovalMappingPage.isDropdownDisabled('StatusTrigger')).toBeTruthy('StatusTrigger dropdown is editable');
        expect(await editApprovalMappingPage.isCasesCreatedWithoutTemplateToggleDisabled()).toBeTruthy('CasesCreatedWithoutTemplateToggleButton is editable');
        await utilCommon.closeBladeOnSettings();
        await utilGrid.searchAndSelectGridRecord("Approval Mapping Name" + randomStr);
        expect(await approvalMappingConsolePO.isDeleteApprovalMappingBtnDisplayed()).toBeFalsy('Delete button is displayed');
        //Case Template selection disabled part is covered in test case DRDMV-1303
    });

    //asahitya
    it('[DRDMV-18062]: Check Case manager is not able to perform Create Update Delete operation on Email->Configuration', async () => {
        try {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteAllEmailConfiguration();
            await apiHelper.createEmailConfiguration();
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Configuration', 'Email Box Console - Business Workflows');
            await utilGrid.searchAndSelectGridRecord('bmctemptestemail@gmail.com');
            expect(await emailConfigurationConsole.isDeleteBtnDisplayed()).toBeFalsy('Delete Button is displayed');
            await utilGrid.clearGridSearchBox();
            await utilGrid.searchAndOpenHyperlink('bmctemptestemail@gmail.com');
            expect(await editEmailConfiguration.isDefaultCaseTemplateToUseBtnDisabled()).toBeTruthy('Default Case Template field is enabled');
            expect(await editEmailConfiguration.isAddNewRuleBtnEnabled()).toBeFalsy('Add New Rule button is enabled');
            expect(await editEmailConfiguration.isAddAvailableGlobalSubjectBtnEnabled()).toBeFalsy('Add available Global Subject button is enabled');
            await utilGrid.clickCheckBoxOfValueInGrid('Out Of Office');
            expect(await editEmailConfiguration.isRemoveExlusionSubjectEnabled()).toBeFalsy('Remove Exclusion Subject button is enabled');
            expect(await editEmailConfiguration.isEditExlusiceSubjectEnabled()).toBeFalsy('Edit Exclusive Subject button is enabled');
            await editEmailConfiguration.selectTab("Acknowledgment Templates");
            await editEmailConfiguration.searchAndClickCheckboxOnAcknowledgementTemplateGrid('Task Update Ack Template');
            expect(await editEmailConfiguration.isAcknowledgementTemplateEditBtnEnabled()).toBeFalsy('Acknowledge Template Edit button is enabled');
            await editEmailConfiguration.selectTab("Associated Support Groups");
            await editEmailConfiguration.selectBusinessUnitInAssociatedSupportGroupTab("Facilities Support");
            expect(await editEmailConfiguration.isAssociatedGroupSGSelectCheckboxDisabled()).toBeTruthy('Support Group checkbox is enabled');
            await editEmailConfiguration.selectTab("Trusted Email");
            expect(await editEmailConfiguration.isAddNewRuleBtnEnabled()).toBeFalsy('Add Trusted Email button is enabled');
            await editEmailConfiguration.selectTab("Blocked Email");
            expect(await editEmailConfiguration.isBlockedEmailBtnEnabled()).toBeFalsy('Add Blocked Email button is enabled');
        }
        catch (ex) { throw ex; }
        finally {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteAllEmailConfiguration();
        }
    });

    //asahitya
    it('[DRDMV-18039]: Check Case manager is not able to perform Create operation on Case template', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateData = {
            "templateName": 'DRDMV-18039 Name' + randomStr,
            "templateSummary": 'DRDMV-18039 Summary' + randomStr,
            "templateStatus": "Draft",
            "company": "Petramco",
            "businessUnit": "United States Support",
            "supportGroup": "US Support 3",
            "ownerBU": "United States Support",
            "ownerGroup": "US Support 3"
        }
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.createCaseTemplate(caseTemplateData);

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        expect(await caseTemplateConsolePage.isAddCaseTemplateBtnDisplayed()).toBeFalsy('Add Case Template button is displayed');
        await caseTemplateConsolePage.searchAndselectCaseTemplate('DRDMV-18039 Name' + randomStr);
        expect(await caseTemplateConsolePage.isCopyCaseTemplateBtnDisplayed()).toBeFalsy('Copy Case Template button is displayed');
        await utilGrid.clearGridSearchBox();
        await utilGrid.searchAndOpenHyperlink('DRDMV-18039 Name' + randomStr);
        await editCaseTemplatePage.clickEditCaseTemplate();
        expect(await editCaseTemplatePage.isCaseStatusFieldDisabled()).toBeTruthy('Case status field is enabled');
        expect(await editCaseTemplatePage.isCaseSummaryFieldDisabled()).toBeTruthy('Case summary field is enabled');
        expect(await editCaseTemplatePage.isCopyTemplateBtnDisplayed()).toBeFalsy('Copy template button is displayed');
        expect(await editCaseTemplatePage.isSaveTemplateBtnEnabled()).toBeFalsy('Save button is enabled');
        await editCaseTemplatePage.clickOnEditCaseTemplateMetadata();
        expect(await editCaseTemplatePage.isTemplateStatusDisabled()).toBeTruthy('Template status field is enabled');
        expect(await editCaseTemplatePage.isSaveMetadataBtnEnabled()).toBeFalsy('Save metadata button is enabled');
        await editCaseTemplatePage.clickOnCancelButton();
    });

    //asahitya
    it('[DRDMV-18059]: Check Case manager is not able to perform Create operation on Task template', async () => {
        let taskTemplateName = 'DRDMV-18059' +  [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let taskTemplateData = {
            "templateName": taskTemplateName,
            "templateSummary": taskTemplateName,
            "templateStatus": "Draft",
            "taskCompany": "Petramco",
            "buisnessUnit": "Facilities Support",
            "supportGroup": "Facilities",
            "ownerCompany": "Petramco",
            "ownerBusinessUnit": "Facilities Support",
            "ownerGroup": "Facilities"
        }

        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.createManualTaskTemplate(taskTemplateData);
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
        expect(await taskTemplateConsolePage.isAddManualTaskTemplateBtnDisplayed()).toBeFalsy('Add Manual Task Template button is displayed');
        expect(await taskTemplateConsolePage.isAddAutomatedTaskTemplateBtnDisplayed()).toBeFalsy('Add Automated Task Template button is displayed');
        expect(await taskTemplateConsolePage.isAddExternalTaskTemplateBtnDisplayed()).toBeFalsy('Add External Task Template button is displayed');
        await taskTemplateConsolePage.searchAndSelectTaskTemplate(taskTemplateName);
        expect(await taskTemplateConsolePage.isCopyTaskTemplateBtnDisplayed()).toBeFalsy('Copy Task Template button is displayed');
        await utilGrid.clearGridSearchBox();
        await utilGrid.searchAndOpenHyperlink(taskTemplateName);
        expect(await viewTaskTemplatePage.isCopyTaskButtonEnabled()).toBeFalsy('Copy task template button is enabled');
        await viewTaskTemplatePage.clickOnEditLink();
        expect(await editTaskTemplatePage.isTaskSummaryFieldDisabled()).toBeTruthy('Task Summary field is enabled');
        expect(await editTaskTemplatePage.isSaveTemplateBtnEnabled()).toBeFalsy('Task template save button is enabled');
        await editTaskTemplatePage.clickOnEditMetadataLink();
        expect(await editTaskTemplatePage.isTemplateStatusDisabled()).toBeTruthy('Template status field is enabled');
        expect(await editTaskTemplatePage.isSaveTemplateMetadataBtnEnabled()).toBeFalsy('Task template metadata save button is enabled');
    });

    it('[DRDMV-18076]: Check Case manager is not able to perform Create Update Delete operation on Document Template', async () => {
        let documentTemplateName = 'DRDMV-18076' +  [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let documentTemplateData = {
            "templateName": documentTemplateName,
            "description": documentTemplateName + "desc",
            "messageBody": "Message Body"
        }        

        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.createDocumentTemplate(documentTemplateData);
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Document Management--Templates', 'Document Templates - Business Workflows');
        expect(await documentTemplateConsolePo.isAddDocumentTemplateBtnDisplayed()).toBeFalsy('Add Document template button is displayed');
        await utilGrid.searchAndSelectGridRecord(documentTemplateName);
        expect(await documentTemplateConsolePo.isDeleteDocumentTemplateBtnDisplayed()).toBeFalsy('Delete Document template button is displayed');
        await utilGrid.clearGridSearchBox();
        await utilGrid.searchAndOpenHyperlink(documentTemplateName);
        expect(await editDocumentTemplatePage.isDescriptionFieldDisabled()).toBeTruthy('Description Field is enabled');
        expect(await editDocumentTemplatePage.isSaveButtonEnabled()).toBeFalsy('Status button is enabled');
    });

});
