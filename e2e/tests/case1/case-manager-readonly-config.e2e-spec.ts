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

describe('Case Manager Read-only Config', () => {
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
        browser.refresh();
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
        NOTES_TEMPLATE_MANDATORY_FIELD.templateName = NOTES_TEMPLATE_MANDATORY_FIELD + randomStr;
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
});
