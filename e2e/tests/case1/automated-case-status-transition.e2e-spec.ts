import { cloneDeep } from 'lodash';
import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import { AUTO_STATUS_TRANSITION_MANDATORY_FIELDS } from '../../data/ui/case/automated-status-transition.data.ui';
import { SAMPLE_MENU_ITEM } from '../../data/ui/ticketing/menu.item.ui';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import notificationPo from '../../pageobject/notification/notification.po';
import automatedStatusTransitionConsole from "../../pageobject/settings/case-management/automated-status-transition-console.po";
import automatedStatusTransitionCreatePage from "../../pageobject/settings/case-management/create-automated-status-config.po";
import automatedStatusTransitionEditPage from "../../pageobject/settings/case-management/edit-automated-status-config.po";
import { BWF_BASE_URL, BWF_PAGE_TITLES } from '../../utils/constants';
import utilityGrid from '../../utils/utility.grid';
import utilityCommon from '../../utils/utility.common';

describe('Automated Case Status Transition', () => {
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('jbarnes');
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Automated Status Transition', BWF_PAGE_TITLES.CASE_MANAGEMENT.AUTOMATED_STATUS_TRANSITION);
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    //asahitya
    describe('[4112]: Case business analyst - automatic case status transtion rule console', async () => {
        let configName1, configName2, randomStr = [...Array(7)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        it('[4112]: Create two records', async () => {
            await apiHelper.apiLogin('jbarnes');
            await apiHelper.deleteAutomatedCaseStatusTransition();

            //Create first Record
            configName1 = cloneDeep(AUTO_STATUS_TRANSITION_MANDATORY_FIELDS);
            configName1.name = 'ConfigName1' + randomStr;
            configName1.changeStatusAfter = Math.floor(Math.random() * 180) + 1;
            await utilityGrid.selectLineOfBusiness("Facilities");
            await automatedStatusTransitionConsole.clickAddAutomatedStatusTransitionBtn();
            await automatedStatusTransitionCreatePage.createAutomatedStatusTransition(configName1);

            //Create Second Record
            configName2 = cloneDeep(AUTO_STATUS_TRANSITION_MANDATORY_FIELDS);
            configName2.name = 'ConfigName2' + randomStr;
            configName2.changeStatusAfter = Math.floor(Math.random() * 180) + 1;
            configName2.fromStatus = "In Progress";
            await automatedStatusTransitionConsole.clickAddAutomatedStatusTransitionBtn();
            await automatedStatusTransitionCreatePage.createAutomatedStatusTransition(configName2);
            expect(await utilityGrid.isGridRecordPresent(configName1.name)).toBeTruthy();
            expect(await utilityGrid.isGridRecordPresent(configName2.name)).toBeTruthy();
            await utilityGrid.addFilter("Name", configName1.name, 'text');
            expect(await utilityGrid.isGridRecordPresent(configName1.name)).toBeTruthy();
        });
        it('[4112]: Case business analyst - automatic case status transtion rule console', async () => {
            expect(await utilityGrid.isGridRecordPresent(configName2.name)).toBeFalsy();
            await utilityGrid.clearFilter();
            await automatedStatusTransitionConsole.addGridColumns(['Category Tier 1', 'Category Tier 2', 'Category Tier 3', 'Category Tier 4', 'From Status Reason', 'ID', 'To Status Reason', 'Label']);
            expect(await automatedStatusTransitionConsole.areGridColumnMatches(['Name', 'Company', 'From Status', 'To Status', 'Days Inactive', 'Enabled', 'Flowset', 'Category Tier 1', 'Category Tier 2', 'Category Tier 3', 'Category Tier 4', 'From Status Reason', 'ID', 'To Status Reason', 'Label']));
            await automatedStatusTransitionConsole.removeGridColumns(['Category Tier 1', 'Category Tier 2', 'Category Tier 3', 'Category Tier 4', 'From Status Reason', 'ID', 'To Status Reason', 'Label']);
            await automatedStatusTransitionConsole.isGridColumnSorted('Days Inactive');

            await utilityGrid.searchAndOpenHyperlink(configName1.name);
            expect(await automatedStatusTransitionEditPage.isCategoryTier1FieldEnabled()).toBeTruthy("Category Tier 1 is disabled");
            expect(await automatedStatusTransitionEditPage.isCategoryTier2FieldEnabled()).toBeTruthy("Category Tier 2 is disabled");
            expect(await automatedStatusTransitionEditPage.isCategoryTier3FieldEnabled()).toBeTruthy("Category Tier 3 is disabled");
            expect(await automatedStatusTransitionEditPage.isCategoryTier4FieldEnabled()).toBeTruthy("Category Tier 4 is disabled");
            expect(await automatedStatusTransitionEditPage.isFlowsetFieldEnabled()).toBeTruthy("Flowset is disabled");
            expect(await automatedStatusTransitionEditPage.isFromStatusFieldEnabled()).toBeTruthy("From Status is disabled");
            expect(await automatedStatusTransitionEditPage.isToStatusFieldEnabled()).toBeTruthy("To Status is disabled");
            expect(await automatedStatusTransitionEditPage.isNumberOfDaysFieldEnabled()).toBeTruthy("Change After Days is disabled");
            expect(await automatedStatusTransitionEditPage.isToStatusReasonFieldEnabled()).toBeTruthy("To Staus Reason is disabled");
            expect(await automatedStatusTransitionEditPage.isFromStatusReasonFieldEnabled()).toBeTruthy("From Staus Reason is disabled");
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
        });
    });

    //asahitya
    describe('[4111]: Case manager - automatic case status transtion rule console validations', async () => {
        let configName1, configName2, randomStr = [...Array(7)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        it('[4111]: Search and presence of existing rule test', async () => {
            await apiHelper.apiLogin('jbarnes');
            await apiHelper.deleteAutomatedCaseStatusTransition();
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Automated Status Transition', BWF_PAGE_TITLES.CASE_MANAGEMENT.AUTOMATED_STATUS_TRANSITION);
            //Create first Record
            configName1 = cloneDeep(AUTO_STATUS_TRANSITION_MANDATORY_FIELDS);
            configName1.name = 'ConfigName1' + randomStr;
            configName1.changeStatusAfter = Math.floor(Math.random() * 180) + 1;
            await automatedStatusTransitionConsole.clickAddAutomatedStatusTransitionBtn();
            await automatedStatusTransitionCreatePage.createAutomatedStatusTransition(configName1);

            //Create Second Record
            configName2 = cloneDeep(AUTO_STATUS_TRANSITION_MANDATORY_FIELDS);
            configName2.name = 'ConfigName2' + randomStr;
            configName2.changeStatusAfter = Math.floor(Math.random() * 180) + 1;
            configName2.fromStatus = "In Progress";
            await automatedStatusTransitionConsole.clickAddAutomatedStatusTransitionBtn();
            await automatedStatusTransitionCreatePage.createAutomatedStatusTransition(configName2);
        });
        it('[4111]: Search and presence of existing rule test', async () => {
            await navigationPage.signOut();
            await loginPage.login('frieda');
            await navigationPage.gotoCaseConsole();
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Automated Status Transition', BWF_PAGE_TITLES.CASE_MANAGEMENT.AUTOMATED_STATUS_TRANSITION);
            expect(await automatedStatusTransitionConsole.isAddAutomatedStatusTransitionBtnPresent()).toBeFalsy('Add button is available');
            await utilityGrid.searchAndSelectGridRecord(configName1.name);
            expect(await automatedStatusTransitionConsole.isDeleteAutomatedStatusTransitionBtnPresent()).toBeFalsy('Delete button is available');
            await automatedStatusTransitionConsole.openAutomatedTransitionConfig(configName1.name);
            expect(await automatedStatusTransitionEditPage.isAutomatedStatusTransitionNameEnabled()).toBeFalsy('Name field is enabled');
            expect(await automatedStatusTransitionEditPage.isAutomatedStatusTransitionSaveBtnEnabled()).toBeFalsy('Save button is enabled');
            await utilityCommon.closeAllBlades();
            //Search and presence of existing rule test
            expect(await utilityGrid.isGridRecordPresent(configName1.name)).toBeTruthy('Record 1 is missing');
            expect(await utilityGrid.isGridRecordPresent(configName2.name)).toBeTruthy('Record 2 is missing');
        });
        it('[4111]: Case manager - automatic case status transtion rule console validations', async () => {
            //Filter test
            await utilityGrid.addFilter("Name", configName1.name, 'text');
            expect(await utilityGrid.isGridRecordPresent(configName1.name)).toBeTruthy('Record 1 is missing');
            expect(await utilityGrid.isGridRecordPresent(configName2.name)).toBeFalsy('Record 2 is getting displayed');

            //Grid Column and sort test
            await utilityGrid.clearFilter();
            await automatedStatusTransitionConsole.addGridColumns(['Category Tier 1', 'Category Tier 2', 'Category Tier 3', 'Category Tier 4', 'From Status Reason', 'ID', 'To Status Reason', 'Label']);
            expect(await automatedStatusTransitionConsole.areGridColumnMatches(['Name', 'Company', 'From Status', 'To Status', 'Days Inactive', 'Enabled', 'Flowset', 'Category Tier 1', 'Category Tier 2', 'Category Tier 3', 'Category Tier 4', 'From Status Reason', 'ID', 'To Status Reason', 'Label']));
            await automatedStatusTransitionConsole.removeGridColumns(['Category Tier 1', 'Category Tier 2', 'Category Tier 3', 'Category Tier 4', 'From Status Reason', 'ID', 'To Status Reason', 'Label']);
            await automatedStatusTransitionConsole.isGridColumnSorted('Days Inactive');
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Automated Status Transition', BWF_PAGE_TITLES.CASE_MANAGEMENT.AUTOMATED_STATUS_TRANSITION);
        });
    });

    //asahitya
    it('[4105]: Toggle status for Automatic case status transition configuration rule', async () => {
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.deleteAutomatedCaseStatusTransition();

        AUTO_STATUS_TRANSITION_MANDATORY_FIELDS.name = [...Array(7)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        AUTO_STATUS_TRANSITION_MANDATORY_FIELDS.changeStatusAfter = Math.floor(Math.random() * 180) + 1;
        await automatedStatusTransitionConsole.clickAddAutomatedStatusTransitionBtn();
        await automatedStatusTransitionCreatePage.createAutomatedStatusTransition(AUTO_STATUS_TRANSITION_MANDATORY_FIELDS);

        await utilityGrid.searchAndOpenHyperlink(AUTO_STATUS_TRANSITION_MANDATORY_FIELDS.name);
        await automatedStatusTransitionEditPage.selectEnableToggle(false);
        await automatedStatusTransitionEditPage.saveConfiguration();
        expect(await automatedStatusTransitionConsole.getEnabledColumnValueOfRule(AUTO_STATUS_TRANSITION_MANDATORY_FIELDS.name)).toBe('False');

        await utilityGrid.searchAndOpenHyperlink(AUTO_STATUS_TRANSITION_MANDATORY_FIELDS.name);
        await automatedStatusTransitionEditPage.selectEnableToggle(true);
        await automatedStatusTransitionEditPage.saveConfiguration();
        expect(await automatedStatusTransitionConsole.getEnabledColumnValueOfRule(AUTO_STATUS_TRANSITION_MANDATORY_FIELDS.name)).toBe('True');
    });
    it('[4108]: Duplicate detection - create new automatic case transition rule which has field values same as existing rule', async () => {
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.deleteAutomatedCaseStatusTransition();

        let configName: string = [...Array(7)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let days: any = Math.floor(Math.random() * 180) + 1;

        await automatedStatusTransitionConsole.clickAddAutomatedStatusTransitionBtn();
        await automatedStatusTransitionCreatePage.setName(configName);
        await automatedStatusTransitionCreatePage.setCompany('Petramco');
        await automatedStatusTransitionCreatePage.setFlowset('Human Resources');
        await automatedStatusTransitionCreatePage.setFromStatus('Resolved');
        await automatedStatusTransitionCreatePage.setToStatus('Closed');
        await automatedStatusTransitionCreatePage.setFromStatusReason('Auto Resolved');
        await automatedStatusTransitionCreatePage.setToStatusReason('No Further Action Required');
        await automatedStatusTransitionCreatePage.setChangeStatusAfter(days);
        await automatedStatusTransitionCreatePage.saveConfig();

        await automatedStatusTransitionConsole.clickAddAutomatedStatusTransitionBtn();
        await automatedStatusTransitionCreatePage.setName(configName);
        await automatedStatusTransitionCreatePage.setCompany('Petramco');
        await automatedStatusTransitionCreatePage.setFlowset('Human Resources');
        await automatedStatusTransitionCreatePage.setFromStatus('Resolved');
        await automatedStatusTransitionCreatePage.setToStatus('Closed');
        await automatedStatusTransitionCreatePage.setFromStatusReason('Auto Resolved');
        await automatedStatusTransitionCreatePage.setToStatusReason('No Further Action Required');
        await automatedStatusTransitionCreatePage.setChangeStatusAfter(days);
        await automatedStatusTransitionCreatePage.saveConfig();
        expect(await utilityCommon.isPopUpMessagePresent('Automated Status Configuration with same values already exists.')).toBeTruthy();
        await utilityCommon.closePopUpMessage();
        await automatedStatusTransitionCreatePage.clickCancelBtn();
        await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
    });

    it('[4101]: Automatic status transition of a case - Notification is sent to assignee', async () => {
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.deleteAutomatedCaseStatusTransition();

        //Create the case
        await apiHelper.apiLogin("qfeng");
        let caseData = require('../../data/ui/case/case.ui.json');
        let newCase = await apiHelper.createCase(caseData['bulkCaseAssignee_Assigned']);

        //Create the Automated status transition
        let configName: string = [...Array(7)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let days: any = Math.floor(Math.random() * 180) + 1;

        await automatedStatusTransitionConsole.clickAddAutomatedStatusTransitionBtn();
        await automatedStatusTransitionCreatePage.setName(configName);
        await automatedStatusTransitionCreatePage.setCompany('Petramco');
        await automatedStatusTransitionCreatePage.setFromStatus('Resolved');
        await automatedStatusTransitionCreatePage.setToStatus('Closed');
        await automatedStatusTransitionCreatePage.setFromStatusReason('Customer Follow-Up Required');
        await automatedStatusTransitionCreatePage.setChangeStatusAfter(days);
        await automatedStatusTransitionCreatePage.saveConfig();

        // //Update the case status to Resolved, update the modified date and run the Process
        await apiHelper.apiLogin("qkatawazi");

        await apiHelper.updateCaseStatus(newCase.id, "Resolved", "Customer Follow-Up Required");
        let updatecase = { "statusChangedDate": "2019-06-13T10:22:21.000Z" };
        await apiHelper.updateCase(newCase.id, updatecase);

        // await apiHelper.setDefaultNotificationForUser('qkatawazi', "Alert");
        await apiHelper.apiLogin("tadmin");
        await apiHelper.runAutomatedCaseTransitionProcess();

        await navigationPage.gotoCaseConsole();
        await utilityCommon.refresh(); // required to get alert notification
        await notificationPo.clickOnNotificationIcon();
        expect(await notificationPo.isAlertPresent('Tenant Admin changed the status of ' + newCase.displayId + ' to Closed')).toBeTruthy('Alert message is not present');
        await utilityCommon.closePopUpMessage();
    });

    //ankagraw
    it('[4100]: Automated case status transtion rule -Creation form validations', async () => {
        await navigationPage.signOut();
        await loginPage.login('jbarnes');

        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.deleteAutomatedCaseStatusTransition();

        let randomStr: string = [...Array(7)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let days: any = Math.floor(Math.random() * 180) + 1;
        await apiHelper.apiLogin('tadmin');

        let menuItemData = cloneDeep(SAMPLE_MENU_ITEM);
        let label = menuItemData.menuItemName + randomStr;
        menuItemData.menuItemName = label;
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.createNewMenuItem(menuItemData);
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Automated Status Transition', BWF_PAGE_TITLES.CASE_MANAGEMENT.AUTOMATED_STATUS_TRANSITION);
        await utilityGrid.selectLineOfBusiness('Human Resource');
        await automatedStatusTransitionConsole.clickAddAutomatedStatusTransitionBtn();

        expect(await automatedStatusTransitionCreatePage.isNameRequiredText()).toBeTruthy("Name Required text not present");
        expect(await automatedStatusTransitionCreatePage.isCompanyRequiredText()).toBeTruthy("Company Required text not present");
        expect(await automatedStatusTransitionCreatePage.isFromStatusRequiredText()).toBeTruthy("From Status Required text not present");
        expect(await automatedStatusTransitionCreatePage.isToStatusRequiredText()).toBeTruthy("To Status Required text not present");
        expect(await automatedStatusTransitionCreatePage.isChangeStatusAferRequiredText()).toBeTruthy("change Status Required text not present");
        expect(await automatedStatusTransitionCreatePage.isFromStatusEnabled()).toBeFalsy("From Status field Enabled");
        await automatedStatusTransitionCreatePage.setCompany('Petramco');
        await automatedStatusTransitionCreatePage.setFlowset('Human Resources');
        await automatedStatusTransitionCreatePage.setName(randomStr);
        expect(await automatedStatusTransitionCreatePage.isFromStatusEnabled()).toBeTruthy("From Status field disabled");
        await automatedStatusTransitionCreatePage.setFromStatus('Resolved');
        await automatedStatusTransitionCreatePage.setToStatus('Closed');
        await automatedStatusTransitionCreatePage.setFromStatusReason('Auto Resolved');
        await automatedStatusTransitionCreatePage.setToStatusReason('No Further Action Required');
        await automatedStatusTransitionCreatePage.setChangeStatusAfter(days);
        await automatedStatusTransitionCreatePage.setCategoryTier1Value('Employee Relations');
        await automatedStatusTransitionCreatePage.setCategoryTier2Value('Compensation');
        await automatedStatusTransitionCreatePage.setCategoryTier3Value('Bonus');
        await automatedStatusTransitionCreatePage.setCategoryTier4Value('Retention Bonus');
        await automatedStatusTransitionCreatePage.setLabelValue(label);
        await automatedStatusTransitionCreatePage.saveConfig();
    });
});
