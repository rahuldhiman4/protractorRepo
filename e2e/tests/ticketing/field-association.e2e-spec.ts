import { browser } from "protractor";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import createFieldAssociationMappingsPo from '../../pageobject/settings/application-config/create-field-association-mappings.po';
import fieldAssociationMappingsConsolePo from '../../pageobject/settings/application-config/field-association-mappings-console.po';
import { BWF_BASE_URL, BWF_PAGE_TITLES } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import editFieldAssociationMappingsPo from '../../pageobject/settings/application-config/edit-field-association-mappings.po';
import utilityGrid from '../../utils/utility.grid';

xdescribe('Field Association', () => {
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('tadmin');
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    //kgaikwad
    describe('[5424]: [Notification Association][UI] Association Mapping UI', async () => {
        let allColoumn: string[] = ['Field Name', 'Association Name', 'Application Or Bundle Name', 'Record Definition Name', 'Status'];

        beforeAll(async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Application Configuration--Field Associations', BWF_PAGE_TITLES.APPLICATION_CONFIGURATIONS.FIELD_ASSOCIATIONS);
        });

        it('[5424]: Verify Record With Application Or Bundle Name Column', async () => {
            await utilityGrid.clearFilter();
            expect(await fieldAssociationMappingsConsolePo.areGridColumnHeaderMatches(allColoumn)).toBeTruthy("All Coloumn is not present");
            await fieldAssociationMappingsConsolePo.addFilter('Application Or Bundle Name', 'com.bmc.dsm.case-lib', 'text');
            await fieldAssociationMappingsConsolePo.addFilter('Field Name', 'Template Name', 'text');
            expect(await fieldAssociationMappingsConsolePo.isGridRecordPresent('Template Name')).toBeTruthy('Field not present on grid');
            expect(await fieldAssociationMappingsConsolePo.isGridRecordPresent('com.bmc.dsm.case-lib')).toBeTruthy('Field not present on grid');

            await utilityGrid.clearFilter();
            await fieldAssociationMappingsConsolePo.addFilter('Application Or Bundle Name', 'com.bmc.dsm.task-lib', 'text');
            await fieldAssociationMappingsConsolePo.addFilter('Field Name', 'Ticket Status GUID', 'text');
            expect(await fieldAssociationMappingsConsolePo.isGridRecordPresent('Ticket Status GUID')).toBeTruthy('Field not present on grid');
            expect(await fieldAssociationMappingsConsolePo.isGridRecordPresent('com.bmc.dsm.task-lib')).toBeTruthy('Field not present on grid');

            await utilityGrid.clearFilter();
            await fieldAssociationMappingsConsolePo.addFilter('Application Or Bundle Name', 'com.bmc.dsm.knowledge', 'text');
            await fieldAssociationMappingsConsolePo.addFilter('Field Name', 'Template Id', 'text');
            expect(await fieldAssociationMappingsConsolePo.isGridRecordPresent('Template Id')).toBeTruthy('Field not present on grid');
            expect(await fieldAssociationMappingsConsolePo.isGridRecordPresent('com.bmc.dsm.knowledge')).toBeTruthy('Field not present on grid');
        });

        it('[5424]: Create Field Associtation Mapping', async () => {
            await fieldAssociationMappingsConsolePo.clickAddFieldAssociationMapping();
            expect(await createFieldAssociationMappingsPo.isSaveButtonEnabled()).toBeTruthy('FailureMsg1: Save button is enabled');
            let BundleNameArr: string[] = ['Approval', 'Assignment', 'Attachment Service', 'BMC Chatbot', 'Business Workflows', 'Case Management Service', 'Catalog Interface Service', 'Chatbot Starter Kit', 'Cognitive Service', 'Data Management Console', 'Email Service', 'Environment Configuration', 'Flowsets Service', 'Foundation', 'Innovation Studio', 'Knowledge Management', 'LOB - Ericsson HR', 'LOB - Ericsson SAM', 'LOB - Facilities', 'LOB - Finance', 'LOB - Human Resource', 'LOB - Kingston HR', 'LOB - Kingston Legal', 'LOB - KingstonOracle Finance', 'LOB - Oracle HR', 'Notification Service', 'Search Service', 'Settings', 'Shared Components', 'Shared Services', 'SLM Service', 'Social Service', 'Standard Library', 'Task Management Service', 'Ticketing Service'];
            expect(await utilityCommon.isAllDropDownValuesMatches('Application Or Bundle Name', BundleNameArr)).toBeTruthy('BundleName dorp down is not matching');
            await createFieldAssociationMappingsPo.selectStatusDropDown('Inactive');
            await createFieldAssociationMappingsPo.selectApplicationOrBundleNameDropDown('Case Management Service');

            let recordDefinitionNameArr: string[] = ['Case Approval Mapping', 'Case Qualification', 'Case Assignment Mapping', 'Case Question', 'Case', 'Case Template', 'Case Question Attachment', 'Case Audit', 'Case Access - Interface', 'Person Extension', 'Case Audit - Migration', 'Case Watchlist', 'Event Scheduler', 'Case Requester Statistics_ReportData', 'Case Requester Statistics By Company_ReportData', 'Case History', 'Permissions - Case Business Analyst', 'Case Detail', 'Case Detail Signature', 'Case Detail Signature Question', 'Case Detail Signature Question Attachment'];
            expect(await utilityCommon.isAllDropDownValuesMatches('Record Definition Name', recordDefinitionNameArr)).toBeTruthy('RecordDefinitionName dorp down is not matching');
            await createFieldAssociationMappingsPo.selectStatusDropDown('Active');
            await createFieldAssociationMappingsPo.selectRecordDefinitionNameDropDown('Case Approval Mapping');
            await createFieldAssociationMappingsPo.selectFieldNameValue('Assignee');
            await createFieldAssociationMappingsPo.selectAssociationToUseValue('Created By', 'Case Approval Mapping Field - Category Tier 1');

            expect(await createFieldAssociationMappingsPo.getStatusDropDownValue()).toBe('Active', 'Active Label is missing');

            await createFieldAssociationMappingsPo.clickSaveButton();
        });

        it('[5424]: Verify Edit Field Associtation Mapping', async () => {
            await utilityGrid.clearFilter();
            await fieldAssociationMappingsConsolePo.addFilter('Association Name', 'Case Approval Mapping Field - Category Tier 1 > Created By', 'text');
            await fieldAssociationMappingsConsolePo.addFilter('Application Or Bundle Name', 'com.bmc.dsm.case-lib', 'text');
            await fieldAssociationMappingsConsolePo.addFilter('Field Name', 'Assignee', 'text');
            await fieldAssociationMappingsConsolePo.searchAndOpenFieldAssociationMappingRecord('Assignee');

            expect(await editFieldAssociationMappingsPo.getRecordDefinitionNameDropDownValue()).toBe('Case Approval Mapping', 'RecordDefinitionNameDropDownValue is missing');
            expect(await editFieldAssociationMappingsPo.getFieldNameValue()).toBe('Assignee', 'FieldNameValue is missing');
            expect(await editFieldAssociationMappingsPo.getAssociationToUseValue()).toBe('Case Approval Mapping Field - Category Tier 1 > Created By', 'AssociationToUseValue is missing');
            expect(await editFieldAssociationMappingsPo.getStatusValue()).toBe('Active', 'StatusValue is missing');
            expect(await editFieldAssociationMappingsPo.getApplicationOrBundleNameValue()).toBe('Case Management Service', 'ApplicationOrBundleNameValue is missing');


            await editFieldAssociationMappingsPo.updateRecordDefinitionNameDropDown('Case Template');
            await editFieldAssociationMappingsPo.updateAssociationToUseValue('Created Date', 'Case Template - Assigned Company');
            await editFieldAssociationMappingsPo.updateFieldNameValue('Assigned Group');
            await editFieldAssociationMappingsPo.clickSaveButton();

        });

        it('[5424]: Verify Field Association On Grid', async () => {
            await utilityGrid.clearFilter();
            await fieldAssociationMappingsConsolePo.addFilter('Association Name', 'Case Template - Assigned Company > Created Date', 'text');
            await fieldAssociationMappingsConsolePo.addFilter('Application Or Bundle Name', 'com.bmc.dsm.case-lib', 'text');
            await fieldAssociationMappingsConsolePo.addFilter('Field Name', 'Assigned Group', 'text');
            expect(await fieldAssociationMappingsConsolePo.isGridRecordPresent('com.bmc.dsm.case-lib')).toBeTruthy('Field not present on grid');
            expect(await fieldAssociationMappingsConsolePo.isGridRecordPresent('Assigned Group')).toBeTruthy('Field not present on grid');

            expect(await fieldAssociationMappingsConsolePo.getSelectedGridRecordValue('Field Name')).toContain('Assigned Group');
            expect(await fieldAssociationMappingsConsolePo.getSelectedGridRecordValue('Association Name')).toContain('Case Template - Assigned Company > Created Date');
            expect(await fieldAssociationMappingsConsolePo.getSelectedGridRecordValue('Application Or Bundle Name')).toContain('com.bmc.dsm.case-lib');
            expect(await fieldAssociationMappingsConsolePo.getSelectedGridRecordValue('Record Definition Name')).toContain('com.bmc.dsm.case-lib:Case');
            expect(await fieldAssociationMappingsConsolePo.getSelectedGridRecordValue('Status')).toContain('Active');
        });

        it('[5424]: Delete record and Add/Remove Column', async () => {
            await fieldAssociationMappingsConsolePo.selectCheckBox('Assigned Group');
            await fieldAssociationMappingsConsolePo.clickOnDeleteButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
            expect(await fieldAssociationMappingsConsolePo.isGridRecordPresent('Assigned Group')).toBeFalsy('Field present on grid');


            let column: string[] = ['Application Or Bundle Name'];
            expect(await fieldAssociationMappingsConsolePo.areGridColumnHeaderMatches(allColoumn)).toBeTruthy("All Coloumn is not present");

            await fieldAssociationMappingsConsolePo.removeColumnOnGrid(column);
            expect(await fieldAssociationMappingsConsolePo.areGridColumnHeaderMatches(allColoumn)).toBeFalsy("All Coloumn is present");

            await fieldAssociationMappingsConsolePo.addColumnOnGrid(column);
            expect(await fieldAssociationMappingsConsolePo.areGridColumnHeaderMatches(allColoumn)).toBeTruthy("All Coloumn is not present");
        });
    });
});
