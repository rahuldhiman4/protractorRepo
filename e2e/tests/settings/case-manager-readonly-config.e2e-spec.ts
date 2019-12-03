import { browser } from "protractor";
import loginPage from "../../pageobject/login.po";
import navigationPage from "../../pageobject/navigation.po";
import automatedStatusTransitionConsole from "../../pageobject/settings/automated-status-transition-console.po";
import automatedStatusTransitionCreatePage from "../../pageobject/settings/create-automated-status-config.po"
import utilGrid from "../../utils/ui/util.grid";
import automatedStatusTransitionEditPage from "../../pageobject/settings/edit-automated-status-config.po"
import assignmentConfigConsole from "../../pageobject/settings/assignments-config-console.po";
import assignmentConfigEditPage from "../../pageobject/settings/edit-assignments-config.po";
import caseReadAccessConfigConsole from "../../pageobject/settings/read-access-console.po";
import caseReadAccessConfigEditPage from "../../pageobject/settings/edit-read-access-config.po";
import processLibraryConfigConsole from "../../pageobject/settings/process-library-config-console.po";
import processLibraryEditPage from "../../pageobject/settings/edit-process-library-config.po";
import menuItemsConfigConsole from "../../pageobject/settings/menu-items-config-console.po";
import menuItemEditPage from "../../pageobject/settings/edit-menu-items-config.po";
import caseStatusConfig from "../../pageobject/settings/case-status-config.po";
import taskStatusConfig from "../../pageobject/settings/task-status-config.po"
import goalTypeEditPage from "../../pageobject/settings/edit-goal-type.po";
import configureDataSourceEditPage from "../../pageobject/settings/edit-configure-data-source-config.po";
import configureDataSourceConfigConsole from "../../pageobject/settings/configure-data-source-config-console.po";
import goalTypeConfigConsole from "../../pageobject/settings/goal-type-config-console.po";
import businessTimeSharedEntityConfigConsole from "../../pageobject/settings/business-time-shared-entity-console.po";
import businessTimeEntityConfigEditPage from "../../pageobject/settings/edit-business-time-entity-config.po";
import businessTimeSegmentConfigConsole from "../../pageobject/settings/business-time-segment-console.po";
import businessTimeSegmentConfigEditPage from "../../pageobject/settings/edit-business-segment-config.po";

describe('Case Manager Read-only Config', () => {
    beforeAll(async () => {
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa');
        await loginPage.login('qdu');
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    it('DRDMV-17553: Case manager - automatic case status transtion rule console validations', async () => {
        await navigationPage.signOut();
        try {
            await loginPage.login('qkatawazi');
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.gotoSettingsMenuItem('Case Management--Automated Status Transition', 'Configure Automated Status Transitions - Business Workflows'));
            let automatedStatusTransitionData = require('../../data/ui/automatedStatusTransition.ui.json');
            var configName: string = await automatedStatusTransitionData['automatedStatusTransitionWithMandatoryFields'].name + Math.floor(Math.random() * 100000);
            automatedStatusTransitionData['automatedStatusTransitionWithMandatoryFields'].name = configName;
            await automatedStatusTransitionConsole.clickAddAutomatedStatusTransitionBtn();
            await automatedStatusTransitionCreatePage.createAutomatedStatusTransition(automatedStatusTransitionData);
        }
        catch (Ex) {
            console.log("Issue while creating the Automated status transition");
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login('qdu');
        }
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Case Management--Automated Status Transition', 'Configure Automated Status Transitions - Business Workflows'));
        expect(await automatedStatusTransitionConsole.isAddAutomatedStatusTransitionBtnDisabled()).toBeTruthy();
        await utilGrid.searchAndSelectAllCheckBoxWOGrid(configName);
        expect(await automatedStatusTransitionConsole.isDeleteAutomatedStatusTransitionBtnDisabled()).toBeTruthy();
        await browser.refresh();
        await utilGrid.searchAndOpenHyperlink(configName);
        expect(await automatedStatusTransitionEditPage.isAutomatedStatusTransitionNameDisabled()).toBeTruthy();
        expect(await automatedStatusTransitionEditPage.isAutomatedStatusTransitionSaveBtnDisabled()).toBeTruthy();
        await browser.refresh();
    });

    it('DRDMV-18033: Check Case manager is not able to perform Create Update Delete operation on Case Assignment Mapping', async () => {
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

    it('DRDMV-18037: Check Case manager is not able to perform Create Update Delete operation on Read Access mapping', async () => {
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
    it('DRDMV-18072: Check Case manager is not able to perform Create Update operation on Process Library configuration', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Process Library', 'Process Library - Console - Business Workflows');
        expect(await processLibraryConfigConsole.isRegisterProcessBtnDisabled()).toBeTruthy();
        await utilGrid.searchAndOpenHyperlink("Facilities - Lifecycle Investigation");
        expect(await processLibraryEditPage.isDescriptionDisabled()).toBeTruthy("Description field is enabled");
        expect(await processLibraryEditPage.isStatusDisabled()).toBeTruthy("Status field is enabled");
        expect(await processLibraryEditPage.isSaveButtonDisabled()).toBeTruthy("Save button is enabled");
        await browser.refresh();
    });

    it('DRDMV-18069: Check Case manager is not able to perform Create Update operation on Menu Items', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Application Configuration--Menu Items', 'Menu Items - Business Workflows');
        expect(await menuItemsConfigConsole.isAddButtonDisabled()).toBeTruthy();
        await utilGrid.searchAndOpenHyperlink("Email");
        expect(await menuItemEditPage.isMenuItemsStatusDisabled()).toBeTruthy("Status field is enabled");
        expect(await menuItemEditPage.isDefaultToggleBtnDisabled()).toBeTruthy("Default Toggle is enabled");
        expect(await menuItemEditPage.isSaveButtonDisabled()).toBeTruthy("Save button is enabled");
        await browser.refresh();
    });

    it('DRDMV-18038: Check Case manager is not able to perform Create Update Delete operation on Case-> Status Configuration', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Status Configuration', 'Configure Case Status Transition - Business Workflows');
        await caseStatusConfig.setCompanyDropdown("Petramco");
        expect(await caseStatusConfig.isEditLifrCycleBtnDisabled()).toBeTruthy("Edit Life Cycle button is enabled");
    });

    it('DRDMV-18057: Check Case manager is not able to perform Create Update Delete operation on Task->Status Configuration', async () => {
        await navigationPage.gotoCaseConsole();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Status Configuration', 'Configure Task Status Tranistions - Business Workflows');
        await taskStatusConfig.setCompanyDropdown("Petramco");
        expect(await taskStatusConfig.isEditLifrCycleBtnDisabled()).toBeTruthy("Edit Life Cycle button is enabled");
    });

    it('DRDMV-18169: Check Case manager is not able to perform Create Update operation on Goal Type', async () => {
        await navigationPage.gotoSettingsMenuItem('Service Level Management--Goal Type', 'Goal Type - Business Workflows');
        expect(await goalTypeConfigConsole.isAddGoalTypeBtnDisabled()).toBeTruthy("Add button is enabled");
        await utilGrid.searchAndOpenHyperlink("Case Resolution Time");
        expect(await goalTypeEditPage.isStatusFieldDisabled()).toBeTruthy("Status field is enabled");
        expect(await goalTypeEditPage.isSaveButtonDisabled()).toBeTruthy("Save button is enabled");
        browser.refresh();
    });

    it('DRDMV-18095: Check Case manager is not able to perform Create Update operation on Configure Data Source', async () => {
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

    it('DRDMV-18093: Check Case manager is not able to perform Create Update operation on Business Time Shared Entity', async () => {
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

    it('DRDMV-18083: Check Case manager is not able to perform Create Update operation on Business Time Segment', async () => {
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

})