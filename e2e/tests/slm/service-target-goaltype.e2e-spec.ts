import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import createGoalType from '../../pageobject/settings/slm/create-goal-type.po';
import editGoalType from '../../pageobject/settings/slm/edit-goal-type.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilCommon from '../../utils/util.common';
import utilGrid from '../../utils/util.grid';
import utilityCommon from '../../utils/utility.common';

var caseBAUser = 'qkatawazi';

describe('Service Level Management - Goal Type Tests', () => {
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login(caseBAUser);
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteApprovalMapping();
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    beforeEach(async () => {
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteServiceTargets();
    });

    afterEach(async () => {
        await utilityCommon.refresh();
    });

    //skhobrag
    it('[DRDMV-2247,DRDMV-2248]:SLM - Goal Type - Create new record', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let goalTypeTitle = 'New Goal Type' + randomStr;
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Service Level Management--Goal Type', 'Goal Type');

        //when SVT created with only mandatory details
        await createGoalType.clickCreateGoalTypeConfigButton();
        await createGoalType.enterGoalTypeName(goalTypeTitle);
        expect(await createGoalType.isGoalTypeDisabled()).toBeTruthy('Goal Type field is enabled.');
        createGoalType.selectGoalTypeStatus('Active');
        createGoalType.clickSaveGoalTypeButton();
        await browser.sleep(1000);
        expect(await utilCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');

        await utilGrid.searchAndOpenHyperlink(goalTypeTitle);
        await browser.sleep(1000);
        expect(await editGoalType.isGoalTypeFieldDisabled()).toBeTruthy('Goal Type field is enabled.');
        expect(await editGoalType.isGoalTypeNameFieldDisabled()).toBeTruthy('Goal Type Name field is enabled.');
        expect(await editGoalType.isSaveButtonDisabled()).toBeTruthy('Save button is enabled.');
        expect(await editGoalType.getGoalTypeFieldValue()).toBe('Request-Based');
        expect(await editGoalType.getStatusDropDownFieldValue()).toBe('Active');
        await editGoalType.selectGoalTypeStatus('Inactive');
        await editGoalType.clickSaveGoalTypeButton();
        await browser.sleep(1000);
        expect(await utilCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
        await utilGrid.searchAndOpenHyperlink(goalTypeTitle);
        expect(await editGoalType.getStatusDropDownFieldValue()).toBe('Inactive');
    }, 550 * 1000);

    //skhobrag
    it('[DRDMV-2282]:SLM - Goal Type - Error and Warning Messages', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let goalTypeTitle = 'New Goal Type' + randomStr;

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Service Level Management--Goal Type', 'Goal Type');

        //when Goal Type created with mandatory details
        await createGoalType.clickCreateGoalTypeConfigButton();
        await createGoalType.enterGoalTypeName(goalTypeTitle);
        expect(await createGoalType.isGoalTypeDisabled()).toBeTruthy('Goal Type field is enabled.');
        createGoalType.selectGoalTypeStatus('Active');
        createGoalType.clickSaveGoalTypeButton();
        await browser.sleep(1000);
        expect(await utilCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');

        await utilGrid.searchAndOpenHyperlink(goalTypeTitle);
        await browser.sleep(1000);
        expect(await editGoalType.isGoalTypeFieldDisabled()).toBeTruthy('Goal Type field is enabled.');
        expect(await editGoalType.isGoalTypeNameFieldDisabled()).toBeTruthy('Goal Type Name field is enabled.');
        expect(await editGoalType.isSaveButtonDisabled()).toBeTruthy('Save button is enabled.');
        expect(await editGoalType.getGoalTypeFieldValue()).toBe('Request-Based');
        expect(await editGoalType.getStatusDropDownFieldValue()).toBe('Active');
        await editGoalType.selectGoalTypeStatus('Inactive');
        await editGoalType.clickCloseGoalTypeButton();
        await browser.sleep(1000);
        expect(await utilCommon.isWarningDialogBoxDisplayed()).toBeTruthy('Warning Dialog Box is not displayed.');
        expect(await utilCommon.getWarningDialogTitle()).toBe('Warning!');
        expect(await utilCommon.getWarningDialogMsg()).toBe('You have unsaved data. Do you want to continue without saving?');
        await utilCommon.clickOnWarningOk();

        //when Goal Type created with mandatory details
        await createGoalType.clickCreateGoalTypeConfigButton();
        await createGoalType.enterGoalTypeName(goalTypeTitle);
        expect(await createGoalType.isGoalTypeDisabled()).toBeTruthy('Goal Type field is enabled.');
        createGoalType.selectGoalTypeStatus('Active');
        createGoalType.clickSaveGoalTypeButton();
        await browser.sleep(1000);
        expect(await utilCommon.isPopUpMessagePresent('ERROR (382): The value(s) for this entry violate a unique index that has been defined for this record definition.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
    }, 300 * 1000);

})
