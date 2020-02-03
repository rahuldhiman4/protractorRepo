import { browser } from "protractor";
import apiHelper from "../../api/api.helper";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import flowsetConsole from "../../pageobject/flowset/console-flowset-config.po";
import flowsetEditPage from "../../pageobject/flowset/edit-flowset-config.po";
import menuItemEditPage from "../../pageobject/settings/application-config/edit-menu-items-config.po";
import menuItemsConfigConsole from "../../pageobject/settings/application-config/menu-items-config-console.po";
import assignmentConfigConsole from "../../pageobject/settings/case-management/assignments-config-console.po";
import automatedStatusTransitionConsole from "../../pageobject/settings/case-management/automated-status-transition-console.po";
import caseStatusConfig from "../../pageobject/settings/case-management/case-status-config.po";
import automatedStatusTransitionCreatePage from "../../pageobject/settings/case-management/create-automated-status-config.po";
import assignmentConfigEditPage from "../../pageobject/settings/case-management/edit-assignments-config.po";
import automatedStatusTransitionEditPage from "../../pageobject/settings/case-management/edit-automated-status-config.po";
import caseReadAccessConfigEditPage from "../../pageobject/settings/case-management/edit-read-access-config.po";
import caseReadAccessConfigConsole from "../../pageobject/settings/case-management/read-access-console.po";
import notesTemplateConsole from "../../pageobject/settings/common/console-notestemplate.po";
import editNotesTemplateConfig from "../../pageobject/settings/common/edit-notestemplate.po";
import processLibraryEditPage from "../../pageobject/settings/manage-flowset/edit-process-library-config.po";
import processLibraryConfigConsole from "../../pageobject/settings/manage-flowset/process-library-config-console.po";
import businessTimeSegmentConfigConsole from "../../pageobject/settings/slm/business-time-segment-console.po";
import businessTimeSharedEntityConfigConsole from "../../pageobject/settings/slm/business-time-shared-entity-console.po";
import configureDataSourceConfigConsole from "../../pageobject/settings/slm/configure-data-source-config-console.po";
import businessTimeSegmentConfigEditPage from "../../pageobject/settings/slm/edit-business-segment-config.po";
import businessTimeEntityConfigEditPage from "../../pageobject/settings/slm/edit-business-time-entity-config.po";
import configureDataSourceEditPage from "../../pageobject/settings/slm/edit-configure-data-source-config.po";
import goalTypeEditPage from "../../pageobject/settings/slm/edit-goal-type.po";
import goalTypeConfigConsole from "../../pageobject/settings/slm/goal-type-config-console.po";
import taskStatusConfig from "../../pageobject/settings/task-management/task-status-config.po";
import utilCommon from '../../utils/util.common';
import utilGrid from "../../utils/util.grid";

describe('Case Manager Read-only Config', () => {
    beforeAll(async () => {
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa');
        await loginPage.login('qdu');
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    afterEach(async () => {
        await browser.refresh();
        await utilCommon.waitUntilSpinnerToHide();
    });

    // asahitya
    it('[DRDMV-17553]: Case manager - automatic case status transtion rule console validations', async () => {
        try {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Automated Status Transition', 'Configure Automated Status Transitions - Business Workflows');
            let automatedStatusTransitionData = await require('../../data/ui/case/automatedStatusTransition.ui.json');
            var configName: string = await automatedStatusTransitionData['automatedStatusTransitionWithMandatoryFields'].name + Math.floor(Math.random() * 100000);
            automatedStatusTransitionData['automatedStatusTransitionWithMandatoryFields'].name = configName;
            automatedStatusTransitionData['automatedStatusTransitionWithMandatoryFields'].changeStatusAfter = Math.floor(Math.random() * 180) + 1;
            await automatedStatusTransitionConsole.clickAddAutomatedStatusTransitionBtn();
            await automatedStatusTransitionCreatePage.createAutomatedStatusTransition(automatedStatusTransitionData);
        }
        catch (ex) {
            throw ex;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login('qdu');
        }
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Automated Status Transition', 'Configure Automated Status Transitions - Business Workflows');
        expect(await automatedStatusTransitionConsole.isAddAutomatedStatusTransitionBtnEnabled()).toBeFalsy();
        await utilGrid.searchAndSelectGridRecord(configName);
        expect(await automatedStatusTransitionConsole.isDeleteAutomatedStatusTransitionBtnEnabled()).toBeFalsy();
        await browser.refresh();
        await utilCommon.waitUntilSpinnerToHide();
        await automatedStatusTransitionConsole.openAutomatedTransitionConfig(configName);
        expect(await automatedStatusTransitionEditPage.isAutomatedStatusTransitionNameEnabled()).toBeFalsy();
        expect(await automatedStatusTransitionEditPage.isAutomatedStatusTransitionSaveBtnEnabled()).toBeFalsy();
    });

    // asahitya
    it('[DRDMV-18033]: Check Case manager is not able to perform Create Update Delete operation on Case Assignment Mapping', async () => {
        await navigationPage.gotoCaseConsole();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', 'Configure Case Assignments - Business Workflows');
        expect(await assignmentConfigConsole.isAddAssignmentsBtnDisabled()).toBeTruthy();
        await utilGrid.searchAndSelectAllCheckBoxWOGrid("Benefits Assignment");
        expect(await assignmentConfigConsole.isDeleteAssignmentConfigBtnDisabled()).toBeTruthy();
        await browser.refresh();
        await utilGrid.searchAndOpenHyperlink("Benefits Assignment");
        expect(await assignmentConfigEditPage.isEditAssignmentNameDisabled()).toBeTruthy();
        expect(await assignmentConfigEditPage.isDefaultToggleBtnDisabled()).toBeTruthy();
        expect(await assignmentConfigEditPage.isSaveBtnDisabled()).toBeTruthy();
        await browser.refresh();
    });

    // asahitya
    it('[DRDMV-18037]: Check Case manager is not able to perform Create Update Delete operation on Read Access mapping', async () => {
        await navigationPage.gotCreateCase();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Read Access', 'Case Read Access Configuration - Business Workflows');
        expect(await caseReadAccessConfigConsole.isAddButtonDisabled()).toBeTruthy();
        await utilGrid.searchAndSelectAllCheckBoxWOGrid("Relocation - Facilities Access Mapping");
        expect(await caseReadAccessConfigConsole.isDeleteButtonDisabled()).toBeTruthy();
        await browser.refresh();
        await utilGrid.searchAndOpenHyperlink("Relocation - Facilities Access Mapping");
        expect(await caseReadAccessConfigEditPage.isAccessMappingNameDisabled()).toBeTruthy();
        expect(await caseReadAccessConfigEditPage.isDefaultToggleBtnDisabled()).toBeTruthy();
        expect(await caseReadAccessConfigEditPage.isSaveBtnDisabled()).toBeTruthy();
        await browser.refresh();
    });

    //Defect: Description and Status fields are enabled
    // asahitya
    it('[DRDMV-18072]: Check Case manager is not able to perform Create Update operation on Process Library configuration', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Process Library', 'Process Library - Console - Business Workflows');
        expect(await processLibraryConfigConsole.isRegisterProcessBtnDisabled()).toBeTruthy();
        await utilGrid.searchAndOpenHyperlink("Facilities - Lifecycle Investigation");
        expect(await processLibraryEditPage.isDescriptionDisabled()).toBeTruthy("Description field is enabled");
        expect(await processLibraryEditPage.isStatusDisabled()).toBeTruthy("Status field is enabled");
        expect(await processLibraryEditPage.isSaveButtonDisabled()).toBeTruthy("Save button is enabled");
        await browser.refresh();
    });

    // asahitya
    it('[DRDMV-18069]: Check Case manager is not able to perform Create Update operation on Menu Items', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Application Configuration--Menu Items', 'Menu Items - Business Workflows');
        expect(await menuItemsConfigConsole.isAddButtonDisabled()).toBeTruthy();
        await utilGrid.searchAndOpenHyperlink("Email");
        expect(await menuItemEditPage.isMenuItemsStatusDisabled()).toBeTruthy("Status field is enabled");
        expect(await menuItemEditPage.isDefaultToggleBtnDisabled()).toBeTruthy("Default Toggle is enabled");
        expect(await menuItemEditPage.isSaveButtonDisabled()).toBeTruthy("Save button is enabled");
        await browser.refresh();
    });

    // asahitya
    it('[DRDMV-18038]: Check Case manager is not able to perform Create Update Delete operation on Case-> Status Configuration', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Status Configuration', 'Configure Case Status Transition - Business Workflows');
        await caseStatusConfig.setCompanyDropdown("Petramco");
        expect(await caseStatusConfig.isEditLifrCycleBtnDisabled()).toBeTruthy("Edit Life Cycle button is enabled");
    });

    // asahitya
    it('[DRDMV-18057]: Check Case manager is not able to perform Create Update Delete operation on Task->Status Configuration', async () => {
        await navigationPage.gotoCaseConsole();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Status Configuration', 'Configure Task Status Tranistions - Business Workflows');
        await taskStatusConfig.setCompanyDropdown("Petramco");
        expect(await taskStatusConfig.isEditLifrCycleBtnDisabled()).toBeTruthy("Edit Life Cycle button is enabled");
    });

    // asahitya
    it('[DRDMV-18169]: Check Case manager is not able to perform Create Update operation on Goal Type', async () => {
        await navigationPage.gotoSettingsMenuItem('Service Level Management--Goal Type', 'Goal Type - Business Workflows');
        expect(await goalTypeConfigConsole.isAddGoalTypeBtnDisabled()).toBeTruthy("Add button is enabled");
        await utilGrid.searchAndOpenHyperlink("Case Resolution Time");
        expect(await goalTypeEditPage.isStatusFieldDisabled()).toBeTruthy("Status field is enabled");
        expect(await goalTypeEditPage.isSaveButtonDisabled()).toBeTruthy("Save button is enabled");
        browser.refresh();
    });

    // asahitya
    it('[DRDMV-18095]: Check Case manager is not able to perform Create Update operation on Configure Data Source', async () => {
        await navigationPage.gotCreateCase();
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
        await browser.refresh();
    });

    // asahitya
    it('[DRDMV-18093]: Check Case manager is not able to perform Create Update operation on Business Time Shared Entity', async () => {
        await navigationPage.gotCreateCase();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Service Level Management--Business Time Shared Entity', 'Business Time Shared Entity Console - Business Workflows');
        expect(await businessTimeSharedEntityConfigConsole.isAddBtnDisabled()).toBeTruthy("Add button is enabled");
        await utilGrid.searchAndOpenHyperlink("India Business Hours");
        await businessTimeEntityConfigEditPage.updateStatus("Pending");
        expect(await businessTimeEntityConfigEditPage.isSaveBtnDisabled()).toBeTruthy("Save button is enabled");
        expect(await businessTimeEntityConfigEditPage.isAddBusinessSegmentBtnDisabled()).toBeTruthy("Add business time segment button is enabled");
        await businessTimeEntityConfigEditPage.selectAllShortDescription();
        expect(await businessTimeEntityConfigEditPage.isRemoveBtnDisabled()).toBeTruthy("Remove button is enabled");
        await browser.refresh();
    });

    // asahitya
    it('[DRDMV-18083]: Check Case manager is not able to perform Create Update operation on Business Time Segment', async () => {
        await navigationPage.gotCreateCase();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Service Level Management--Business Time Segment', 'Business Time Segment Console - Business Workflows');
        expect(await businessTimeSegmentConfigConsole.isAddBusinessSegmentBtnDisabled()).toBeTruthy("Add Business Time Segment button is enabled");
        await utilGrid.searchAndOpenHyperlink("India Available M-F 9AM-5PM");
        await businessTimeSegmentConfigEditPage.updateStatus("Draft");
        await businessTimeSegmentConfigEditPage.clickNextButton();
        expect(await businessTimeSegmentConfigEditPage.isFinishButtonDisabled()).toBeTruthy("Finish button is enabled");
        await browser.refresh();
    });

    //Defect: Description and Status fields are enabled
    // asahitya
    it('[DRDMV-18034]: Check Case manager is not able to perform Create Update Delete operation on Note template', async () => {
        //API call to create the case notes template
        await apiHelper.apiLogin('qkatawazi');
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let notesTemplateData = require('../../data/ui/social/notesTemplate.ui.json');
        let notesTemplateName: string = await notesTemplateData['notesTemplateWithMandatoryField'].templateName + randomStr;
        notesTemplateData['notesTemplateWithMandatoryField'].templateName = notesTemplateName;
        await apiHelper.createNotesTemplate("Case", notesTemplateData['notesTemplateWithMandatoryField']);

        await navigationPage.gotCreateCase();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Notes Template', 'Activity Notes Template Console - Case - Business Workflows');
        expect(await notesTemplateConsole.isAddNotesTemplateBtnDisabled()).toBeTruthy("Add notes template button is enabled");
        await utilGrid.searchAndSelectFirstCheckBoxWOGrid(notesTemplateName);
        expect(await notesTemplateConsole.isDeleteNotesTemplateBtnDisabled()).toBeTruthy("Delete notes template button is enabled");
        await browser.refresh();
        await utilGrid.searchAndOpenHyperlink(notesTemplateName);
        expect(await editNotesTemplateConfig.isStatusFieldEnabled()).toBeFalsy("Status field is enabled");
        expect(await editNotesTemplateConfig.isDescriptionFieldEnabled()).toBeFalsy("Description field is enabled");
        await browser.refresh();
    });

    //Defect: Description and Status fields are enabled
    // asahitya
    it('[DRDMV-18056]: Check Case manager is not able to perform Create Update Delete operation on Task->Note Template', async () => {
        //API call to create the case notes template
        await apiHelper.apiLogin('qkatawazi');
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let notesTemplateData = require('../../data/ui/social/notesTemplate.ui.json');
        let notesTemplateName: string = await notesTemplateData['notesTemplateWithMandatoryField'].templateName + randomStr;
        notesTemplateData['notesTemplateWithMandatoryField'].templateName = notesTemplateName;
        await apiHelper.createNotesTemplate("Task", notesTemplateData['notesTemplateWithMandatoryField']);

        await navigationPage.gotCreateCase();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Notes Template', 'Activity Notes Template Console - Task - Business Workflows');
        expect(await notesTemplateConsole.isAddNotesTemplateBtnDisabled()).toBeTruthy("Add notes template button is enabled");
        await utilGrid.searchAndSelectFirstCheckBoxWOGrid(notesTemplateName);
        expect(await notesTemplateConsole.isDeleteNotesTemplateBtnDisabled()).toBeTruthy("Delete notes template button is enabled");
        await browser.refresh();
        await utilGrid.searchAndOpenHyperlink(notesTemplateName);
        expect(await editNotesTemplateConfig.isStatusFieldEnabled()).toBeFalsy("Status field is enabled");
        expect(await editNotesTemplateConfig.isDescriptionFieldEnabled()).toBeFalsy("Description field is enabled");
        await browser.refresh();
    });

    //Defect: Description and Status fields are enabled
    // asahitya
    it('[DRDMV-18042]: Check Case manager is not able to perform Create Update Delete operation on People->Note Template', async () => {
        //API call to create the case notes template
        await apiHelper.apiLogin('qkatawazi');
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let notesTemplateData = require('../../data/ui/social/notesTemplate.ui.json');
        let notesTemplateName: string = await notesTemplateData['notesTemplateWithMandatoryField'].templateName + randomStr;
        notesTemplateData['notesTemplateWithMandatoryField'].templateName = notesTemplateName;
        await apiHelper.createNotesTemplate("People", notesTemplateData['notesTemplateWithMandatoryField']);

        await navigationPage.gotCreateCase();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('People--Notes Template', 'Activity Notes Template Console - Person - Business Workflows');
        expect(await notesTemplateConsole.isAddNotesTemplateBtnDisabled()).toBeTruthy("Add notes template button is enabled");
        await utilGrid.searchAndSelectFirstCheckBoxWOGrid(notesTemplateName);
        expect(await notesTemplateConsole.isDeleteNotesTemplateBtnDisabled()).toBeTruthy("Delete notes template button is enabled");
        await browser.refresh();
        await utilGrid.searchAndOpenHyperlink(notesTemplateName);
        expect(await editNotesTemplateConfig.isStatusFieldEnabled()).toBeFalsy("Status field is enabled");
        expect(await editNotesTemplateConfig.isDescriptionFieldEnabled()).toBeFalsy("Description field is enabled");
        await browser.refresh();
    });

    //Defect: Description and Status fields are enabled
    // asahitya
    it('[DRDMV-18071]: Check Case manager is not able to perform Create Update operation on Define Flowset configuration', async () => {
        //API call to create the flowset
        await apiHelper.apiLogin('qkatawazi');
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let flowsetData = require('../../data/ui/case/flowset.ui.json');
        let flowsetName: string = await flowsetData['flowsetMandatoryFields'].flowsetName + randomStr;
        flowsetData['flowsetMandatoryFields'].flowsetName = flowsetName;
        await apiHelper.createNewFlowset(flowsetData['flowsetMandatoryFields']);

        await navigationPage.gotCreateCase();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Define Flowsets', 'Flowsets - Console - Business Workflows');
        expect(await flowsetConsole.isAddFlowsetButtonDisabled()).toBeTruthy("Add button is enabled");
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
        await browser.refresh();
    });
})