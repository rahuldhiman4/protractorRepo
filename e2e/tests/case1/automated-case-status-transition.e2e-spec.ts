import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import { AUTO_STATUS_TRANSITION_MANDATORY_FIELDS } from '../../data/ui/case/automated-status-transition.data.ui';
import { UPDATE_CASE_STATUS_MODIFIED_DATE } from '../../data/ui/case/update.case.data.api';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import notificationPo from '../../pageobject/notification/notification.po';
import automatedStatusTransitionConsole from "../../pageobject/settings/case-management/automated-status-transition-console.po";
import automatedStatusTransitionCreatePage from "../../pageobject/settings/case-management/create-automated-status-config.po";
import automatedStatusTransitionEditPage from "../../pageobject/settings/case-management/edit-automated-status-config.po";
import { BWF_BASE_URL } from '../../utils/constants';
import utilCommon from '../../utils/util.common';
import utilGrid from '../../utils/util.grid';
import utilityCommon from '../../utils/utility.common';

describe('Automated Case Status Transition', () => {
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Automated Status Transition', 'Configure Automated Status Transitions - Business Workflows');
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    //asahitya
    describe('[DRDMV-17551]: Case business analyst - automatic case status transtion rule console', async () => {
        let configName1, configName2, randomStr = [...Array(7)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        it('[DRDMV-17551]: Create two records', async () => {
            //Create first Record
            configName1 = AUTO_STATUS_TRANSITION_MANDATORY_FIELDS.name = 'ConfigName1' + randomStr;
            AUTO_STATUS_TRANSITION_MANDATORY_FIELDS.changeStatusAfter = Math.floor(Math.random() * 180) + 1;
            await automatedStatusTransitionConsole.clickAddAutomatedStatusTransitionBtn();
            await automatedStatusTransitionCreatePage.createAutomatedStatusTransition(AUTO_STATUS_TRANSITION_MANDATORY_FIELDS);

            //Create Second Record
            configName2 = AUTO_STATUS_TRANSITION_MANDATORY_FIELDS.name = 'ConfigName2' + randomStr;
            AUTO_STATUS_TRANSITION_MANDATORY_FIELDS.changeStatusAfter = Math.floor(Math.random() * 180) + 1;
            await automatedStatusTransitionConsole.clickAddAutomatedStatusTransitionBtn();
            await automatedStatusTransitionCreatePage.createAutomatedStatusTransition(AUTO_STATUS_TRANSITION_MANDATORY_FIELDS);
            expect(await utilGrid.isGridRecordPresent(configName1)).toBeTruthy();
            await utilGrid.clearGridSearchBox();
            expect(await utilGrid.isGridRecordPresent(configName2)).toBeTruthy();
            await utilGrid.clearGridSearchBox();
            await utilGrid.addFilter("Name", configName1, 'text');
            expect(await utilGrid.isGridRecordPresent(configName1)).toBeTruthy();
        });
        it('[DRDMV-17551]: Case business analyst - automatic case status transtion rule console', async () => {
            await utilGrid.clearGridSearchBox();
            expect(await utilGrid.isGridRecordPresent(configName2)).toBeFalsy();
            await utilGrid.clearGridSearchBox();
            await utilGrid.clearFilter();
            await automatedStatusTransitionConsole.addGridColumns(['Category Tier 1', 'Category Tier 2', 'Category Tier 3', 'Category Tier 4', 'From Status Reason', 'ID', 'To Status Reason', 'Label']);
            expect(await automatedStatusTransitionConsole.areGridColumnMatches(['Name', 'Company', 'From Status', 'To Status', 'Days Inactive', 'Enabled', 'Flowset', 'Category Tier 1', 'Category Tier 2', 'Category Tier 3', 'Category Tier 4', 'From Status Reason', 'ID', 'To Status Reason', 'Label']))
            await automatedStatusTransitionConsole.removeGridColumns(['Category Tier 1', 'Category Tier 2', 'Category Tier 3', 'Category Tier 4', 'From Status Reason', 'ID', 'To Status Reason', 'Label']);
            await automatedStatusTransitionConsole.isGridColumnSorted('Days Inactive');

            await utilGrid.searchAndOpenHyperlink(configName1);
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
            await utilCommon.closeBladeOnSettings();
        });
    });

    //asahitya
    describe('[DRDMV-17553]: Case manager - automatic case status transtion rule console validations', async () => {
        let configName1, configName2, randomStr = [...Array(7)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            //Create first Record
            configName1 = AUTO_STATUS_TRANSITION_MANDATORY_FIELDS.name = 'ConfigName1' + randomStr;
            AUTO_STATUS_TRANSITION_MANDATORY_FIELDS.changeStatusAfter = Math.floor(Math.random() * 180) + 1;
            await automatedStatusTransitionConsole.clickAddAutomatedStatusTransitionBtn();
            await automatedStatusTransitionCreatePage.createAutomatedStatusTransition(AUTO_STATUS_TRANSITION_MANDATORY_FIELDS);

            //Create Second Record
            configName2 = AUTO_STATUS_TRANSITION_MANDATORY_FIELDS.name = 'ConfigName2' + randomStr;
            AUTO_STATUS_TRANSITION_MANDATORY_FIELDS.changeStatusAfter = Math.floor(Math.random() * 180) + 1;
            await automatedStatusTransitionConsole.clickAddAutomatedStatusTransitionBtn();
            await automatedStatusTransitionCreatePage.createAutomatedStatusTransition(AUTO_STATUS_TRANSITION_MANDATORY_FIELDS);
        });
        it('[DRDMV-17553]: Search and presence of existing rule test', async () => {
            await navigationPage.signOut();
            await loginPage.login('qdu');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Automated Status Transition', 'Configure Automated Status Transitions - Business Workflows');
            expect(await automatedStatusTransitionConsole.isAddAutomatedStatusTransitionBtnPresent()).toBeFalsy();
            await utilGrid.searchAndSelectGridRecord(configName1);
            expect(await automatedStatusTransitionConsole.isDeleteAutomatedStatusTransitionBtnPresent()).toBeFalsy();
            await automatedStatusTransitionConsole.openAutomatedTransitionConfig(configName1);
            expect(await automatedStatusTransitionEditPage.isAutomatedStatusTransitionNameEnabled()).toBeFalsy();
            expect(await automatedStatusTransitionEditPage.isAutomatedStatusTransitionSaveBtnEnabled()).toBeFalsy();
            await utilCommon.closeBladeOnSettings();
            //Search and presence of existing rule test
            expect(await utilGrid.isGridRecordPresent(configName1)).toBeTruthy();
            await utilGrid.clearGridSearchBox();
            expect(await utilGrid.isGridRecordPresent(configName2)).toBeTruthy();
            await utilGrid.clearGridSearchBox();
        });
        it('[DRDMV-17553]: Case manager - automatic case status transtion rule console validations', async () => {
            //Filter test
            await utilGrid.addFilter("Name", configName1, 'text');
            expect(await utilGrid.isGridRecordPresent(configName1)).toBeTruthy();
            await utilGrid.clearGridSearchBox();
            expect(await utilGrid.isGridRecordPresent(configName2)).toBeFalsy();
            await utilGrid.clearGridSearchBox();

            //Grid Column and sort test
            await utilGrid.clearFilter();
            await automatedStatusTransitionConsole.addGridColumns(['Category Tier 1', 'Category Tier 2', 'Category Tier 3', 'Category Tier 4', 'From Status Reason', 'ID', 'To Status Reason', 'Label']);
            expect(await automatedStatusTransitionConsole.areGridColumnMatches(['Name', 'Company', 'From Status', 'To Status', 'Days Inactive', 'Enabled', 'Flowset', 'Category Tier 1', 'Category Tier 2', 'Category Tier 3', 'Category Tier 4', 'From Status Reason', 'ID', 'To Status Reason', 'Label']))
            await automatedStatusTransitionConsole.removeGridColumns(['Category Tier 1', 'Category Tier 2', 'Category Tier 3', 'Category Tier 4', 'From Status Reason', 'ID', 'To Status Reason', 'Label']);
            await automatedStatusTransitionConsole.isGridColumnSorted('Days Inactive');
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Automated Status Transition', 'Configure Automated Status Transitions - Business Workflows');
        });
    });

    //asahitya
    it('[DRDMV-17561]: Toggle status for Automatic case status transition configuration rule', async () => {
        AUTO_STATUS_TRANSITION_MANDATORY_FIELDS.name = [...Array(7)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        AUTO_STATUS_TRANSITION_MANDATORY_FIELDS.changeStatusAfter = Math.floor(Math.random() * 180) + 1;
        await automatedStatusTransitionConsole.clickAddAutomatedStatusTransitionBtn();
        await automatedStatusTransitionCreatePage.createAutomatedStatusTransition(AUTO_STATUS_TRANSITION_MANDATORY_FIELDS);

        await utilGrid.searchAndOpenHyperlink(AUTO_STATUS_TRANSITION_MANDATORY_FIELDS.name);
        await automatedStatusTransitionEditPage.selectEnableToggle(false);
        await automatedStatusTransitionEditPage.saveConfiguration();
        expect(await automatedStatusTransitionConsole.getEnabledColumnValueOfRule(AUTO_STATUS_TRANSITION_MANDATORY_FIELDS.name)).toBe('False');

        await utilGrid.searchAndOpenHyperlink(AUTO_STATUS_TRANSITION_MANDATORY_FIELDS.name);
        await automatedStatusTransitionEditPage.selectEnableToggle(true);
        await automatedStatusTransitionEditPage.saveConfiguration();
        expect(await automatedStatusTransitionConsole.getEnabledColumnValueOfRule(AUTO_STATUS_TRANSITION_MANDATORY_FIELDS.name)).toBe('True');
    });

    it('[DRDMV-17557]: Duplicate detection - create new automatic case transition rule which has field values same as existing rule', async () => {
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

        expect(await utilCommon.isPopUpMessagePresent('ERROR (10000): Automated Status Configuration with same values already exists.')).toBeTruthy();
        await utilCommon.closePopUpMessage();
        await automatedStatusTransitionCreatePage.clickOCancelBtn();
        await utilCommon.clickOnWarningOk();
    });

    it('[DRDMV-17566]: Automatic status transition of a case - Notification is sent to assignee', async () => {
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

        //Update the case status to Resolved, update the modified date and run the Process
        await apiHelper.apiLogin("qkatawazi");

        await apiHelper.updateCaseStatus(newCase.id, "Resolved", "Customer Follow-Up Required");
        await apiHelper.updateCase(newCase.id, UPDATE_CASE_STATUS_MODIFIED_DATE);
        await apiHelper.apiLogin("tadmin");
        await apiHelper.setDefaultNotificationForUser('qkatawazi', "Alert");
        await apiHelper.runAutomatedCaseTransitionProcess();

        await navigationPage.gotoCaseConsole();
        await utilityCommon.refresh(); // required to get alert notification
        await notificationPo.clickOnNotificationIcon();
        expect(await notificationPo.isAlertPresent('tadmin Tenant Administrator changed the status of ' + newCase.displayId + ' to Closed')).toBeTruthy('Alert message is not present');
        await utilCommon.closePopUpMessage();
    });

    //ankagraw
    it('[DRDMV-17567]: Automated case status transtion rule -Creation form validations', async () => {
        let randomStr: string = [...Array(7)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let days: any = Math.floor(Math.random() * 180) + 1;
        let menuItemDataFile = require('../../data/ui/ticketing/menuItem.ui.json');
        await apiHelper.apiLogin('tadmin');
        await apiHelper.associateCategoryToCategory('Bonus', 'Failure');

        let label = await menuItemDataFile['sampleMenuItem'].menuItemName + randomStr;
        menuItemDataFile['sampleMenuItem'].menuItemName = label;
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.createNewMenuItem(menuItemDataFile['sampleMenuItem']);
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Automated Status Transition', 'Configure Automated Status Transitions - Business Workflows');
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
        await automatedStatusTransitionCreatePage.setCategoryTier4Value('Failure');
        await automatedStatusTransitionCreatePage.setLabelValue(label);
        await automatedStatusTransitionCreatePage.saveConfig();
    });
});
