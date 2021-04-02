
import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import caseConsolePo from "../../pageobject/case/case-console.po";
import casePreviewPo from '../../pageobject/case/case-preview.po';
import createCasePo from '../../pageobject/case/create-case.po';
import viewCasePo from '../../pageobject/case/view-case.po';
import dynamicFieldsPage from '../../pageobject/common/dynamic-fields.po';
import localizeValuePopPo from '../../pageobject/common/localize-value-pop.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import createDynamicFieldLibraryConfigPo from '../../pageobject/settings/application-config/create-dynamic-field-library-config.po';
import createDynamicGroupLibraryConfigPo from '../../pageobject/settings/application-config/create-dynamic-group-library-config.po';
import dynamicFieldLibraryConfigConsolePo from '../../pageobject/settings/application-config/dynamic-field-library-config-console.po';
import dynamicGroupLibraryConfigConsolePo from '../../pageobject/settings/application-config/dynamic-group-library-config-console.po';
import editDynamicFieldLibraryConfigPo from '../../pageobject/settings/application-config/edit-dynamic-field-library-config.po';
import editDynamicGroupLibraryConfigPo from '../../pageobject/settings/application-config/edit-dynamic-group-library-config.po';
import consoleCasetemplatePo from '../../pageobject/settings/case-management/console-casetemplate.po';
import editCasetemplatePo from "../../pageobject/settings/case-management/edit-casetemplate.po";
import viewCasetemplatePo from '../../pageobject/settings/case-management/view-casetemplate.po';
import selectTaskTemplate from "../../pageobject/settings/task-management/console-tasktemplate.po";
import viewTasktemplatePo from '../../pageobject/settings/task-management/view-tasktemplate.po';
import editTaskPo from '../../pageobject/task/edit-task.po';
import manageTaskBladePo from '../../pageobject/task/manage-task-blade.po';
import viewTaskPo from '../../pageobject/task/view-task.po';
import { BWF_BASE_URL, BWF_PAGE_TITLES } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';
import changeAssignmentPo from '../../pageobject/common/change-assignment.po';


describe('Dynamic Library Configuration', () => {
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    describe('[4870]: [-ve] [Dynamic Data] - Create another Field with Same Name (ID) from Field Library', async () => {
        let randomString = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let dynamicFieldName = "LibTextField" + randomString;

        it('[4870]: [-ve] [Dynamic Data] - Create another Field with Same Name (ID) from Field Library', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Application Configuration--Dynamic Field Library', BWF_PAGE_TITLES.APPLICATION_CONFIGURATIONS.DYNAMIC_FILED_LIBRARY);
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            //field Text type    
            await dynamicFieldLibraryConfigConsolePo.clickAddDynamicFieldButton();
            await createDynamicFieldLibraryConfigPo.setFieldName(dynamicFieldName);
            await createDynamicFieldLibraryConfigPo.clickOnLocalizeButton();
            await localizeValuePopPo.setLocalizeValue(dynamicFieldName);
            await localizeValuePopPo.clickOnSaveButton();
            await createDynamicFieldLibraryConfigPo.setStatusValue('Active');
            await createDynamicFieldLibraryConfigPo.setInformationSourceValueType('Agent');
            await createDynamicFieldLibraryConfigPo.setFieldValueType('TEXT');
            await createDynamicFieldLibraryConfigPo.clickOnSaveButton();
            //field Number Type  
            await dynamicFieldLibraryConfigConsolePo.clickAddDynamicFieldButton();
            await createDynamicFieldLibraryConfigPo.setFieldName(dynamicFieldName);
            await createDynamicFieldLibraryConfigPo.clickOnLocalizeButton();
            await localizeValuePopPo.setLocalizeValue(dynamicFieldName);
            await localizeValuePopPo.clickOnSaveButton();
            await createDynamicFieldLibraryConfigPo.setStatusValue('Active');
            await createDynamicFieldLibraryConfigPo.setInformationSourceValueType('Agent');
            await createDynamicFieldLibraryConfigPo.setFieldValueType('NUMBER');
            await createDynamicFieldLibraryConfigPo.clickOnSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('Dynamic field with same name and line of business already exists.')).toBeTruthy();
            await utilityCommon.closePopUpMessage();
            await createDynamicFieldLibraryConfigPo.clickCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        });

        it('[4867]: create same name record in different LOB', async () => {
            //create same name record in same LOB
            await navigationPage.signOut();
            await loginPage.login('jbarnes');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Application Configuration--Dynamic Field Library', BWF_PAGE_TITLES.APPLICATION_CONFIGURATIONS.DYNAMIC_FILED_LIBRARY);
            await utilityGrid.selectLineOfBusiness('Facilities');
            await dynamicFieldLibraryConfigConsolePo.clickAddDynamicFieldButton();
            await createDynamicFieldLibraryConfigPo.setFieldName(dynamicFieldName);
            await createDynamicFieldLibraryConfigPo.clickOnLocalizeButton();
            await localizeValuePopPo.setLocalizeValue(dynamicFieldName);
            await localizeValuePopPo.clickOnSaveButton();
            await createDynamicFieldLibraryConfigPo.setStatusValue('Active');
            await createDynamicFieldLibraryConfigPo.setInformationSourceValueType('Agent');
            await createDynamicFieldLibraryConfigPo.setFieldValueType('TEXT');
            await createDynamicFieldLibraryConfigPo.clickOnSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy();
        });

        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        });

    });

    // adapt issue select dropdown with space
    describe('[4875,4876,4872]: [Dynamic Data] - Add all type of fields in Field Library', async () => {
        let randomString = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        it('[4875,4876,4872]: [Dynamic Data] - Add all type of fields in Field Library', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Application Configuration--Dynamic Field Library', BWF_PAGE_TITLES.APPLICATION_CONFIGURATIONS.DYNAMIC_FILED_LIBRARY);
            let headers: string[] = ["Field Description", "Field Name", "Field Value Type", "Status"];
            let updatedHeaders: string[] = ["Field Description", "Field Name", "Field Value Type", "Status", "Information Source", "Confidential", "Created Date", "ID", "Modified By", "Modified Date"];
            let header: string[] = ["Information Source", "Confidential", "Created Date", "ID", "Modified By", "Modified Date"];
            //field Text type    
            expect(await dynamicFieldLibraryConfigConsolePo.areRequestedColumnMatches(headers)).toBeTruthy();
            await dynamicFieldLibraryConfigConsolePo.addColumnOnGrid(header);
            expect(await dynamicFieldLibraryConfigConsolePo.areRequestedColumnMatches(updatedHeaders)).toBeTruthy();
            await dynamicFieldLibraryConfigConsolePo.removeColumnOnGrid(header);
            expect(await dynamicFieldLibraryConfigConsolePo.areRequestedColumnMatches(headers)).toBeTruthy();
            expect(await dynamicFieldLibraryConfigConsolePo.isRequestedColumnSortedAscending("Field Description")).toBeTruthy("ascending");
            expect(await dynamicFieldLibraryConfigConsolePo.isRequestedColumnSortedDescending("Field Description")).toBeTruthy("descending");
            expect(await dynamicFieldLibraryConfigConsolePo.isRequestedColumnSortedAscending("Field Name")).toBeTruthy("ascending");
            expect(await dynamicFieldLibraryConfigConsolePo.isRequestedColumnSortedDescending("Field Name")).toBeTruthy("descending");
            expect(await dynamicFieldLibraryConfigConsolePo.isRequestedColumnSortedAscending("Field Value Type")).toBeTruthy("ascending");
            expect(await dynamicFieldLibraryConfigConsolePo.isRequestedColumnSortedDescending("Field Value Type")).toBeTruthy("descending");
            expect(await dynamicFieldLibraryConfigConsolePo.isRequestedColumnSortedAscending("Status")).toBeTruthy("ascending");
            expect(await dynamicFieldLibraryConfigConsolePo.isRequestedColumnSortedDescending("Status")).toBeTruthy("descending");
            expect(await dynamicFieldLibraryConfigConsolePo.isRequestedColumnSortedAscending("InformationSource")).toBeTruthy("ascending");
            expect(await dynamicFieldLibraryConfigConsolePo.isRequestedColumnSortedDescending("InformationSource")).toBeTruthy("descending");
            expect(await dynamicFieldLibraryConfigConsolePo.isRequestedColumnSortedAscending("Confidential")).toBeTruthy("ascending");
            expect(await dynamicFieldLibraryConfigConsolePo.isRequestedColumnSortedDescending("Confidential")).toBeTruthy("descending");

        });
        it('[4875,4876,4872]: [Dynamic Data] - Add all type of fields in Field Library', async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();

            //field Text type    
            await dynamicFieldLibraryConfigConsolePo.clickAddDynamicFieldButton();
            await createDynamicFieldLibraryConfigPo.setFieldName('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
            await createDynamicFieldLibraryConfigPo.clickOnLocalizeButton();
            await localizeValuePopPo.setLocalizeValue('ABCDEFGHIJKLMNOPQRSTUVWXYZ' + randomString);
            await localizeValuePopPo.clickOnSaveButton();
            await createDynamicFieldLibraryConfigPo.setStatusValue('Active');
            await createDynamicFieldLibraryConfigPo.setInformationSourceValueType('Agent');
            await createDynamicFieldLibraryConfigPo.setFieldValueType('TEXT');
            await createDynamicFieldLibraryConfigPo.clickOnSaveButton();

            await dynamicFieldLibraryConfigConsolePo.clickAddDynamicFieldButton();
            await createDynamicFieldLibraryConfigPo.setFieldName('123456789');
            await createDynamicFieldLibraryConfigPo.clickOnLocalizeButton();
            await localizeValuePopPo.setLocalizeValue('123456789' + randomString);
            await localizeValuePopPo.clickOnSaveButton();
            await createDynamicFieldLibraryConfigPo.setStatusValue('Active');
            await createDynamicFieldLibraryConfigPo.setInformationSourceValueType('Agent');
            await createDynamicFieldLibraryConfigPo.setFieldValueType('NUMBER');
            await createDynamicFieldLibraryConfigPo.clickOnSaveButton();
        });
        it('[4875,4876,4872]: [Dynamic Data] - Add all type of fields in Field Library', async () => {
            await dynamicFieldLibraryConfigConsolePo.clickAddDynamicFieldButton();
            await createDynamicFieldLibraryConfigPo.setFieldName('ABC1237GC234wer324werfer7df');
            await createDynamicFieldLibraryConfigPo.clickOnLocalizeButton();
            await localizeValuePopPo.setLocalizeValue('ABC1237GC234wer324werfer7df' + randomString);
            await localizeValuePopPo.clickOnSaveButton();
            await createDynamicFieldLibraryConfigPo.setStatusValue('Active');
            await createDynamicFieldLibraryConfigPo.setInformationSourceValueType('Agent');
            await createDynamicFieldLibraryConfigPo.setFieldValueType('BOOLEAN');
            await createDynamicFieldLibraryConfigPo.clickOnSaveButton();

            await dynamicFieldLibraryConfigConsolePo.clickAddDynamicFieldButton();
            await createDynamicFieldLibraryConfigPo.setFieldName('@#$%^&*()_-++{[}');
            await createDynamicFieldLibraryConfigPo.clickOnLocalizeButton();
            await localizeValuePopPo.setLocalizeValue('@#$%^&*()_-++{[}' + randomString);
            await localizeValuePopPo.clickOnSaveButton();
            await createDynamicFieldLibraryConfigPo.setStatusValue('Active');
            await createDynamicFieldLibraryConfigPo.setInformationSourceValueType('System');
            await createDynamicFieldLibraryConfigPo.setFieldValueType('DATE');
            await createDynamicFieldLibraryConfigPo.clickOnSaveButton();
        });
        it('[4875,4876,4872]: [Dynamic Data] - Add all type of fields in Field Library', async () => {
            await dynamicFieldLibraryConfigConsolePo.clickAddDynamicFieldButton();
            await createDynamicFieldLibraryConfigPo.setFieldName('Field 123 Test_12');
            await createDynamicFieldLibraryConfigPo.clickOnLocalizeButton();
            await localizeValuePopPo.setLocalizeValue('Field 123 Test_1' + randomString);
            await localizeValuePopPo.clickOnSaveButton();
            await createDynamicFieldLibraryConfigPo.setStatusValue('Active');
            await createDynamicFieldLibraryConfigPo.setInformationSourceValueType('Task Assignee');
            await createDynamicFieldLibraryConfigPo.setFieldValueType('ATTACHMENT');
            await createDynamicFieldLibraryConfigPo.clickOnSaveButton();

            await dynamicFieldLibraryConfigConsolePo.clickAddDynamicFieldButton();
            await createDynamicFieldLibraryConfigPo.setFieldName('List');
            await createDynamicFieldLibraryConfigPo.clickOnLocalizeButton();
            await localizeValuePopPo.setLocalizeValue('List' + randomString);
            await localizeValuePopPo.clickOnSaveButton();
            await createDynamicFieldLibraryConfigPo.setStatusValue('Active');
            await createDynamicFieldLibraryConfigPo.setInformationSourceValueType('Requester');
            await createDynamicFieldLibraryConfigPo.setFieldValueType('LIST');
            await createDynamicFieldLibraryConfigPo.clickOnSaveButton();
            await editDynamicFieldLibraryConfigPo.clickCancelButton();
        });
        it('[4875,4876,4872]: [Dynamic Data] - Add all type of fields in Field Library', async () => {
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter("Field Value Type", "LIST", "checkbox");
            expect(await utilityGrid.isGridRecordPresent('List' + randomString)).toBeTruthy();
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter("Information Source", "Requester", "checkbox");
            expect(await utilityGrid.isGridRecordPresent('List' + randomString)).toBeTruthy();
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter("Confidential", "False", "radioButton");
            expect(await utilityGrid.isGridRecordPresent('List' + randomString)).toBeTruthy();
            await utilityGrid.clearFilter();
        });
        it('[4875,4876,4872]: [Dynamic Data] - Add all type of fields in Field Library', async () => {
            await utilityGrid.searchAndOpenHyperlink('ABCDEFGHIJKLMNOPQRSTUVWXYZ' + randomString);
            expect(await editDynamicFieldLibraryConfigPo.isFieldNameAttribute("readOnly")).toBeTruthy();
            expect(await editDynamicFieldLibraryConfigPo.isFieldValueTypeAttribute("aria-disabled")).toBeTruthy();
            await editDynamicFieldLibraryConfigPo.clickOnLocalizeButton();
            await localizeValuePopPo.setLocalizeValue(randomString + "ABCDEFGHIJKLMNOPQRSTUVWXYZ");
            await localizeValuePopPo.clickOnSaveButton();
            await editDynamicFieldLibraryConfigPo.setInformationSourceValueType('Requester');
            await editDynamicFieldLibraryConfigPo.setStatusValue('Inactive');
            await editDynamicFieldLibraryConfigPo.clickOnSaveButton();

            await utilityGrid.searchAndOpenHyperlink('123456789' + randomString);
            await editDynamicFieldLibraryConfigPo.clickOnLocalizeButton();
            await localizeValuePopPo.setLocalizeValue("123456789" + randomString);
            await localizeValuePopPo.clickOnSaveButton();
            await editDynamicFieldLibraryConfigPo.setInformationSourceValueType('Requester');
            await editDynamicFieldLibraryConfigPo.setStatusValue('Inactive');
            await editDynamicFieldLibraryConfigPo.clickOnSaveButton();
        });
        it('[4875,4876,4872]: [Dynamic Data] - Add all type of fields in Field Library', async () => {
            await utilityGrid.searchAndOpenHyperlink('ABC1237GC234wer324werfer7df' + randomString);
            await editDynamicFieldLibraryConfigPo.clickOnLocalizeButton();
            await localizeValuePopPo.setLocalizeValue(randomString + "ABC1237GC234wer324werfer7df");
            await localizeValuePopPo.clickOnSaveButton();
            await editDynamicFieldLibraryConfigPo.setInformationSourceValueType('Requester');
            await editDynamicFieldLibraryConfigPo.setStatusValue('Inactive');
            await editDynamicFieldLibraryConfigPo.clickOnSaveButton();

            await utilityGrid.searchAndOpenHyperlink('@#$%^&*()_-++{[}' + randomString);
            await editDynamicFieldLibraryConfigPo.clickOnLocalizeButton();
            await localizeValuePopPo.setLocalizeValue(randomString + '@#$%^&*()_-++{[}');
            await localizeValuePopPo.clickOnSaveButton();
            await editDynamicFieldLibraryConfigPo.setInformationSourceValueType('Requester');
            await editDynamicFieldLibraryConfigPo.setStatusValue('Inactive');
            await editDynamicFieldLibraryConfigPo.clickOnSaveButton();
        });
        it('[4875,4876,4872]: [Dynamic Data] - Add all type of fields in Field Library', async () => {
            await utilityGrid.searchAndOpenHyperlink('Field 123 Test_1' + randomString);
            await editDynamicFieldLibraryConfigPo.clickOnLocalizeButton();
            await localizeValuePopPo.setLocalizeValue(randomString + "Field 123 Test_1");
            await localizeValuePopPo.clickOnSaveButton();
            await editDynamicFieldLibraryConfigPo.setInformationSourceValueType('Requester');
            await editDynamicFieldLibraryConfigPo.setStatusValue('Inactive');
            await editDynamicFieldLibraryConfigPo.clickOnSaveButton();

            await utilityGrid.searchAndOpenHyperlink('List' + randomString);
            await editDynamicFieldLibraryConfigPo.clickOnLocalizeButton();
            await localizeValuePopPo.setLocalizeValue(randomString + 'List');
            await localizeValuePopPo.clickOnSaveButton();
            await editDynamicFieldLibraryConfigPo.setInformationSourceValueType('Task Assignee');
            await editDynamicFieldLibraryConfigPo.setStatusValue('Inactive');
            await editDynamicFieldLibraryConfigPo.clickOnSaveButton();
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
        });
    });

    describe('[4874]: [-ve] [Dynamic Data] - Add fields with different format of field names (ID)', async () => {
        let caseTemplateData, templateData, randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            caseTemplateData = {
                "templateName": randomStr + 'caseTemplateName',
                "templateSummary": 'CaseSummaryName' + randomStr,
                "caseStatus": "InProgress",
                "templateStatus": "Draft",
                "ownerBU": 'United States Support',
                "ownerGroup": "US Support 3",
            }
            templateData = {
                "templateName": randomStr + 'manualTaskTemplate1',
                "templateSummary": randomStr + 'manualTaskTemplateSummary1',
                "templateStatus": "Draft",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createManualTaskTemplate(templateData);
            await apiHelper.createCaseTemplate(caseTemplateData);
        });
        it('[4874]: [-ve] [Dynamic Data] - Add fields with different format of field names (ID)', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', BWF_PAGE_TITLES.TASK_MANAGEMENT.TEMPLATES);
            await selectTaskTemplate.searchAndOpenTaskTemplate(templateData.templateName);
            await viewTasktemplatePo.clickOnManageDynamicFieldLink();
            await dynamicFieldsPage.clickOnDynamicField();
            await dynamicFieldsPage.setFieldName('TIME' + randomStr);
            await dynamicFieldsPage.setDescriptionName('TIME' + randomStr);
            await dynamicFieldsPage.selectFieldValueType('TIME');
            await dynamicFieldsPage.clickSaveButton();
            await viewTasktemplatePo.clickOnManageDynamicFieldLink();
            await dynamicFieldsPage.clickOnDynamicField();
            await dynamicFieldsPage.setFieldName('DATE_TIME' + randomStr);
            await dynamicFieldsPage.setDescriptionName('DATE_TIME' + randomStr);
            await dynamicFieldsPage.selectFieldValueType('DATE_TIME');
            await dynamicFieldsPage.clickSaveButton();
            await viewTasktemplatePo.clickOnManageDynamicFieldLink();
            await dynamicFieldsPage.clickOnDynamicField();
            await dynamicFieldsPage.setFieldName('ATTACHMENT' + randomStr);
            await dynamicFieldsPage.setDescriptionName('ATTACHMENT' + randomStr);
            await dynamicFieldsPage.selectFieldValueType('ATTACHMENT');
            await dynamicFieldsPage.clickSaveButton();
        });
        it('[4874]: [-ve] [Dynamic Data] - Add fields with different format of field names (ID)', async () => {
            await viewTasktemplatePo.clickOnManageDynamicFieldLink();
            await dynamicFieldsPage.clickOnDynamicField();
            await dynamicFieldsPage.setFieldName('LIST' + randomStr);
            await dynamicFieldsPage.setDescriptionName('123 Test_1' + randomStr);
            await dynamicFieldsPage.selectFieldValueType('LIST');
            await dynamicFieldsPage.clickSaveButton();
            await viewTasktemplatePo.clickOnManageDynamicFieldLink();
            await dynamicFieldsPage.clickOnDynamicField();
            await dynamicFieldsPage.setFieldName('BOOLEAN' + randomStr);
            await dynamicFieldsPage.setDescriptionName('!@#$%^&*' + randomStr);
            await dynamicFieldsPage.selectFieldValueType('BOOLEAN');
            await dynamicFieldsPage.selectInfromationSource("Agent");
            await dynamicFieldsPage.clickSaveButton();
            await viewTasktemplatePo.clickOnManageDynamicFieldLink();
            await dynamicFieldsPage.clickOnDynamicField();
            await dynamicFieldsPage.setFieldName('Date' + randomStr);
            await dynamicFieldsPage.setDescriptionName('12345ABCDE' + randomStr);
            await dynamicFieldsPage.selectFieldValueType('DATE');
            await dynamicFieldsPage.selectInfromationSource("System");
            await dynamicFieldsPage.clickSaveButton();
        });
        it('[4874]: [-ve] [Dynamic Data] - Add fields with different format of field names (ID)', async () => {
            await viewTasktemplatePo.clickOnManageDynamicFieldLink();
            await dynamicFieldsPage.clickOnDynamicField();
            await dynamicFieldsPage.setFieldName('Name' + randomStr);
            await dynamicFieldsPage.setDescriptionName('ABCDEFGHIJKLMNOPQRSTUVWZYZ' + randomStr);
            await dynamicFieldsPage.selectInfromationSource("Requester");
            await dynamicFieldsPage.clickSaveButton();
            await viewTasktemplatePo.clickOnManageDynamicFieldLink();
            await dynamicFieldsPage.clickOnDynamicField();
            await dynamicFieldsPage.setFieldName('Number' + randomStr);
            await dynamicFieldsPage.setDescriptionName('1234567890' + randomStr);
            await dynamicFieldsPage.selectFieldValueType('NUMBER');
            await dynamicFieldsPage.selectInfromationSource("Task Assignee");
            await dynamicFieldsPage.clickSaveButton();
        });
        it('[4874]: [-ve] [Dynamic Data] - Add fields with different format of field names (ID)', async () => {
            expect(await viewTasktemplatePo.isDynamicFieldPresent('ABCDEFGHIJKLMNOPQRSTUVWZYZ' + randomStr)).toBeTruthy();
            expect(await viewTasktemplatePo.isDynamicFieldPresent('1234567890' + randomStr)).toBeTruthy();
            expect(await viewTasktemplatePo.isDynamicFieldPresent('12345ABCDE' + randomStr)).toBeTruthy();
            expect(await viewTasktemplatePo.isDynamicFieldPresent('!@#$%^&*' + randomStr)).toBeTruthy();
            expect(await viewTasktemplatePo.isDynamicFieldPresent('123 Test_1' + randomStr)).toBeTruthy();
            expect(await viewTasktemplatePo.isDynamicFieldPresent('ATTACHMENT' + randomStr)).toBeTruthy();
            expect(await viewTasktemplatePo.isDynamicFieldPresent('DATE_TIME' + randomStr)).toBeTruthy();
            expect(await viewTasktemplatePo.isDynamicFieldPresent('TIME' + randomStr)).toBeTruthy();
            await viewTasktemplatePo.clickBackArrowBtn();
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
            await consoleCasetemplatePo.searchAndClickOnCaseTemplate(caseTemplateData.templateName);
            await viewCasetemplatePo.clickOnMangeDynamicFieldLink();
            await dynamicFieldsPage.clickOnDynamicField();
            await dynamicFieldsPage.setFieldName('Field Name' + randomStr);
            await dynamicFieldsPage.setDescriptionName('ABCDEFGHIJKLMNOPQRSTUVWZYZ' + randomStr);
            await dynamicFieldsPage.selectInfromationSource("Requester");
            await dynamicFieldsPage.clickSaveButton();
            await viewCasetemplatePo.clickOnMangeDynamicFieldLink();
            await dynamicFieldsPage.clickOnDynamicField();
            await dynamicFieldsPage.setFieldName('Field Number' + randomStr);
            await dynamicFieldsPage.setDescriptionName('1234567890' + randomStr);
            await dynamicFieldsPage.selectFieldValueType('NUMBER');
            await dynamicFieldsPage.selectInfromationSource("Task Assignee");
            await dynamicFieldsPage.clickSaveButton();
        });
        it('[4874]: [-ve] [Dynamic Data] - Add fields with different format of field names (ID)', async () => {
            await viewCasetemplatePo.clickOnMangeDynamicFieldLink();
            await dynamicFieldsPage.clickOnDynamicField();
            await dynamicFieldsPage.setFieldName('Field Date' + randomStr);
            await dynamicFieldsPage.setDescriptionName('12345ABCDE' + randomStr);
            await dynamicFieldsPage.selectFieldValueType('DATE');
            await dynamicFieldsPage.selectInfromationSource("System");
            await dynamicFieldsPage.clickSaveButton();
            await viewCasetemplatePo.clickOnMangeDynamicFieldLink();
            await dynamicFieldsPage.clickOnDynamicField();
            await dynamicFieldsPage.setFieldName('Field BOOLEAN' + randomStr);
            await dynamicFieldsPage.setDescriptionName('!@#$%^&*' + randomStr);
            await dynamicFieldsPage.selectFieldValueType('BOOLEAN');
            await dynamicFieldsPage.selectInfromationSource("Agent");
            await dynamicFieldsPage.clickSaveButton();
            await viewCasetemplatePo.clickOnMangeDynamicFieldLink();
            await dynamicFieldsPage.clickOnDynamicField();
            await dynamicFieldsPage.setFieldName('Field LIST' + randomStr);
            await dynamicFieldsPage.setDescriptionName('123 Test_1' + randomStr);
            await dynamicFieldsPage.selectFieldValueType('LIST');
            await dynamicFieldsPage.clickSaveButton();
        });

        it('[4874]: [-ve] [Dynamic Data] - Add fields with different format of field names (ID)', async () => {
            await viewCasetemplatePo.clickOnMangeDynamicFieldLink();
            await dynamicFieldsPage.clickOnDynamicField();
            await dynamicFieldsPage.setFieldName('Field ATTACHMENT' + randomStr);
            await dynamicFieldsPage.setDescriptionName('Field ATTACHMENT' + randomStr);
            await dynamicFieldsPage.selectFieldValueType('ATTACHMENT');
            await dynamicFieldsPage.clickSaveButton();
            await viewCasetemplatePo.clickOnMangeDynamicFieldLink();
            await dynamicFieldsPage.clickOnDynamicField();
            await dynamicFieldsPage.setFieldName('Field DATE_TIME' + randomStr);
            await dynamicFieldsPage.setDescriptionName('Field DATE_TIME' + randomStr);
            await dynamicFieldsPage.selectFieldValueType('DATE_TIME');
            await dynamicFieldsPage.clickSaveButton();
            await viewCasetemplatePo.clickOnMangeDynamicFieldLink();
            await dynamicFieldsPage.clickOnDynamicField();
            await dynamicFieldsPage.setFieldName('Field TIME' + randomStr);
            await dynamicFieldsPage.setDescriptionName('Field TIME' + randomStr);
            await dynamicFieldsPage.selectFieldValueType('TIME');
            await dynamicFieldsPage.clickSaveButton();
            expect(await viewCasetemplatePo.isDynamicFieldDisplayed('ABCDEFGHIJKLMNOPQRSTUVWZYZ' + randomStr)).toBeTruthy();
            expect(await viewCasetemplatePo.isDynamicFieldDisplayed('1234567890' + randomStr)).toBeTruthy();
            expect(await viewCasetemplatePo.isDynamicFieldDisplayed('12345ABCDE' + randomStr)).toBeTruthy();
            expect(await viewCasetemplatePo.isDynamicFieldDisplayed('!@#$%^&*' + randomStr)).toBeTruthy();
            expect(await viewCasetemplatePo.isDynamicFieldDisplayed('123 Test_1' + randomStr)).toBeTruthy();
            expect(await viewCasetemplatePo.isDynamicFieldDisplayed('Field ATTACHMENT' + randomStr)).toBeTruthy();
            expect(await viewCasetemplatePo.isDynamicFieldDisplayed('Field DATE_TIME' + randomStr)).toBeTruthy();
            expect(await viewCasetemplatePo.isDynamicFieldDisplayed('Field TIME' + randomStr)).toBeTruthy();
        });
        afterAll(async () => {
            await viewCasetemplatePo.clickBackArrowBtn();
        });
    });

    describe('[4834]: [Dynamic Data] [UI] - Behavior of different dynamic fields from Task Edit view', async () => {
        let templateData, randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            templateData = {
                "templateName": randomStr + 'manualTaskTemplate',
                "templateSummary": randomStr + 'manualTaskTemplateSummary',
                "templateStatus": "Active",
                "taskCompany": 'Petramco',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('qkatawazi');
            let newCaseTemplate = await apiHelper.createManualTaskTemplate(templateData);
            await apiHelper.createDynamicDataOnTemplate(newCaseTemplate.id, 'CASE_TEMPLATE_DYNAMIC_FIELDS');
        });
        it('[4834]: [Dynamic Data] [UI] - Behavior of different dynamic fields from Task Edit view', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('adam');
            await createCasePo.setSummary('Summary' + randomStr);
            await changeAssignmentPo.setAssignee("US Support 3", "Qadim Katawazi");
            await createCasePo.clickSaveCaseButton();
            await casePreviewPo.clickGoToCaseButton();
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.addTaskFromTaskTemplate(templateData.templateName);
            await manageTaskBladePo.clickTaskLink(templateData.templateSummary);
        });
        it('[4834]: [Dynamic Data] [UI] - Behavior of different dynamic fields from Task Edit view', async () => {
            await viewTaskPo.clickOnEditTask();
            await editTaskPo.setDynamicFieldValue('temp', 'newtemp');
            await editTaskPo.setDynamicFieldValue('temp1', '333');
            await editTaskPo.setDateValueInDynamicField('2020-03-01');
            await editTaskPo.clickOnTrueValueOfDynamicField();
            await editTaskPo.addAttachmentInDynamicField('attachment2', ['../../data/ui/attachment/demo.txt']);
            await editTaskPo.setTimeInDynamicField('02');
            await editTaskPo.selectValueFromList('listvalues');
            await editTaskPo.setDateTimeDynamicFieldValue('04-01-2022 05:11 PM');
            await changeAssignmentPo.setAssignee("US Support 3", "Qadim Katawazi");
            await editTaskPo.clickOnSaveButton();
        });
        it('[4834]: [Dynamic Data] [UI] - Behavior of different dynamic fields from Task Edit view', async () => {
            expect(await viewTaskPo.getDynamicFieldValue('temp')).toBe('newtemplistvalues');
            expect(await viewTaskPo.getDynamicFieldValue('temp1')).toBe('333');
            expect(await viewTaskPo.getDynamicFieldValue('temp2')).toContain('Jan 20, 2020');
            expect(await viewTaskPo.getDynamicFieldValue('temp4')).toContain('Jan 20, 2004 5:11 PM');
            expect(await viewTaskPo.getDynamicFieldValue('temp3')).toContain('Yes');
            expect(await viewTaskPo.getDynamicFieldValue('temp5')).toContain('2:00 AM');
            expect(await viewTaskPo.getDynamicFieldValue('dynamicList')).toContain('listvalues');
        });
    });

    describe('[4869]: [Dynamic Data]- Add Dynamic Fields and Groups to Case Template', async () => {
        let casetemplateData, randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            casetemplateData = {
                "templateName": randomStr + 'caseTemplateDRDMV13128',
                "templateSummary": randomStr + 'caseTemplateDRDMV13128',
                "templateStatus": "Active",
                "assignee": "qkatawazi",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "ownerBU": "United States Support",
                "supportGroup": "US Support 3",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createCaseTemplate(casetemplateData);
            casetemplateData.templateName = randomStr + 'caseTemplateInactive';
            casetemplateData.templateStatus = 'Inactive';
            let CaseTemplate = await apiHelper.createCaseTemplate(casetemplateData);
            await apiHelper.createDynamicDataOnTemplate(CaseTemplate.id, 'DynamicGroupContainsHiddenFieldDRDMV21416');
            casetemplateData.templateName = randomStr + 'caseTemplateDraft';
            casetemplateData.templateStatus = 'Draft';
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            await apiHelper.apiLogin('qkatawazi');
            let newCaseTemplate = await apiHelper.createCaseTemplate(casetemplateData);
            await apiHelper.createDynamicDataOnTemplate(newCaseTemplate.id, 'DynamicGroupContainsHiddenFieldDRDMV21416');
        });
        it('[4869]: [Dynamic Data]- Add Dynamic Fields and Groups to Case Template', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
            await utilityGrid.searchAndOpenHyperlink(randomStr + 'caseTemplateDRDMV13128');
            expect(await viewCasetemplatePo.isManageDynamicFieldLinkDisplayed()).toBeFalsy();
            await viewCasetemplatePo.clickBackArrowBtn();
            await utilityGrid.searchAndOpenHyperlink(randomStr + 'caseTemplateDraft');
            expect(await viewCasetemplatePo.isManageDynamicFieldLinkDisplayed()).toBeTruthy();
            expect(await viewCasetemplatePo.isDynamicFieldDisplayed("FieldGroup1")).toBeTruthy();
            await viewCasetemplatePo.clickOnMangeDynamicFieldLink();
            expect(await dynamicFieldsPage.isAddDynamicGroupDisplayed()).toBeTruthy();
            expect(await dynamicFieldsPage.isDynamicFieldDisplayed()).toBeTruthy();
            await dynamicFieldsPage.clickOnAddDynamicGroup();
            expect(await dynamicFieldsPage.isGroupNameDisplayed()).toBeTruthy();
            expect(await dynamicFieldsPage.isGroupDescriptionDisplay()).toBeTruthy();
            await dynamicFieldsPage.clickEnabledPublishInLibraryButton();
            expect(await dynamicFieldsPage.isEnabledPublishInLibraryButtonDisplayed()).toBeTruthy();
            await dynamicFieldsPage.clickCancelButton();
            await dynamicFieldsPage.clickOnDownArrow();
            await dynamicFieldsPage.clickOnDownArrow();
            await browser.sleep(1000);
            expect(await dynamicFieldsPage.isFieldDisplayedInFieldSection('FieldGroup1')).toBeTruthy();
            expect(await dynamicFieldsPage.getFieldNameAttribute('disabled')).toBeTruthy();
            expect(await dynamicFieldsPage.getDescriptionName('disabled')).toBeTruthy();
            expect(await dynamicFieldsPage.getFieldValueType('aria-disabled')).toBeTruthy();
            await dynamicFieldsPage.removeField();
        });
        it('[4869]: [Dynamic Data]- Add Dynamic Fields and Groups to Case Template', async () => {
            await dynamicFieldsPage.clickSaveButton();
            expect(await viewCasetemplatePo.isDynamicFieldDisplayed("FieldGroup1")).toBeFalsy();
            await viewCasetemplatePo.clickBackArrowBtn();
            await utilityGrid.searchAndOpenHyperlink(randomStr + 'caseTemplateInactive');
            expect(await viewCasetemplatePo.isManageDynamicFieldLinkDisplayed()).toBeTruthy();
            await viewCasetemplatePo.clickOnMangeDynamicFieldLink();
            expect(await dynamicFieldsPage.isAddDynamicGroupDisplayed()).toBeTruthy();
            expect(await dynamicFieldsPage.isDynamicFieldDisplayed()).toBeTruthy();
            await dynamicFieldsPage.clickOnAddDynamicGroup();
            expect(await dynamicFieldsPage.isGroupNameDisplayed()).toBeTruthy();
            expect(await dynamicFieldsPage.isGroupDescriptionDisplay()).toBeTruthy();
            await dynamicFieldsPage.clickEnabledPublishInLibraryButton();
            expect(await dynamicFieldsPage.isEnabledPublishInLibraryButtonDisplayed()).toBeTruthy();
            await dynamicFieldsPage.clickCancelButton();
            await dynamicFieldsPage.clickOnDownArrow();
            await dynamicFieldsPage.clickOnDownArrow();
            expect(await dynamicFieldsPage.isFieldDisplayedInFieldSection('FieldGroup1')).toBeTruthy();
            expect(await dynamicFieldsPage.getFieldNameAttribute('disabled')).toBeTruthy();
            expect(await dynamicFieldsPage.getDescriptionName('disabled')).toBeTruthy();
            expect(await dynamicFieldsPage.getFieldValueType('aria-disabled')).toBeTruthy();
            await dynamicFieldsPage.removeField();
            await dynamicFieldsPage.clickSaveButton();
            expect(await viewCasetemplatePo.isDynamicFieldDisplayed("FieldGroup1")).toBeFalsy();

        });
        afterAll(async () => {
            await viewCasetemplatePo.clickBackArrowBtn();
            await utilityCommon.closeAllBlades();
        });
    });

    describe('[4863]: [Dynamic Data]- Add Dynamic Fields and Groups to Case Template', async () => {
        let caseTemplate, casetemplateData, randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseResponse;
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            casetemplateData = {
                "templateName": randomStr + 'caseTemplate13117',
                "templateSummary": randomStr + 'caseTemplate13117',
                "templateStatus": "Draft",
                "assignee": "qkatawazi",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "ownerBU": "United States Support",
                "supportGroup": "US Support 3",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('qkatawazi');
            caseTemplate = await apiHelper.createCaseTemplate(casetemplateData);
            await apiHelper.createDynamicDataOnTemplate(caseTemplate.id, 'BULK_DYNAMIC_FIELDS_INSIDE_OUTSIDE_GROUP');

        });
        it('[4863]: [Dynamic Data]- Add Dynamic Fields and Groups to Case Template', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
            await utilityGrid.searchAndOpenHyperlink(casetemplateData.templateName);
            await viewCasetemplatePo.clickEditTemplateMetaData();
            await editCasetemplatePo.changeTemplateStatusDropdownValue('Active');
            await editCasetemplatePo.clickOnSaveCaseTemplateMetadata();
            expect(await viewCasetemplatePo.isGroupDisplayed('GroupOne')).toBeTruthy();
        });
        it('[4863]: Verify Numbers Field InSide Of Group on Case template', async () => {
            for (let i = 1; i <= 15; i++) {
                expect(await viewCasetemplatePo.isDynamicFieldDisplayed(`${'WithInGroupNUMBER' + i}`)).toBeTruthy(`${'WithInGroupNUMBER' + i} is missing`);
            }
        });
        it('[4863]: Verify DATE Field InSide Of Group on Case template', async () => {
            for (let i = 1; i <= 15; i++) {
                expect(await viewCasetemplatePo.isDynamicFieldDisplayed(`${'WithInGroupDATE' + i}`)).toBeTruthy(`${'WithInGroupDATE' + i} is missing`);
            }
        });
        it('[4863]: Verify BOOLEAN Field InSide Of Group on Case template', async () => {
            for (let i = 1; i <= 15; i++) {
                expect(await viewCasetemplatePo.isDynamicFieldDisplayed(`${'WithInGroupBOOLEAN' + i}`)).toBeTruthy(`${'WithInGroupBOOLEAN' + i} is missing`);
            }
        });
        it('[4863]: Verify DATE_TIME Field InSide Of Group on Case template', async () => {
            for (let i = 1; i <= 15; i++) {
                expect(await viewCasetemplatePo.isDynamicFieldDisplayed(`${'WithInGroupDATETIME' + i}`)).toBeTruthy(`${'WithInGroupDATETIME' + i} is missing`);
            }
        });
        it('[4863]: Verify TIME Field InSide Of Group on Case template', async () => {
            for (let i = 1; i <= 15; i++) {
                expect(await viewCasetemplatePo.isDynamicFieldDisplayed(`${'WithInGroupTIME' + i}`)).toBeTruthy(`${'WithInGroupTIME' + i} is missing`);
            }
        });
        it('[4863]: Verify LIST Field InSide Of Group on Case template', async () => {
            for (let i = 1; i <= 15; i++) {
                expect(await viewCasetemplatePo.isDynamicFieldDisplayed(`${'WithInGroupLIST' + i}`)).toBeTruthy(`${'WithInGroupLIST' + i} is missing`);
            }
        });
        it('[4863]: Verify ATTACHMENT Field InSide Of Group on Case template', async () => {
            for (let i = 1; i <= 15; i++) {
                expect(await viewCasetemplatePo.isDynamicFieldDisplayed(`${'WithInGroupATTACHMENT' + i}`)).toBeTruthy(`${'WithInGroupATTACHMENT' + i} is missing`);
            }
        });
        it('[4863]: Verify TEXT Field InSide Of Group on Case template', async () => {
            for (let i = 1; i <= 15; i++) {
                expect(await viewCasetemplatePo.isDynamicFieldDisplayed(`${'WithInGroupTempTEXT' + i}`)).toBeTruthy(`${'WithInGroupTempTEXT' + i} is missing`);
            }
        });
        it('[4863]: Verify Numbers Field Out Of Group on Case template', async () => {
            for (let i = 1; i <= 15; i++) {
                expect(await viewCasetemplatePo.isDynamicFieldDisplayed(`${'OutOfGroupNUMBER' + i}`)).toBeTruthy(`${'OutOfGroupNUMBER' + i} is missing`);
            }
        });
        it('[4863]: Verify DATE Field Out Of Group on Case template', async () => {
            for (let i = 1; i <= 15; i++) {
                expect(await viewCasetemplatePo.isDynamicFieldDisplayed(`${'OutOfGroupDATE' + i}`)).toBeTruthy(`${'OutOfGroupDATE' + i} is missing`);
            }
        });
        it('[4863]: Verify BOOLEAN Field Out Of Group on Case template', async () => {
            for (let i = 1; i <= 15; i++) {
                expect(await viewCasetemplatePo.isDynamicFieldDisplayed(`${'OutOfGroupBOOLEAN' + i}`)).toBeTruthy(`${'OutOfGroupBOOLEAN' + i} is missing`);
            }
        });
        it('[4863]:Verify DATE_TIME Field Out Of Group on Case template', async () => {
            for (let i = 1; i <= 15; i++) {
                expect(await viewCasetemplatePo.isDynamicFieldDisplayed(`${'OutOfGroupDATETIME' + i}`)).toBeTruthy(`${'OutOfGroupDATETIME' + i} is missing`);
            }
        });
        it('[4863]: Verify TIME Field Out Of Group on Case template', async () => {
            for (let i = 1; i <= 15; i++) {
                expect(await viewCasetemplatePo.isDynamicFieldDisplayed(`${'OutOfGroupTIME' + i}`)).toBeTruthy(`${'OutOfGroupTIME' + i} is missing`);
            }
        });
        it('[4863]: Verify LIST Field Out Of Group on Case template', async () => {
            for (let i = 1; i <= 15; i++) {
                expect(await viewCasetemplatePo.isDynamicFieldDisplayed(`${'OutOfGroupLIST' + i}`)).toBeTruthy(`${'OutOfGroupLIST' + i} is missing`);
            }
        });
        it('[4863]: Verify ATTACHMENT Field Out Of Group on Case template', async () => {
            for (let i = 1; i <= 15; i++) {
                expect(await viewCasetemplatePo.isDynamicFieldDisplayed(`${'OutOfGroupATTACHMENT' + i}`)).toBeTruthy(`${'OutOfGroupATTACHMENT' + i} is missing`);
            }
        });
        it('[4863]: Verify TEXT Field Out Of Group on Case template', async () => {
            for (let i = 1; i <= 15; i++) {
                expect(await viewCasetemplatePo.isDynamicFieldDisplayed(`${'OutOfGroupTempTEXT' + i}`)).toBeTruthy(`${'OutOfGroupTempTEXT' + i} is missing`);
            }
        });

        it('[4863]: Search and open case', async () => {
            let caseData = {
                "Requester": "apavlik",
                "Summary": "caseSummaryForDynamicData13117",
                "Origin": "Agent",
                "Case Template ID": caseTemplate.displayId
            }
            caseResponse = await apiHelper.createCase(caseData);
            await viewCasetemplatePo.clickBackArrowBtn()
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(caseResponse.displayId);
        });
        it('[4863]: Verify Numbers Field InSide Of Group on Case', async () => {
            for (let i = 1; i <= 15; i++) {
                expect(await viewCasePo.isDynamicFieldDisplayed(`${'WithInGroupNUMBER' + i}`)).toBeTruthy(`${'WithInGroupNUMBER' + i} is missing`);
            }
        });
        it('[4863]: Verify DATE Field InSide Of Group on Case', async () => {
            for (let i = 1; i <= 15; i++) {
                expect(await viewCasePo.isDynamicFieldDisplayed(`${'WithInGroupDATE' + i}`)).toBeTruthy(`${'WithInGroupDATE' + i} is missing`);
            }
        });
        it('[4863]: Verify BOOLEAN Field InSide Of Group on Case', async () => {
            for (let i = 1; i <= 15; i++) {
                expect(await viewCasePo.isDynamicFieldDisplayed(`${'WithInGroupBOOLEAN' + i}`)).toBeTruthy(`${'WithInGroupBOOLEAN' + i} is missing`);
            }
        });
        it('[4863]: Verify DATE_TIME Field InSide Of Group on Case', async () => {
            for (let i = 1; i <= 15; i++) {
                expect(await viewCasePo.isDynamicFieldDisplayed(`${'WithInGroupDATETIME' + i}`)).toBeTruthy(`${'WithInGroupDATETIME' + i} is missing`);
            }
        });
        it('[4863]: Verify TIME Field InSide Of Group on Case', async () => {
            for (let i = 1; i <= 15; i++) {
                expect(await viewCasePo.isDynamicFieldDisplayed(`${'WithInGroupTIME' + i}`)).toBeTruthy(`${'WithInGroupTIME' + i} is missing`);
            }
        });
        it('[4863]: Verify LIST Field InSide Of Group on Case', async () => {
            for (let i = 1; i <= 15; i++) {
                expect(await viewCasePo.isDynamicFieldDisplayed(`${'WithInGroupLIST' + i}`)).toBeTruthy(`${'WithInGroupLIST' + i} is missing`);
            }
        });
        it('[4863]: Verify ATTACHMENT Field InSide Of Group on Case', async () => {
            for (let i = 1; i <= 15; i++) {
                expect(await viewCasePo.isDynamicFieldDisplayed(`${'WithInGroupATTACHMENT' + i}`)).toBeTruthy(`${'WithInGroupATTACHMENT' + i} is missing`);
            }
        });
        it('[4863]: Verify TEXT Field InSide Of Group on Case', async () => {
            for (let i = 1; i <= 15; i++) {
                expect(await viewCasePo.isDynamicFieldDisplayed(`${'WithInGroupTempTEXT' + i}`)).toBeTruthy(`${'WithInGroupTempTEXT' + i} is missing`);
            }
        });
        it('[4863]: Verify Numbers Field Out Of Group on Case', async () => {
            for (let i = 1; i <= 15; i++) {
                expect(await viewCasePo.isDynamicFieldDisplayed(`${'OutOfGroupNUMBER' + i}`)).toBeTruthy(`${'OutOfGroupNUMBER' + i} is missing`);
            }
        });
        it('[4863]: Verify DATE Field Out Of Group on Case', async () => {
            for (let i = 1; i <= 15; i++) {
                expect(await viewCasePo.isDynamicFieldDisplayed(`${'OutOfGroupDATE' + i}`)).toBeTruthy(`${'OutOfGroupDATE' + i} is missing`);
            }
        });
        it('[4863]: Verify BOOLEAN Field Out Of Group on Case', async () => {
            for (let i = 1; i <= 15; i++) {
                expect(await viewCasePo.isDynamicFieldDisplayed(`${'OutOfGroupBOOLEAN' + i}`)).toBeTruthy(`${'OutOfGroupBOOLEAN' + i} is missing`);
            }
        });
        it('[4863]:Verify DATE_TIME Field Out Of Group on Case', async () => {
            for (let i = 1; i <= 15; i++) {
                expect(await viewCasePo.isDynamicFieldDisplayed(`${'OutOfGroupDATETIME' + i}`)).toBeTruthy(`${'OutOfGroupDATETIME' + i} is missing`);
            }
        });
        it('[4863]: Verify TIME Field Out Of Group on Case', async () => {
            for (let i = 1; i <= 15; i++) {
                expect(await viewCasePo.isDynamicFieldDisplayed(`${'OutOfGroupTIME' + i}`)).toBeTruthy(`${'OutOfGroupTIME' + i} is missing`);
            }
        });
        it('[4863]: Verify LIST Field Out Of Group on Case', async () => {
            for (let i = 1; i <= 15; i++) {
                expect(await viewCasePo.isDynamicFieldDisplayed(`${'OutOfGroupLIST' + i}`)).toBeTruthy(`${'OutOfGroupLIST' + i} is missing`);
            }
        });
        it('[4863]: Verify ATTACHMENT Field Out Of Group on Case', async () => {
            for (let i = 1; i <= 15; i++) {
                expect(await viewCasePo.isDynamicFieldDisplayed(`${'OutOfGroupATTACHMENT' + i}`)).toBeTruthy(`${'OutOfGroupATTACHMENT' + i} is missing`);
            }
        });
        it('[4863]: Verify TEXT Field Out Of Group on Case', async () => {
            for (let i = 1; i <= 15; i++) {
                expect(await viewCasePo.isDynamicFieldDisplayed(`${'OutOfGroupTempTEXT' + i}`)).toBeTruthy(`${'OutOfGroupTempTEXT' + i} is missing`);
            }
        });
    });

    describe('[4067]: [Dynamic Data Group] Add dynamic groups to Dynamic Field Group Library', async () => {
        let randomString = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let dynamicGrpText = "Custom Dynamic Group " + randomString;
        let dynamicGrpDisplayLabel = "Custom Dynamic Group Display Text " + randomString;
        let dynamicGroupWarningText = "A group must contain at least one field.";
        let dynamicFieldText = "Custom Dynamic Field " + randomString;
        let dynamicFieldDesc = "Custom Dynamic Field Desc Text " + randomString;

        it('[4067]: [Dynamic Data Group] - Add dynamic group to dynamic field group library', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Application Configuration--Dynamic Group Library', BWF_PAGE_TITLES.APPLICATION_CONFIGURATIONS.DYNAMIC_GROUP_LIBRARY);
            await dynamicGroupLibraryConfigConsolePo.clickAddDynamicGroupButton();
            expect(await createDynamicGroupLibraryConfigPo.verifyTitle('Create Dynamic Group')).toBeTruthy("Dynamic Group Library Screen title did not matched");
            expect(await createDynamicGroupLibraryConfigPo.isDynamicGroupNameRequiredText()).toBeTruthy();
            expect(await createDynamicGroupLibraryConfigPo.isLineofBusinessRequiredText()).toBeTruthy();
            expect(await createDynamicGroupLibraryConfigPo.isStatusRequiredText()).toBeTruthy();

            await createDynamicGroupLibraryConfigPo.setDynamicGroupName(dynamicGrpText);
            await createDynamicGroupLibraryConfigPo.clickOnDisplayLabelocalizedLink();
            await createDynamicGroupLibraryConfigPo.setLocalizedValue(dynamicGrpDisplayLabel);
            await createDynamicGroupLibraryConfigPo.clickOnDynamicGroupLocalizedVaueSaveButton();
            expect(await createDynamicGroupLibraryConfigPo.getDynamicGroupWarningMessage()).toBe(dynamicGroupWarningText);

            await createDynamicGroupLibraryConfigPo.clickOnAddDynamicField();
            await createDynamicGroupLibraryConfigPo.setDynamicFieldName(dynamicFieldText);
            await createDynamicGroupLibraryConfigPo.setDynamicFieldDesc(dynamicFieldDesc);
            await createDynamicGroupLibraryConfigPo.clickOnDynamicGroupSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
            expect(await utilityGrid.isGridRecordPresent(dynamicGrpText)).toBeTruthy('Dynamic Group is not present of grid.');

            await utilityGrid.searchAndOpenHyperlink(dynamicGrpText);
            expect(await editDynamicGroupLibraryConfigPo.getDynamicGroupName()).toBe(dynamicGrpText);
            expect(await editDynamicGroupLibraryConfigPo.getDynamicGroupDisplayLabel()).toBe(dynamicGrpDisplayLabel);
            expect(await editDynamicGroupLibraryConfigPo.getDynamicGroupLineOfBusiness()).toBe('Human Resource');
            expect(await editDynamicGroupLibraryConfigPo.getDynamicGroupStatusValue()).toBe('Active');
            expect(await editDynamicGroupLibraryConfigPo.isDynamicFieldsDisplayed()).toBeTruthy();

            await editDynamicGroupLibraryConfigPo.setStatusValue('Inactive');
            await editDynamicGroupLibraryConfigPo.clickOnAddDynamicField();
            await editDynamicGroupLibraryConfigPo.setDynamicFieldName(dynamicFieldText + "updated");
            await editDynamicGroupLibraryConfigPo.setDynamicFieldDesc(dynamicFieldDesc);
            await editDynamicGroupLibraryConfigPo.clickOnDynamicGroupSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
            expect(await utilityGrid.isGridRecordPresent(dynamicGrpText)).toBeTruthy('Dynamic Group is not present of grid.');
        });

        it('[4067]: Verify if dynamic fields groups are accessible to same LOB Case Manager', async () => {
            await navigationPage.signOut();
            await loginPage.login('qdu');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Application Configuration--Dynamic Group Library', BWF_PAGE_TITLES.APPLICATION_CONFIGURATIONS.DYNAMIC_GROUP_LIBRARY);
            expect(await utilityGrid.isGridRecordPresent(dynamicGrpText)).toBeTruthy('Dynamic Group is not present of grid.');
        });

        it('[4067]: Verify if dynamic fields groups are accessible to different LOB Case BA', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Application Configuration--Dynamic Group Library', BWF_PAGE_TITLES.APPLICATION_CONFIGURATIONS.DYNAMIC_GROUP_LIBRARY);
            expect(await utilityGrid.isGridRecordPresent(dynamicGrpText)).toBeFalsy('Dynamic Group is displayed to different LOB Case BA.');
        });

        it('[4067]: Verify if dynamic fields groups are accessible to different LOB Case Manager', async () => {
            await navigationPage.signOut();
            await loginPage.login('frieda');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Application Configuration--Dynamic Group Library', BWF_PAGE_TITLES.APPLICATION_CONFIGURATIONS.DYNAMIC_GROUP_LIBRARY);
            expect(await utilityGrid.isGridRecordPresent(dynamicGrpText)).toBeFalsy('Dynamic Group is displayed to different LOB Case Manager.');
        });

        it('[4067]: Verify if dynamic fields groups are accessible to Case BA belonging to different company with same LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('gwixillian');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Application Configuration--Dynamic Group Library', BWF_PAGE_TITLES.APPLICATION_CONFIGURATIONS.DYNAMIC_GROUP_LIBRARY);
            expect(await utilityGrid.isGridRecordPresent(dynamicGrpText)).toBeTruthy('Dynamic Group is displayed to different company but same LOB Case BA.');
        });

        it('[4067]: create same name record in same LOB', async () => {
            //create same name record in same LOB
            await navigationPage.signOut();
            await loginPage.login('jbarnes');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Application Configuration--Dynamic Group Library', BWF_PAGE_TITLES.APPLICATION_CONFIGURATIONS.DYNAMIC_GROUP_LIBRARY);
            await utilityGrid.selectLineOfBusiness('Human Resource');
            await dynamicGroupLibraryConfigConsolePo.clickAddDynamicGroupButton();
            await createDynamicGroupLibraryConfigPo.setDynamicGroupName(dynamicGrpText);
            await createDynamicGroupLibraryConfigPo.clickOnDisplayLabelocalizedLink();
            await createDynamicGroupLibraryConfigPo.setLocalizedValue(dynamicGrpDisplayLabel);
            await createDynamicGroupLibraryConfigPo.clickOnDynamicGroupLocalizedVaueSaveButton();

            await createDynamicGroupLibraryConfigPo.clickOnAddDynamicField();
            await createDynamicGroupLibraryConfigPo.setDynamicFieldName(dynamicFieldText);
            await createDynamicGroupLibraryConfigPo.setDynamicFieldDesc(dynamicFieldDesc);
            expect(await createDynamicGroupLibraryConfigPo.isSaveButtonDisabled()).toBeTruthy();
            await createDynamicGroupLibraryConfigPo.clickOnDynamicGroupCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        });

        it('[4067]: create same name record in different LOB', async () => {
            //create same name record in different LOB
            await utilityGrid.selectLineOfBusiness('Facilities');
            await dynamicGroupLibraryConfigConsolePo.clickAddDynamicGroupButton();
            await createDynamicGroupLibraryConfigPo.setDynamicGroupName(dynamicGrpText);
            await createDynamicGroupLibraryConfigPo.clickOnDisplayLabelocalizedLink();
            await createDynamicGroupLibraryConfigPo.setLocalizedValue(dynamicGrpDisplayLabel);
            await createDynamicGroupLibraryConfigPo.clickOnDynamicGroupLocalizedVaueSaveButton();

            await createDynamicGroupLibraryConfigPo.clickOnAddDynamicField();
            await createDynamicGroupLibraryConfigPo.setDynamicFieldName(dynamicFieldText);
            await createDynamicGroupLibraryConfigPo.setDynamicFieldDesc(dynamicFieldDesc);
            await createDynamicGroupLibraryConfigPo.clickOnDynamicGroupSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
            expect(await utilityGrid.isGridRecordPresent(dynamicGrpText)).toBeTruthy('Dynamic Group is not present of grid.');

            await utilityGrid.selectLineOfBusiness('Human Resource');
        });

        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        });
    });

});