import { browser } from "protractor";
import localizeValuePopPo from '../../pageobject/common/localize-value-pop.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import createMenuItems from '../../pageobject/settings/application-config/create-menu-items-blade.po';
import menuItemsConfigConsolePo from '../../pageobject/settings/application-config/menu-items-config-console.po'
import editMenuItemsConfigPo from '../../pageobject/settings/application-config/edit-menu-items-config.po'
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
    it('DRDMV-16105,DRDMV-16106: [Menu Items] - Update records AND grid Validation', async () => {
        let lableRandVal = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let sourceRandVal = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let resolutionCodeRandVal = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');

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

        await createMenuItems.clickOnMenuOptionLink();
        await createMenuItems.selectMenuNameDropDown('Source');
        await createMenuItems.clickOnLocalizeLink();
        await utilCommon.waitUntilSpinnerToHide();
        await localizeValuePopPo.valueTextBox(sourceRandVal);
        await localizeValuePopPo.clickOnSaveButton();
        await utilCommon.waitUntilSpinnerToHide();
        await createMenuItems.selectStatusDropDown('Inactive');
        await createMenuItems.selectAvailableOnUiToggleButton(true);
        await createMenuItems.clickOnSaveButton();
        await utilCommon.waitUntilPopUpDisappear();

        await createMenuItems.clickOnMenuOptionLink();
        await createMenuItems.selectMenuNameDropDown('Resolution Code');
        await createMenuItems.clickOnLocalizeLink();
        await utilCommon.waitUntilSpinnerToHide();
        await localizeValuePopPo.valueTextBox(resolutionCodeRandVal);
        await localizeValuePopPo.clickOnSaveButton();
        await utilCommon.waitUntilSpinnerToHide();
        await createMenuItems.selectStatusDropDown('Active');
        await createMenuItems.selectAvailableOnUiToggleButton(true);
        await createMenuItems.clickOnSaveButton();
        await utilCommon.waitUntilPopUpDisappear();
        
        await menuItemsConfigConsolePo.searchAndEditMenuOption(sourceRandVal);
        expect(await editMenuItemsConfigPo.isMenuNameDropDownEnabled()).toBeTruthy('MenuName drop down is editable');
        await editMenuItemsConfigPo.clickOnLocalizeLink();
        await utilCommon.waitUntilSpinnerToHide();
        await localizeValuePopPo.clearValueTextBox();
        await localizeValuePopPo.valueTextBox(sourceRandVal);
        await localizeValuePopPo.clickOnSaveButton();
        await utilCommon.waitUntilPopUpDisappear();
        let statusdropDown1: string[] = ["Deprecated", "Inactive", "Active"];
        expect(await editMenuItemsConfigPo.isStatusDropDownValuesMatch(statusdropDown1)).toBeTruthy('wrong column headers');
        await editMenuItemsConfigPo.clickOnSaveButton();
        expect(await utilCommon.getPopUpMessage()).toBe('Saved successfully.'),'Saved successfully. Popup is missing';
        await utilCommon.waitUntilPopUpDisappear();

        await menuItemsConfigConsolePo.searchAndEditMenuOption(lableRandVal);
        expect(await editMenuItemsConfigPo.isMenuNameDropDownEnabled()).toBeTruthy('MenuName drop down is editable');
        await editMenuItemsConfigPo.clickOnLocalizeLink();
        await utilCommon.waitUntilSpinnerToHide();
        await localizeValuePopPo.clearValueTextBox();
        await localizeValuePopPo.valueTextBox(lableRandVal);
        await localizeValuePopPo.clickOnSaveButton();
        await utilCommon.waitUntilPopUpDisappear();
        let statusDropDown2: string[] = ["Deprecated", "Inactive", "Active"];
        expect(await editMenuItemsConfigPo.isStatusDropDownValuesMatch(statusDropDown2)).toBeTruthy('wrong column headers');
        await editMenuItemsConfigPo.selectAvailableOnUIToggleButton(true);
        await editMenuItemsConfigPo.clickOnSaveButton();
        expect(await utilCommon.getPopUpMessage()).toBe('Saved successfully.'),'Saved successfully. Popup is missing';
        await utilCommon.waitUntilPopUpDisappear();

        await menuItemsConfigConsolePo.searchAndEditMenuOption(resolutionCodeRandVal);
        expect(await editMenuItemsConfigPo.isMenuNameDropDownEnabled()).toBeTruthy('MenuName drop down is editable');
        await editMenuItemsConfigPo.clickOnLocalizeLink();
        await utilCommon.waitUntilSpinnerToHide();
        await localizeValuePopPo.clearValueTextBox();
        await localizeValuePopPo.valueTextBox(resolutionCodeRandVal);
        await localizeValuePopPo.clickOnSaveButton();
        await utilCommon.waitUntilPopUpDisappear();
        let statusDropDown3: string[] = ["Deprecated", "Inactive", "Active"];
        expect(await editMenuItemsConfigPo.isStatusDropDownValuesMatch(statusDropDown3)).toBeTruthy('wrong column headers');
        await editMenuItemsConfigPo.selectAvailableOnUIToggleButton(true);
        await editMenuItemsConfigPo.clickOnSaveButton();
        expect(await utilCommon.getPopUpMessage()).toBe('Saved successfully.'),'Saved successfully. Popup is missing';
        await utilCommon.waitUntilPopUpDisappear();
        
        let column1: string[] = ["ID", "Created Date", "Modified Date", "Menu Name", "Menu Options", "Status"];
        await menuItemsConfigConsolePo.addColumnOnGrid(column1);
        let column2: string[] = ["ID", "Created Date", "Modified Date"];
        await menuItemsConfigConsolePo.removeColumnOnGrid(column2);

        await menuItemsConfigConsolePo.clearGridSearchBox();
        expect(await menuItemsConfigConsolePo.isGridColumnSorted('Menu Options', 'descending')).toBeTruthy('MenuOption Column is not sorted');
        expect(await menuItemsConfigConsolePo.isGridColumnSorted('Menu Name', 'descending')).toBeTruthy('Menu Name Column is not sorted');

        await menuItemsConfigConsolePo.searchOnGridConsole(lableRandVal);
        expect(await menuItemsConfigConsolePo.getSelectedGridRecordValue('Menu Name')).toBe('Label'),'Menu Name column value is missing. for label';
        expect(await menuItemsConfigConsolePo.getSelectedGridRecordValue('Menu Options')).toBe(lableRandVal),'Menu Option column value is missing for label';
        expect(await menuItemsConfigConsolePo.getSelectedGridRecordValue('Status')).toBe('Active'),'Status column value is missing for label';
    
        await menuItemsConfigConsolePo.searchOnGridConsole(sourceRandVal);
        expect(await menuItemsConfigConsolePo.getSelectedGridRecordValue('Menu Name')).toBe('Source'),'Menu Name column value is missing for Source';
        expect(await menuItemsConfigConsolePo.getSelectedGridRecordValue('Menu Options')).toBe(sourceRandVal),'Menu Option column value is missing for source';
        expect(await menuItemsConfigConsolePo.getSelectedGridRecordValue('Status')).toBe('Inactive'),'Status column value is missing for source';

        await menuItemsConfigConsolePo.searchOnGridConsole(resolutionCodeRandVal);
        expect(await menuItemsConfigConsolePo.getSelectedGridRecordValue('Menu Name')).toBe('Resolution Code'),'Menu Name column value is missing for resolution code';
        expect(await menuItemsConfigConsolePo.getSelectedGridRecordValue('Menu Options')).toBe(resolutionCodeRandVal),'Menu Option column value is missing for resolution code';
        expect(await menuItemsConfigConsolePo.getSelectedGridRecordValue('Status')).toBe('Active'),'Status column value is missing for resolution code';
    
    }, 240 * 1000);

})