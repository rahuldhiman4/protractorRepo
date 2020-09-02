import { browser } from "protractor";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import configureDataSourceConsolePage from '../../pageobject/settings/slm/configure-data-source-config-console.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilCommon from '../../utils/util.common';
import utilGrid from '../../utils/util.grid';
import createConfigureDataSourceConfigPo from '../../pageobject/settings/slm/create-configure-data-source-config.po';
import editConfigureDataSourceConfigPo from '../../pageobject/settings/slm/edit-configure-data-source-config.po';
import approvalConfigurationPage from "../../pageobject/settings/approval/approval-configuration.po";
import utilityCommon from '../../utils/utility.common';

let caseBAUser = 'qkatawazi';

describe('Data Source Configuration Tests', () => {
    const dataSourceConsoleHeading = 'Service Target Data Source Configuration';
    const dataSourceConsoleDesc = 'Create/update a data source for flexibility to calculate service targets differently for each record.';
    const createdataSourceConfigHeading = 'Add Service Target Data Source Configuration';

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login(caseBAUser);
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    //skhobrag
    describe('[DRDMV-2209,DRDMV-2210,DRDMV-2212]: SLM - Configure Data Source - Create a new Data Source', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let dataSourceDisplayName = 'Case Data Source_' + randomStr;
        let dataSourceDisplayName2 = 'Case Data Source2_' + randomStr;
        let dataSourceRecordDefinitionOptions = ['com.bmc.dsm.case-lib:Case Audit','com.bmc.dsm.case-lib:Case Detail Signature','com.bmc.dsm.case-lib:Case Detail Signature Question','com.bmc.dsm.case-lib:Case Detail Signature Question Attachment']

        it('[DRDMV-2209,DRDMV-2210,DRDMV-2212]: Verify Data Source Configuration Creation', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Configure Data Source', 'Configure Data Source - Administration - Business Workflows');
            expect(await configureDataSourceConsolePage.getDataSourceConfigurationConsoleHeading()).toBe(dataSourceConsoleHeading);
            expect(await configureDataSourceConsolePage.getDataSourceConfigurationConsoleDescription()).toBe(dataSourceConsoleDesc);
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
            expect(await utilCommon.getWarningDialogMsg()).toBe('You have unsaved data. Do you want to continue?');
            await utilCommon.clickOnWarningCancel();
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Application Name', 'Innovation Studio');
            expect(await utilCommon.isPopUpMessagePresent('No Record Definition exists for the selected Application Name Innovation Studio')).toBeTruthy('Error : Record definition does not exists error message is not displayed.');
            expect(await createConfigureDataSourceConfigPo.isSaveBtnDisabled()).toBeTruthy('Save button is found enabled.');

            await createConfigureDataSourceConfigPo.setDataSourceDisplayName(dataSourceDisplayName);
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Application Name', 'Case Management Service');
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Record Definition Name', 'com.bmc.dsm.case-lib:Case Detail');
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Company Field', 'ASSIGNED COMPANY_ID Primary');
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
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Association Name','com.bmc.dsm.case-lib:Case Approval Mapping Field - Company');
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Create Qualification View','com.bmc.dsm.case-lib:Case Qualification Builder');
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Edit Qualification View','com.bmc.dsm.case-lib:Case Qualification Builder');
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Assigned Group','Assigned Group Primary');
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Dynamic Business Entity','Assigned Business Unit Primary');
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Dynamic Start Time Field','Created Date Primary');
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Dynamic Goal Time Field','Assignee Primary');
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Category Field','Category Tier 1 Primary');
            await createConfigureDataSourceConfigPo.clickUseEndTimeCheckbox();
            expect(await createConfigureDataSourceConfigPo.isDatSourceAdvancedFieldsDisabled('Dynamic End Time Field')).toBeFalsy('Dynamic End Time Field is disabled on Create Data Source Config screen');
            expect(await createConfigureDataSourceConfigPo.isDatSourceAdvancedFieldsDisabled('Dynamic Goal Time Field')).toBeTruthy('Dynamic Goal Time Field is enabled on Create Data Source Config screen');
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Dynamic End Time Field', 'Created By Primary');
            await createConfigureDataSourceConfigPo.clickDataSourceLink('Build Expression');
            expect(await approvalConfigurationPage.isCreateNewApprovalFlowPopUpDisplayed()).toBeTruthy();
            expect(await approvalConfigurationPage.getCreateNewApprovalFlowPopUpTitle()).toContain('Create Expression');
            await browser.sleep(3000); // sleep added for expression builder loading time
            await approvalConfigurationPage.searchExpressionFieldOption('Assignee GUID Primary');
            await approvalConfigurationPage.clickRecordOption('Record Instance');
            await browser.sleep(2000); // sleep added for expression builder loading time
            await approvalConfigurationPage.selectExpressionFieldOption();
            await browser.sleep(2000); // sleep added for expression builder loading time
            await approvalConfigurationPage.selectExpressionOperator('=');
            await browser.sleep(1000); // sleep added for expression builder loading time
            await approvalConfigurationPage.setExpressionValueForParameter('"'+"Petramco"+'"');
            await createConfigureDataSourceConfigPo.clickRegularExpressionSaveButton();
            await createConfigureDataSourceConfigPo.clickSaveButton();
            expect(await utilCommon.isPopUpMessagePresent('Record has been registered successfully.')).toBeTruthy('Record saved successfully confirmation message is not displayed.');
        });

        it('[DRDMV-2209,DRDMV-2210,DRDMV-2212]: Verify Data Source Configuration Updation', async () => {
            await utilGrid.searchAndOpenHyperlink(dataSourceDisplayName);
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
            await editConfigureDataSourceConfigPo.selectDataSourceFieldOption('Assigned Group','Assigned Department Primary');
            await editConfigureDataSourceConfigPo.clickSaveButton();
            expect(await utilCommon.isPopUpMessagePresent('Record has been updated successfully')).toBeTruthy('Record saved successfully confirmation message is not displayed.');
            await utilGrid.searchAndOpenHyperlink(dataSourceDisplayName);
            await browser.sleep(2000); // added hard wait to close Edit Data Source Blade
            await editConfigureDataSourceConfigPo.clickDataSourceLink('Show Advanced Settings'); 
            expect(await editConfigureDataSourceConfigPo.getDatSourceAdvancedFieldValue('Assigned Group')).toBe('Assigned Department Primary');
            await editConfigureDataSourceConfigPo.clickCancelButton();
        });

        it('[DRDMV-2209,DRDMV-2210,DRDMV-2212]: Verify that the already utilized record definition is not available for new data source', async () => {
            await configureDataSourceConsolePage.clickConfigDataSourceBtn();
            await browser.sleep(5000); // added hard wait to load Create Data Source Blade
            expect(await createConfigureDataSourceConfigPo.getAddDataSourceConfigurationHeading()).toBe(createdataSourceConfigHeading);
            await createConfigureDataSourceConfigPo.setDataSourceDisplayName(dataSourceDisplayName2);
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Application Name', 'Case Management Service');
            expect(await createConfigureDataSourceConfigPo.isDataSourceDropDownOptionsMatches('Record Definition Name', dataSourceRecordDefinitionOptions,'Case Detail')).toBeFalsy('Field Option Not Displayed');
            await editConfigureDataSourceConfigPo.clickCancelButton();
            expect(await utilCommon.getWarningDialogMsg()).toBe('You have unsaved data. Do you want to continue?');
            await utilCommon.clickOnWarningOk();
        });

        it('[DRDMV-2209,DRDMV-2210,DRDMV-2212]: Verify the error when existing data source used in SVT configs is modified', async () => {
            await utilGrid.searchRecord('nonmatchingtext');
            await utilGrid.searchAndOpenHyperlink('Case Management');
            await browser.sleep(2000); // added hard wait to load Edit Data Source Blade
            expect(await editConfigureDataSourceConfigPo.isDatSourceFieldDisabled('Display Name')).toBeTruthy('Display Name field is enabled on Edit Data Source Config screen');
            await editConfigureDataSourceConfigPo.clickDataSourceLink('Show Advanced Settings');
            await editConfigureDataSourceConfigPo.clearDatSourceAdvancedFieldSelection('Assigned Group');
            expect(await utilCommon.isPopUpMessagePresent('For a valid measurement data, ensure that Service Targets do not use this option.')).toBeTruthy('Error : error message is not displayed.');
            expect(await editConfigureDataSourceConfigPo.isSaveBtnDisabled()).toBeFalsy('Save button is found disabled.');
            await editConfigureDataSourceConfigPo.clickCancelButton();
            expect(await utilCommon.getWarningDialogMsg()).toBe('You have unsaved data. Do you want to continue?');
            await utilCommon.clickOnWarningOk();
        });

    });


});
