import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import casePreviewPo from '../../pageobject/case/case-preview.po';
import createCasePo from '../../pageobject/case/create-case.po';
import viewCasePo from '../../pageobject/case/view-case.po';
import dynamicFieldsPage from '../../pageobject/common/dynamic-fields.po';
import localizeValuePopPo from '../../pageobject/common/localize-value-pop.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import createDynamicFieldLibraryConfigPo from '../../pageobject/settings/application-config/create-dynamic-field-library-config.po';
import dynamicFieldLibraryConfigConsolePo from '../../pageobject/settings/application-config/dynamic-field-library-config-console.po';
import editDynamicFieldLibraryConfigPo from '../../pageobject/settings/application-config/edit-dynamic-field-library-config.po';
import consoleCasetemplatePo from '../../pageobject/settings/case-management/console-casetemplate.po';
import viewCasetemplatePo from '../../pageobject/settings/case-management/view-casetemplate.po';
import selectTaskTemplate from "../../pageobject/settings/task-management/console-tasktemplate.po";
import viewTasktemplatePo from '../../pageobject/settings/task-management/view-tasktemplate.po';
import editTaskPo from '../../pageobject/task/edit-task.po';
import manageTaskBladePo from '../../pageobject/task/manage-task-blade.po';
import viewTaskPo from '../../pageobject/task/view-task.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilCommon from '../../utils/util.common';
import utilGrid from '../../utils/util.grid';
import utilityCommon from '../../utils/utility.common';


describe('Dynamic Library Configuration', () => {
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    it('[DRDMV-13109]: [-ve] [Dynamic Data] - Create another Field with Same Name (ID) from Field Library', async () => {
        let randomString = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Application Configuration--Dynamic Field Library', 'Field Management Console - Business Workflows');
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteDynamicFieldAndGroup();
        //field Text type    
        await dynamicFieldLibraryConfigConsolePo.clickAddDynamicFieldButton();
        await createDynamicFieldLibraryConfigPo.setFieldName('LibTextField' + randomString);
        await createDynamicFieldLibraryConfigPo.clickOnLocalizeButton();
        await localizeValuePopPo.setLocalizeValue('LibTextField' + randomString);
        await localizeValuePopPo.clickOnSaveButton();
        await createDynamicFieldLibraryConfigPo.setStatusValue('Active');
        await createDynamicFieldLibraryConfigPo.setInformationSourceValueType('Agent');
        await createDynamicFieldLibraryConfigPo.setFieldValueType('TEXT');
        await createDynamicFieldLibraryConfigPo.clickOnSaveButton();
        //field Number Type  
        await dynamicFieldLibraryConfigConsolePo.clickAddDynamicFieldButton();
        await createDynamicFieldLibraryConfigPo.setFieldName('LibTextField' + randomString);
        await createDynamicFieldLibraryConfigPo.clickOnLocalizeButton();
        await localizeValuePopPo.setLocalizeValue('LibNumberField' + randomString);
        await localizeValuePopPo.clickOnSaveButton();
        await createDynamicFieldLibraryConfigPo.setStatusValue('Active');
        await createDynamicFieldLibraryConfigPo.setInformationSourceValueType('Agent');
        await createDynamicFieldLibraryConfigPo.setFieldValueType('NUMBER');
        await createDynamicFieldLibraryConfigPo.clickOnSaveButton();
        expect(await utilCommon.isPopUpMessagePresent('ERROR (12423): Dynamic field with same name and line of business already exists.')).toBeTruthy();
        await utilCommon.closePopUpMessage();
        await createDynamicFieldLibraryConfigPo.clickCancelButton();
        await utilCommon.clickOnWarningOk();
    });

    describe('[DRDMV-13104,DRDMV-13103,DRDMV-13107]: [Dynamic Data] - Add all type of fields in Field Library', async () => {
        let randomString = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        it('[DRDMV-13104,DRDMV-13103,DRDMV-13107]: [Dynamic Data] - Add all type of fields in Field Library', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Application Configuration--Dynamic Field Library', 'Field Management Console - Business Workflows');
            let headers: string[] = ["Field Description", "Field Name", "Field Value Type", "Status"];
            let updatedHeaders: string[] = ["Field Description", "Field Name", "Field Value Type", "Status", "InformationSource", "Confidential" ];
            let header: string[] = ["InformationSource", "Confidential"]
            //field Text type    
            expect(await dynamicFieldLibraryConfigConsolePo.areRequestedColumnMatches(headers)).toBeTruthy();
            await dynamicFieldLibraryConfigConsolePo.addColumnOnGrid(header);
            expect(await dynamicFieldLibraryConfigConsolePo.areRequestedColumnMatches(updatedHeaders)).toBeTruthy();
            expect(await dynamicFieldLibraryConfigConsolePo.isRequestedColumnSortedAscending("Field Description")).toBeTruthy("asc");
            expect(await dynamicFieldLibraryConfigConsolePo.isRequestedColumnSortedDescending("Field Description")).toBeTruthy("desc");
            expect(await dynamicFieldLibraryConfigConsolePo.isRequestedColumnSortedAscending("Field Name")).toBeTruthy("asc");
            expect(await dynamicFieldLibraryConfigConsolePo.isRequestedColumnSortedDescending("Field Name")).toBeTruthy("desc");
            expect(await dynamicFieldLibraryConfigConsolePo.isRequestedColumnSortedAscending("Field Value Type")).toBeTruthy("asc");
            expect(await dynamicFieldLibraryConfigConsolePo.isRequestedColumnSortedDescending("Field Value Type")).toBeTruthy("desc");
            expect(await dynamicFieldLibraryConfigConsolePo.isRequestedColumnSortedAscending("Status")).toBeTruthy("asc");
            expect(await dynamicFieldLibraryConfigConsolePo.isRequestedColumnSortedDescending("Status")).toBeTruthy("desc");
            expect(await dynamicFieldLibraryConfigConsolePo.isRequestedColumnSortedAscending("InformationSource")).toBeTruthy("asc");
            expect(await dynamicFieldLibraryConfigConsolePo.isRequestedColumnSortedDescending("InformationSource")).toBeTruthy("desc");
            expect(await dynamicFieldLibraryConfigConsolePo.isRequestedColumnSortedAscending("Confidential")).toBeTruthy("asc");
            expect(await dynamicFieldLibraryConfigConsolePo.isRequestedColumnSortedDescending("Confidential")).toBeTruthy("desc");

        });
        it('[DRDMV-13104,DRDMV-13103,DRDMV-13107]: [Dynamic Data] - Add all type of fields in Field Library', async () => {
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
        it('[DRDMV-13104,DRDMV-13103,DRDMV-13107]: [Dynamic Data] - Add all type of fields in Field Library', async () => {
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
        it('[DRDMV-13104,DRDMV-13103,DRDMV-13107]: [Dynamic Data] - Add all type of fields in Field Library', async () => {
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
        it('[DRDMV-13104,DRDMV-13103,DRDMV-13107]: [Dynamic Data] - Add all type of fields in Field Library', async () => {
            await utilGrid.clearFilter();
            await utilGrid.addFilter("Field Value Type", "LIST", "checkbox");
            expect( await utilGrid.isGridRecordPresent('List' + randomString)).toBeTruthy();
            await utilGrid.clearFilter();
            await utilGrid.addFilter("InformationSource", "Requester", "checkbox");
            expect(await utilGrid.isGridRecordPresent('List' + randomString)).toBeTruthy();
            await utilGrid.clearFilter();
            await utilGrid.addFilter("Confidential", "False", "checkbox");
            expect(await utilGrid.isGridRecordPresent('List' + randomString)).toBeTruthy();
            await utilGrid.clearFilter();
        });
        it('[DRDMV-13104,DRDMV-13103,DRDMV-13107]: [Dynamic Data] - Add all type of fields in Field Library', async () => {
            await utilGrid.searchAndOpenHyperlink('ABCDEFGHIJKLMNOPQRSTUVWXYZ' + randomString);
            expect(await editDynamicFieldLibraryConfigPo.isFieldNameAttribute("readOnly")).toBeTruthy();
            expect(await editDynamicFieldLibraryConfigPo.isFieldValueTypeAttribute("disabled")).toBeTruthy();
            await editDynamicFieldLibraryConfigPo.clickOnLocalizeButton();
            await localizeValuePopPo.setLocalizeValue(randomString + "ABCDEFGHIJKLMNOPQRSTUVWXYZ");
            await localizeValuePopPo.clickOnSaveButton();
            await editDynamicFieldLibraryConfigPo.setInformationSourceValueType('Requester');
            await editDynamicFieldLibraryConfigPo.setStatusValue('Inactive');
            await editDynamicFieldLibraryConfigPo.clickOnSaveButton();

            await utilGrid.searchAndOpenHyperlink('123456789' + randomString);
            await editDynamicFieldLibraryConfigPo.clickOnLocalizeButton();
            await localizeValuePopPo.setLocalizeValue("123456789" + randomString);
            await localizeValuePopPo.clickOnSaveButton();
            await editDynamicFieldLibraryConfigPo.setInformationSourceValueType('Requester');
            await editDynamicFieldLibraryConfigPo.setStatusValue('Inactive');
            await editDynamicFieldLibraryConfigPo.clickOnSaveButton();
        });
        it('[DRDMV-13104,DRDMV-13103,DRDMV-13107]: [Dynamic Data] - Add all type of fields in Field Library', async () => {
            await utilGrid.searchAndOpenHyperlink('ABC1237GC234wer324werfer7df' + randomString);
            await editDynamicFieldLibraryConfigPo.clickOnLocalizeButton();
            await localizeValuePopPo.setLocalizeValue(randomString + "ABC1237GC234wer324werfer7df");
            await localizeValuePopPo.clickOnSaveButton();
            await editDynamicFieldLibraryConfigPo.setInformationSourceValueType('Requester');
            await editDynamicFieldLibraryConfigPo.setStatusValue('Inactive');
            await editDynamicFieldLibraryConfigPo.clickOnSaveButton();

            await utilGrid.searchAndOpenHyperlink('@#$%^&*()_-++{[}' + randomString);
            await editDynamicFieldLibraryConfigPo.clickOnLocalizeButton();
            await localizeValuePopPo.setLocalizeValue(randomString + '@#$%^&*()_-++{[}');
            await localizeValuePopPo.clickOnSaveButton();
            await editDynamicFieldLibraryConfigPo.setInformationSourceValueType('Requester');
            await editDynamicFieldLibraryConfigPo.setStatusValue('Inactive');
            await editDynamicFieldLibraryConfigPo.clickOnSaveButton();
        });
        it('[DRDMV-13104,DRDMV-13103,DRDMV-13107]: [Dynamic Data] - Add all type of fields in Field Library', async () => {
            await utilGrid.searchAndOpenHyperlink('Field 123 Test_1' + randomString);
            await editDynamicFieldLibraryConfigPo.clickOnLocalizeButton();
            await localizeValuePopPo.setLocalizeValue(randomString + "Field 123 Test_1");
            await localizeValuePopPo.clickOnSaveButton();
            await editDynamicFieldLibraryConfigPo.setInformationSourceValueType('Requester');
            await editDynamicFieldLibraryConfigPo.setStatusValue('Inactive');
            await editDynamicFieldLibraryConfigPo.clickOnSaveButton();

            await utilGrid.searchAndOpenHyperlink('List' + randomString);
            await editDynamicFieldLibraryConfigPo.clickOnLocalizeButton();
            await localizeValuePopPo.setLocalizeValue(randomString + 'List');
            await localizeValuePopPo.clickOnSaveButton();
            await editDynamicFieldLibraryConfigPo.setInformationSourceValueType('Task Assignee');
            await editDynamicFieldLibraryConfigPo.setStatusValue('Inactive');
            await editDynamicFieldLibraryConfigPo.clickOnSaveButton();
        });
    });

    describe('[DRDMV-13105]: [-ve] [Dynamic Data] - Add fields with different format of field names (ID)', async () => {
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
        it('[DRDMV-13105]: [-ve] [Dynamic Data] - Add fields with different format of field names (ID)', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await selectTaskTemplate.searchAndOpenTaskTemplate(templateData.templateName);
            await viewTasktemplatePo.clickOnManageDynamicFieldLink();
            await dynamicFieldsPage.clickOnDynamicField();
            await dynamicFieldsPage.setFieldName('Field Name' + randomStr);
            await dynamicFieldsPage.setDescriptionName('ABCDEFGHIJKLMNOPQRSTUVWZYZ' + randomStr);
            await dynamicFieldsPage.selectInfromationSource("Requester");
            await dynamicFieldsPage.clickSaveButton();
            await viewTasktemplatePo.clickOnManageDynamicFieldLink();
            await dynamicFieldsPage.clickOnDynamicField();
            await dynamicFieldsPage.setFieldName('Field Number' + randomStr);
            await dynamicFieldsPage.setDescriptionName('1234567890' + randomStr);
            await dynamicFieldsPage.selectFieldValueType('NUMBER');
            await dynamicFieldsPage.selectInfromationSource("Task Assignee");
            await dynamicFieldsPage.clickSaveButton();
        });
        it('[DRDMV-13105]: [-ve] [Dynamic Data] - Add fields with different format of field names (ID)', async () => {
            await viewTasktemplatePo.clickOnManageDynamicFieldLink();
            await dynamicFieldsPage.clickOnDynamicField();
            await dynamicFieldsPage.setFieldName('Field Date' + randomStr);
            await dynamicFieldsPage.setDescriptionName('12345ABCDE' + randomStr);
            await dynamicFieldsPage.selectFieldValueType('DATE');
            await dynamicFieldsPage.selectInfromationSource("System");
            await dynamicFieldsPage.clickSaveButton();
            await viewTasktemplatePo.clickOnManageDynamicFieldLink();
            await dynamicFieldsPage.clickOnDynamicField();
            await dynamicFieldsPage.setFieldName('Field BOOLEAN' + randomStr);
            await dynamicFieldsPage.setDescriptionName('!@#$%^&*' + randomStr);
            await dynamicFieldsPage.selectFieldValueType('BOOLEAN');
            await dynamicFieldsPage.selectInfromationSource("Agent");
            await dynamicFieldsPage.clickSaveButton();
            await viewTasktemplatePo.clickOnManageDynamicFieldLink();
            await dynamicFieldsPage.clickOnDynamicField();
            await dynamicFieldsPage.setFieldName('Field LIST' + randomStr);
            await dynamicFieldsPage.setDescriptionName('123 Test_1' + randomStr);
            await dynamicFieldsPage.selectFieldValueType('LIST');
            await dynamicFieldsPage.clickSaveButton();
        });

        it('[DRDMV-13105]: [-ve] [Dynamic Data] - Add fields with different format of field names (ID)', async () => {
            await viewTasktemplatePo.clickOnManageDynamicFieldLink();
            await dynamicFieldsPage.clickOnDynamicField();
            await dynamicFieldsPage.setFieldName('Field ATTACHMENT' + randomStr);
            await dynamicFieldsPage.setDescriptionName('Field ATTACHMENT' + randomStr);
            await dynamicFieldsPage.selectFieldValueType('ATTACHMENT');
            await dynamicFieldsPage.clickSaveButton();
            await viewTasktemplatePo.clickOnManageDynamicFieldLink();
            await dynamicFieldsPage.clickOnDynamicField();
            await dynamicFieldsPage.setFieldName('Field DATE_TIME' + randomStr);
            await dynamicFieldsPage.setDescriptionName('Field DATE_TIME' + randomStr);
            await dynamicFieldsPage.selectFieldValueType('DATE_TIME');
            await dynamicFieldsPage.clickSaveButton();
            await viewTasktemplatePo.clickOnManageDynamicFieldLink();
            await dynamicFieldsPage.clickOnDynamicField();
            await dynamicFieldsPage.setFieldName('Field TIME' + randomStr);
            await dynamicFieldsPage.setDescriptionName('Field TIME' + randomStr);
            await dynamicFieldsPage.selectFieldValueType('TIME');
            await dynamicFieldsPage.clickSaveButton();
        });

        it('[DRDMV-13105]: [-ve] [Dynamic Data] - Add fields with different format of field names (ID)', async () => {
            expect(await viewTasktemplatePo.isDynamicFieldPresent('ABCDEFGHIJKLMNOPQRSTUVWZYZ' + randomStr)).toBeTruthy();
            expect(await viewTasktemplatePo.isDynamicFieldPresent('1234567890' + randomStr)).toBeTruthy();
            expect(await viewTasktemplatePo.isDynamicFieldPresent('12345ABCDE' + randomStr)).toBeTruthy();
            expect(await viewTasktemplatePo.isDynamicFieldPresent('!@#$%^&*' + randomStr)).toBeTruthy();
            expect(await viewTasktemplatePo.isDynamicFieldPresent('123 Test_1' + randomStr)).toBeTruthy();
            expect(await viewTasktemplatePo.isDynamicFieldPresent('Field ATTACHMENT' + randomStr)).toBeTruthy();
            expect(await viewTasktemplatePo.isDynamicFieldPresent('Field DATE_TIME' + randomStr)).toBeTruthy();
            expect(await viewTasktemplatePo.isDynamicFieldPresent('Field TIME' + randomStr)).toBeTruthy();

            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
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
        it('[DRDMV-13105]: [-ve] [Dynamic Data] - Add fields with different format of field names (ID)', async () => {
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

        it('[DRDMV-13105]: [-ve] [Dynamic Data] - Add fields with different format of field names (ID)', async () => {
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
    });

    describe('[DRDMV-13150]: [Dynamic Data] [UI] - Behavior of different dynamic fields from Task Edit view', async () => {
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
        it('[DRDMV-13150]: [Dynamic Data] [UI] - Behavior of different dynamic fields from Task Edit view', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('adam');
            await createCasePo.setSummary('Summary' + randomStr);
            await createCasePo.clickAssignToMeButton();
            await createCasePo.clickSaveCaseButton();
            await casePreviewPo.clickGoToCaseButton();
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.addTaskFromTaskTemplate(templateData.templateName);
            await manageTaskBladePo.clickTaskLink(templateData.templateSummary);
        });
        it('[DRDMV-13150]: [Dynamic Data] [UI] - Behavior of different dynamic fields from Task Edit view', async () => {
            await viewTaskPo.clickOnEditTask();
            await editTaskPo.setDynamicFieldValue('temp', 'newtemp');
            await editTaskPo.setDynamicFieldValue('temp1', '333');
            await editTaskPo.setDateValueInDynamicField('2020-03-01');
            await editTaskPo.clickOnTrueValueOfDynamicField();
            await editTaskPo.addAttachmentInDynamicField('attachment2', ['../../data/ui/attachment/demo.txt']);
            await editTaskPo.setTimeInDynamicField('02');
            await editTaskPo.selectValueFromList('listvalues');
            await editTaskPo.setDateTimeDynamicFieldValue('04-01-2022 05:11 PM');
            await editTaskPo.clickOnAssignToMe();
            await editTaskPo.clickOnSaveButton();
        });
        it('[DRDMV-13150]: [Dynamic Data] [UI] - Behavior of different dynamic fields from Task Edit view', async () => {
            expect(await viewTaskPo.getDynamicFieldValue('temp')).toBe('newtemplistvalues');
            expect(await viewTaskPo.getDynamicFieldValue('temp1')).toBe('333');
            expect(await viewTaskPo.getDynamicFieldValue('temp2')).toContain('Jan 20, 2020');
            expect(await viewTaskPo.getDynamicFieldValue('temp4')).toContain('Jan 20, 2004 5:11 PM');
            expect(await viewTaskPo.getDynamicFieldValue('temp3')).toContain('Yes');
            expect(await viewTaskPo.getDynamicFieldValue('temp5')).toContain('2:00 AM');
            expect(await viewTaskPo.getDynamicFieldValue('dynamicList')).toContain('listvalues');
        });
    });

    describe('[DRDMV-13110]: [Dynamic Data]- Add Dynamic Fields and Groups to Case Template', async () => {
        let casetemplateData, randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            casetemplateData = {
                "templateName": randomStr + 'caseTemplateDRDMV-13128',
                "templateSummary": randomStr + 'caseTemplateDRDMV-13128',
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
        it('[DRDMV-13110]: [Dynamic Data]- Add Dynamic Fields and Groups to Case Template', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await utilGrid.searchAndOpenHyperlink(randomStr + 'caseTemplateDRDMV-13128');
            expect(await viewCasetemplatePo.isManageDynamicFieldLinkDisplayed()).toBeFalsy();
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await utilGrid.searchAndOpenHyperlink(randomStr + 'caseTemplateDraft');
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
            expect(await dynamicFieldsPage.isFieldDisplayedInFieldSection('FieldGroup1')).toBeTruthy();
            expect(await dynamicFieldsPage.getFieldNameAttribute('readonly')).toBeTruthy();
            expect(await dynamicFieldsPage.getDescriptionName('readonly')).toBeTruthy();
            expect(await dynamicFieldsPage.getFieldValueType('disabled')).toBeTruthy();
            await dynamicFieldsPage.removeField('GroupOne');
            await dynamicFieldsPage.clickSaveButton();
            expect(await viewCasetemplatePo.isDynamicFieldDisplayed("FieldGroup1")).toBeFalsy();
        });
        it('[DRDMV-13110]: [Dynamic Data]- Add Dynamic Fields and Groups to Case Template', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await utilGrid.searchAndOpenHyperlink(randomStr + 'caseTemplateInactive');
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
            expect(await dynamicFieldsPage.getFieldNameAttribute('readonly')).toBeTruthy();
            expect(await dynamicFieldsPage.getDescriptionName('readonly')).toBeTruthy();
            expect(await dynamicFieldsPage.getFieldValueType('disabled')).toBeTruthy();
            await dynamicFieldsPage.removeField('GroupOne');
            await dynamicFieldsPage.clickSaveButton();
            expect(await viewCasetemplatePo.isDynamicFieldDisplayed("FieldGroup1")).toBeFalsy();
        });
    });
});