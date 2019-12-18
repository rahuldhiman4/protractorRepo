import { browser } from "protractor";
import localizeValuePopPo from '../../pageobject/common/localize-value-pop.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import createMenuItems from '../../pageobject/settings/application-config/create-menu-items-blade.po';
import editMenuItemsConfigPo from '../../pageobject/settings/application-config/edit-menu-items-config.po';
import menuItemsConfigConsolePo from '../../pageobject/settings/application-config/menu-items-config-console.po';
import utilCommon from '../../utils/util.common';


describe('Menu Item', () => {
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
        await createMenuItems.clickOnMenuOptionLink();
        await createMenuItems.selectMenuNameDropDown('Label');
        await createMenuItems.selectMenuNameDropDown('Resolution Code');
        await createMenuItems.selectMenuNameDropDown('Source');
        expect(await createMenuItems.isMenuNameDropDownPresent()).toBeTruthy('MenuName Drop down is missing');
        expect(await createMenuItems.isMenuOptionTextBoxPresent()).toBeTruthy('MenuOption text box is missing');
        expect(await createMenuItems.isStatusDropDownPresent()).toBeTruthy('status Drop down is missing');
        await createMenuItems.selectStatusDropDown('Active');
        await createMenuItems.selectStatusDropDown('Inactive');
        await createMenuItems.selectStatusDropDown('Deprecated');
        expect(await createMenuItems.isToggleButtonPresent()).toBeTruthy('Toggle Button is missing');
    });

    //kgaikwad
    it('DRDMV-17637: [UI] "Resolution Code" new option available in Menu Items', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Application Configuration--Menu Items', 'Menu Items - Business Workflows');
        await createMenuItems.clickOnMenuOptionLink();
        await createMenuItems.selectMenuNameDropDown('Resolution Code');
    });

    //kgaikwad
    it('DRDMV-16173: [Menu Items] - Multiple records with same name and type are not allowed', async () => {
        let lableRandVal = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let sourceRandVal = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let label = 'Legal' + lableRandVal;
        let label1 = 'legal' + lableRandVal;
        let label2 = 'leGAL' + lableRandVal;
        let source = 'Phone' + sourceRandVal;
        let source1 = 'phONE' + sourceRandVal;
        let source2 = 'phone' + sourceRandVal;

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Application Configuration--Menu Items', 'Menu Items - Business Workflows');
        await createMenuItems.clickOnMenuOptionLink();
        await createMenuItems.selectMenuNameDropDown('Label');
        await createMenuItems.clickOnLocalizeLink();
        await utilCommon.waitUntilSpinnerToHide();
        await localizeValuePopPo.valueTextBox(label);
        await localizeValuePopPo.clickOnSaveButton();
        await utilCommon.waitUntilSpinnerToHide();
        await createMenuItems.selectStatusDropDown('Active');
        await createMenuItems.selectAvailableOnUiToggleButton(true);
        await createMenuItems.clickOnSaveButton();
        await utilCommon.waitUntilPopUpDisappear();

        await createMenuItems.clickOnMenuOptionLink();
        await createMenuItems.selectMenuNameDropDown('Source');
        await createMenuItems.clickOnLocalizeLink();
        await utilCommon.waitUntilSpinnerToHide();
        await localizeValuePopPo.valueTextBox(source);
        await localizeValuePopPo.clickOnSaveButton();
        await utilCommon.waitUntilSpinnerToHide();
        await createMenuItems.selectStatusDropDown('Active');
        await createMenuItems.selectAvailableOnUiToggleButton(true);
        await createMenuItems.clickOnSaveButton();
        await utilCommon.waitUntilPopUpDisappear();

        await createMenuItems.clickOnMenuOptionLink();
        await createMenuItems.selectMenuNameDropDown('Label');
        await createMenuItems.clickOnLocalizeLink();
        await utilCommon.waitUntilSpinnerToHide();
        await localizeValuePopPo.valueTextBox(label);
        await localizeValuePopPo.clickOnSaveButton();
        await utilCommon.waitUntilSpinnerToHide();
        await createMenuItems.selectStatusDropDown('Active');
        await createMenuItems.selectAvailableOnUiToggleButton(true);
        await createMenuItems.clickOnSaveButton();
        expect(await utilCommon.getPopUpMessage()).toBe('ERROR (382): The value(s) for this entry violate a unique index that has been defined for this record definition.');
        await utilCommon.closePopUpMessage();

        await createMenuItems.clickOnLocalizeLink();
        await utilCommon.waitUntilSpinnerToHide();
        await localizeValuePopPo.clearValueTextBox();
        await localizeValuePopPo.valueTextBox(label1);
        await localizeValuePopPo.clickOnSaveButton();
        await utilCommon.waitUntilSpinnerToHide();
        await createMenuItems.clickOnSaveButton();
        expect(await utilCommon.getPopUpMessage()).toBe('ERROR (382): The value(s) for this entry violate a unique index that has been defined for this record definition.');
        await utilCommon.closePopUpMessage();

        await createMenuItems.clickOnLocalizeLink();
        await utilCommon.waitUntilSpinnerToHide();
        await localizeValuePopPo.clearValueTextBox();
        await localizeValuePopPo.valueTextBox(label2);
        await localizeValuePopPo.clickOnSaveButton();
        await utilCommon.waitUntilSpinnerToHide();
        await createMenuItems.clickOnSaveButton();
        expect(await utilCommon.getPopUpMessage()).toBe('ERROR (382): The value(s) for this entry violate a unique index that has been defined for this record definition.');
        await utilCommon.closePopUpMessage();

        await createMenuItems.clickOnLocalizeLink();
        await utilCommon.waitUntilSpinnerToHide();
        await localizeValuePopPo.clearValueTextBox();
        await localizeValuePopPo.valueTextBox(source);
        await localizeValuePopPo.clickOnSaveButton();
        await utilCommon.waitUntilSpinnerToHide();
        await createMenuItems.clickOnSaveButton();
        expect(await utilCommon.getPopUpMessage()).toBe('Saved successfully.');
        await utilCommon.waitUntilPopUpDisappear();

        await createMenuItems.clickOnMenuOptionLink();
        await createMenuItems.selectMenuNameDropDown('Source');
        await createMenuItems.clickOnLocalizeLink();
        await utilCommon.waitUntilSpinnerToHide();
        await localizeValuePopPo.valueTextBox(source);
        await localizeValuePopPo.clickOnSaveButton();
        await utilCommon.waitUntilSpinnerToHide();
        await createMenuItems.selectStatusDropDown('Active');
        await createMenuItems.selectAvailableOnUiToggleButton(true);
        await createMenuItems.clickOnSaveButton();
        expect(await utilCommon.getPopUpMessage()).toBe('ERROR (382): The value(s) for this entry violate a unique index that has been defined for this record definition.');
        await utilCommon.closePopUpMessage();

        await createMenuItems.clickOnLocalizeLink();
        await utilCommon.waitUntilSpinnerToHide();
        await localizeValuePopPo.clearValueTextBox();
        await localizeValuePopPo.valueTextBox(source1);
        await localizeValuePopPo.clickOnSaveButton();
        await utilCommon.waitUntilSpinnerToHide();
        await createMenuItems.clickOnSaveButton();
        expect(await utilCommon.getPopUpMessage()).toBe('ERROR (382): The value(s) for this entry violate a unique index that has been defined for this record definition.');
        await utilCommon.closePopUpMessage();

        await createMenuItems.clickOnLocalizeLink();
        await utilCommon.waitUntilSpinnerToHide();
        await localizeValuePopPo.clearValueTextBox();
        await localizeValuePopPo.valueTextBox(source2);
        await localizeValuePopPo.clickOnSaveButton();
        await utilCommon.waitUntilSpinnerToHide();
        await createMenuItems.clickOnSaveButton();
        expect(await utilCommon.getPopUpMessage()).toBe('ERROR (382): The value(s) for this entry violate a unique index that has been defined for this record definition.');
        await utilCommon.closePopUpMessage();

        await createMenuItems.clickOnLocalizeLink();
        await utilCommon.waitUntilSpinnerToHide();
        await localizeValuePopPo.clearValueTextBox();
        await localizeValuePopPo.valueTextBox(label);
        await localizeValuePopPo.clickOnSaveButton();
        await utilCommon.waitUntilSpinnerToHide();
        await createMenuItems.clickOnSaveButton();
        expect(await utilCommon.getPopUpMessage()).toBe('Saved successfully.');
        await utilCommon.waitUntilPopUpDisappear();
    }, 150 * 1000);

    //kgaikwad
    xit('DRDMV-16104: [Menu Items] Create new records in Menu Items', async () => {
        let lableRandVal = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let sourceRandVal = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        console.log(lableRandVal);
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Application Configuration--Menu Items', 'Menu Items - Business Workflows');
        await createMenuItems.clickOnMenuOptionLink();
        await createMenuItems.selectMenuNameDropDown('Label');
        await createMenuItems.clickOnLocalizeLink();
        await utilCommon.waitUntilSpinnerToHide();
        await localizeValuePopPo.valueTextBox(lableRandVal);
        await localizeValuePopPo.clickOnSaveButton();
        await utilCommon.waitUntilSpinnerToHide();
        await createMenuItems.selectStatusDropDown('Active');
        await createMenuItems.selectAvailableOnUiToggleButton(true);
        await createMenuItems.clickOnSaveButton();
        await utilCommon.waitUntilPopUpDisappear();

    }, 150 * 1000);

    //kgaikwad
    xit('DRDMV-16105: [UI] "[Menu Items] - Update records', async () => {
        let lableRandVal = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let sourceRandVal = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        console.log(lableRandVal);
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Application Configuration--Menu Items', 'Menu Items - Business Workflows');
        await createMenuItems.clickOnMenuOptionLink();
        await createMenuItems.selectMenuNameDropDown('Label');
        await createMenuItems.clickOnLocalizeLink();
        await utilCommon.waitUntilSpinnerToHide();
        await localizeValuePopPo.valueTextBox(lableRandVal);
        await localizeValuePopPo.clickOnSaveButton();
        await utilCommon.waitUntilSpinnerToHide();
        await createMenuItems.selectStatusDropDown('Active');
        await createMenuItems.selectAvailableOnUiToggleButton(true);
        await createMenuItems.clickOnSaveButton();
        await utilCommon.waitUntilPopUpDisappear();

        // await createMenuItems.clickOnMenuOptionLink();
        // await createMenuItems.selectMenuNameDropDown('Source');
        // await createMenuItems.clickOnLocalizeLink();
        // await utilCommon.waitUntilSpinnerToHide();
        // await localizeValuePopPo.valueTextBox(sourceRandVal);
        // await localizeValuePopPo.clickOnSaveButton();
        // await utilCommon.waitUntilSpinnerToHide();
        // await createMenuItems.selectStatusDropDown('Active');
        // await createMenuItems.selectAvailableOnUiToggleButton(true);
        // await createMenuItems.clickOnSaveButton();
        // await utilCommon.waitUntilPopUpDisappear();

        // await menuItemsConfigConsolePo.searchAndEditMenuOption(sourceRandVal);
        // expect(await editMenuItemsConfigPo.isMenuNameDropDownEnabled()).toBeTruthy('MenuName drop down is editable');
        // await editMenuItemsConfigPo.clickOnLocalizeLink();
        // await utilCommon.waitUntilSpinnerToHide();
        // await localizeValuePopPo.clearValueTextBox();
        // await localizeValuePopPo.valueTextBox(sourceRandVal);
        // await localizeValuePopPo.clickOnSaveButton();
        // await utilCommon.waitUntilPopUpDisappear();
        // await editMenuItemsConfigPo.selectStatusDropDown('Deprecated');
        // await editMenuItemsConfigPo.selectStatusDropDown('Inactive');
        // await editMenuItemsConfigPo.selectStatusDropDown('Active');
        // await editMenuItemsConfigPo.clickOnSaveButton();
        // expect(await utilCommon.getPopUpMessage()).toBe('Saved successfully.');
        // await utilCommon.waitUntilPopUpDisappear();

        await menuItemsConfigConsolePo.searchAndEditMenuOption(lableRandVal);
        expect(await editMenuItemsConfigPo.isMenuNameDropDownEnabled()).toBeTruthy('MenuName drop down is editable');
        await editMenuItemsConfigPo.clickOnLocalizeLink();
        await utilCommon.waitUntilSpinnerToHide();
        await localizeValuePopPo.clearValueTextBox();
        await localizeValuePopPo.valueTextBox(lableRandVal);
        await localizeValuePopPo.clickOnSaveButton();
        await utilCommon.waitUntilPopUpDisappear();
        await editMenuItemsConfigPo.selectStatusDropDown('Deprecated');
        await editMenuItemsConfigPo.selectStatusDropDown('Inactive');
        await editMenuItemsConfigPo.selectStatusDropDown('Active');
        await editMenuItemsConfigPo.selectAvailableOnUIToggleButton(true);
        await editMenuItemsConfigPo.clickOnSaveButton();
        expect(await utilCommon.getPopUpMessage()).toBe('Saved successfully.');
        await utilCommon.waitUntilPopUpDisappear();

        // await menuItemsConfigConsolePo.searchRecord(lableRandVal);
        // console.log('step:1')
        // expect(await menuItemsConfigConsolePo.getSelectedGridRecordValue('Menu Name')).toBe('Label');
        // console.log('step:2')
        // expect(await menuItemsConfigConsolePo.getSelectedGridRecordValue('Menu Options')).toBe(lableRandVal);
        // console.log('step:3')
        // expect(await menuItemsConfigConsolePo.getSelectedGridRecordValue('Status')).toBe('Active');  
    }, 150 * 1000);
})