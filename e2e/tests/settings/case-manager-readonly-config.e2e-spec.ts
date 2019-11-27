import { browser } from "protractor";
import loginPage from "../../pageobject/login.po";
import navigationPage from "../../pageobject/navigation.po";
import automatedStatusTransitionConsole from "../../pageobject/settings/automated-status-transition-console.po";
import automatedStatusTransitionCreatePage from "../../pageobject/settings/create-automated-status-config.po"
import utilGrid from "../../utils/ui/util.grid";
import automatedStatusTransitionEditPage from "../../pageobject/settings/edit-automated-status-config.po"
import assignmentConfgiConsole from "../../pageobject/settings/assignments-config-console.po";
import assignmentConfigEditPage from "../../pageobject/settings/edit-assignments-config.po"

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
        expect(await assignmentConfgiConsole.isAddAssignmentsBtnDisabled()).toBeTruthy();
        await utilGrid.searchAndSelectAllCheckBoxWOGrid("Benefits Assignment");
        expect(await assignmentConfgiConsole.isDeleteAssignmentConfigBtnDisabled()).toBeTruthy();
        await browser.refresh();
        await utilGrid.searchAndOpenHyperlink("Benefits Assignment");
        expect(await assignmentConfigEditPage.isEditAssignmentNameDisabled()).toBeTruthy();
        expect(await assignmentConfigEditPage.isDefaultToggleBtnDisabled()).toBeTruthy();
        expect(await assignmentConfigEditPage.isSaveBtnDisabled()).toBeTruthy();
        await browser.refresh();
    });
})