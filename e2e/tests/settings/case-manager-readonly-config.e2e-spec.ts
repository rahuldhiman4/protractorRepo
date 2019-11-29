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

describe('Case And Employee Relationship', () => {
    beforeAll(async () => {
        await browser.get(`${browser.baseUrl}/innovationsuite/index.html#/com.bmc.dsm.bwfa`);
        browser.waitForAngularEnabled(false);
    });

    beforeAll(async () => {
        await loginPage.login('qdu');
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    it('DRDMV-17553: Case manager - automatic case status transtion rule console validations', async () => {
        navigationPage.signOut();
        await loginPage.login('qkatawazi');
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Case Management--Automated Status Transition', 'Configure Automated Status Transitions - Business Workflows'));
        let automatedStatusTransitionData = require('../../data/ui/automatedStatusTransition.ui.json');
        let configName: string = await automatedStatusTransitionData['automatedStatusTransitionWithMandatoryFields'].name + Math.floor(Math.random() * 100000);
        automatedStatusTransitionData['automatedStatusTransitionWithMandatoryFields'].name = configName;
        await automatedStatusTransitionConsole.clickAddAutomatedStatusTransitionBtn();
        await automatedStatusTransitionCreatePage.createAutomatedStatusTransition(automatedStatusTransitionData);
        await navigationPage.signOut();
        await loginPage.login('qdu');
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

})