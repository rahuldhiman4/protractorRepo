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
        let dataSourceRecordDefinitionOptions = ['com.bmc.dsm.case-lib:Case Audit', 'com.bmc.dsm.case-lib:Case Detail Signature', 'com.bmc.dsm.case-lib:Case Detail Signature Question', 'com.bmc.dsm.case-lib:Case Detail Signature Question Attachment']

        it('[6052,6051,6050,6048,6042,6043]: Verify Data Source Configuration Creation', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Configure Data Source', BWF_PAGE_TITLES.SERVICE_LEVEL_MANAGEMENT.CONFIGURE_DATA_SOURCE);
            expect(await configureDataSourceConsolePage.getDataSourceConfigurationConsoleHeading()).toBe(dataSourceConsoleHeading);
            // // expect(await configureDataSourceConsolePage.getDataSourceConfigurationConsoleDescription()).toBe(dataSourceConsoleDesc);
            await configureDataSourceConsolePage.clickConfigDataSourceBtn();
            // await browser.sleep(2000);  // added hard wait to load Add Data Source Blade
            expect(await createConfigureDataSourceConfigPo.getAddDataSourceConfigurationHeading()).toBe(createdataSourceConfigHeading);
            expect(await createConfigureDataSourceConfigPo.isDataSourceFieldRequired('Display Name')).toBeTruthy('Display Name field is marked as optional field');
            expect(await createConfigureDataSourceConfigPo.isDataSourceFieldRequired('Application Name')).toBeTruthy('Application Name field is marked as optional field');
            expect(await createConfigureDataSourceConfigPo.isDataSourceFieldRequired('Record Definition Name')).toBeTruthy('Record Definition Name field is marked as optional field');
            expect(await createConfigureDataSourceConfigPo.isDataSourceFieldRequired('Company Field')).toBeTruthy('Company Field field is marked as optional field');
            await createConfigureDataSourceConfigPo.clickCancelButton();
            // await browser.sleep(2000);  // added hard wait to close Add Data Source Blade
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
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Record Definition Name(required)', 'com.bmc.dsm.case-lib:Case Detail');
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Company Field(required)', 'ASSIGNED COMPANY_ID Primary');
            expect(await createConfigureDataSourceConfigPo.isSaveBtnDisabled()).toBeFalsy('Save button is found disabled.');
            await createConfigureDataSourceConfigPo.clickDataSourceLink('Show Advanced Settings');
            expect(await createConfigureDataSourceConfigPo.isDataSourceFieldRequired('Association Name')).toBeFalsy('Association Name field is marked as required field');
            expect(await createConfigureDataSourceConfigPo.isDataSourceFieldRequired('Create Qualification View')).toBeFalsy('Create Qualification View field is marked as required field');
            expect(await createConfigureDataSourceConfigPo.isDataSourceFieldRequired('Edit Qualification View')).toBeFalsy('Edit Qualification View field is marked as required field');
            expect(await createConfigureDataSourceConfigPo.isDataSourceFieldRequired('Assigned Group')).toBeFalsy('Assigned Group field is marked as required field');
            expect(await createConfigureDataSourceConfigPo.isDataSourceFieldRequired('Dynamic Business Entity')).toBeFalsy('Dynamic Business Entity field is marked as required field');
            expect(await createConfigureDataSourceConfigPo.isDataSourceFieldRequired('Dynamic Start Time Field')).toBeFalsy('Dynamic Start Time Field field is marked as required field');
            expect(await createConfigureDataSourceConfigPo.isDataSourceFieldRequired('Reset Goal Condition')).toBeFalsy('Reset Goal Condition field is marked as required field');
            expect(await createConfigureDataSourceConfigPo.isDataSourceFieldRequired('Dynamic End Time Field')).toBeFalsy('Dynamic End Time Field field is marked as required field');
            expect(await createConfigureDataSourceConfigPo.isDataSourceFieldRequired('Dynamic Goal Time Field')).toBeFalsy('Dynamic Goal Time Field field is marked as required field');
            expect(await createConfigureDataSourceConfigPo.isDataSourceFieldRequired('Category Field')).toBeFalsy('Category Field field is marked as required field');
            expect(await createConfigureDataSourceConfigPo.isDatSourceAdvancedFieldsDisabled('Dynamic End Time Field')).toBeTruthy('Dynamic End Time Field is enabled on Create Data Source Config screen');
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Association Name', 'com.bmc.dsm.case-lib:Case Approval Mapping Field - Label');
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Create Qualification View', 'com.bmc.dsm.case-lib:Case Qualification Builder');
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Edit Qualification View', 'com.bmc.dsm.case-lib:Case Qualification Builder');
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Assigned Group', 'Assigned Group Primary');
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Dynamic Business Entity', 'Assigned Business Unit Primary');
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Dynamic Start Time Field', 'Created Date Primary');
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Dynamic Goal Time Field', 'Assignee Primary');
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Category Field', 'Category Tier 1 Primary');
            await createConfigureDataSourceConfigPo.clickUseEndTimeCheckbox();
            expect(await createConfigureDataSourceConfigPo.isDatSourceAdvancedFieldsDisabled('Dynamic End Time Field')).toBeFalsy('Dynamic End Time Field is disabled on Create Data Source Config screen');
            expect(await createConfigureDataSourceConfigPo.isDatSourceAdvancedFieldsDisabled('Dynamic Goal Time Field')).toBeTruthy('Dynamic Goal Time Field is enabled on Create Data Source Config screen');
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Dynamic End Time Field', 'Created By Primary');
            await createConfigureDataSourceConfigPo.clickDataSourceLinkBuildExpression('Build Expression');
            expect(await approvalConfigurationPage.isCreateNewApprovalFlowPopUpDisplayed()).toBeTruthy();
            expect(await approvalConfigurationPage.getCreateNewApprovalFlowPopUpTitle()).toContain('Create Expression');
            await browser.sleep(3000); // sleep added for expression builder loading time
            await approvalConfigurationPage.searchExpressionFieldOption('Assignee GUID Primary');
            await approvalConfigurationPage.clickRecordOption('Record Instance');
            await browser.sleep(2000); // sleep added for expression builder loading time
            await approvalConfigurationPage.selectExpressionFieldOption('Assignee GUID Primary');
            await browser.sleep(2000); // sleep added for expression builder loading time
            await approvalConfigurationPage.selectExpressionOperator('=');
            await browser.sleep(1000); // sleep added for expression builder loading time
            await approvalConfigurationPage.setExpressionValueForParameter('"' + "Petramco" + '"');
            await createConfigureDataSourceConfigPo.clickRegularExpressionSaveButton();
            await createConfigureDataSourceConfigPo.clickSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message is not displayed.');
        });

        it('[6052,6051,6050,6048,6042,6043]: Verify Data Source Configuration Updation', async () => {
            await utilityGrid.searchAndOpenHyperlink(dataSourceDisplayName);
            await browser.sleep(2000); // added hard wait to load Edit Data Source Blade
            expect(await editConfigureDataSourceConfigPo.isDatSourceFieldDisabled('Display Name')).toBeTruthy('Display Name field is optional on Edit Data Source Config screen');
            expect(await editConfigureDataSourceConfigPo.isDatSourceFieldDisabled('Application Name')).toBeTruthy('Application Name field is optional on Edit Data Source Config screen');
            expect(await editConfigureDataSourceConfigPo.isDatSourceFieldDisabled('Record Definition Name')).toBeTruthy('Record Definition Name field is optional on Edit Data Source Config screen');
            expect(await editConfigureDataSourceConfigPo.isDatSourceCompanyFieldDisabled()).toBeTruthy('Company Field field is optional on Edit Data Source Config screen');
            expect(await editConfigureDataSourceConfigPo.getDatSourceFieldValue('Display Name')).toBe(dataSourceDisplayName);
            expect(await editConfigureDataSourceConfigPo.getDatSourceFieldValue('Application Name')).toBe('Case Management Service');
            expect(await editConfigureDataSourceConfigPo.getDatSourceFieldValue('Record Definition Name')).toBe('com.bmc.dsm.case-lib:Case Detail');
            expect(await editConfigureDataSourceConfigPo.getDatSourceCompanyFieldValue()).toBe('ASSIGNED COMPANY_ID Primary');
            await editConfigureDataSourceConfigPo.clickDataSourceLink('Show Advanced Settings');
            expect(await editConfigureDataSourceConfigPo.isDatSourceFieldDisabled('Association Name')).toBeFalsy('Association Name field is required on Edit Data Source Config screen');
            expect(await editConfigureDataSourceConfigPo.isDatSourceFieldDisabled('Create Qualification View')).toBeFalsy('Create Qualification View field is required on Edit Data Source Config screen');
            expect(await editConfigureDataSourceConfigPo.isDatSourceFieldDisabled('Edit Qualification View')).toBeFalsy('Edit Qualification View field is required on Edit Data Source Config screen');
            expect(await editConfigureDataSourceConfigPo.isDatSourceFieldDisabled('Assigned Group')).toBeFalsy('Assigned Group field is required on Edit Data Source Config screen');
            expect(await editConfigureDataSourceConfigPo.isDatSourceFieldDisabled('Dynamic Business Entity')).toBeFalsy('Dynamic Business Entity field is required on Edit Data Source Config screen');
            expect(await editConfigureDataSourceConfigPo.isDatSourceFieldDisabled('Dynamic Start Time Field')).toBeFalsy('Dynamic Start Time Field is required on Edit Data Source Config screen');
            expect(await editConfigureDataSourceConfigPo.isDatSourceFieldDisabled('Dynamic End Time Field')).toBeFalsy('Dynamic End Time Field is required on Edit Data Source Config screen');
            expect(await editConfigureDataSourceConfigPo.isDatSourceFieldDisabled('Dynamic Goal Time Field')).toBeFalsy('Dynamic Goal Time Field field is required on Edit Data Source Config screen');
            expect(await editConfigureDataSourceConfigPo.isDatSourceFieldDisabled('Category Field')).toBeFalsy('Category Field Field field is required on Edit Data Source Config screen');

            expect(await editConfigureDataSourceConfigPo.getDatSourceAdvancedFieldValue('Association Name')).toBe('com.bmc.dsm.case-lib:Case Approval Mapping Field - Company');
            expect(await editConfigureDataSourceConfigPo.getDatSourceAdvancedFieldValue('Create Qualification View')).toBe('com.bmc.dsm.case-lib:Case Qualification Builder');
            expect(await editConfigureDataSourceConfigPo.getDatSourceAdvancedFieldValue('Edit Qualification View')).toBe('com.bmc.dsm.case-lib:Case Qualification Builder');
            expect(await editConfigureDataSourceConfigPo.getDatSourceAdvancedFieldValue('Assigned Group')).toBe('Assigned Group Primary');
            expect(await editConfigureDataSourceConfigPo.getDatSourceAdvancedFieldValue('Dynamic Business Entity')).toBe('Assigned Business Unit Primary');
            expect(await editConfigureDataSourceConfigPo.getDatSourceAdvancedFieldValue('Dynamic Start Time Field')).toBe('Created Date Primary');
            expect(await editConfigureDataSourceConfigPo.getDatSourceAdvancedFieldValue('Dynamic End Time Field')).toBe('Created By Primary');
            expect(await editConfigureDataSourceConfigPo.getDatSourceAdvancedFieldValue('Dynamic Goal Time Field')).toBe('');
            expect(await editConfigureDataSourceConfigPo.getDatSourceAdvancedFieldValue('Category Field')).toBe('Category Tier 1 Primary');
            let expectedSelectedExp = `'Assignee GUID Primary' ="Petramco"`;
            expect(await editConfigureDataSourceConfigPo.getDatSourceFieldValue('Reset Goal Condition')).toBe(expectedSelectedExp);
            await editConfigureDataSourceConfigPo.selectDataSourceFieldOption('Assigned Group', 'Assigned Department Primary');
            await editConfigureDataSourceConfigPo.clickSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('Record has been updated successfully')).toBeTruthy('Record saved successfully confirmation message is not displayed.');
            await utilityGrid.searchAndOpenHyperlink(dataSourceDisplayName);
            await browser.sleep(2000); // added hard wait to close Edit Data Source Blade
            await editConfigureDataSourceConfigPo.clickDataSourceLink('Show Advanced Settings');
            expect(await editConfigureDataSourceConfigPo.getDatSourceAdvancedFieldValue('Assigned Group')).toBe('Assigned Department Primary');
            await editConfigureDataSourceConfigPo.clickCancelButton();
        });

        it('[6052,6051,6050,6048,6042,6043]: Verify that the already utilized record definition is not available for new data source', async () => {
            await configureDataSourceConsolePage.clickConfigDataSourceBtn();
            await browser.sleep(5000); // added hard wait to load Create Data Source Blade
            expect(await createConfigureDataSourceConfigPo.getAddDataSourceConfigurationHeading()).toBe(createdataSourceConfigHeading);
            await createConfigureDataSourceConfigPo.setDataSourceDisplayName(dataSourceDisplayName2);
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Application Name', 'Case Management Service');
            expect(await createConfigureDataSourceConfigPo.isDataSourceDropDownOptionsMatches('Record Definition Name', dataSourceRecordDefinitionOptions, 'Case Detail')).toBeFalsy('Field Option Not Displayed');
            await editConfigureDataSourceConfigPo.clickCancelButton();
            expect(await utilityCommon.getWarningDialogMsg()).toBe('You have unsaved data. Do you want to continue?');
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        });

        it('[6052,6051,6050,6048,6042,6043]: Verify the error when existing data source used in SVT configs is modified', async () => {
            await utilityGrid.searchRecord('nonmatchingtext');
            await utilityGrid.searchAndOpenHyperlink('Case Management');
            await browser.sleep(2000); // added hard wait to load Edit Data Source Blade
            expect(await editConfigureDataSourceConfigPo.isDatSourceFieldDisabled('Display Name')).toBeTruthy('Display Name field is enabled on Edit Data Source Config screen');
            await editConfigureDataSourceConfigPo.clickDataSourceLink('Show Advanced Settings');
            await editConfigureDataSourceConfigPo.clearDatSourceAdvancedFieldSelection('Assigned Group');
            expect(await utilityCommon.isPopUpMessagePresent('For a valid measurement data, ensure that Service Targets do not use this option.')).toBeTruthy('Error : error message is not displayed.');
            expect(await editConfigureDataSourceConfigPo.isSaveBtnDisabled()).toBeFalsy('Save button is found disabled.');
            await editConfigureDataSourceConfigPo.clickCancelButton();
            expect(await utilityCommon.getWarningDialogMsg()).toBe('You have unsaved data. Do you want to continue?');
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
            // expect(await configureDataSourceConsolePage.getDataSourceConfigurationConsoleDescription()).toBe(dataSourceConsoleDesc);
            await configureDataSourceConsolePage.clickConfigDataSourceBtn();
            // await browser.sleep(2000);  // added hard wait to load Add Data Source Blade
            expect(await createConfigureDataSourceConfigPo.getAddDataSourceConfigurationHeading()).toBe(createdataSourceConfigHeading);
            await createConfigureDataSourceConfigPo.setDataSourceDisplayName(dataSourceMaxLimit);
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Application Name', 'Case Management Service');
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Record Definition Name', 'com.bmc.dsm.case-lib:Case Approval Mapping');
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Company Field', 'Company');
            expect(await createConfigureDataSourceConfigPo.isSaveBtnDisabled()).toBeFalsy('Save button is found disabled.');
            await createConfigureDataSourceConfigPo.clickSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('Value does not fall within the limits specified for the field (Field ID - com.bmc.dsm.slm-lib:Config Data Source <300520600>, Maximum length - 50)')).toBeTruthy('Record saved successfully confirmation message is not displayed.');
            await createConfigureDataSourceConfigPo.setDataSourceDisplayName(dataSourceAlphaNumeric);
            await createConfigureDataSourceConfigPo.clickDataSourceLink('Show Advanced Settings');
            expect(await createConfigureDataSourceConfigPo.isDatSourceAdvancedFieldsDisabled('Dynamic End Time Field')).toBeTruthy('Dynamic End Time Field is enabled on Create Data Source Config screen');
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Association Name', 'com.bmc.dsm.case-lib:Case Approval Mapping Field - Category Tier 1');
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Create Qualification View', 'com.bmc.dsm.case-lib:Case Qualification Builder');
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Edit Qualification View', 'com.bmc.dsm.case-lib:Case Qualification Builder');
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Assigned Group', 'Assignee');
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Dynamic Business Entity', 'Approval Process');
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Dynamic Start Time Field', 'Created Date');
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Dynamic Goal Time Field', 'Category Tier 2');
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Category Field', 'Category Tier 2');
            await createConfigureDataSourceConfigPo.clickUseEndTimeCheckbox();
            expect(await createConfigureDataSourceConfigPo.isDatSourceAdvancedFieldsDisabled('Dynamic End Time Field')).toBeFalsy('Dynamic End Time Field is disabled on Create Data Source Config screen');
            expect(await createConfigureDataSourceConfigPo.isDatSourceAdvancedFieldsDisabled('Dynamic Goal Time Field')).toBeTruthy('Dynamic Goal Time Field is enabled on Create Data Source Config screen');
            await createConfigureDataSourceConfigPo.clickSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('You must enter an End Time value.')).toBeTruthy('Dynamic End Time Validation message is not displayed.');
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Dynamic End Time Field', 'Created Date');
            await createConfigureDataSourceConfigPo.clickDataSourceLinkBuildExpression('Build Expression');
            expect(await approvalConfigurationPage.isCreateNewApprovalFlowPopUpDisplayed()).toBeTruthy();
            expect(await approvalConfigurationPage.getCreateNewApprovalFlowPopUpTitle()).toContain('Create Expression');
            await browser.sleep(3000); // sleep added for expression builder loading time
            await approvalConfigurationPage.searchExpressionFieldOption('Company');
            await approvalConfigurationPage.clickRecordOption('Record Instance');
            await browser.sleep(2000); // sleep added for expression builder loading time
            await approvalConfigurationPage.selectExpressionFieldOption('Company');
            await browser.sleep(2000); // sleep added for expression builder loading time
            await approvalConfigurationPage.selectExpressionOperator('=');
            await browser.sleep(1000); // sleep added for expression builder loading time
            await approvalConfigurationPage.setExpressionValueForParameter('"' + "Petramco" + '"');
            await createConfigureDataSourceConfigPo.clickRegularExpressionSaveButton();
            await createConfigureDataSourceConfigPo.clickSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message is not displayed.');
        });

        it('[6049,6049,6045,6047]: Verify Data Source Configuration Creation with Reset Goal Validation', async () => {
            await utilityGrid.searchAndOpenHyperlink(dataSourceAlphaNumeric);
            await browser.sleep(2000); // added hard wait to load Edit Data Source Blade
            expect(await editConfigureDataSourceConfigPo.getDatSourceFieldValue('Display Name')).toBe(dataSourceAlphaNumeric);
            await editConfigureDataSourceConfigPo.clickDataSourceLink('Show Advanced Settings');
            let expectedSelectedExp = `'Company' ="Petramco"`;
            expect(await editConfigureDataSourceConfigPo.getDatSourceFieldValue('Reset Goal Condition')).toBe(expectedSelectedExp);
            await editConfigureDataSourceConfigPo.clickCancelButton();
        });

        it('[6049,6049,6045,6047]: Verify Data Source Configuration Creation with Build Expression Validation', async () => {
            await configureDataSourceConsolePage.clickConfigDataSourceBtn();
            await browser.sleep(5000); // added hard wait to load Create Data Source Blade
            expect(await createConfigureDataSourceConfigPo.getAddDataSourceConfigurationHeading()).toBe(createdataSourceConfigHeading);
            await createConfigureDataSourceConfigPo.setDataSourceDisplayName(dataSourceSpecialChars);
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Application Name', 'Case Management Service');
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Record Definition Name', 'com.bmc.dsm.case-lib:Case Audit');
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Company Field', 'ASSIGNED COMPANY_ID');
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
            // expect(await configureDataSourceConsolePage.getDataSourceConfigurationConsoleDescription()).toBe(dataSourceConsoleDesc);
            await utilityGrid.searchAndOpenHyperlink(dataSourceDisplayName);
            await browser.sleep(2000); // added hard wait to load Edit Data Source Blade
            await editConfigureDataSourceConfigPo.clickDataSourceLink('Show Advanced Settings');
            await editConfigureDataSourceConfigPo.selectDataSourceFieldOption('Dynamic Business Entity', 'Company');
            await editConfigureDataSourceConfigPo.selectDataSourceFieldOption('Dynamic Start Time Field', 'Created Date');
            await editConfigureDataSourceConfigPo.selectDataSourceFieldOption('Dynamic Goal Time Field', 'Assignee');
            await editConfigureDataSourceConfigPo.clickEndTimeCheckbox();
            await editConfigureDataSourceConfigPo.selectDataSourceFieldOption('Dynamic End Time Field', 'Created Date');
            await editConfigureDataSourceConfigPo.clickBuildExpressionBtn();
            expect(await approvalConfigurationPage.isCreateNewApprovalFlowPopUpDisplayed()).toBeTruthy();
            expect(await approvalConfigurationPage.getCreateNewApprovalFlowPopUpTitle()).toContain('Edit expression');
            await browser.sleep(3000); // sleep added for expression builder loading time
            await approvalConfigurationPage.searchExpressionFieldOption('Assignee GUID');
            await browser.sleep(2000); // sleep added for expression builder loading time
            await approvalConfigurationPage.selectExpressionFieldOption('Assignee GUID');
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
