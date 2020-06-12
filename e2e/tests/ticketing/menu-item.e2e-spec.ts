import { browser } from "protractor";
import localizeValuePopPo from '../../pageobject/common/localize-value-pop.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import createMenuItems from '../../pageobject/settings/application-config/create-menu-items-blade.po';
import editMenuItemsConfigPo from '../../pageobject/settings/application-config/edit-menu-items-config.po';
import menuItemsConfigConsolePo from '../../pageobject/settings/application-config/menu-items-config-console.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilCommon from '../../utils/util.common';
import utilityCommon from '../../utils/utility.common';
import apiHelper from '../../api/api.helper';
import createCasePage from '../../pageobject/case/create-case.po';
import selectCasetemplateBladePo from '../../pageobject/case/select-casetemplate-blade.po';
import casePreviewPo from '../../pageobject/case/case-preview.po';
import updateStatusBladePo from '../../pageobject/common/update.status.blade.po';
import viewCasePo from '../../pageobject/case/view-case.po';
import caseConsolePo from '../../pageobject/case/case-console.po';

describe('Menu Item', () => {
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    //kgaikwad
    it('[DRDMV-17650]: The Menu Items View would be re-arranged so that fields are in Proper sequence.', async () => {
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
    it('[DRDMV-17637]: [UI] "Resolution Code" new option available in Menu Items', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Application Configuration--Menu Items', 'Menu Items - Business Workflows');
        await createMenuItems.clickOnMenuOptionLink();
        await createMenuItems.selectMenuNameDropDown('Resolution Code');
    });

    //kgaikwad
    describe('[DRDMV-16173]: Verify Multiple records with same name', async () => {
        let randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let label = 'Legal' + randomStr;
        let label1 = 'legal' + randomStr;
        let label2 = 'leGAL' + randomStr;
        let source = 'Phone' + randomStr;
        let source1 = 'phONE' + randomStr;
        let source2 = 'phone' + randomStr;
        it('Create Menu Item label and Source', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Application Configuration--Menu Items', 'Menu Items - Business Workflows');
            await createMenuItems.clickOnMenuOptionLink();
            await createMenuItems.selectMenuNameDropDown('Label');
            await createMenuItems.clickOnLocalizeLink();
            await utilCommon.waitUntilSpinnerToHide();
            await localizeValuePopPo.setLocalizeValue(label);
            await localizeValuePopPo.clickOnSaveButton();
            await utilCommon.waitUntilSpinnerToHide();
            await createMenuItems.selectStatusDropDown('Active');
            await createMenuItems.selectAvailableOnUiToggleButton(true);
            await createMenuItems.clickOnSaveButton();
            await utilCommon.closePopUpMessage();
            await createMenuItems.clickOnMenuOptionLink();
            await createMenuItems.selectMenuNameDropDown('Source');
            await createMenuItems.clickOnLocalizeLink();
            await utilCommon.waitUntilSpinnerToHide();
            await localizeValuePopPo.setLocalizeValue(source);
            await localizeValuePopPo.clickOnSaveButton();
            await utilCommon.waitUntilSpinnerToHide();
            await createMenuItems.selectStatusDropDown('Active');
            await createMenuItems.selectAvailableOnUiToggleButton(true);
            await createMenuItems.clickOnSaveButton();
            await utilCommon.closePopUpMessage();
        });
        it('Create Duplicate Menu Item Source and Label', async () => {
            await createMenuItems.clickOnMenuOptionLink();
            await createMenuItems.selectMenuNameDropDown('Label');
            await createMenuItems.clickOnLocalizeLink();
            await utilCommon.waitUntilSpinnerToHide();
            await localizeValuePopPo.setLocalizeValue(label);
            await localizeValuePopPo.clickOnSaveButton();
            await utilCommon.waitUntilSpinnerToHide();
            await createMenuItems.selectStatusDropDown('Active');
            await createMenuItems.selectAvailableOnUiToggleButton(true);
            await createMenuItems.clickOnSaveButton();
            expect(await utilCommon.isPopUpMessagePresent('ERROR (382): The value(s) for this entry violate a unique index that has been defined for this record definition.')).toBeTruthy();
            await utilCommon.closePopUpMessage();
            await createMenuItems.clickOnLocalizeLink();
            await utilCommon.waitUntilSpinnerToHide();
            await localizeValuePopPo.clearValueTextBox();
            await localizeValuePopPo.setLocalizeValue(label1);
            await localizeValuePopPo.clickOnSaveButton();
            await utilCommon.waitUntilSpinnerToHide();
            await createMenuItems.clickOnSaveButton();
            expect(await utilCommon.isPopUpMessagePresent('ERROR (382): The value(s) for this entry violate a unique index that has been defined for this record definition.')).toBeTruthy();
            await utilCommon.closePopUpMessage();
            await createMenuItems.clickOnLocalizeLink();
            await utilCommon.waitUntilSpinnerToHide();
            await localizeValuePopPo.clearValueTextBox();
            await localizeValuePopPo.setLocalizeValue(label2);
            await localizeValuePopPo.clickOnSaveButton();
            await utilCommon.waitUntilSpinnerToHide();
            await createMenuItems.clickOnSaveButton();
            expect(await utilCommon.isPopUpMessagePresent('ERROR (382): The value(s) for this entry violate a unique index that has been defined for this record definition.')).toBeTruthy();
            await utilCommon.closePopUpMessage();
            await createMenuItems.clickOnLocalizeLink();
            await utilCommon.waitUntilSpinnerToHide();
            await localizeValuePopPo.clearValueTextBox();
            await localizeValuePopPo.setLocalizeValue(source);
            await localizeValuePopPo.clickOnSaveButton();
            await utilCommon.waitUntilSpinnerToHide();
            await createMenuItems.clickOnSaveButton();
            expect(await utilCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy();
            await utilCommon.closePopUpMessage();
        });
        it('[DRDMV-16173]: [Menu Items] - Multiple records with same name and type are not allowed', async () => {
            await createMenuItems.clickOnMenuOptionLink();
            await createMenuItems.selectMenuNameDropDown('Source');
            await createMenuItems.clickOnLocalizeLink();
            await utilCommon.waitUntilSpinnerToHide();
            await localizeValuePopPo.setLocalizeValue(source);
            await localizeValuePopPo.clickOnSaveButton();
            await utilCommon.waitUntilSpinnerToHide();
            await createMenuItems.selectStatusDropDown('Active');
            await createMenuItems.selectAvailableOnUiToggleButton(true);
            await createMenuItems.clickOnSaveButton();
            await expect(await utilCommon.isPopUpMessagePresent('ERROR (382): The value(s) for this entry violate a unique index that has been defined for this record definition.')).toBeTruthy();
            await createMenuItems.clickOnLocalizeLink();
            await utilCommon.waitUntilSpinnerToHide();
            await localizeValuePopPo.clearValueTextBox();
            await localizeValuePopPo.setLocalizeValue(source1);
            await localizeValuePopPo.clickOnSaveButton();
            await utilCommon.waitUntilSpinnerToHide();
            await createMenuItems.clickOnSaveButton();
            expect(await utilCommon.isPopUpMessagePresent('ERROR (382): The value(s) for this entry violate a unique index that has been defined for this record definition.')).toBeTruthy();
            await utilCommon.closePopUpMessage();
            await createMenuItems.clickOnLocalizeLink();
            await utilCommon.waitUntilSpinnerToHide();
            await localizeValuePopPo.clearValueTextBox();
            await localizeValuePopPo.setLocalizeValue(source2);
            await localizeValuePopPo.clickOnSaveButton();
            await utilCommon.waitUntilSpinnerToHide();
            await createMenuItems.clickOnSaveButton();
            expect(await utilCommon.isPopUpMessagePresent('ERROR (382): The value(s) for this entry violate a unique index that has been defined for this record definition.')).toBeTruthy();
            await utilCommon.closePopUpMessage();
            await createMenuItems.clickOnLocalizeLink();
            await utilCommon.waitUntilSpinnerToHide();
            await localizeValuePopPo.clearValueTextBox();
            await localizeValuePopPo.setLocalizeValue(label);
            await localizeValuePopPo.clickOnSaveButton();
            await utilCommon.waitUntilSpinnerToHide();
            await createMenuItems.clickOnSaveButton();
            expect(await utilCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy();
            await utilCommon.closePopUpMessage();
        });
    });

    //kgaikwad
    describe('[DRDMV-16105,DRDMV-16106]: Verify Multiple records with same name', async () => {
        let randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let label = 'label' + randomStr;
        let source = 'source' + randomStr;
        let resolutionCode = 'resolutionCode' + randomStr;
        it('[Menu Items] - Create Menu Item', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Application Configuration--Menu Items', 'Menu Items - Business Workflows');
            await createMenuItems.clickOnMenuOptionLink();
            await createMenuItems.selectMenuNameDropDown('Label');
            await createMenuItems.clickOnLocalizeLink();
            await utilCommon.waitUntilSpinnerToHide();
            await localizeValuePopPo.setLocalizeValue(label);
            await localizeValuePopPo.clickOnSaveButton();
            await utilCommon.waitUntilSpinnerToHide();
            await createMenuItems.selectStatusDropDown('Active');
            await createMenuItems.selectAvailableOnUiToggleButton(true);
            await createMenuItems.clickOnSaveButton();
            await utilCommon.closePopUpMessage();
            await createMenuItems.clickOnMenuOptionLink();
            await createMenuItems.selectMenuNameDropDown('Source');
            await createMenuItems.clickOnLocalizeLink();
            await utilCommon.waitUntilSpinnerToHide();
            await localizeValuePopPo.setLocalizeValue(source);
            await localizeValuePopPo.clickOnSaveButton();
            await utilCommon.waitUntilSpinnerToHide();
            await createMenuItems.selectStatusDropDown('Inactive');
            await createMenuItems.selectAvailableOnUiToggleButton(true);
            await createMenuItems.clickOnSaveButton();
            await utilCommon.closePopUpMessage();
            await createMenuItems.clickOnMenuOptionLink();
            await createMenuItems.selectMenuNameDropDown('Resolution Code');
            await createMenuItems.clickOnLocalizeLink();
            await utilCommon.waitUntilSpinnerToHide();
            await localizeValuePopPo.setLocalizeValue(resolutionCode);
            await localizeValuePopPo.clickOnSaveButton();
            await utilCommon.waitUntilSpinnerToHide();
            await createMenuItems.selectStatusDropDown('Active');
            await createMenuItems.selectAvailableOnUiToggleButton(true);
            await createMenuItems.clickOnSaveButton();
            await utilCommon.closePopUpMessage();
        });
        it('[Menu Items] - Update Menu Item', async () => {
            await menuItemsConfigConsolePo.searchAndEditMenuOption(source);
            expect(await editMenuItemsConfigPo.isMenuNameDropDownEnabled()).toBeTruthy('MenuName drop down is editable');
            await editMenuItemsConfigPo.clickOnLocalizeLink();
            await utilCommon.waitUntilSpinnerToHide();
            await localizeValuePopPo.clearValueTextBox();
            await localizeValuePopPo.setLocalizeValue(source);
            await localizeValuePopPo.clickOnSaveButton();
            await utilCommon.closePopUpMessage();
            let statusdropDown1: string[] = ["Deprecated", "Inactive", "Active"];
            expect(await editMenuItemsConfigPo.isStatusDropDownValuesMatch(statusdropDown1)).toBeTruthy('wrong column headers');
            await editMenuItemsConfigPo.clickOnSaveButton();
            expect(await utilCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy();
            await utilCommon.closePopUpMessage();
            await menuItemsConfigConsolePo.searchAndEditMenuOption(label);
            expect(await editMenuItemsConfigPo.isMenuNameDropDownEnabled()).toBeTruthy('MenuName drop down is editable');
            await editMenuItemsConfigPo.clickOnLocalizeLink();
            await utilCommon.waitUntilSpinnerToHide();
            await localizeValuePopPo.clearValueTextBox();
            await localizeValuePopPo.setLocalizeValue(label);
            await localizeValuePopPo.clickOnSaveButton();
            await utilCommon.closePopUpMessage();
            let statusDropDown2: string[] = ["Deprecated", "Inactive", "Active"];
            expect(await editMenuItemsConfigPo.isStatusDropDownValuesMatch(statusDropDown2)).toBeTruthy('wrong column headers');
            await editMenuItemsConfigPo.selectAvailableOnUIToggleButton(true);
            await editMenuItemsConfigPo.clickOnSaveButton();
            expect(await utilCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy();
            await utilCommon.closePopUpMessage();
        });
        it('[DRDMV-16105,DRDMV-16106]: [Menu Items] - Update records AND grid Validation', async () => {
            await menuItemsConfigConsolePo.searchAndEditMenuOption(resolutionCode);
            expect(await editMenuItemsConfigPo.isMenuNameDropDownEnabled()).toBeTruthy('MenuName drop down is editable');
            await editMenuItemsConfigPo.clickOnLocalizeLink();
            await utilCommon.waitUntilSpinnerToHide();
            await localizeValuePopPo.clearValueTextBox();
            await localizeValuePopPo.setLocalizeValue(resolutionCode);
            await localizeValuePopPo.clickOnSaveButton();
            await utilCommon.closePopUpMessage();
            let statusDropDown3: string[] = ["Deprecated", "Inactive", "Active"];
            expect(await editMenuItemsConfigPo.isStatusDropDownValuesMatch(statusDropDown3)).toBeTruthy('wrong column headers');
            await editMenuItemsConfigPo.selectAvailableOnUIToggleButton(true);
            await editMenuItemsConfigPo.clickOnSaveButton();
            expect(await utilCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy();
            await utilCommon.closePopUpMessage();

            let column1: string[] = ["ID", "Created Date", "Modified Date", "Menu Name", "Menu Options", "Status"];
            await menuItemsConfigConsolePo.addColumnOnGrid(column1);
            let column2: string[] = ["ID", "Created Date", "Modified Date"];
            await menuItemsConfigConsolePo.removeColumnOnGrid(column2);

            await menuItemsConfigConsolePo.clearGridSearchBox();
            expect(await menuItemsConfigConsolePo.isGridColumnSorted('Menu Options', 'descending')).toBeTruthy('MenuOption Column is not sorted');
            expect(await menuItemsConfigConsolePo.isGridColumnSorted('Menu Name', 'descending')).toBeTruthy('Menu Name Column is not sorted');

            await menuItemsConfigConsolePo.searchOnGridConsole(label);
            expect(await menuItemsConfigConsolePo.getSelectedGridRecordValue('Menu Name')).toBe('Label'), 'Menu Name column value is missing. for label';
            expect(await menuItemsConfigConsolePo.getSelectedGridRecordValue('Menu Options')).toBe(label), 'Menu Option column value is missing for label';
            expect(await menuItemsConfigConsolePo.getSelectedGridRecordValue('Status')).toBe('Active'), 'Status column value is missing for label';

            await menuItemsConfigConsolePo.searchOnGridConsole(source);
            expect(await menuItemsConfigConsolePo.getSelectedGridRecordValue('Menu Name')).toBe('Source'), 'Menu Name column value is missing for Source';
            expect(await menuItemsConfigConsolePo.getSelectedGridRecordValue('Menu Options')).toBe(source), 'Menu Option column value is missing for source';
            expect(await menuItemsConfigConsolePo.getSelectedGridRecordValue('Status')).toBe('Inactive'), 'Status column value is missing for source';

            await menuItemsConfigConsolePo.searchOnGridConsole(resolutionCode);
            expect(await menuItemsConfigConsolePo.getSelectedGridRecordValue('Menu Name')).toBe('Resolution Code'), 'Menu Name column value is missing for resolution code';
            expect(await menuItemsConfigConsolePo.getSelectedGridRecordValue('Menu Options')).toBe(resolutionCode), 'Menu Option column value is missing for resolution code';
            expect(await menuItemsConfigConsolePo.getSelectedGridRecordValue('Status')).toBe('Active'), 'Status column value is missing for resolution code';
        });
    });

    //kgaikwad
    describe('[DRDMV-16104]: [Menu Items] Create new records in Menu Items', async () => {
        let lableRandVal = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let sourceRandVal = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let resolutionCodeRandVal = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');

        it('Verify Create Menu Item UI', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Application Configuration--Menu Items', 'Menu Items - Business Workflows');

            await createMenuItems.clickOnMenuOptionLink();
            expect(await createMenuItems.isMenuNameFieldRequired()).toBeTruthy('FailureMsg: Menu Name required label is missing');
            expect(await createMenuItems.isMenuOptionFieldRequired()).toBeTruthy('FailureMsg: Menu Option required label is missing');
            expect(await createMenuItems.isStatusFieldRequired()).toBeTruthy('FailureMsg: Status required label is missing');
            let menuNameValues: string[] = ['Label', 'Resolution Code', 'Source'];
            expect(await createMenuItems.isMenuNameDropDownValuesMatches(menuNameValues)).toBeTruthy('FailureMsg: Cancel status reason options mismatch');
            let statusValues: string[] = ['Active', 'Inactive', 'Deprecated'];
            expect(await createMenuItems.isStatusDropDownValuesMatches(statusValues)).toBeTruthy('FailureMsg: Cancel status reason options mismatch');
            expect(await createMenuItems.isSaveButtonDisplayed()).toBeTruthy('FailureMsg: save button is missing');
            expect(await createMenuItems.isCancelButtonDisplayed()).toBeTruthy('FailureMsg: Cancel button is missing');
            await createMenuItems.selectMenuNameDropDown('Source');
            expect(await createMenuItems.isToggleButtonPresent()).toBeTruthy('FailureMsg: Available On UI toogle button is missing ')
        });

        it('Create Label Menu and verify in in Grid', async () => {
            await createMenuItems.selectMenuNameDropDown('Label');
            await createMenuItems.clickOnLocalizeLink();
            await localizeValuePopPo.setLocalizeValue(lableRandVal)
            await localizeValuePopPo.clickOnSaveButton();
            await utilCommon.waitUntilPopUpDisappear();
            await createMenuItems.selectStatusDropDown('Active');
            await createMenuItems.clickOnSaveButton();
            await menuItemsConfigConsolePo.clearGridSearchBox();
            await menuItemsConfigConsolePo.searchOnGridConsole(lableRandVal);
            expect(await menuItemsConfigConsolePo.getSelectedGridRecordValue('Menu Options')).toBe(lableRandVal);
        });

        it('Create Resolution Code Menu and verify in in Grid', async () => {
            await createMenuItems.clickOnMenuOptionLink();
            await createMenuItems.selectMenuNameDropDown('Resolution Code');
            await createMenuItems.clickOnLocalizeLink();
            await localizeValuePopPo.setLocalizeValue(resolutionCodeRandVal);
            await localizeValuePopPo.clickOnSaveButton();
            await utilCommon.waitUntilPopUpDisappear();
            await createMenuItems.selectStatusDropDown('Inactive');
            await createMenuItems.clickOnSaveButton();
            await menuItemsConfigConsolePo.clearGridSearchBox();
            await menuItemsConfigConsolePo.searchOnGridConsole(resolutionCodeRandVal);
            expect(await menuItemsConfigConsolePo.getSelectedGridRecordValue('Menu Options')).toBe(resolutionCodeRandVal);
        });

        it('[DRDMV-16104]: Create Source Menu and verify in in Grid', async () => {
            await createMenuItems.clickOnMenuOptionLink();
            await createMenuItems.selectMenuNameDropDown('Source');
            await createMenuItems.clickOnLocalizeLink();
            await localizeValuePopPo.setLocalizeValue(sourceRandVal);
            await localizeValuePopPo.clickOnSaveButton();
            await utilCommon.waitUntilPopUpDisappear();
            await createMenuItems.selectStatusDropDown('Inactive');
            await createMenuItems.clickOnSaveButton();
            await menuItemsConfigConsolePo.clearGridSearchBox();
            await menuItemsConfigConsolePo.searchOnGridConsole(sourceRandVal);
            expect(await menuItemsConfigConsolePo.getSelectedGridRecordValue('Menu Options')).toBe(sourceRandVal);
        });
    });

    //kgaikwad
    describe('[DRDMV-17654]: Check Resolution Code and Resolution Description fields added on Case Template', async () => {
        let caseTemplateName1: string = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateName2: string = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateName3: string = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateName4: string = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let resolutionCode;
        beforeAll(async () => {
            // Create Resoution code
            await apiHelper.apiLogin('qkatawazi');
            let menuItemDataFile = require('../../data/ui/ticketing/menuItem.ui.json');
            resolutionCode = await menuItemDataFile['resolutionCodeActiveOnUI'].menuItemName + randomStr;
            menuItemDataFile['resolutionCodeActiveOnUI'].menuItemName = resolutionCode;
            await apiHelper.createNewMenuItem(menuItemDataFile['resolutionCodeActiveOnUI']);

            // Create case template 1 
            let templateData1 = {
                "templateName": caseTemplateName1,
                "templateSummary": caseTemplateName1,
                "caseStatus": "InProgress",
                "templateStatus": "Active",
                "company": "Petramco",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
                "ownerBU": 'Facilities Support',
                "ownerGroup": "Facilities",
                "resolutionCode": "1",
                "resolutionDescription": "0"
            }
            await apiHelper.createCaseTemplate(templateData1);

            // Create case template 2
            let templateData2 = {
                "templateName": caseTemplateName2,
                "templateSummary": caseTemplateName2,
                "caseStatus": "InProgress",
                "templateStatus": "Active",
                "company": "Petramco",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
                "ownerBU": 'Facilities Support',
                "ownerGroup": "Facilities",
                "resolutionCode": "0",
                "resolutionDescription": "1"
            }
            await apiHelper.createCaseTemplate(templateData2);

            // Create case template 3
            let templateData3 = {
                "templateName": caseTemplateName3,
                "templateSummary": caseTemplateName3,
                "caseStatus": "InProgress",
                "templateStatus": "Active",
                "company": "Petramco",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
                "ownerBU": 'Facilities Support',
                "ownerGroup": "Facilities",
                "resolutionCode": "1",
                "resolutionDescription": "1"
            }
            await apiHelper.createCaseTemplate(templateData3);

            // Create case template 4
            let templateData4 = {
                "templateName": caseTemplateName4,
                "templateSummary": caseTemplateName4,
                "caseStatus": "InProgress",
                "templateStatus": "Active",
                "company": "Petramco",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
                "ownerBU": 'Facilities Support',
                "ownerGroup": "Facilities",
                "resolutionCode": "0",
                "resolutionDescription": "0"
            }
            await apiHelper.createCaseTemplate(templateData4);
        });

        it('Create case with selecting case template 1', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('DRDMV-17654_Summary_1');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName1);
            await createCasePage.clickSaveCaseButton();
            await casePreviewPo.clickGoToCaseButton();
        });

        it('Validate case with resolution code required true condition ', async () => {
            await updateStatusBladePo.changeCaseStatus('Resolved');
            expect(await updateStatusBladePo.isRequiredTagToResolutionCode()).toBeTruthy('FailureMsg: Required Tab for Resolution Code is missing');
            expect(await updateStatusBladePo.isSaveUpdateStatusButtonEnabled()).toBeFalsy('FailureMsg: Save button is not enabled');
            await updateStatusBladePo.setStatusReason('Auto Resolved');
            await updateStatusBladePo.selectResolutionCode(resolutionCode);
            expect(await updateStatusBladePo.isSaveUpdateStatusButtonEnabled()).toBeTruthy('FailureMsg: Save button is not disabled');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePo.getTextOfStatus()).toBe('Resolved');
            await updateStatusBladePo.changeCaseStatus('Closed');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePo.getTextOfStatus()).toBe('Closed');
        });

        it('Create case with selecting case template 2', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('DRDMV-17654_Summary_2');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName2);
            await createCasePage.clickSaveCaseButton();
            await casePreviewPo.clickGoToCaseButton();
        });

        it('Validate case with resolution description required true condition', async () => {
            await updateStatusBladePo.changeCaseStatus('Resolved');
            expect(await updateStatusBladePo.isRequiredTagToResolutionDescription()).toBeTruthy('FailureMsg: Required Tab for Resolution Description is missing');
            expect(await updateStatusBladePo.isSaveUpdateStatusButtonEnabled()).toBeFalsy('FailureMsg: Save button is not enabled');
            await updateStatusBladePo.setStatusReason('Auto Resolved');
            await updateStatusBladePo.setResolutionDescription('ResolutionDescription2');
            expect(await updateStatusBladePo.isSaveUpdateStatusButtonEnabled()).toBeTruthy('FailureMsg: Save button is not disabled');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePo.getTextOfStatus()).toBe('Resolved');
            await updateStatusBladePo.changeCaseStatus('Closed');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePo.getTextOfStatus()).toBe('Closed');
        });

        it('Create case with selecting case template 3', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('DRDMV-17654_Summary_3');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName3);
            await createCasePage.clickSaveCaseButton();
            await casePreviewPo.clickGoToCaseButton();
        });

        it('Validate case with Resolution code and Resolution description required true condition', async () => {
            await updateStatusBladePo.changeCaseStatus('Resolved');
            expect(await updateStatusBladePo.isRequiredTagToResolutionCode()).toBeTruthy('FailureMsg: Required Tag for Resolution Code is displayed ');
            expect(await updateStatusBladePo.isRequiredTagToResolutionDescription()).toBeTruthy('FailureMsg: Required Tab for Resolution Description is missing');
            expect(await updateStatusBladePo.isSaveUpdateStatusButtonEnabled()).toBeFalsy('FailureMsg: Save button is not enabled');
            await updateStatusBladePo.setStatusReason('Auto Resolved');
            await updateStatusBladePo.selectResolutionCode(resolutionCode);
            expect(await updateStatusBladePo.isSaveUpdateStatusButtonEnabled()).toBeFalsy('FailureMsg: Save button is not enabled');
            await updateStatusBladePo.setResolutionDescription('ResolutionDescription2');
            expect(await updateStatusBladePo.isSaveUpdateStatusButtonEnabled()).toBeTruthy('FailureMsg: Save button is not disabled');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePo.getTextOfStatus()).toBe('Resolved');
            await updateStatusBladePo.changeCaseStatus('Closed');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePo.getTextOfStatus()).toBe('Closed');
        });

        it('Create case with selecting case template 4', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('DRDMV-17654_Summary_4');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName4);
            await createCasePage.clickSaveCaseButton();
            await casePreviewPo.clickGoToCaseButton();
        });

        it('[DRDMV-17654]: Validate case with Resolution code and Resolution description required false condition', async () => {
            await updateStatusBladePo.changeCaseStatus('Resolved');
            expect(await updateStatusBladePo.isSaveUpdateStatusButtonEnabled()).toBeFalsy('FailureMsg: Save button is not enabled');
            await updateStatusBladePo.setStatusReason('Auto Resolved');
            expect(await updateStatusBladePo.isSaveUpdateStatusButtonEnabled()).toBeTruthy('FailureMsg: Save button is not disabled');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePo.getTextOfStatus()).toBe('Resolved');
            await updateStatusBladePo.changeCaseStatus('Closed');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePo.getTextOfStatus()).toBe('Closed');
        });
    });

})