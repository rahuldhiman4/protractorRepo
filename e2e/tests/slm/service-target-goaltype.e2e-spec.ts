import utilityGrid from '../../utils/utility.grid';
import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import createGoalType from '../../pageobject/settings/slm/create-goal-type.po';
import editGoalType from '../../pageobject/settings/slm/edit-goal-type.po';
import goalTypeConsole from '../../pageobject/settings/slm/goal-type-config-console.po';
import { BWF_BASE_URL, BWF_PAGE_TITLES } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';

let caseBAUser = 'qkatawazi';

describe('Service Level Management - Goal Type Tests', () => {
    const caseModule = 'Case';
    let goalTypeConsoleGUID: '781a6488-ff08-481b-86c7-7c78c577357b';

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login(caseBAUser);
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteApprovalMapping(caseModule);
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    //skhobrag
    describe('[6039,6038,6040,6041]: SLM - Goal Type - Create new record', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let goalTypeTitle = 'New Goal Type' + randomStr;
        it('[6039,6038,6040,6041]: Create a Goal Type', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Goal Type', BWF_PAGE_TITLES.SERVICE_LEVEL_MANAGEMENT.GOAL_TYPE);
            await createGoalType.clickCreateGoalTypeConfigButton();
            await createGoalType.enterGoalTypeName(goalTypeTitle);
            // expect(await createGoalType.isGoalTypeDisabled()).toBeTruthy('Goal Type field is enabled.');
            await createGoalType.selectGoalTypeStatus('Active');
            await createGoalType.clickSaveGoalTypeButton();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
        });
        it('[6039,6038,6040,6041]: Update Goal Type and Verify the details', async () => {
            await utilityGrid.searchAndOpenHyperlink(goalTypeTitle);
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
            expect(await utilityCommon.getWarningDialogMsg()).toBe('You have unsaved data. Do you want to continue without saving?');
            await utilityCommon.clickOnApplicationWarningYesNoButton('No');
            expect(await editGoalType.isGoalTypeFieldDisabled()).toBeTruthy('Goal Type field is enabled.');
            await editGoalType.clickSaveGoalTypeButton();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
            await utilityGrid.searchAndOpenHyperlink(goalTypeTitle);
            expect(await editGoalType.getStatusDropDownFieldValue()).toBe('Inactive');
            await utilityCommon.closeAllBlades();
        });
        it('[6039,6038,6040,6041]: Verify if SVT Goal Type is accessible to same LOB Case Manager', async () => {
            await navigationPage.signOut();
            await loginPage.login('qdu');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Goal Type', BWF_PAGE_TITLES.SERVICE_LEVEL_MANAGEMENT.GOAL_TYPE);
            expect(await utilityGrid.isGridRecordPresent(goalTypeTitle)).toBeTruthy('SVT Goal Type is displayed to same LOB with different company Case BA.');
        });
        it('[6039,6038,6040,6041]: Verify if SVT Goal Type  is accessible to different LOB Case BA', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Goal Type', BWF_PAGE_TITLES.SERVICE_LEVEL_MANAGEMENT.GOAL_TYPE);
            expect(await utilityGrid.isGridRecordPresent(goalTypeTitle)).toBeFalsy('SVT Goal Type is dispayed to different LOB case BA');
        });
        it('[6039,6038,6040,6041]: Verify if SVT Goal Type is accessible to different LOB Case Manager', async () => {
            await navigationPage.signOut();
            await loginPage.login('frieda');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Goal Type', BWF_PAGE_TITLES.SERVICE_LEVEL_MANAGEMENT.GOAL_TYPE);
            expect(await utilityGrid.isGridRecordPresent(goalTypeTitle)).toBeFalsy('SVT Goal Type is dispayed to different LOB case manager');
        });
        it('[6039,6038,6040,6041]: Verify if SVT Goal Type is accessible to Case BA belonging to different company with same LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('gwixillian');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Goal Type', BWF_PAGE_TITLES.SERVICE_LEVEL_MANAGEMENT.GOAL_TYPE);
            expect(await utilityGrid.isGridRecordPresent(goalTypeTitle)).toBeTruthy('SVT Goal Type is not dispayed to same LOB and different company case BA');
        });
        it('[6039,6038,6040,6041]: Verify if SVT Goal Type is accessible to Case Manager user having access to multiple LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('qyuan');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Goal Type', BWF_PAGE_TITLES.SERVICE_LEVEL_MANAGEMENT.GOAL_TYPE);
            await utilityGrid.selectLineOfBusiness('Human Resource');
            expect(await utilityGrid.isGridRecordPresent(goalTypeTitle)).toBeTruthy('SVT Goal Type is dispayed to user with multiple LOB case manager');
            await utilityGrid.selectLineOfBusiness('Facilities');
            expect(await utilityGrid.isGridRecordPresent(goalTypeTitle)).toBeFalsy('SVT Goal Type is not dispayed to user with multiple LOB case manager');
        });
        it('[6039,6038,6040,6041]: Verify if SVT Goal Type is accessible to Case BA user having access to multiple LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('jbarnes');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Goal Type', BWF_PAGE_TITLES.SERVICE_LEVEL_MANAGEMENT.GOAL_TYPE);
            await utilityGrid.selectLineOfBusiness('Human Resource');
            expect(await utilityGrid.isGridRecordPresent(goalTypeTitle)).toBeTruthy('SVT Goal Type is dispayed to user with multiple LOB case manager');
            await utilityGrid.selectLineOfBusiness('Facilities');
            expect(await utilityGrid.isGridRecordPresent(goalTypeTitle)).toBeFalsy('SVT Goal Type is not dispayed to user with multiple LOB case manager');
            await utilityGrid.selectLineOfBusiness('Human Resource');
            await utilityGrid.searchAndOpenHyperlink(goalTypeTitle);
            await editGoalType.selectGoalTypeStatus('Active');
            await editGoalType.clickSaveGoalTypeButton();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
        });
        it('[6039,6038,6040,6041]: create same name record in same LOB', async () => {
            await createGoalType.clickCreateGoalTypeConfigButton();
            await createGoalType.enterGoalTypeName(goalTypeTitle);
            await createGoalType.selectGoalTypeStatus('Active');
            await createGoalType.clickSaveGoalTypeButton();
            expect(await utilityCommon.isPopUpMessagePresent('A goal with the specified name already exists. Specify a different goal name')).toBeTruthy('Record saved successfully confirmation message not displayed.');
            await utilityCommon.closePopUpMessage();
            await createGoalType.clickCloseGoalTypeButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
            //on update verification is not possible since goal type name field is disabled on edit.
        });
        it('[6039,6038,6040,6041]: create same name record in different LOB', async () => {
            await utilityGrid.selectLineOfBusiness('Facilities');
            await createGoalType.clickCreateGoalTypeConfigButton();
            await createGoalType.enterGoalTypeName(goalTypeTitle);
            await createGoalType.selectGoalTypeStatus('Active');
            await createGoalType.clickSaveGoalTypeButton();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
            await utilityCommon.closePopUpMessage();
            expect(await utilityGrid.isGridRecordPresent(goalTypeTitle)).toBeTruthy('SVT Goal Type is dispayed to user with multiple LOB case manager');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    //skhobrag
    describe('[6035]: SLM - Goal Type - Error and Warning Messages', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let goalTypeTitle = 'New Goal Type' + randomStr;
        it('[6035]: Create Goal Type', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Goal Type', BWF_PAGE_TITLES.SERVICE_LEVEL_MANAGEMENT.GOAL_TYPE);
            await createGoalType.clickCreateGoalTypeConfigButton();
            await createGoalType.enterGoalTypeName(goalTypeTitle);
            expect(await createGoalType.isGoalTypeDisabled()).toBeTruthy('Goal Type field is enabled.');
            await createGoalType.selectGoalTypeStatus('Active');
            await createGoalType.clickSaveGoalTypeButton();
            await browser.sleep(2000); // sleep added for pop up message display since it takes some time to get pop up there
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
        });

        it('[6035]: Update Goal Type and Verify warning message appears', async () => {
            await utilityGrid.searchAndOpenHyperlink(goalTypeTitle);
            expect(await editGoalType.isGoalTypeFieldDisabled()).toBeTruthy('Goal Type field is enabled.');
            expect(await editGoalType.isGoalTypeNameFieldDisabled()).toBeTruthy('Goal Type Name field is enabled.');
            expect(await editGoalType.isSaveButtonDisabled()).toBeTruthy('Save button is enabled.');
            expect(await editGoalType.getGoalTypeFieldValue()).toBe('Request-Based');
            expect(await editGoalType.getStatusDropDownFieldValue()).toBe('Active');
            await editGoalType.selectGoalTypeStatus('Inactive');
            await editGoalType.clickCloseGoalTypeButton();
            expect(await utilityCommon.isWarningDialogBoxDisplayed()).toBeTruthy('Warning Dialog Box is not displayed.');
            expect(await utilityCommon.getWarningDialogTitle()).toContain('Warning');
            expect(await utilityCommon.getWarningDialogMsg()).toBe('You have unsaved data. Do you want to continue without saving?');
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
            await browser.sleep(2000); // sleep added for pop up message display since it takes some time to get pop up there
        });

        it('[6035]: Create Goal Type with Save Title and verify error message', async () => {
            await createGoalType.clickCreateGoalTypeConfigButton();
            await createGoalType.enterGoalTypeName(goalTypeTitle);
            expect(await createGoalType.isGoalTypeDisabled()).toBeTruthy('Goal Type field is enabled.');
            await createGoalType.selectGoalTypeStatus('Active');
            await createGoalType.clickSaveGoalTypeButton();
            await browser.sleep(2000); // sleep added for pop up message display since it takes some time to get pop up there
            expect(await utilityCommon.isPopUpMessagePresent('A goal with the specified name already exists. Specify a different goal name')).toBeTruthy('Record saved successfully confirmation message not displayed.');
            await utilityCommon.closePopUpMessage();
            createGoalType.clickCloseGoalTypeButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        });
    });

    //skhobrag
    describe('[6037]: SLM - Goal Type - Console', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let defaultGoalTypeColumns: string[] = ["Goal Type Name", "Goal Type", "Status"];
        let goalTypeColumns: string[] = ["ID"];
        let goalTypeTitle = 'New Goal Type' + randomStr;
        it('[6037]: Create a Goal Type', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Goal Type', BWF_PAGE_TITLES.SERVICE_LEVEL_MANAGEMENT.GOAL_TYPE);
            await createGoalType.clickCreateGoalTypeConfigButton();
            await createGoalType.enterGoalTypeName(goalTypeTitle);
            expect(await createGoalType.isGoalTypeDisabled()).toBeTruthy('Goal Type field is enabled.');
            await createGoalType.selectGoalTypeStatus('Inactive');
            await createGoalType.clickSaveGoalTypeButton();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
            await utilityCommon.closePopUpMessage();
        });
        it('[6037]: Update Goal Type and Verify the details', async () => {
            await goalTypeConsole.addColumns(goalTypeColumns);
            await goalTypeConsole.searchOnGridConsole(goalTypeTitle);
            let goalTypeGUID = await utilityGrid.getFirstGridRecordColumnValue('GUID');
            await utilityGrid.clearFilter();
            await utilityGrid.clearSearchBox();
            expect(await goalTypeConsole.isGridColumnSorted('Goal Type Name', 'ascending')).toBeTruthy('Goal Type Name Column is not sorted in ascending order');
            expect(await goalTypeConsole.isGridColumnSorted('Goal Type Name', 'descending')).toBeTruthy('Goal Type Name Column is not sorted in descending order');
            await goalTypeConsole.clickRefreshIcon();
            expect(await goalTypeConsole.isGridColumnSorted('Goal Type', 'ascending')).toBeTruthy('Goal Type Column is not sorted in ascending order');
            expect(await goalTypeConsole.isGridColumnSorted('Goal Type', 'descending')).toBeTruthy('Goal Type Column is not sorted in descending order');
            // These steps need to confirm as status column is not working on sort order

            // await goalTypeConsole.clickRefreshIcon();
            // expect(await goalTypeConsole.isGridColumnSorted('Status', 'asc')).toBeTruthy('Status Column is not sorted in ascending order');
            // expect(await goalTypeConsole.isGridColumnSorted('Status', 'desc')).toBeTruthy('Status Column is not sorted in descending order');
            await goalTypeConsole.clickRefreshIcon();
            expect(await goalTypeConsole.isGridRecordDisplayed(goalTypeTitle)).toBeTruthy('Goal Type Name record is not searched.');

            // Steps commented to confirm the behavior here since the search functionality is not working for below commented options   

            // await goalTypeConsole.clickRefreshIcon();
            // expect(await goalTypeConsole.isGridRecordDisplayed('Request-Based')).toBeTruthy('Goal Type record is not searched.');

            // await goalTypeConsole.clickRefreshIcon();
            // expect(await goalTypeConsole.isGridRecordDisplayed('Inactive')).toBeTruthy('Goal Type status record is not searched.');

            await goalTypeConsole.clickRefreshIcon();
            expect(await goalTypeConsole.isGridRecordDisplayed(goalTypeGUID)).toBeTruthy('Goal Type GUID record is not searched.');

            await utilityGrid.clearSearchBox();
            await goalTypeConsole.clickRefreshIcon();
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('Goal Type Name', goalTypeTitle, 'text', goalTypeConsoleGUID);
            expect(await utilityGrid.isGridRecordPresent(goalTypeTitle)).toBeTruthy('Goal Type Name record is not searched.');

            await utilityGrid.clearSearchBox();
            await utilityGrid.clearFilter();
            await goalTypeConsole.clickRefreshIcon();
            await utilityGrid.addFilter('Status', 'Inactive', 'checkbox', goalTypeConsoleGUID);
            expect(await utilityGrid.isGridRecordPresent(goalTypeTitle)).toBeTruthy('Goal Type Status record is not searched.');

            await utilityGrid.clearSearchBox();
            await utilityGrid.clearFilter();
            await goalTypeConsole.clickRefreshIcon();
            await utilityGrid.addFilter('ID', goalTypeGUID, 'text', goalTypeConsoleGUID);
            expect(await utilityGrid.isGridRecordPresent(goalTypeTitle)).toBeTruthy('Goal Type GUID record is not searched.');

            await utilityGrid.clearSearchBox();
            await utilityGrid.clearFilter();
            await goalTypeConsole.clickRefreshIcon();
            await utilityGrid.addFilter('Goal Type', 'Request-Based', 'checkbox');
            expect(await utilityGrid.isGridRecordPresent(goalTypeTitle)).toBeTruthy('Goal Type record is not searched.');
            await goalTypeConsole.removeColumns(goalTypeColumns);
        });
    });
});
