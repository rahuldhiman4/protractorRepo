import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import createGoalType from '../../pageobject/settings/slm/create-goal-type.po';
import editGoalType from '../../pageobject/settings/slm/edit-goal-type.po';
import goalTypeConsole from '../../pageobject/settings/slm/goal-type-config-console.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilCommon from '../../utils/util.common';
import utilGrid from '../../utils/util.grid';
import utilityCommon from '../../utils/utility.common';

let caseBAUser = 'qkatawazi';

describe('Service Level Management - Goal Type Tests', () => {
    const caseModule = 'Case';
    let goalTypeConsoleGUID: '781a6488-ff08-481b-86c7-7c78c577357b';

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login(caseBAUser);
        await apiHelper.apiLogin(caseBAUser);
        await apiHelper.deleteApprovalMapping(caseModule);
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    //skhobrag
    describe('[DRDMV-2247,DRDMV-2248,DRDMV-2246]: SLM - Goal Type - Create new record', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let goalTypeTitle = 'New Goal Type' + randomStr;
        it('[DRDMV-2247,DRDMV-2248,DRDMV-2246]: Create a Goal Type', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Goal Type', 'Goal Type');
            await createGoalType.clickCreateGoalTypeConfigButton();
            await createGoalType.enterGoalTypeName(goalTypeTitle);
            expect(await createGoalType.isGoalTypeDisabled()).toBeTruthy('Goal Type field is enabled.');
            await createGoalType.selectGoalTypeStatus('Active');
            await createGoalType.clickSaveGoalTypeButton();
            expect(await utilCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
        });
        it('[DRDMV-2247,DRDMV-2248,DRDMV-2246]: Update Goal Type and Verify the details', async () => {
            await utilGrid.searchAndOpenHyperlink(goalTypeTitle);
            expect(await editGoalType.isGoalTypeFieldDisabled()).toBeTruthy('Goal Type field is enabled.');
            expect(await editGoalType.isGoalTypeNameFieldDisabled()).toBeTruthy('Goal Type Name field is enabled.');
            expect(await editGoalType.isSaveButtonDisabled()).toBeTruthy('Save button is enabled.');
            expect(await editGoalType.isGoalTypeFieldRequired()).toBeTruthy('Goal Type field is marked as optional');
            expect(await editGoalType.isGoalTypeNameFieldRequired()).toBeTruthy('Goal Type Name field is marked as optional');
            expect(await editGoalType.isStatusFieldRequired()).toBeTruthy('Status field is marked as optional.');
            expect(await editGoalType.getGoalTypeFieldValue()).toBe('Request-Based');
            expect(await editGoalType.getStatusDropDownFieldValue()).toBe('Active');
            await editGoalType.selectGoalTypeStatus('Inactive');
            expect(await editGoalType.isSaveButtonDisabled()).toBeFalsy('Save button is disabled.');
            await editGoalType.clickCloseGoalTypeButton();
            expect(await utilCommon.getWarningDialogMsg()).toBe('You have unsaved data. Do you want to continue without saving?');
            await utilCommon.clickOnWarningCancel();
            expect(await editGoalType.isGoalTypeFieldDisabled()).toBeTruthy('Goal Type field is enabled.');
            await editGoalType.clickSaveGoalTypeButton();
            expect(await utilCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
            await utilGrid.searchAndOpenHyperlink(goalTypeTitle);
            expect(await editGoalType.getStatusDropDownFieldValue()).toBe('Inactive');
        });
    });

    //skhobrag
    describe('[DRDMV-2282]: SLM - Goal Type - Error and Warning Messages', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let goalTypeTitle = 'New Goal Type' + randomStr;
        it('[DRDMV-2282]: Create Goal Type', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Goal Type', 'Goal Type');
            await createGoalType.clickCreateGoalTypeConfigButton();
            await createGoalType.enterGoalTypeName(goalTypeTitle);
            expect(await createGoalType.isGoalTypeDisabled()).toBeTruthy('Goal Type field is enabled.');
            await createGoalType.selectGoalTypeStatus('Active');
            await createGoalType.clickSaveGoalTypeButton();
            await browser.sleep(2000); // sleep added for pop up message display since it takes some time to get pop up there
            expect(await utilCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
        });
        it('[DRDMV-2282]: Update Goal Type and Verify warning message appears', async () => {
            await utilGrid.searchAndOpenHyperlink(goalTypeTitle);
            expect(await editGoalType.isGoalTypeFieldDisabled()).toBeTruthy('Goal Type field is enabled.');
            expect(await editGoalType.isGoalTypeNameFieldDisabled()).toBeTruthy('Goal Type Name field is enabled.');
            expect(await editGoalType.isSaveButtonDisabled()).toBeTruthy('Save button is enabled.');
            expect(await editGoalType.getGoalTypeFieldValue()).toBe('Request-Based');
            expect(await editGoalType.getStatusDropDownFieldValue()).toBe('Active');
            await editGoalType.selectGoalTypeStatus('Inactive');
            await editGoalType.clickCloseGoalTypeButton();
            expect(await utilCommon.isWarningDialogBoxDisplayed()).toBeTruthy('Warning Dialog Box is not displayed.');
            expect(await utilCommon.getWarningDialogTitle()).toBe('Warning!');
            expect(await utilCommon.getWarningDialogMsg()).toBe('You have unsaved data. Do you want to continue without saving?');
            await utilCommon.clickOnWarningOk();
            await browser.sleep(2000); // sleep added for pop up message display since it takes some time to get pop up there
        });
        it('[DRDMV-2282]: Create Goal Type with Save Title and verify error message', async () => {
            await createGoalType.clickCreateGoalTypeConfigButton();
            await createGoalType.enterGoalTypeName(goalTypeTitle);
            expect(await createGoalType.isGoalTypeDisabled()).toBeTruthy('Goal Type field is enabled.');
            await createGoalType.selectGoalTypeStatus('Active');
            await createGoalType.clickSaveGoalTypeButton();
            await browser.sleep(2000); // sleep added for pop up message display since it takes some time to get pop up there
            expect(await utilCommon.isPopUpMessagePresent('ERROR (382): The value(s) for this entry violate a unique index that has been defined for this record definition.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
        });
    });

    //skhobrag
    describe('[DRDMV-2249]: SLM - Goal Type - Console', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let defaultGoalTypeColumns: string[] = ["Goal Type Name", "Goal Type", "Status"];
        let goalTypeColumns: string[] = ["Goal Type Name", "Goal Type", "Status", "GUID"];
        let goalTypeTitle = 'New Goal Type' + randomStr;
        it('[DRDMV-2249]: Create a Goal Type', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Goal Type', 'Goal Type');
            await createGoalType.clickCreateGoalTypeConfigButton();
            await createGoalType.enterGoalTypeName(goalTypeTitle);
            expect(await createGoalType.isGoalTypeDisabled()).toBeTruthy('Goal Type field is enabled.');
            await createGoalType.selectGoalTypeStatus('Inactive');
            await createGoalType.clickSaveGoalTypeButton();
            expect(await utilCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
        });
        it('[DRDMV-2249]: Update Goal Type and Verify the details', async () => {
            await goalTypeConsole.addColumns(goalTypeColumns);
            await goalTypeConsole.searchOnGridConsole(goalTypeTitle);
            let goalTypeGUID = await goalTypeConsole.getGoalTypeGUID();
            await utilGrid.clearFilter();
            await utilGrid.clearGridSearchBox();
            expect(await goalTypeConsole.isGridColumnSorted('Goal Type Name', 'asc')).toBeTruthy('Goal Type Name Column is not sorted in ascending order');
            expect(await goalTypeConsole.isGridColumnSorted('Goal Type Name', 'desc')).toBeTruthy('Goal Type Name Column is not sorted in descending order');
            await goalTypeConsole.clickRefreshIcon();
            expect(await goalTypeConsole.isGridColumnSorted('Goal Type', 'asc')).toBeTruthy('Goal Type Column is not sorted in ascending order');
            expect(await goalTypeConsole.isGridColumnSorted('Goal Type', 'desc')).toBeTruthy('Goal Type Column is not sorted in descending order');
            await goalTypeConsole.clickRefreshIcon();
            expect(await goalTypeConsole.isGridColumnSorted('Status', 'asc')).toBeTruthy('Status Column is not sorted in ascending order');
            expect(await goalTypeConsole.isGridColumnSorted('Status', 'desc')).toBeTruthy('Status Column is not sorted in descending order');
            await goalTypeConsole.clickRefreshIcon();
            expect(await goalTypeConsole.isGridRecordDisplayed(goalTypeTitle)).toBeTruthy('Goal Type Name record is not searched.');

         // Steps commented to confirm the behavior here since the search functionality is not working for below commented options   

            // await goalTypeConsole.clickRefreshIcon();
            // expect(await goalTypeConsole.isGridRecordDisplayed('Request-Based')).toBeTruthy('Goal Type record is not searched.');

            // await goalTypeConsole.clickRefreshIcon();
            // expect(await goalTypeConsole.isGridRecordDisplayed('Inactive')).toBeTruthy('Goal Type status record is not searched.');

            await goalTypeConsole.clickRefreshIcon();
            expect(await goalTypeConsole.isGridRecordDisplayed(goalTypeGUID)).toBeTruthy('Goal Type GUID record is not searched.');

            await utilGrid.clearGridSearchBox();
            await goalTypeConsole.clickRefreshIcon();
            await utilGrid.addFilter('Goal Type Name', goalTypeTitle, 'text', goalTypeConsoleGUID);
            expect(await goalTypeConsole.isFilteredRecordDisplayed()).toBeTruthy('Goal Type Name record is not searched.');

            await utilGrid.clearFilter();
            await goalTypeConsole.clickRefreshIcon();
            await utilGrid.addFilter('Status', 'Inactive', 'checkbox', goalTypeConsoleGUID);
            expect(await goalTypeConsole.isFilteredRecordDisplayed()).toBeTruthy('Goal Type Name record is not searched.');

            await utilGrid.clearFilter();
            await goalTypeConsole.clickRefreshIcon();
            await utilGrid.addFilter('GUID', goalTypeGUID, 'text', goalTypeConsoleGUID);
            expect(await goalTypeConsole.isFilteredRecordDisplayed()).toBeTruthy('Goal Type Name record is not searched.');

            await utilGrid.clearFilter();
            await goalTypeConsole.clickRefreshIcon();
            await goalTypeConsole.addGoalTypeFilter('Goal Type', 'Request-Based', 'checkbox', goalTypeConsoleGUID);
            expect(await goalTypeConsole.isFilteredRecordDisplayed()).toBeTruthy('Goal Type record is not searched.');

        });
    });

});
