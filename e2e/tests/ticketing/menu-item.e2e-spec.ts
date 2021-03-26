import { cloneDeep } from 'lodash';
import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import { RESOLUTION_CODE_ACTIVE_ON_UI, SAMPLE_MENU_ITEM } from '../../data/ui/ticketing/menu.item.ui';
import caseConsolePo from '../../pageobject/case/case-console.po';
import casePreviewPo from '../../pageobject/case/case-preview.po';
import createCasePage from '../../pageobject/case/create-case.po';
import editCasePo from '../../pageobject/case/edit-case.po';
import selectCasetemplateBladePo from '../../pageobject/case/select-casetemplate-blade.po';
import viewCasePo from '../../pageobject/case/view-case.po';
import changeAssignmentPo from '../../pageobject/common/change-assignment.po';
import localizeValuePopPo from '../../pageobject/common/localize-value-pop.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import updateStatusBladePo from '../../pageobject/common/update.status.blade.po';
import createMenuItems from '../../pageobject/settings/application-config/create-menu-items-blade.po';
import editMenuItemsConfigPo from '../../pageobject/settings/application-config/edit-menu-items-config.po';
import menuItemsConfigConsolePo from '../../pageobject/settings/application-config/menu-items-config-console.po';
import addReadAccess from '../../pageobject/settings/case-management/add-read-access-configuration.po';
import assignmentsConfigConsolePo from '../../pageobject/settings/case-management/assignments-config-console.po';
import consoleCasetemplatePo from '../../pageobject/settings/case-management/console-casetemplate.po';
import createAssignmentsConfigPo from '../../pageobject/settings/case-management/create-assignments-config.po';
import createCasetemplatePo from '../../pageobject/settings/case-management/create-casetemplate.po';
import editAssignmentsConfigPo from '../../pageobject/settings/case-management/edit-assignments-config.po';
import editCasetemplatePo from '../../pageobject/settings/case-management/edit-casetemplate.po';
import editReadAccessConfigPo from '../../pageobject/settings/case-management/edit-read-access-config.po';
import consoleReadAcess from '../../pageobject/settings/case-management/read-access-console.po';
import viewCasetemplatePo from '../../pageobject/settings/case-management/view-casetemplate.po';
import serviceTargetConfig from '../../pageobject/settings/slm/service-target-blade.po';
import SlmExpressionBuilder from '../../pageobject/settings/slm/slm-expressionbuilder.pop.po';
import consoleTasktemplatePo from "../../pageobject/settings/task-management/console-tasktemplate.po";
import createTasktemplatePo from '../../pageobject/settings/task-management/create-tasktemplate.po';
import editTasktemplatePo from '../../pageobject/settings/task-management/edit-tasktemplate.po';
import viewTasktemplatePo from '../../pageobject/settings/task-management/view-tasktemplate.po';
import adhoctaskTemplate from "../../pageobject/task/create-adhoc-task.po";
import editTaskPo from '../../pageobject/task/edit-task.po';
import manageTask from "../../pageobject/task/manage-task-blade.po";
import viewTaskPo from '../../pageobject/task/view-task.po';
import { BWF_BASE_URL, BWF_PAGE_TITLES } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';

describe('Menu Item', () => {
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    //kgaikwad
    it('[4085]: The Menu Items View would be re-arranged so that fields are in Proper sequence.', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Application Configuration--Menu Items', BWF_PAGE_TITLES.APPLICATION_CONFIGURATIONS.MENU_ITEMS);
        await createMenuItems.clickOnMenuOptionLink();
        await createMenuItems.selectMenuNameDropDown('Label');
        await createMenuItems.selectMenuNameDropDown('Resolution Code');
        expect(await createMenuItems.isMenuNameDropDownPresent()).toBeTruthy('MenuName Drop down is missing');
        expect(await createMenuItems.isMenuOptionTextBoxPresent()).toBeTruthy('MenuOption text box is missing');
        expect(await createMenuItems.isStatusDropDownPresent()).toBeTruthy('status Drop down is missing');
        await createMenuItems.selectStatusDropDown('Active');
        await createMenuItems.selectStatusDropDown('Inactive');
        await createMenuItems.selectStatusDropDown('Deprecated');
        expect(await createMenuItems.isToggleButtonDisplayed()).toBeTruthy('Toggle Button is missing');
        await createMenuItems.clickOnCancelButton();
        await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
    });

    //kgaikwad
    it('[4090]: [UI] "Resolution Code" new option available in Menu Items', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Application Configuration--Menu Items', BWF_PAGE_TITLES.APPLICATION_CONFIGURATIONS.MENU_ITEMS);
        await createMenuItems.clickOnMenuOptionLink();
        await createMenuItems.selectMenuNameDropDown('Resolution Code');
        await createMenuItems.clickOnCancelButton();
        await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
    });

    //kgaikwad
    //this test is skip due to DRDMV-23822 defect which was resolved on 21.05
    xdescribe('[4290]: Verify Multiple records with same name', async () => {
        let randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let label = 'Legal' + randomStr;
        let label1 = 'legal' + randomStr;
        let label2 = 'leGAL' + randomStr;
        it('[4290]: Create Menu Item label and Source', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Application Configuration--Menu Items', BWF_PAGE_TITLES.APPLICATION_CONFIGURATIONS.MENU_ITEMS);
            await createMenuItems.clickOnMenuOptionLink();
            await createMenuItems.selectMenuNameDropDown('Label');
            await createMenuItems.clickOnLocalizeLink();
            await localizeValuePopPo.setLocalizeValue(label);
            await localizeValuePopPo.clickOnSaveButton();
            await createMenuItems.selectStatusDropDown('Active');
            await createMenuItems.selectAvailableOnUiToggleButton(true);
            await createMenuItems.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
        });
        it('[4290]: Create Duplicate Menu Item Source and Label', async () => {
            await createMenuItems.clickOnMenuOptionLink();
            await createMenuItems.selectMenuNameDropDown('Label');
            await createMenuItems.clickOnLocalizeLink();
            await localizeValuePopPo.setLocalizeValue(label);
            await localizeValuePopPo.clickOnSaveButton();
            await createMenuItems.selectStatusDropDown('Active');
            await createMenuItems.selectAvailableOnUiToggleButton(true);
            await createMenuItems.clickOnSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('Label with same name already exists. Select a different name.')).toBeTruthy();
            await utilityCommon.closePopUpMessage();
            await createMenuItems.clickOnLocalizeLink();
            await localizeValuePopPo.clearValueTextBox();
            await localizeValuePopPo.setLocalizeValue(label1);
            await localizeValuePopPo.clickOnSaveButton();
            await createMenuItems.clickOnSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('Label with same name already exists. Select a different name.')).toBeTruthy();
            await utilityCommon.closePopUpMessage();
            await createMenuItems.clickOnLocalizeLink();
            await localizeValuePopPo.clearValueTextBox();
            await localizeValuePopPo.setLocalizeValue(label2);
            await localizeValuePopPo.clickOnSaveButton();
            await createMenuItems.clickOnSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('Label with same name already exists. Select a different name.')).toBeTruthy();
            await createMenuItems.clickOnCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        });
        it('[4290]: create same name record in same LOB', async () => {
            //create same name record in same LOB
            await navigationPage.signOut();
            await loginPage.login('jbarnes');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Application Configuration--Menu Items', BWF_PAGE_TITLES.APPLICATION_CONFIGURATIONS.MENU_ITEMS);
            await utilityGrid.selectLineOfBusiness('Human Resource');
            await createMenuItems.clickOnMenuOptionLink();
            await createMenuItems.selectMenuNameDropDown('Label');
            await createMenuItems.clickOnLocalizeLink();
            await localizeValuePopPo.setLocalizeValue(label);
            await localizeValuePopPo.clickOnSaveButton();
            await createMenuItems.clickOnSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('Label with same name already exists. Select a different name.')).toBeTruthy("Error message absent");
            await utilityCommon.closePopUpMessage();
            await createMenuItems.clickOnCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        });
        it('[4290]: create same name record in different LOB', async () => {
            //create same name record in different LOB
            await utilityGrid.selectLineOfBusiness('Facilities');
            await createMenuItems.clickOnMenuOptionLink();
            await createMenuItems.selectMenuNameDropDown('Label');
            await createMenuItems.clickOnLocalizeLink();
            await localizeValuePopPo.setLocalizeValue(label);
            await localizeValuePopPo.clickOnSaveButton();
            // verify LOB is there
            expect(await createMenuItems.getLobValue()).toBe("Facilities");
            await createMenuItems.clickOnSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy("Success message absent");
            // open the record and verify LOB is on edit screen
            await menuItemsConfigConsolePo.searchAndEditMenuOption(label);
            expect(await editMenuItemsConfigPo.getLobValue()).toBe("Facilities");
            await editMenuItemsConfigPo.clickOnCancelButton();
            await utilityGrid.selectLineOfBusiness('Human Resource');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await utilityGrid.selectLineOfBusiness('Human Resource');
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        });
    });

    //kgaikwad
    // this test case steps should be modified due to 21.02 changes
    xdescribe('[4305,4304]: Verify Multiple records with same name', async () => {
        let randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let label = 'label' + randomStr;
        let labelActive1 = 'labelActive1' + randomStr;
        let sourcesActive = 'Email';
        let resolutionCode = 'resolutionCode' + randomStr;
        let resolutionCodeActiveOnUIData = 'resolutionCodeActiveOnUIData' + randomStr;
        it('[4305,4304]: [Menu Items] - Create Menu Item', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Application Configuration--Menu Items', BWF_PAGE_TITLES.APPLICATION_CONFIGURATIONS.MENU_ITEMS);
            await createMenuItems.clickOnMenuOptionLink();
            await createMenuItems.selectMenuNameDropDown('Label');
            await createMenuItems.clickOnLocalizeLink();
            await localizeValuePopPo.setLocalizeValue(label);
            await localizeValuePopPo.clickOnSaveButton();
            await createMenuItems.selectStatusDropDown('Active');
            await createMenuItems.selectAvailableOnUiToggleButton(true);
            await createMenuItems.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();

            await createMenuItems.clickOnMenuOptionLink();
            await createMenuItems.selectMenuNameDropDown('Resolution Code');
            await createMenuItems.clickOnLocalizeLink();
            await localizeValuePopPo.setLocalizeValue(resolutionCode);
            await localizeValuePopPo.clickOnSaveButton();
            await createMenuItems.selectStatusDropDown('Active');
            await createMenuItems.selectAvailableOnUiToggleButton(true);
            await createMenuItems.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
        });
        it('[4305,4304]: [Menu Items] - Update Menu Item', async () => {
            await menuItemsConfigConsolePo.searchAndEditMenuOption(label);
            expect(await editMenuItemsConfigPo.isMenuNameDropDownEnabled()).toBeFalsy('MenuName drop down is editable');
            await editMenuItemsConfigPo.clickOnLocalizeLink();
            await localizeValuePopPo.clearValueTextBox();
            await localizeValuePopPo.setLocalizeValue(labelActive1);
            await localizeValuePopPo.clickOnSaveButton();
            let statusDropDown2: string[] = ["Deprecated", "Inactive", "Active"];
            expect(await editMenuItemsConfigPo.isStatusDropDownValuesMatch(statusDropDown2)).toBeTruthy('wrong column headers');
            await editMenuItemsConfigPo.selectAvailableOnUIToggleButton(true);
            await editMenuItemsConfigPo.clickOnSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy();
            await utilityCommon.closePopUpMessage();
        });
        it('[4305,4304]: [Menu Items] - Update records AND grid Validation', async () => {
            await menuItemsConfigConsolePo.searchAndEditMenuOption(resolutionCode);
            expect(await editMenuItemsConfigPo.isMenuNameDropDownEnabled()).toBeFalsy('MenuName drop down is editable');
            await editMenuItemsConfigPo.clickOnLocalizeLink();
            await localizeValuePopPo.clearValueTextBox();
            await localizeValuePopPo.setLocalizeValue(resolutionCodeActiveOnUIData);
            await localizeValuePopPo.clickOnSaveButton();
            let statusDropDown3: string[] = ["Deprecated", "Inactive", "Active"];
            expect(await editMenuItemsConfigPo.isStatusDropDownValuesMatch(statusDropDown3)).toBeTruthy('wrong column headers');
            await editMenuItemsConfigPo.selectAvailableOnUIToggleButton(true);
            await editMenuItemsConfigPo.clickOnSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy();
            await utilityCommon.closePopUpMessage();

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

            await menuItemsConfigConsolePo.searchOnGridConsole(resolutionCode);
            expect(await menuItemsConfigConsolePo.getSelectedGridRecordValue('Menu Name')).toBe('Resolution Code'), 'Menu Name column value is missing for resolution code';
            expect(await menuItemsConfigConsolePo.getSelectedGridRecordValue('Menu Options')).toBe(resolutionCode), 'Menu Option column value is missing for resolution code';
            expect(await menuItemsConfigConsolePo.getSelectedGridRecordValue('Status')).toBe('Active'), 'Status column value is missing for resolution code';
        });
        it('[4305,4304]: [Menu Items] - Update records AND grid Validation', async () => {
            await navigationPage.signOut();
            await loginPage.login('tadmin');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Application Configuration--Menu Items', BWF_PAGE_TITLES.APPLICATION_CONFIGURATIONS.MENU_ITEMS);
            await menuItemsConfigConsolePo.searchAndEditMenuOption(sourcesActive);
            expect(await editMenuItemsConfigPo.isSaveButtonDisabled()).toBeTruthy();
            expect(await editMenuItemsConfigPo.isMenuItemsStatusDisabled()).toBeTruthy();
            expect(await editMenuItemsConfigPo.getSourceDisabledMessage()).toBe('Note: Source is disabled for editing.');
            expect(await editMenuItemsConfigPo.isMenuNameDropDownEnabled()).toBeFalsy('MenuName drop down is editable');
            expect(await editMenuItemsConfigPo.isLocalizeLinkEnabled()).toBeFalsy();
            await editMenuItemsConfigPo.clickOnCancelButton();
            await menuItemsConfigConsolePo.searchOnGridConsole(sourcesActive);
            expect(await menuItemsConfigConsolePo.getSelectedGridRecordValue('Menu Name')).toBe('Source'), 'Menu Name column value is missing for Source';
            expect(await menuItemsConfigConsolePo.getSelectedGridRecordValue('Menu Options')).toBe(sourcesActive), 'Menu Option column value is missing for source';
            expect(await menuItemsConfigConsolePo.getSelectedGridRecordValue('Status')).toBe('Active'), 'Status column value is missing for source';

        }); afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    //kgaikwad
    describe('[4306]: [Menu Items] Create new records in Menu Items', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let lableRandVal = 'labelVal' + randomStr;
        let resolutionCodeRandVal = 'resolutionCodeVal' + randomStr;

        it('[4306]: Verify Create Menu Item UI', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Application Configuration--Menu Items', BWF_PAGE_TITLES.APPLICATION_CONFIGURATIONS.MENU_ITEMS);
            await createMenuItems.clickOnMenuOptionLink();
            expect(await createMenuItems.isMenuNameFieldRequired()).toBeTruthy('FailureMsg: Menu Name required label is missing');
            expect(await createMenuItems.isMenuOptionFieldRequired()).toBeTruthy('FailureMsg: Menu Option required label is missing');
            expect(await createMenuItems.isStatusFieldRequired()).toBeTruthy('FailureMsg: Status required label is missing');
            let menuNameValues: string[] = ["None", 'Label', 'Resolution Code'];
            expect(await createMenuItems.isMenuNameDropDownValuesMatches(menuNameValues)).toBeTruthy('FailureMsg: Cancel status reason options mismatch');
            let statusValues: string[] = ['Active', 'Inactive', 'Deprecated'];
            expect(await createMenuItems.isStatusDropDownValuesMatches(statusValues)).toBeTruthy('FailureMsg: Cancel status reason options mismatch');
            expect(await createMenuItems.isSaveButtonDisplayed()).toBeTruthy('FailureMsg: save button is missing');
            expect(await createMenuItems.isCancelButtonDisplayed()).toBeTruthy('FailureMsg: Cancel button is missing');
            expect(await createMenuItems.isToggleButtonDisplayed()).toBeTruthy('FailureMsg: Available On UI toogle button is missing ')
        });
        it('[4306]: Create Label Menu and verify in in Grid', async () => {
            await createMenuItems.selectMenuNameDropDown('Label');
            await createMenuItems.clickOnLocalizeLink();
            await localizeValuePopPo.setLocalizeValue(lableRandVal);
            await localizeValuePopPo.clickOnSaveButton();
            await utilityCommon.waitUntilPopUpDisappear();
            await createMenuItems.selectStatusDropDown('Active');
            await createMenuItems.clickOnSaveButton();
            await menuItemsConfigConsolePo.searchOnGridConsole(lableRandVal);
            expect(await menuItemsConfigConsolePo.getSelectedGridRecordValue('Menu Options')).toBe(lableRandVal);
        });
        it('[4306]: Create Resolution Code Menu and verify in in Grid', async () => {
            await createMenuItems.clickOnMenuOptionLink();
            await createMenuItems.selectMenuNameDropDown('Resolution Code');
            await createMenuItems.clickOnLocalizeLink();
            await localizeValuePopPo.setLocalizeValue(resolutionCodeRandVal);
            await localizeValuePopPo.clickOnSaveButton();
            await utilityCommon.waitUntilPopUpDisappear();
            await createMenuItems.selectStatusDropDown('Inactive');
            await createMenuItems.clickOnSaveButton();
            await menuItemsConfigConsolePo.searchOnGridConsole(resolutionCodeRandVal);
            expect(await menuItemsConfigConsolePo.getSelectedGridRecordValue('Menu Options')).toBe(resolutionCodeRandVal);
        });
    });

    //kgaikwad
    describe('[4081]: Check Resolution Code and Resolution Description fields added on Case Template', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateName1, caseTemplateName2, caseTemplateName3, caseTemplateName4, resolutionCode;
        beforeAll(async () => {
            // Create Resoution code
            await apiHelper.apiLogin('qkatawazi');
            let resolutionCodeActiveOnUIData = cloneDeep(RESOLUTION_CODE_ACTIVE_ON_UI)
            resolutionCode = resolutionCodeActiveOnUIData.menuItemName + randomStr;
            resolutionCodeActiveOnUIData.menuItemName = resolutionCode;
            await apiHelper.createNewMenuItem(resolutionCodeActiveOnUIData);

            // Create case template 1 
            let caseTemplateData = {
                "templateName": 'caseTemplateName',
                "templateSummary": 'case_Template_Summary',
                "caseStatus": "InProgress",
                "templateStatus": "Active",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qkatawazi",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3",
                "resolutionCode": "0",
                "resolutionDescription": "0"
            }
            await apiHelper.apiLogin('qkatawazi');
            caseTemplateName1 = caseTemplateData.templateName = randomStr + 'DRDMV17654_caseTemplateName_1';
            caseTemplateData.resolutionCode = "1"
            caseTemplateData.resolutionDescription = "0"
            await apiHelper.createCaseTemplate(caseTemplateData);

            caseTemplateName2 = caseTemplateData.templateName = randomStr + 'DRDMV17654_caseTemplateName_2';
            caseTemplateData.resolutionCode = "0"
            caseTemplateData.resolutionDescription = "1"
            await apiHelper.createCaseTemplate(caseTemplateData);

            caseTemplateName3 = caseTemplateData.templateName = randomStr + 'DRDMV17654_caseTemplateName_3';
            caseTemplateData.resolutionCode = "1"
            caseTemplateData.resolutionDescription = "1"
            await apiHelper.createCaseTemplate(caseTemplateData);

            caseTemplateName4 = caseTemplateData.templateName = randomStr + 'DRDMV17654_caseTemplateName_4';
            caseTemplateData.resolutionCode = "0"
            caseTemplateData.resolutionDescription = "0"
            await apiHelper.createCaseTemplate(caseTemplateData);
        });
        it('[4081]: Create case with selecting case template 1', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('4081_Summary_1');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName1);
            await createCasePage.clickSaveCaseButton();
            await casePreviewPo.clickGoToCaseButton();
        });
        it('[4081]: Validate case with resolution code required true condition ', async () => {
            await updateStatusBladePo.changeStatus('Resolved');
            expect(await updateStatusBladePo.isRequiredTagToResolutionCode()).toBeTruthy('FailureMsg: Required Tab for Resolution Code is missing');
            expect(await updateStatusBladePo.isSaveUpdateStatusButtonEnabled()).toBeFalsy('FailureMsg: Save button is not enabled');
            await updateStatusBladePo.selectStatusReason('Auto Resolved');
            await updateStatusBladePo.selectResolutionCode(resolutionCode);
            expect(await updateStatusBladePo.isSaveUpdateStatusButtonEnabled()).toBeTruthy('FailureMsg: Save button is not disabled');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePo.getTextOfStatus()).toBe('Resolved');
            await updateStatusBladePo.changeStatus('Closed');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePo.getTextOfStatus()).toBe('Closed');
        });
        it('[4081]: Create case with selecting case template 2', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('4081_Summary_2');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName2);
            await createCasePage.clickSaveCaseButton();
            await casePreviewPo.clickGoToCaseButton();
        });
        it('[4081]: Validate case with resolution description required true condition', async () => {
            await updateStatusBladePo.changeStatus('Resolved');
            expect(await updateStatusBladePo.isRequiredTagToResolutionDescription()).toBeTruthy('FailureMsg: Required Tab for Resolution Description is missing');
            expect(await updateStatusBladePo.isSaveUpdateStatusButtonEnabled()).toBeFalsy('FailureMsg: Save button is not enabled');
            await updateStatusBladePo.selectStatusReason('Auto Resolved');
            await updateStatusBladePo.setResolutionDescription('ResolutionDescription2');
            expect(await updateStatusBladePo.isSaveUpdateStatusButtonEnabled()).toBeTruthy('FailureMsg: Save button is not disabled');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePo.getTextOfStatus()).toBe('Resolved');
            await updateStatusBladePo.changeStatus('Closed');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePo.getTextOfStatus()).toBe('Closed');
        });
        it('[4081]: Create case with selecting case template 3', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('4081_Summary_3');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName3);
            await createCasePage.clickSaveCaseButton();
            await casePreviewPo.clickGoToCaseButton();
        });
        it('[4081]: Validate case with Resolution code and Resolution description required true condition', async () => {
            await updateStatusBladePo.changeStatus('Resolved');
            expect(await updateStatusBladePo.isRequiredTagToResolutionCode()).toBeTruthy('FailureMsg: Required Tag for Resolution Code is displayed ');
            expect(await updateStatusBladePo.isRequiredTagToResolutionDescription()).toBeTruthy('FailureMsg: Required Tab for Resolution Description is missing');
            expect(await updateStatusBladePo.isSaveUpdateStatusButtonEnabled()).toBeFalsy('FailureMsg: Save button is not enabled');
            await updateStatusBladePo.selectStatusReason('Auto Resolved');
            await updateStatusBladePo.selectResolutionCode(resolutionCode);
            expect(await updateStatusBladePo.isSaveUpdateStatusButtonEnabled()).toBeFalsy('FailureMsg: Save button is not enabled');
            await updateStatusBladePo.setResolutionDescription('ResolutionDescription2');
            expect(await updateStatusBladePo.isSaveUpdateStatusButtonEnabled()).toBeTruthy('FailureMsg: Save button is not disabled');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePo.getTextOfStatus()).toBe('Resolved');
            await updateStatusBladePo.changeStatus('Closed');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePo.getTextOfStatus()).toBe('Closed');
        });
        it('[4081]: Create case with selecting case template 4', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('4081_Summary_4');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName4);
            await createCasePage.clickSaveCaseButton();
            await casePreviewPo.clickGoToCaseButton();
        });
        it('[4081]: Validate case with Resolution code and Resolution description required false condition', async () => {
            await updateStatusBladePo.changeStatus('Resolved');
            expect(await updateStatusBladePo.isSaveUpdateStatusButtonEnabled()).toBeFalsy('FailureMsg: Save button is not enabled');
            await updateStatusBladePo.selectStatusReason('Auto Resolved');
            expect(await updateStatusBladePo.isSaveUpdateStatusButtonEnabled()).toBeTruthy('FailureMsg: Save button is not disabled');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePo.getTextOfStatus()).toBe('Resolved');
            await updateStatusBladePo.changeStatus('Closed');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePo.getTextOfStatus()).toBe('Closed');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
        });
    });

    //kgaikwad
    describe('[4277]: [Menu Items] - Only Active Label and Sources are available for consumption', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseId;
        let title = 'titleDRDMV16276' + randomStr;
        let summary = 'summaryDRDMV16276' + randomStr;

        let labelActive1 = 'oneLabelActiveDRDMV16276' + randomStr;
        let labelActive2 = 'twoLabelActiveDRDMV16276' + randomStr;
        let labelInactive = 'labelInactiveDRDMV16276' + randomStr;
        let labelDeprecated = 'labelDeprecatedDRDMV16276' + randomStr;

        beforeAll(async () => {
            await apiHelper.apiLogin('qkatawazi');

            // Create Label 1 Active
            let sampleMeniItemData1 = cloneDeep(SAMPLE_MENU_ITEM);
            sampleMeniItemData1.menuItemName = labelActive1;
            await apiHelper.createNewMenuItem(sampleMeniItemData1);

            // Create Label 2 Active
            let sampleMeniItemData2 = cloneDeep(SAMPLE_MENU_ITEM);
            sampleMeniItemData2.menuItemName = labelActive2;
            await apiHelper.createNewMenuItem(sampleMeniItemData2);

            // Create Label Inactive
            let sampleMeniItemData3 = cloneDeep(SAMPLE_MENU_ITEM);
            sampleMeniItemData3.menuItemName = labelInactive;
            sampleMeniItemData3.menuItemStatus = 'Inactive';
            await apiHelper.createNewMenuItem(sampleMeniItemData3);

            // Create Label Deprecated
            let sampleMeniItemData4 = cloneDeep(SAMPLE_MENU_ITEM);
            sampleMeniItemData4.menuItemName = labelDeprecated;
            sampleMeniItemData4.menuItemStatus = 'Deprecated';
            await apiHelper.createNewMenuItem(sampleMeniItemData4);
        });

        it('[4277]: Verify Label & Source With Create Case', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('adam');
            expect(await createCasePage.isValuePresentInDropdown('Label', labelInactive)).toBeFalsy('Value is present in  label drop down');
            await createCasePage.clickAssignToMeButton();
            expect(await createCasePage.isValuePresentInDropdown('Label', labelDeprecated)).toBeFalsy('Value is present in  label drop down');
            await createCasePage.setLabel(labelActive1);
            await createCasePage.setSummary(summary);
            await changeAssignmentPo.setAssignee("US Support 3", "Qadim Katawazi");
            await createCasePage.clickSaveCaseButton();
            await casePreviewPo.clickGoToCaseButton();
            caseId = await viewCasePo.getCaseID();
        });

        it('[4277]: Verify Label With Create Task', async () => {
            await viewCasePo.clickAddTaskButton();
            await manageTask.clickAddAdhocTaskButton();
            await adhoctaskTemplate.setDescription("Description");
            expect(await adhoctaskTemplate.isValuePresentInDropdown('Label', labelInactive)).toBeFalsy('Value is present in  label drop down');
            await adhoctaskTemplate.clickAssignToMeButton();
            expect(await adhoctaskTemplate.isValuePresentInDropdown('Label', labelDeprecated)).toBeFalsy('Value is present in  label drop down');
            await adhoctaskTemplate.selectLabel(labelActive1);
            await adhoctaskTemplate.setSummary(summary);
            await adhoctaskTemplate.clickSaveAdhoctask();
            await manageTask.clickCloseButton();
        });

        it('[4277]: Verify Label With Create Case Template', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
            await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
            await createCasetemplatePo.setTemplateName(title);
            expect(await createCasetemplatePo.isValuePresentInDropdown('Label', labelInactive)).toBeFalsy('Value is present in  label drop down');
            await createCasetemplatePo.setCompanyName('Petramco');
            expect(await createCasetemplatePo.isValuePresentInDropdown('Label', labelDeprecated)).toBeFalsy('Value is present in  label drop down');
            await createCasetemplatePo.setCaseSummary(summary);
            await createCasetemplatePo.setPriorityValue('Low');
            await createCasetemplatePo.setLabelValue(labelActive1);
            await createCasetemplatePo.clickSaveCaseTemplate();
            await utilityCommon.closePopUpMessage();
            await viewCasetemplatePo.clickBackArrowBtn();
        });

        it('[4277]: Verify Label With Create Task Template', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', BWF_PAGE_TITLES.TASK_MANAGEMENT.TEMPLATES);
            await consoleTasktemplatePo.clickOnManualTaskTemplateButton();
            await createTasktemplatePo.setTemplateName(title);
            await createTasktemplatePo.setTaskSummary(summary);
            expect(await createTasktemplatePo.isValuePresentInDropdown('Label', labelInactive)).toBeFalsy('Value is present in  label drop down');
            await createTasktemplatePo.selectTaskPriority('Low');
            expect(await createTasktemplatePo.isValuePresentInDropdown('Label', labelDeprecated)).toBeFalsy('Value is present in  label drop down');
            await createTasktemplatePo.selectCompanyByName('Petramco');
            await createTasktemplatePo.selectLabel(labelActive1);
            await createTasktemplatePo.clickOnSaveTaskTemplate();
            await utilityCommon.closePopUpMessage();
            await viewTasktemplatePo.clickBackArrowBtn();
        });

        it('[4277]: Verify Label With Create Assignment Mapping', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', BWF_PAGE_TITLES.CASE_MANAGEMENT.ASSIGNMENTS);
            await assignmentsConfigConsolePo.clickOnCreateAssignmentConfiguration();
            await createAssignmentsConfigPo.setAssignmentMapName(title);
            expect(await createAssignmentsConfigPo.isValuePresentInDropdown('Label', labelInactive)).toBeFalsy('Value is present in  label drop down');
            await createAssignmentsConfigPo.setCompany("Petramco");
            expect(await createAssignmentsConfigPo.isValuePresentInDropdown('Label', labelDeprecated)).toBeFalsy('Value is present in  label drop down');
            await createAssignmentsConfigPo.setSupportCompany("Petramco");
            await createAssignmentsConfigPo.setSupportOrg('Canada Support');
            await createAssignmentsConfigPo.setSupportGroup("CA Support 1");
            await createAssignmentsConfigPo.setLabel(labelActive1);
            await createAssignmentsConfigPo.clickonSaveButton();
        });

        it('[4277]: Verify Label With Case Read Access', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Read Access', BWF_PAGE_TITLES.CASE_MANAGEMENT.READ_ACCESS);
            await consoleReadAcess.clickOnReadAccessConfiguration();
            await addReadAccess.setReadAccessConfigurationName(title);
            await addReadAccess.selectCompany('Petramco');
            await addReadAccess.selectSupportCompany('Petramco');
            expect(await addReadAccess.isValuePresentInDropdown('Label', labelInactive)).toBeFalsy('Value is present in  label drop down');
            await addReadAccess.selectSupportOrg('Canada Support');
            expect(await addReadAccess.isValuePresentInDropdown('Label', labelDeprecated)).toBeFalsy('Value is present in  label drop down');
            await addReadAccess.selectSupportGroup('CA Support 1');
            await addReadAccess.selectLabel(labelActive1)
            await addReadAccess.selectSupportCompany('Petramco');
            await addReadAccess.selectSupportOrg('Canada Support');
            await addReadAccess.selectSupportGroup('CA Support 1');
            await addReadAccess.clickOnSave();
        });

        it('[4277]: Verify Label With Create SVT', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', BWF_PAGE_TITLES.SERVICE_LEVEL_MANAGEMENT.SERVICE_TARGET);
            await serviceTargetConfig.createServiceTargetConfig(title, 'Global', 'Case Management');
            await SlmExpressionBuilder.selectExpressionQualification('Label', '=', labelActive1, "Search");
            await SlmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.selectGoal("4");
            await serviceTargetConfig.selectMeasurement();
            await serviceTargetConfig.selectExpressionForMeasurement(0, "Status", "=", "Assigned", "Direct");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "Status", "=", "Resolved", "Direct");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "Status", "=", "Pending", "Direct");
            await serviceTargetConfig.clickOnSaveSVTButton();
            browser.sleep(2000);
        });

        it('[4277]: Change Status Active Label Status to InActive', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Application Configuration--Menu Items', BWF_PAGE_TITLES.APPLICATION_CONFIGURATIONS.MENU_ITEMS);
            await menuItemsConfigConsolePo.searchAndEditMenuOption(labelActive1);
            await editMenuItemsConfigPo.selectStatusDropDown('Inactive');
            await editMenuItemsConfigPo.clickOnSaveButton();
        });

        it('[4277]: Verify Label With Edit Case', async () => {
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(caseId);
            await viewCasePo.clickEditCaseButton();
            await editCasePo.updateLabel(labelInactive);
            await changeAssignmentPo.setAssignee("US Support 3", "Qadim Katawazi");
            await editCasePo.clickSaveCase();
            expect(await utilityCommon.isPopUpMessagePresent('The Label you have selected is either Inactive or Deprecated. Please select a valid Label.')).toBeTruthy('Popup message not present');
            await utilityCommon.closePopUpMessage();
            await editCasePo.updateLabel(labelDeprecated);
            await editCasePo.clickSaveCase();
            expect(await utilityCommon.isPopUpMessagePresent('The Label you have selected is either Inactive or Deprecated. Please select a valid Label.')).toBeTruthy('Popup message not present');
            await utilityCommon.closePopUpMessage();
            await editCasePo.updateLabel(labelActive2);
            await editCasePo.clickSaveCase();
            await viewCasePo.clickEditCaseButton();
            await editCasePo.updateLabel(labelDeprecated);
            await editCasePo.clickSaveCase();
            expect(await utilityCommon.isPopUpMessagePresent('The Label you have selected is either Inactive or Deprecated. Please select a valid Label.')).toBeTruthy('Popup message not present');
            await utilityCommon.closePopUpMessage();
            await editCasePo.clickOnCancelCaseButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        });

        it('[4277]: Verify Label With Edit Task', async () => {
            await viewCasePo.clickOnTaskLink(summary);
            await viewTaskPo.clickOnEditTask();
            await editTaskPo.setLabel(labelInactive);
            await editTaskPo.clickOnSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('The Label you have selected is either Inactive or Deprecated. Please select a valid Label.')).toBeTruthy('Popup message not present');
            await utilityCommon.closePopUpMessage();
            await editTaskPo.setLabel(labelDeprecated);
            await editTaskPo.clickOnSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('The Label you have selected is either Inactive or Deprecated. Please select a valid Label.')).toBeTruthy('Popup message not present');
            await utilityCommon.closePopUpMessage();
            await editTaskPo.setLabel(labelActive2);
            await editTaskPo.clickOnSaveButton();
            await viewTaskPo.clickOnEditTask();
            await editTaskPo.setLabel(labelInactive);
            await editTaskPo.clickOnSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('The Label you have selected is either Inactive or Deprecated. Please select a valid Label.')).toBeTruthy('Popup message not present');
            await utilityCommon.closePopUpMessage();
            await editTaskPo.clickOnCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        });

        it('[4277]: Verify Label With Edit Case Template', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
            await consoleCasetemplatePo.searchAndClickOnCaseTemplate(title);
            await viewCasetemplatePo.clickOnEditCaseTemplateButton();
            await editCasetemplatePo.changeLabelValue(labelInactive);
            await editCasetemplatePo.clickSaveCaseTemplate();
            expect(await utilityCommon.isPopUpMessagePresent('The Label you have selected is either Inactive or Deprecated. Please select a valid Label.')).toBeTruthy('Popup message not present');
            await editCasetemplatePo.changeLabelValue(labelDeprecated);
            await editCasetemplatePo.clickSaveCaseTemplate();
            expect(await utilityCommon.isPopUpMessagePresent('The Label you have selected is either Inactive or Deprecated. Please select a valid Label.')).toBeTruthy('Popup message not present');
            await editCasetemplatePo.changeLabelValue(labelActive2);
            await editCasetemplatePo.clickSaveCaseTemplate();
            await viewCasetemplatePo.clickOnEditCaseTemplateButton();
            await editCasetemplatePo.changeLabelValue(labelActive1);
            await editCasetemplatePo.clickSaveCaseTemplate();
            await viewCasetemplatePo.clickBackArrowBtn()
            //  expect(await utilityCommon.isPopUpMessagePresent('The Label you have selected is either Inactive or Deprecated. Please select a valid Label.')).toBeTruthy('Popup message not present');
        });

        it('[4277]: Verify Inactive, deprecated label With Edit Task Template', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', BWF_PAGE_TITLES.TASK_MANAGEMENT.TEMPLATES);
            await consoleTasktemplatePo.searchAndOpenTaskTemplate(title);
            await viewTasktemplatePo.clickOnEditLink();
            await editTasktemplatePo.selectLabel(labelInactive);
            await editTasktemplatePo.clickOnSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('The Label you have selected is either Inactive or Deprecated. Please select a valid Label.')).toBeTruthy('Popup message not present');

            await editTasktemplatePo.selectLabel(labelDeprecated);
            await editTasktemplatePo.clickOnSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('The Label you have selected is either Inactive or Deprecated. Please select a valid Label.')).toBeTruthy('Popup message not present');
            await utilityCommon.closePopUpMessage();
        });

        it('[4277]: Verify Label With Edit Task Template', async () => {
            await editTasktemplatePo.selectLabel(labelActive2);
            await editTasktemplatePo.clickOnSaveButton();
            await viewTasktemplatePo.clickOnEditLink();
            await editTasktemplatePo.selectLabel(labelActive1);
            await editTasktemplatePo.clickOnSaveButton();
            await viewTasktemplatePo.clickBackArrowBtn();
            //expect(await utilityCommon.isPopUpMessagePresent('The Label you have selected is either Inactive or Deprecated. Please select a valid Label.')).toBeTruthy('Popup message not present');
        });

        it('[4277]: Verify Label With Edit Assignment Mapping', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', BWF_PAGE_TITLES.CASE_MANAGEMENT.ASSIGNMENTS);
            await assignmentsConfigConsolePo.searchAndClickOnAssignmentConfig(title);

            await editAssignmentsConfigPo.setLabel(labelInactive);
            await editAssignmentsConfigPo.clickonSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('The Label you have selected is either Inactive or Deprecated. Please select a valid Label.')).toBeTruthy('Popup message not present');
            await utilityCommon.closePopUpMessage();
            await editAssignmentsConfigPo.setLabel(labelDeprecated);
            await editAssignmentsConfigPo.clickonSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('The Label you have selected is either Inactive or Deprecated. Please select a valid Label.')).toBeTruthy('Popup message not present');
            await utilityCommon.closePopUpMessage();
            await editAssignmentsConfigPo.setLabel(labelActive2);
            await editAssignmentsConfigPo.clickonSaveButton();

            await assignmentsConfigConsolePo.searchAndClickOnAssignmentConfig(title);
            await editAssignmentsConfigPo.setLabel(labelActive1);
            await editAssignmentsConfigPo.clickonSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy("Success message absent");
        });

        it('[4277]: Verify Label With Edit Case Read Access', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Read Access', BWF_PAGE_TITLES.CASE_MANAGEMENT.READ_ACCESS);
            await consoleReadAcess.searchAndOpenReadAccess(title);

            await editReadAccessConfigPo.setLabel(labelInactive);
            await editReadAccessConfigPo.clickOnSave();
            expect(await utilityCommon.isPopUpMessagePresent('The Label you have selected is either Inactive or Deprecated. Please select a valid Label.')).toBeTruthy('Popup message not present');
            await utilityCommon.closePopUpMessage();

            await editReadAccessConfigPo.setLabel(labelDeprecated);
            await editReadAccessConfigPo.clickOnSave();
            expect(await utilityCommon.isPopUpMessagePresent('The Label you have selected is either Inactive or Deprecated. Please select a valid Label.')).toBeTruthy('Popup message not present');
            await utilityCommon.closePopUpMessage();

            await editReadAccessConfigPo.setLabel(labelActive2);
            await editReadAccessConfigPo.clickOnSave();
            await consoleReadAcess.searchAndOpenReadAccess(title);
            await editReadAccessConfigPo.setLabel(labelActive1);
            await editReadAccessConfigPo.clickOnSave();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy("Success message absent");
        });
    });
});