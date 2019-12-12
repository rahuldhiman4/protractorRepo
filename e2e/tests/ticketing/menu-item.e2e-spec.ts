import { browser } from "protractor";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import editMenuItemsConfigPo from '../../pageobject/settings/application-config/edit-menu-items-config.po';
import utilCommon from '../../utils/util.common';

describe('Case Status Change', () => {
    beforeAll(async () => {
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa');
        await loginPage.login('qkatawazi');
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    afterEach(async () => {
        await browser.refresh();
        await utilCommon.waitUntilSpinnerToHide();
    });

    //kgaikwad
    it('DRDMV-17650: The Menu Items View would be re-arranged so that fields are in Proper sequence.', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Application Configuration--Menu Items', 'Menu Items - Business Workflows');
        await editMenuItemsConfigPo.clickOnMenuOptionLink();
        await utilCommon.selectDropDown('da9b9818-7b4c-43ec-9c4b-41e0cda49b8d','Label');
        await utilCommon.selectDropDown('da9b9818-7b4c-43ec-9c4b-41e0cda49b8d','Resolution Code');
        await utilCommon.selectDropDown('da9b9818-7b4c-43ec-9c4b-41e0cda49b8d','Source');
        expect(await editMenuItemsConfigPo.isMenuNameDropDownPresence()).toBeTruthy('MenuName Drop down is missing');
        expect(await editMenuItemsConfigPo.isMenuOptionTextBoxPresence()).toBeTruthy('MenuOption text box is missing');
        expect(await editMenuItemsConfigPo.isStatusDropDownPresence()).toBeTruthy('status Drop down is missing');
        await utilCommon.selectDropDown('a548d907-8c6b-46ab-bc83-88a5310e04b7','Active');
        await utilCommon.selectDropDown('a548d907-8c6b-46ab-bc83-88a5310e04b7','Inactive');
        await utilCommon.selectDropDown('a548d907-8c6b-46ab-bc83-88a5310e04b7','Deprecated');
        expect(await editMenuItemsConfigPo.isToggleButtonPresence()).toBeTruthy('Toggle Button is missing');
    });
})