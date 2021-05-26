import { browser } from "protractor";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import configureDataSourceConsolePage from '../../pageobject/settings/slm/configure-data-source-config-console.po';
import { BWF_BASE_URL, BWF_PAGE_TITLES } from '../../utils/constants';
import createConfigureDataSourceConfigPo from '../../pageobject/settings/slm/create-configure-data-source-config.po';
import editConfigureDataSourceConfigPo from '../../pageobject/settings/slm/edit-configure-data-source-config.po';
import approvalConfigurationPage from "../../pageobject/settings/approval/approval-configuration.po";
import utilityCommon from '../../utils/utility.common';
import { default as serviceTargetConfig } from '../../pageobject/settings/slm/service-target-blade.po';
import SlmExpressionBuilder from '../../pageobject/settings/slm/slm-expressionbuilder.pop.po';
import utilityGrid from '../../utils/utility.grid';

let caseBAUser = 'qkatawazi';

describe('Data Source Configuration Tests', () => {
    const dataSourceConsoleHeading = 'Data Source Configuration';
    const dataSourceConsoleDesc = 'Create/update a data source for flexibility to calculate service targets differently for each record.';
    const createdataSourceConfigHeading = 'Create Data Source Configuration';

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login(caseBAUser);
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    //skhobrag
    describe('[6052,6051,6050,6048,6042,6043]: SLM - Configure Data Source - Create a new Data Source', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let dataSourceDisplayName = 'Case Data Source_' + randomStr;
        let dataSourceDisplayName2 = 'Case Data Source2_' + randomStr;
        let dataSourceRecordDefinitionOptions = ['com.bmc.dsm.case-lib:Case Detail', 'com.bmc.dsm.case-lib:Case Detail Signature']

        it('[6052,6051,6050,6048,6042,6043]: Verify Data Source Configuration Creation', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Configure Data Source', BWF_PAGE_TITLES.SERVICE_LEVEL_MANAGEMENT.CONFIGURE_DATA_SOURCE);
            expect(await configureDataSourceConsolePage.getDataSourceConfigurationConsoleHeading()).toBe(dataSourceConsoleHeading);
            await configureDataSourceConsolePage.clickConfigDataSourceBtn();
            expect(await createConfigureDataSourceConfigPo.getAddDataSourceConfigurationHeading()).toBe(createdataSourceConfigHeading);
            expect(await createConfigureDataSourceConfigPo.isDataSourceFieldRequired('Display Name')).toBeTruthy('Display Name field is marked as optional field');
            expect(await createConfigureDataSourceConfigPo.isDataSourceFieldRequired('Application Name')).toBeTruthy('Application Name field is marked as optional field');
            expect(await createConfigureDataSourceConfigPo.isDataSourceFieldRequired('Record Definition Name')).toBeTruthy('Record Definition Name field is marked as optional field');
            expect(await createConfigureDataSourceConfigPo.isDataSourceFieldRequired('Company Field')).toBeTruthy('Company Field field is marked as optional field');
            await createConfigureDataSourceConfigPo.clickCancelButton();
            await configureDataSourceConsolePage.clickConfigDataSourceBtn();
            expect(await createConfigureDataSourceConfigPo.getAddDataSourceConfigurationHeading()).toBe(createdataSourceConfigHeading);
            await createConfigureDataSourceConfigPo.setDataSourceDisplayName(dataSourceDisplayName);
            await createConfigureDataSourceConfigPo.clickCancelButton();
            expect(await utilityCommon.getWarningDialogMsg()).toBe('You have unsaved data. Do you want to continue without saving?');
            await utilityCommon.clickOnApplicationWarningYesNoButton('No');
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Application Name(required)', 'Innovation Studio');
            expect(await utilityCommon.isPopupMsgsMatches(['No Record Definition exists for the selected Application Name com.bmc.arsys.rx.innovationstudio'])).toBeTruthy('Error : Record definition does not exists error message is not displayed.');
            await utilityCommon.closePopUpMessage();
            expect(await createConfigureDataSourceConfigPo.isSaveBtnDisabled()).toBeTruthy('Save button is found enabled.');

            await createConfigureDataSourceConfigPo.setDataSourceDisplayName(dataSourceDisplayName);
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Application Name(required)', 'Case Management Service');
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Record Definition Name(required)', 'com.bmc.dsm.case-lib:Case Approval Mapping');
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Company Field(required)', 'Assignee');
            expect(await createConfigureDataSourceConfigPo.isSaveBtnDisabled()).toBeFalsy('Save button is found disabled.');
            await createConfigureDataSourceConfigPo.clickDataSourceLink('Show Advanced Settings');
            expect(await createConfigureDataSourceConfigPo.isDataSourceAdvancedFieldRequired('Association Name')).toBeFalsy('Association Name field is marked as required field');
            expect(await createConfigureDataSourceConfigPo.isDataSourceAdvancedFieldRequired('Create Qualification View')).toBeFalsy('Create Qualification View field is marked as required field');
            expect(await createConfigureDataSourceConfigPo.isDataSourceAdvancedFieldRequired('Edit Qualification View')).toBeFalsy('Edit Qualification View field is marked as required field');
            expect(await createConfigureDataSourceConfigPo.isDataSourceAdvancedFieldRequired('Assigned Group')).toBeFalsy('Assigned Group field is marked as required field');
            expect(await createConfigureDataSourceConfigPo.isDataSourceAdvancedFieldRequired('Dynamic Business Entity')).toBeFalsy('Dynamic Business Entity field is marked as required field');
            expect(await createConfigureDataSourceConfigPo.isDataSourceAdvancedFieldRequired('Dynamic Start Time Field')).toBeFalsy('Dynamic Start Time Field field is marked as required field');
            expect(await createConfigureDataSourceConfigPo.isDataSourceFieldRequired('Reset Goal Condition')).toBeFalsy('Reset Goal Condition field is marked as required field');
            expect(await createConfigureDataSourceConfigPo.isDataSourceAdvancedFieldRequired('Dynamic End Time Field')).toBeFalsy('Dynamic End Time Field field is marked as required field');
            expect(await createConfigureDataSourceConfigPo.isDataSourceAdvancedFieldRequired('Dynamic Goal Time Field')).toBeFalsy('Dynamic Goal Time Field field is marked as required field');
            expect(await createConfigureDataSourceConfigPo.isDataSourceAdvancedFieldRequired('Category Field')).toBeFalsy('Category Field field is marked as required field');
            expect(await createConfigureDataSourceConfigPo.isDataSourceAdvancedFieldsDisabled('Dynamic End Time Field')).toBeTruthy('Dynamic End Time Field is enabled on Create Data Source Config screen');
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Association Name', 'com.bmc.dsm.case-lib:Case Approval mapping Field - Label');
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Create Qualification View', 'com.bmc.dsm.case-lib:Case Qualification Builder');
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Edit Qualification View', 'com.bmc.dsm.case-lib:Case Qualification Builder');
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Assigned Group', 'Assignee');
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Dynamic Business Entity', 'Assignee');
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Dynamic Start Time Field', 'Created Date');
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Dynamic Goal Time Field', 'Assignee');
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Category Field', 'Category Tier 1');
            await createConfigureDataSourceConfigPo.clickUseEndTimeCheckbox();
            await browser.sleep(2000);
            expect(await createConfigureDataSourceConfigPo.isDataSourceAdvancedFieldsDisabled('Dynamic End Time Field')).toBeFalsy('Dynamic End Time Field is disabled on Create Data Source Config screen');
            expect(await createConfigureDataSourceConfigPo.isDataSourceAdvancedFieldsDisabled('Dynamic Goal Time Field')).toBeTruthy('Dynamic Goal Time Field is enabled on Create Data Source Config screen');
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Dynamic End Time Field', 'Modified Date');
            await createConfigureDataSourceConfigPo.clickDataSourceLinkBuildExpression('Build Expression');
            expect(await approvalConfigurationPage.isCreateNewApprovalFlowPopUpDisplayed()).toBeTruthy();
            expect(await approvalConfigurationPage.getCreateNewApprovalFlowPopUpTitle()).toContain('Edit expression');
            await browser.sleep(3000); // sleep added for expression builder loading time
            await approvalConfigurationPage.searchExpressionFieldOption('Assignee');
            await browser.sleep(2000); // sleep added for expression builder loading time
            await approvalConfigurationPage.selectExpressionFieldOption('Assignee');
            await browser.sleep(2000); // sleep added for expression builder loading time
            await approvalConfigurationPage.selectExpressionOperator('=');
            await browser.sleep(1000); // sleep added for expression builder loading time
            await approvalConfigurationPage.setExpressionValueForParameter('"' + "Qadim Katawazi" + '"');
            await createConfigureDataSourceConfigPo.clickRegularExpressionSaveButton();
            await createConfigureDataSourceConfigPo.clickSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message is not displayed.');
        });

        it('[6052,6051,6050,6048,6042,6043]: Verify Data Source Configuration Updation', async () => {
            await utilityGrid.searchAndOpenHyperlink(dataSourceDisplayName);
            await browser.sleep(2000); // added hard wait to load Edit Data Source Blade
            expect(await editConfigureDataSourceConfigPo.isDataSourceDisplayNameFieldDisabled('Display Name')).toBeTruthy('Display Name field is optional on Edit Data Source Config screen');            
            expect(await editConfigureDataSourceConfigPo.isDataSourceFieldDisabled('Application Name')).toBeTruthy('Application Name field is optional on Edit Data Source Config screen');
            expect(await editConfigureDataSourceConfigPo.isDataSourceFieldDisabled('Record Definition Name')).toBeTruthy('Record Definition Name field is optional on Edit Data Source Config screen');
            expect(await editConfigureDataSourceConfigPo.isDataSourceFieldDisabled('Company Field')).toBeTruthy('Company Field field is optional on Edit Data Source Config screen');
            expect(await editConfigureDataSourceConfigPo.getDataSourceInputFieldValue('Display Name')).toBe(dataSourceDisplayName);
            expect(await editConfigureDataSourceConfigPo.getDatSourceAdvancedFieldValue('Application Name')).toBe('Case Management Service');
            expect(await editConfigureDataSourceConfigPo.getDatSourceAdvancedFieldValue('Record Definition Name')).toBe('com.bmc.dsm.case-lib:Case Approval Mapping');
            expect(await editConfigureDataSourceConfigPo.getDatSourceAdvancedFieldValue('Company Field')).toBe('Assignee');
            await editConfigureDataSourceConfigPo.clickDataSourceLink('Show Advanced Settings');
            expect(await editConfigureDataSourceConfigPo.isDataSourceFieldDisabled('Association Name')).toBeFalsy('Association Name field is required on Edit Data Source Config screen');
            expect(await editConfigureDataSourceConfigPo.isDataSourceFieldDisabled('Create Qualification View')).toBeFalsy('Create Qualification View field is required on Edit Data Source Config screen');
            expect(await editConfigureDataSourceConfigPo.isDataSourceFieldDisabled('Edit Qualification View')).toBeFalsy('Edit Qualification View field is required on Edit Data Source Config screen');
            expect(await editConfigureDataSourceConfigPo.isDataSourceFieldDisabled('Assigned Group')).toBeFalsy('Assigned Group field is required on Edit Data Source Config screen');
            expect(await editConfigureDataSourceConfigPo.isDataSourceFieldDisabled('Dynamic Business Entity')).toBeFalsy('Dynamic Business Entity field is required on Edit Data Source Config screen');
            expect(await editConfigureDataSourceConfigPo.isDataSourceFieldDisabled('Dynamic Start Time Field')).toBeFalsy('Dynamic Start Time Field is required on Edit Data Source Config screen');
            expect(await editConfigureDataSourceConfigPo.isDataSourceFieldDisabled('Dynamic End Time Field')).toBeFalsy('Dynamic End Time Field is required on Edit Data Source Config screen');
            expect(await editConfigureDataSourceConfigPo.isDataSourceFieldDisabled('Dynamic Goal Time Field')).toBeTruthy('Dynamic Goal Time Field field is required on Edit Data Source Config screen');
            expect(await editConfigureDataSourceConfigPo.isDataSourceFieldDisabled('Category Field')).toBeTruthy('Category Field Field field is required on Edit Data Source Config screen');

            expect(await editConfigureDataSourceConfigPo.getDatSourceAdvancedFieldValue('Association Name')).toBe('com.bmc.dsm.case-lib:Case Approval mapping Field - Label');
            expect(await editConfigureDataSourceConfigPo.getDatSourceAdvancedFieldValue('Create Qualification View')).toBe('com.bmc.dsm.case-lib:Case Qualification Builder');
            expect(await editConfigureDataSourceConfigPo.getDatSourceAdvancedFieldValue('Edit Qualification View')).toBe('com.bmc.dsm.case-lib:Case Qualification Builder');
            expect(await editConfigureDataSourceConfigPo.getDatSourceAdvancedFieldValue('Assigned Group')).toBe('Assignee');
            expect(await editConfigureDataSourceConfigPo.getDatSourceAdvancedFieldValue('Dynamic Business Entity')).toBe('Assignee');
            expect(await editConfigureDataSourceConfigPo.getDatSourceAdvancedFieldValue('Dynamic Start Time Field')).toBe('Created Date');
            expect(await editConfigureDataSourceConfigPo.getDatSourceAdvancedFieldValue('Dynamic End Time Field')).toBe('Modified Date');
            expect(await editConfigureDataSourceConfigPo.getDatSourceAdvancedFieldValue('Dynamic Goal Time Field')).toBe('Select');
            expect(await editConfigureDataSourceConfigPo.getDatSourceAdvancedFieldValue('Category Field')).toBe('Category Tier 1');
            await editConfigureDataSourceConfigPo.selectDataSourceFieldOption('Assigned Group', 'Description');
            await editConfigureDataSourceConfigPo.clickSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message is not displayed.');
            await utilityGrid.searchAndOpenHyperlink(dataSourceDisplayName);
            await browser.sleep(2000); // added hard wait to close Edit Data Source Blade
            await editConfigureDataSourceConfigPo.clickDataSourceLink('Show Advanced Settings');
            expect(await editConfigureDataSourceConfigPo.getDatSourceAdvancedFieldValue('Assigned Group')).toBe('Description');
            await editConfigureDataSourceConfigPo.clickCancelButton();
        });

        it('[6052,6051,6050,6048,6042,6043]: Verify that the already utilized record definition is not available for new data source', async () => {
            await configureDataSourceConsolePage.clickConfigDataSourceBtn();
            await browser.sleep(5000); // added hard wait to load Create Data Source Blade
            expect(await createConfigureDataSourceConfigPo.getAddDataSourceConfigurationHeading()).toBe(createdataSourceConfigHeading);
            await createConfigureDataSourceConfigPo.setDataSourceDisplayName(dataSourceDisplayName2);
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Application Name(required)', 'Case Management Service');
            expect(await createConfigureDataSourceConfigPo.isValuePresentInDropdown('Record Definition Name', 'Case Approval Mapping')).toBeFalsy('Field Option Not Displayed');
            await createConfigureDataSourceConfigPo.clickCancelButton();
            expect(await utilityCommon.getWarningDialogMsg()).toBe('You have unsaved data. Do you want to continue without saving?');
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        });

        it('[6052,6051,6050,6048,6042,6043]: Verify the error when existing data source used in SVT configs is modified', async () => {
            await utilityGrid.searchAndOpenHyperlink('Case Management');
            await browser.sleep(2000); // added hard wait to load Edit Data Source Blade
            expect(await editConfigureDataSourceConfigPo.isDataSourceDisplayNameFieldDisabled('Display Name')).toBeTruthy('Display Name field is enabled on Edit Data Source Config screen');
            await editConfigureDataSourceConfigPo.clickDataSourceLink('Show Advanced Settings');
            await editConfigureDataSourceConfigPo.selectDataSourceNoneOption('Assigned Group');
            expect(await utilityCommon.isPopUpMessagePresent('For a valid measurement data, ensure that Service Targets do not use this option.')).toBeTruthy('Error : error message is not displayed.');
            await editConfigureDataSourceConfigPo.clickCancelButton();
            expect(await utilityCommon.getWarningDialogMsg()).toBe('You have unsaved data. Do you want to continue without saving?');
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        });
    });

    //skhobrag
    describe('[6049,6049,6045,6047]: SLM - Configure Data Source - Build Expression', async () => {
        let dataSourceMaxLimit = "DataSource is a name given to the connection set to.";
        let dataSourceAlphaNumeric = "DaTaSource is a Name given to the set 21378236872";
        let dataSourceSpecialChars = "DaTaSource is a #$%&@^(*@#&*&@*( given to the set";

        it('[6049,6049,6045,6047]: Verify Data Source Configuration Creation with Input Characters Validation', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Configure Data Source', BWF_PAGE_TITLES.SERVICE_LEVEL_MANAGEMENT.CONFIGURE_DATA_SOURCE);
            expect(await configureDataSourceConsolePage.getDataSourceConfigurationConsoleHeading()).toBe(dataSourceConsoleHeading);
            await configureDataSourceConsolePage.clickConfigDataSourceBtn();
            expect(await createConfigureDataSourceConfigPo.getAddDataSourceConfigurationHeading()).toBe(createdataSourceConfigHeading);
            await createConfigureDataSourceConfigPo.setDataSourceDisplayName(dataSourceMaxLimit);
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Application Name(required)', 'Case Management Service');
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Record Definition Name(required)', 'com.bmc.dsm.case-lib:Case Assignment Mapping');
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Company Field(required)', 'Assigned Company');
            expect(await createConfigureDataSourceConfigPo.isSaveBtnDisabled()).toBeFalsy('Save button is found disabled.');
            await createConfigureDataSourceConfigPo.clickSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('Value does not fall within the limits specified for the field (Field ID and Name - com.bmc.dsm.slm-lib:Config Data Source <300520600 : AppDataSourceDisplayAs>, ...')).toBeTruthy('Record not saved validation message is not displayed.');
            await createConfigureDataSourceConfigPo.setDataSourceDisplayName(dataSourceAlphaNumeric);
            await createConfigureDataSourceConfigPo.clickDataSourceLink('Show Advanced Settings');
            expect(await createConfigureDataSourceConfigPo.isDataSourceAdvancedFieldsDisabled('Dynamic End Time Field')).toBeTruthy('Dynamic End Time Field is enabled on Create Data Source Config screen');
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Association Name', 'com.bmc.dsm.case-lib:Case Assignment Mapping Field - Assignee');
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Create Qualification View', 'com.bmc.dsm.case-lib:Case Qualification Builder');
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Edit Qualification View', 'com.bmc.dsm.case-lib:Case Qualification Builder');
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Assigned Group', 'Assigned Group');
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Dynamic Business Entity', 'Assigned Group');
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Dynamic Start Time Field', 'Created Date');
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Dynamic Goal Time Field', 'Category Tier 1');
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Category Field', 'Category Tier 1');
            await createConfigureDataSourceConfigPo.clickUseEndTimeCheckbox();
            await createConfigureDataSourceConfigPo.clickDataSourceLinkBuildExpression('Build Expression');
            expect(await approvalConfigurationPage.isCreateNewApprovalFlowPopUpDisplayed()).toBeTruthy();
            expect(await approvalConfigurationPage.getCreateNewApprovalFlowPopUpTitle()).toContain('Edit expression');
            await browser.sleep(3000); // sleep added for expression builder loading time
            await approvalConfigurationPage.searchExpressionFieldOption('Assigned Group');
            await browser.sleep(2000); // sleep added for expression builder loading time
            await approvalConfigurationPage.selectExpressionFieldOption('Assigned group');
            await browser.sleep(2000); // sleep added for expression builder loading time
            await approvalConfigurationPage.selectExpressionOperator('=');
            await browser.sleep(1000); // sleep added for expression builder loading time
            await approvalConfigurationPage.setExpressionValueForParameter('"' + "Employee Relations" + '"');
            await createConfigureDataSourceConfigPo.clickRegularExpressionSaveButton();
            expect(await createConfigureDataSourceConfigPo.isDataSourceAdvancedFieldsDisabled('Dynamic Goal Time Field')).toBeTruthy('Dynamic Goal Time Field is enabled on Create Data Source Config screen');
            expect(await createConfigureDataSourceConfigPo.isDataSourceAdvancedFieldsDisabled('Dynamic End Time Field')).toBeFalsy('Dynamic End Time Field is disabled on Create Data Source Config screen');
            await createConfigureDataSourceConfigPo.clickSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('You must enter an End Time value.')).toBeTruthy('Dynamic End Time Validation message is not displayed.');
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Dynamic End Time Field', 'Modified Date');
            await createConfigureDataSourceConfigPo.clickSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message is not displayed.');
        });

        it('[6049,6049,6045,6047]: Verify Data Source Configuration Creation with Reset Goal Validation', async () => {
            await utilityGrid.searchAndOpenHyperlink(dataSourceAlphaNumeric);
            await browser.sleep(2000); // added hard wait to load Edit Data Source Blade
            expect(await editConfigureDataSourceConfigPo.getDataSourceInputFieldValue('Display Name')).toBe(dataSourceAlphaNumeric);
            await editConfigureDataSourceConfigPo.clickCancelButton();
        });

        it('[6049,6049,6045,6047]: Verify Data Source Configuration Creation with Build Expression Validation', async () => {
            await configureDataSourceConsolePage.clickConfigDataSourceBtn();
            await browser.sleep(5000); // added hard wait to load Create Data Source Blade
            expect(await createConfigureDataSourceConfigPo.getAddDataSourceConfigurationHeading()).toBe(createdataSourceConfigHeading);
            await createConfigureDataSourceConfigPo.setDataSourceDisplayName(dataSourceSpecialChars);
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Application Name(required)', 'Case Management Service');
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Record Definition Name(required)', 'com.bmc.dsm.case-lib:Case Detail');
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Company Field(required)', 'Assigned Company Primary');
            expect(await createConfigureDataSourceConfigPo.isSaveBtnDisabled()).toBeFalsy('Save button is found disabled.');
            await createConfigureDataSourceConfigPo.clickSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message is not displayed.');
        });

    });

    //skhobrag
    describe('[4901]: Create a Task Management Data Source to enable Dynamic fields and check dependencies on SVT blade', async () => {
        let dataSourceDisplayName = "Task Management";

        it('[4901]: Verify Task Management Data Source Configuration is provided OOTB and can be modified', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Configure Data Source', BWF_PAGE_TITLES.SERVICE_LEVEL_MANAGEMENT.CONFIGURE_DATA_SOURCE);
            expect(await configureDataSourceConsolePage.getDataSourceConfigurationConsoleHeading()).toBe(dataSourceConsoleHeading);
            await utilityGrid.searchAndOpenHyperlink(dataSourceDisplayName);
            await browser.sleep(2000); // added hard wait to load Edit Data Source Blade
            await editConfigureDataSourceConfigPo.clickDataSourceLink('Show Advanced Settings');
            await editConfigureDataSourceConfigPo.selectDataSourceFieldOption('Dynamic Business Entity', 'Assigned Company');
            await editConfigureDataSourceConfigPo.selectDataSourceFieldOption('Dynamic Start Time Field', 'Created Date');
            await editConfigureDataSourceConfigPo.selectDataSourceFieldOption('Dynamic Goal Time Field', 'Assignee');
            await editConfigureDataSourceConfigPo.clickEndTimeCheckbox();
            await editConfigureDataSourceConfigPo.selectDataSourceFieldOption('Dynamic End Time Field', 'Modified Date');
            await editConfigureDataSourceConfigPo.clickBuildExpressionBtn();
            expect(await approvalConfigurationPage.isCreateNewApprovalFlowPopUpDisplayed()).toBeTruthy();
            expect(await approvalConfigurationPage.getCreateNewApprovalFlowPopUpTitle()).toContain('Edit expression');
            await browser.sleep(3000); // sleep added for expression builder loading time
            await approvalConfigurationPage.searchExpressionFieldOption('Assigned company');
            await browser.sleep(2000); // sleep added for expression builder loading time
            await approvalConfigurationPage.selectExpressionFieldOption('Assigned company');
            await browser.sleep(2000); // sleep added for expression builder loading time
            await approvalConfigurationPage.selectExpressionOperator('=');
            await browser.sleep(1000); // sleep added for expression builder loading time
            await approvalConfigurationPage.setExpressionValueForParameter('"' + "Petramco" + '"');
            await createConfigureDataSourceConfigPo.clickRegularExpressionSaveButton();
            await editConfigureDataSourceConfigPo.clickSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message is not displayed.');
        });

        it('[4901]: Create a Task SVT and verify the data source details are enabled', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', BWF_PAGE_TITLES.SERVICE_LEVEL_MANAGEMENT.SERVICE_TARGET);
            await serviceTargetConfig.createServiceTargetConfig('SVT with all fields', 'Petramco', 'Task Management');
            await SlmExpressionBuilder.selectExpressionQualification('Priority', '=','High', "Direct");
            await SlmExpressionBuilder.clickOnSaveExpressionButtonForTask();
            await serviceTargetConfig.selectGoalType('Task Resolution Time');
            await serviceTargetConfig.enterSVTDescription('SVT with all fields Desc');
            await serviceTargetConfig.selectGoal("2");
            expect(await serviceTargetConfig.isGoalCheckboxDisabled('Goal Time')).toBeFalsy('Goal Time field is disabled.');
            expect(await serviceTargetConfig.isGoalCheckboxDisabled('Business Entity')).toBeFalsy('Business Entity field is disabled.');
            expect(await serviceTargetConfig.isGoalCheckboxDisabled('Start Time')).toBeFalsy('Start Time field is disabled.');
            await serviceTargetConfig.selectGoalTypeCheckbox('Goal Time');
            await serviceTargetConfig.selectGoalTypeCheckbox('Business Entity');
            await serviceTargetConfig.selectGoalTypeCheckbox('Start Time');
            expect(await serviceTargetConfig.isBusinessEntityDisabled()).toBeTruthy('Business Entity field is disabled.');
            await serviceTargetConfig.selectMeasurement();
            expect(await serviceTargetConfig.isMeasurementCheckboxDisabled('Reset Goal for Same Request?')).toBeFalsy('Reset Goal for Same Request? field is disabled.');
            expect(await serviceTargetConfig.isMeasurementCheckboxDisabled('Allow Measurement to Re-Open?')).toBeFalsy('Allow Measurement to Re-Open? field is disabled.');
            expect(await serviceTargetConfig.isMeasurementCheckboxDisabled('Enable Team Tracking')).toBeFalsy('Enable Team Tracking field is disabled.');
            await serviceTargetConfig.selectMeasurementCheckbox('Reset Goal for Same Request?');
            await serviceTargetConfig.selectMeasurementCheckbox('Allow Measurement to Re-Open?');
            await serviceTargetConfig.selectMeasurementCheckbox('Enable Team Tracking');
            await serviceTargetConfig.selectExpressionForMeasurementForTask(0, "Status", "=", "Assigned","Direct");
            await serviceTargetConfig.selectExpressionForMeasurementForTask(1, "Status", "=", "Completed","Direct");
            await serviceTargetConfig.clickOnSaveSVTButton();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
        });
    });
});
