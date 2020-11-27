import { browser } from "protractor";
import apiHelper from "../../api/api.helper";
import casePreviewPo from '../../pageobject/case/case-preview.po';
import createCasePo from '../../pageobject/case/create-case.po';
import editCasePo from '../../pageobject/case/edit-case.po';
import quickCasePo from '../../pageobject/case/quick-case.po';
import requesterResponseBladePo from '../../pageobject/case/requester-response-blade.po';
import selectCasetemplateBladePo from '../../pageobject/case/select-casetemplate-blade.po';
import viewCasePo from "../../pageobject/case/view-case.po";
import dynamicFieldsPo from '../../pageobject/common/dynamic-fields.po';
import localizeValuePopPo from '../../pageobject/common/localize-value-pop.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import createDynamicFieldLibraryConfigPo from '../../pageobject/settings/application-config/create-dynamic-field-library-config.po';
import dynamicFieldLibraryConfigConsolePo from '../../pageobject/settings/application-config/dynamic-field-library-config-console.po';
import editCasetemplatePo from '../../pageobject/settings/case-management/edit-casetemplate.po';
import previewCaseTemplateCasesPo from '../../pageobject/settings/case-management/preview-case-template.po';
import viewCasetemplatePo from '../../pageobject/settings/case-management/view-casetemplate.po';
import editTaskTemplate from "../../pageobject/settings/task-management/edit-tasktemplate.po";
import previewTaskTemplateCasesPo from '../../pageobject/settings/task-management/preview-task-template.po';
import viewTaskTemplate from "../../pageobject/settings/task-management/view-tasktemplate.po";
import editTaskPo from '../../pageobject/task/edit-task.po';
import manageTaskBladePo from "../../pageobject/task/manage-task-blade.po";
import viewTaskPo from '../../pageobject/task/view-task.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilCommon from '../../utils/util.common';
import utilGrid from '../../utils/util.grid';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';
import dynamicGroupLibraryConfigConsolePo from '../../pageobject/settings/application-config/dynamic-group-library-config-console.po';
import createDynamicGroupLibraryConfigPo from '../../pageobject/settings/application-config/create-dynamic-group-library-config.po';
import editDynamicFieldLibraryConfigPo from '../../pageobject/settings/application-config/edit-dynamic-field-library-config.po';

describe('Case Data Store', () => {
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    //ptidke
    describe('[DRDMV-13123]: [Dynamic Data] [UI] - Dynamic Fields display on Case Edit view UI', async () => {
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let casetemplateData;
        beforeAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            casetemplateData = {
                "templateName": randomStr + 'caseTemplateDRDMV-13123',
                "templateSummary": randomStr + 'caseTemplateDRDMV-13123',
                "templateStatus": "Active",
                "assignee": "qkatawazi",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "ownerBU": "United States Support",
                "supportGroup": "US Support 3",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('qkatawazi');
            let newCaseTemplate = await apiHelper.createCaseTemplate(casetemplateData);
            await apiHelper.createDynamicDataOnTemplate(newCaseTemplate.id, 'CASE_TEMPLATE_DYNAMIC_FIELDS');
        });
        it('[DRDMV-13123]: Create Case With Case Template', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('qkatawazi');
            await createCasePo.setSummary('new cases');
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(casetemplateData.templateName);
            await createCasePo.clickSaveCaseButton();
            await casePreviewPo.clickGoToCaseButton();
            expect(await viewCasePo.isDynamicFieldDisplayed('temp')).toBeTruthy('temp dynamic fields not present');
            expect(await viewCasePo.isDynamicFieldDisplayed('temp1')).toBeTruthy('temp1 dynamic fields not present');
            expect(await viewCasePo.isDynamicFieldDisplayed('temp2')).toBeTruthy('temp2 dynamic fields not present');
            expect(await viewCasePo.isDynamicFieldDisplayed('temp3')).toBeTruthy('temp3 dynamic fields not present');
            expect(await viewCasePo.isDynamicFieldDisplayed('temp4')).toBeTruthy('temp4 dynamic fields not present');
            expect(await viewCasePo.isDynamicFieldDisplayed('temp5')).toBeTruthy('temp5 dynamic fields not present');
            expect(await viewCasePo.isDynamicFieldDisplayed('attachment1')).toBeTruthy('attachment1 dynamic fields not present');
            expect(await viewCasePo.isDynamicFieldDisplayed('attachment2')).toBeTruthy('attachment2 dynamic fields not present');
            expect(await viewCasePo.isDynamicFieldDisplayed('attachment3')).toBeTruthy('attachment3 dynamic fields not present');
            expect(await viewCasePo.isDynamicFieldDisplayed('dynamicList')).toBeTruthy('dynamicList dynamic fields not present');
        });
        it('[DRDMV-13123]: [Dynamic Data] [UI] - Dynamic Fields display on Case Edit view UI', async () => {
            await viewCasePo.clickEditCaseButton();
            expect(await editCasePo.isDynamicFieldDisplayed('temp')).toBeTruthy('temp dynamic fields not present');
            expect(await editCasePo.isDynamicFieldDisplayed('temp1')).toBeTruthy('temp1 dynamic fields not present');
            expect(await editCasePo.isDynamicFieldDisplayed('temp2')).toBeTruthy('temp2 dynamic fields not present');
            expect(await editCasePo.isDynamicFieldDisplayed('temp3')).toBeTruthy('temp3 dynamic fields not present');
            expect(await editCasePo.isDynamicFieldDisplayed('temp4')).toBeTruthy('temp4 dynamic fields not present');
            expect(await editCasePo.isDynamicFieldDisplayed('temp5')).toBeTruthy('temp5 dynamic fields not present');
            expect(await editCasePo.isDynamicFieldDisplayed('attachment1')).toBeTruthy('attachment1 dynamic fields not present');
            expect(await editCasePo.isDynamicFieldDisplayed('attachment2')).toBeTruthy('attachment2 dynamic fields not present');
            expect(await editCasePo.isDynamicFieldDisplayed('attachment3')).toBeTruthy('attachment3 dynamic fields not present');
            expect(await editCasePo.isDynamicFieldDisplayed('dynamicList')).toBeTruthy('dynamicList dynamic fields not present');
            await editCasePo.clickOnCancelCaseButton();
        });
        afterAll(async () => {
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        });
    });

    //ptidke
    describe('[DRDMV-13126]: [Dynamic Data] - Verify Dynamic Field On Requester Blade', async () => {
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let casetemplateData;
        beforeAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            casetemplateData = {
                "templateName": randomStr + 'caseTemplateDRDMV-13126',
                "templateSummary": randomStr + 'caseTemplateDRDMV-13126',
                "templateStatus": "Active",
                "company": "Petramco",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('qkatawazi');
            let newCaseTemplate = await apiHelper.createCaseTemplate(casetemplateData);
            await apiHelper.createDynamicDataOnTemplate(newCaseTemplate.id, 'CASE_TEMPLATE_REQUESTER_DYNAMIC_FIELDS');
        });
        it('[DRDMV-13126]: Verfiy Dyanmic Field On Requester Blade', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('adam');
            await createCasePo.setSummary('new cases');
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(casetemplateData.templateName);
            await createCasePo.clickSaveCaseButton();
            expect(await requesterResponseBladePo.getBladeHeading()).toContain("Requester's Response");
            expect(await requesterResponseBladePo.isDynamicFieldDisplayed('temp')).toBeTruthy('field not present');
            expect(await requesterResponseBladePo.isDynamicFieldDisplayed('temp1')).toBeTruthy('field not present');
            expect(await requesterResponseBladePo.isDynamicFieldDisplayed('temp2')).toBeTruthy('field not present');
            expect(await requesterResponseBladePo.isDynamicFieldDisplayed('temp3')).toBeTruthy('field not present');
            expect(await requesterResponseBladePo.isDynamicFieldDisplayed('temp4')).toBeTruthy('field not present');
            expect(await requesterResponseBladePo.isDynamicFieldDisplayed('temp5')).toBeTruthy('field not present');
            expect(await requesterResponseBladePo.isDynamicFieldDisplayed('dynamicList')).toBeTruthy('field not present');
            expect(await requesterResponseBladePo.isDynamicFieldDisplayed('attachment1')).toBeFalsy('field is present');
            expect(await requesterResponseBladePo.isDynamicFieldDisplayed('temp6')).toBeTruthy('field not present');
            expect(await requesterResponseBladePo.isDynamicFieldDisplayed('temp7')).toBeTruthy('field not present');
            expect(await requesterResponseBladePo.isDynamicFieldDisplayed('temp8')).toBeTruthy('field not present');
            expect(await requesterResponseBladePo.isDynamicFieldDisplayed('temp9')).toBeTruthy('field not present');
            expect(await requesterResponseBladePo.isDynamicFieldDisplayed('temp10')).toBeTruthy('field not present');
            expect(await requesterResponseBladePo.isDynamicFieldDisplayed('temp11')).toBeTruthy('field not present');
            expect(await requesterResponseBladePo.isDynamicFieldDisplayed('temp12')).toBeTruthy('field not present');
            await requesterResponseBladePo.clickOkButton();
            await quickCasePo.gotoCaseButton();
        });
        it('[DRDMV-13126]: [Dynamic Data] - Create Case from Quick Case with Template having dynamic fields and also have field with source as Requester', async () => {
            //verify fields shoule be empty values on case view
            expect(await viewCasePo.getValueOfDynamicFields('temp')).toBe('-');
            expect(await viewCasePo.getValueOfDynamicFields('temp1')).toBe('-');
            expect(await viewCasePo.getValueOfDynamicFields('temp2')).toBe('-');
            expect(await viewCasePo.getValueOfDynamicFields('temp4')).toBe('-');
            expect(await viewCasePo.getValueOfDynamicFields('temp3')).toBe('-');
            expect(await viewCasePo.getValueOfDynamicFields('temp5')).toBe('-');
            expect(await viewCasePo.getValueOfDynamicFields('dynamicList')).toBe('-');
            expect(await viewCasePo.getValueOfDynamicFields('attachment1')).toBe('-');
            expect(await viewCasePo.getValueOfDynamicFields('temp6')).toBe('-');
            expect(await viewCasePo.getValueOfDynamicFields('temp7')).toBe('-');
            expect(await viewCasePo.getValueOfDynamicFields('temp8')).toBe('-');
            expect(await viewCasePo.getValueOfDynamicFields('temp9')).toBe('-');
            expect(await viewCasePo.getValueOfDynamicFields('temp10')).toBe('-');
            expect(await viewCasePo.getValueOfDynamicFields('temp11')).toBe('-');
            expect(await viewCasePo.getValueOfDynamicFields('temp12')).toBe('-');
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        });
    });

    //ptidke
    it('[DRDMV-13115]: [Dynamic Data] - Update Dynamic fields in Existing Case Template by replacing old fields with new Fields', async () => {
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteDynamicFieldAndGroup();
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let templateData = {
            "templateName": 'CaseSummarySummary13115' + randomStr,
            "templateSummary": 'CaseSummarySummary13115' + randomStr,
            "templateStatus": "Draft",
            "resolveCaseonLastTaskCompletion": "1",
            "assignee": "qkatawazi",
            "company": "Petramco",
            "businessUnit": "United States Support",
            "ownerBU": "United States Support",
            "supportGroup": "US Support 3",
            "ownerGroup": "US Support 3"
        }
        await apiHelper.apiLogin('qkatawazi');
        let newCaseTemplate = await apiHelper.createCaseTemplate(templateData);
        await apiHelper.createDynamicDataOnTemplate(newCaseTemplate.id, 'CASE_TEMPLATE_REMOVE_FIELDS');
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        await utilGrid.searchAndOpenHyperlink(templateData.templateName);
        await viewCasetemplatePo.clickOnMangeDynamicFieldLink();
        //field in right section
        expect(await dynamicFieldsPo.isFieldDisplayedInFieldSection('temp')).toBeTruthy();
        expect(await dynamicFieldsPo.isFieldDisplayedInFieldSection('temp1')).toBeTruthy();
        expect(await dynamicFieldsPo.isFieldDisplayedInFieldSection('temp2')).toBeTruthy();
        //remove field
        await dynamicFieldsPo.removeField('temp');
        await dynamicFieldsPo.removeField('temp1');
        await dynamicFieldsPo.removeField('temp2');
        await dynamicFieldsPo.clickSaveButton();
        //add new fields
        await viewCasetemplatePo.clickOnMangeDynamicFieldLink();
        await dynamicFieldsPo.clickOnDynamicField();
        await dynamicFieldsPo.setFieldName('news12' + randomStr);
        await dynamicFieldsPo.setDescriptionName('newDescri12' + randomStr);
        await dynamicFieldsPo.clickOnDynamicField();
        await dynamicFieldsPo.setFieldName('news13' + randomStr);
        await dynamicFieldsPo.setDescriptionName('newDescri13' + randomStr);
        await dynamicFieldsPo.clickOnDynamicField();
        await dynamicFieldsPo.setFieldName('news14' + randomStr);
        await dynamicFieldsPo.setDescriptionName('newDescri14' + randomStr);
        await dynamicFieldsPo.clickSaveButton();
        expect(await viewCasetemplatePo.isDynamicFieldDisplayed('newDescri12' + randomStr)).toBeTruthy();
        expect(await viewCasetemplatePo.isDynamicFieldDisplayed('newDescri13' + randomStr)).toBeTruthy();
        expect(await viewCasetemplatePo.isDynamicFieldDisplayed('newDescri14' + randomStr)).toBeTruthy();
    });

    //ptidke
    describe('[DRDMV-13118]: [Dynamic Data] - Verify Dynamic Field On Requester Blade', async () => {
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let groupName = 'GroupLocalCaseTemplateGroupLocalCaseTemplateLocalCaseTemplate';
        let field1InGroup = 'LocalNonConfidentialDescLocalNonConfidentialDescLocalNonConfidentialDesc';
        let field2InGroup = 'LocalConfidentialDescLocalConfidentialDescLocalNonConfidentialDesc';
        let field1OutSideGroup = 'theautomatedDynamicFieldsIsgettingMouseOveredMouseOvered';
        let field2OutSideGroup = 'theSecondautomatedDynamicFieldsIsgettingMouseOveredMouseOvered';
        let field3OutSideGroup = 'theThirdDynamicautomatedFieldsIsgettingMouseOveredMouseOvered';
        let field4OutSideGroup = 'temp1theNewautomatedDynamicFieldsIsgettingMouseOveredMouseOvered';
        let templateData;
        beforeAll(async () => {
            templateData = {
                "templateName": 'CaseSummarySummary13118' + randomStr,
                "templateSummary": 'CaseSummarySummary13118' + randomStr,
                "templateStatus": "Active",
                "company": "Petramco",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            await apiHelper.apiLogin('qkatawazi');
            let newCaseTemplate = await apiHelper.createCaseTemplate(templateData);
            await apiHelper.createDynamicDataOnTemplate(newCaseTemplate.id, 'CASE_TEMPLATE_LONG_FIELDS');
        });
        it('[DRDMV-13118]: Create Case Template with Dynamic Fields', async () => {
            await navigationPage.gotoCaseConsole();
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await utilGrid.searchAndOpenHyperlink(templateData.templateName);
            expect(await viewCasetemplatePo.isGroupDisplayed(groupName)).toBeTruthy('Group Not found');
            expect(await viewCasetemplatePo.isDynamicFieldDisplayed(field1InGroup)).toBeTruthy();
            expect(await viewCasetemplatePo.isDynamicFieldDisplayed(field2InGroup)).toBeTruthy();
            expect(await viewCasetemplatePo.isDynamicFieldDisplayed(field1OutSideGroup)).toBeTruthy();
            expect(await viewCasetemplatePo.isDynamicFieldDisplayed(field2OutSideGroup)).toBeTruthy();
            expect(await viewCasetemplatePo.isDynamicFieldDisplayed(field3OutSideGroup)).toBeTruthy();
            expect(await viewCasetemplatePo.isDynamicFieldDisplayed(field4OutSideGroup)).toBeTruthy();
        });
        it('[DRDMV-13118]: [Dynamic Data] - Case Template and Case UI with dynamic fields and groups having long title', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('qtao');
            await createCasePo.setSummary('Summary');
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(templateData.templateName);
            await createCasePo.clickAssignToMeButton();
            await createCasePo.clickSaveCaseButton();
            await casePreviewPo.clickGoToCaseButton();
            await utilityCommon.closePopUpMessage();
            //edit case
            await viewCasePo.clickEditCaseButton();
            await editCasePo.setDynamicFieldValue(field1InGroup, 'New values for field 1 group');
            await editCasePo.setDynamicFieldValue(field2InGroup, '8888899');
            await editCasePo.clickOnTrueValueOfDynamicField();
            await editCasePo.setDynamicFieldValue(field1OutSideGroup, 'field1 outside group');
            await editCasePo.setDynamicFieldValue(field2OutSideGroup, '809888');
            await editCasePo.clickSaveCase();
            //field on case profile
            expect(await viewCasePo.isDynamicFieldDisplayed(field4OutSideGroup)).toBeTruthy('field not present');
            expect(await viewCasePo.isDynamicFieldDisplayed(field3OutSideGroup)).toBeTruthy('field not present');
            expect(await viewCasePo.isDynamicFieldDisplayed(field2OutSideGroup)).toBeTruthy('field not present');
            expect(await viewCasePo.isDynamicFieldDisplayed(field1OutSideGroup)).toBeTruthy('field not present');
            expect(await viewCasePo.isGroupNameDisplayed(groupName)).toBeTruthy('group not present');
            expect(await viewCasePo.isDynamicFieldDisplayed(field1InGroup)).toBeTruthy('field not present');
            expect(await viewCasePo.isDynamicFieldDisplayed(field2InGroup)).toBeTruthy('field not present');
            //entered field validation
            expect(await viewCasePo.getValueOfDynamicFields(field1InGroup)).toBe('New values for field 1 group');
            expect(await viewCasePo.getValueOfDynamicFields(field2InGroup)).toBe('8888899');
            expect(await viewCasePo.getValueOfDynamicFields(field4OutSideGroup)).toBe('Yes');
            expect(await viewCasePo.getValueOfDynamicFields(field1OutSideGroup)).toBe('field1 outside group');
            expect(await viewCasePo.getValueOfDynamicFields(field2OutSideGroup)).toBe('809888');
        });
    });

    //ptidke
    describe('[DRDMV-13140]: [Dynamic Data] - Verify Dynamic Field On Task Template', async () => {
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let arr: string[] = ['temp', 'temp1', 'temp2', 'temp3', 'temp4', 'temp5', 'attachment1', 'attachment2', 'attachment3'];
        let templateData, draftToActiveTemplateName, inactiveTemplateName, draftTemplateName, activeTemplateName;
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            //Draft to active
            draftToActiveTemplateName = 'ManualtaskDraftToActiveDRDMV-13940' + randomStr;
            templateData = {
                "templateName": draftToActiveTemplateName,
                "templateSummary": draftToActiveTemplateName + "Summary",
                "templateStatus": "Draft",
                "taskCompany": 'Petramco',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('qkatawazi');
            //Draft template (convert to active later)
            let tasktemplate = await apiHelper.createManualTaskTemplate(templateData);
            await apiHelper.createDynamicDataOnTemplate(tasktemplate.id, 'TASK_TEMPLATE__DYNAMIC_FIELDS');
            //Inactive
            templateData.templateSummary = 'ManualtaskSummaryInactiveDRDMV-13940' + randomStr;
            inactiveTemplateName = templateData.templateName = 'ManualtaskInactiveDRDMV-13940' + randomStr;
            templateData.templateStatus = 'Inactive';
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            await apiHelper.apiLogin('qkatawazi');
            let tasktemplateInactive = await apiHelper.createManualTaskTemplate(templateData);
            await apiHelper.createDynamicDataOnTemplate(tasktemplateInactive.id, 'TASK_TEMPLATE__DYNAMIC_FIELDS');
            //Draft only
            templateData.templateSummary = 'ManualtaskSummaryDraftOnlyDRDMV-13940' + randomStr;
            draftTemplateName = templateData.templateName = 'ManualtaskDraftOnlyDRDMV-13940' + randomStr;
            templateData.templateStatus = 'Draft';
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            await apiHelper.apiLogin('qkatawazi');
            let tasktemplateDraft = await apiHelper.createManualTaskTemplate(templateData);
            await apiHelper.createDynamicDataOnTemplate(tasktemplateDraft.id, 'TASK_TEMPLATE__DYNAMIC_FIELDS');
            //active
            templateData.templateSummary = 'ManualtaskSummaryActiveDRDMV-13940' + randomStr;
            activeTemplateName = templateData.templateName = 'ManualtaskActiveDRDMV-13940' + randomStr;
            templateData.templateStatus = 'Active';
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createManualTaskTemplate(templateData);
        });
        it('[DRDMV-13140]: Create Task Template With Dynamic Fields', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await utilGrid.searchAndOpenHyperlink(activeTemplateName);
            expect(await viewTaskPo.isDynamicFieldSectionPresent()).toBeFalsy('fields are present');
            //draft to active
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await utilGrid.searchAndOpenHyperlink(draftToActiveTemplateName);
            await viewTaskTemplate.clickOnEditMetaData();
            await editTaskTemplate.selectTemplateStatus('Active');
            await editTaskTemplate.clickOnSaveMetadata();
            for (let i = 0; i < arr.length; i++) {
                expect(await viewTaskTemplate.isDynamicFieldPresent(arr[i])).toBeTruthy('field is not present');
            }
            expect(await viewTaskTemplate.isManageDynamicFieldLinkDisplayed()).toBeFalsy('Link is present');
            //draft only
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await utilGrid.searchAndOpenHyperlink(draftTemplateName);
            for (let i = 0; i < arr.length; i++) {
                expect(await viewTaskTemplate.isDynamicFieldPresent(arr[i])).toBeTruthy('field is not present');
            }
            expect(await viewTaskTemplate.isManageDynamicFieldLinkDisplayed()).toBeTruthy('Link is not present');
            //edit
            await viewTaskTemplate.clickOnEditLink();
        });
        it('[DRDMV-13140]: [Dynamic Data] [UI] -Dynamic Fields display on Task Template Edit view UI', async () => {

            expect(await editTaskTemplate.isMangeDynamicFieldLinkDisplayed()).toBeTruthy('link is not present');
            for (let i = 0; i < arr.length; i++) {
                expect(await editTaskTemplate.isDynamicFieldPresent(arr[i])).toBeTruthy('field is not present');
            }
        });
        it('[DRDMV-13140]: Dynamic Fields display on Task Template Edit view UI', async () => {
            await editTaskTemplate.clickOnCancelButton();
            await utilCommon.clickOnWarningOk();
            //Inactive
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await utilGrid.searchAndOpenHyperlink(inactiveTemplateName);
            for (let i = 0; i < arr.length; i++) {
                expect(await viewTaskTemplate.isDynamicFieldPresent(arr[i])).toBeTruthy('field is not present');
            }
            expect(await viewTaskTemplate.isManageDynamicFieldLinkDisplayed()).toBeTruthy('Link is not present');
        });
        it('[DRDMV-13140]: Dynamic Fields display on Task Template Edit view UI', async () => {
            //edit
            await viewTaskTemplate.clickOnEditLink();
            expect(await editTaskTemplate.isMangeDynamicFieldLinkDisplayed()).toBeTruthy('link not present');
            for (let i = 0; i < arr.length; i++) {
                expect(await editTaskTemplate.isDynamicFieldPresent(arr[i])).toBeTruthy('field is not present');
            }
        });
        afterAll(async () => {
            await editTaskTemplate.clickOnCancelButton();
            await utilCommon.clickOnWarningOk();
        });
    });

    //ptidke
    describe('[DRDMV-13122]: [Dynamic Data] - Verify Dynamic Field On Case Template preview', async () => {
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let group1 = 'GroupLocalCaseTemplate';
        let group2 = 'PulishCaseTemplateData';
        let dynamicFields: string[] = ['LocalNonConfidentialDesc', 'LocalConfidentialDesc', 'nonConfidentialPulicDesc', 'confidentialPublicDesc', 'OuterNonConfidentialDesc', 'ListOfDataNameDesc', 'OuterConfidentialDesc'];
        let casetemplateData;
        beforeAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            casetemplateData = {
                "templateName": randomStr + 'caseTemplateDRDMV-13122',
                "templateSummary": randomStr + 'caseTemplateDRDMV-13122',
                "templateStatus": "Active",
                "company": "Petramco",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('qkatawazi');
            let newCaseTemplate = await apiHelper.createCaseTemplate(casetemplateData);
            await apiHelper.createDynamicDataOnTemplate(newCaseTemplate.id, 'CASE_TEMPLATE_WITH_CONFIDENTIAL');
        });
        it('[DRDMV-13122]: Create Case Template and verify Dynamic Field on Case Template Preview', async () => {
            //qucik case preview
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('adam');
            await quickCasePo.selectCaseTemplate(casetemplateData.templateName);
            await quickCasePo.clickOnCaseTemplate(casetemplateData.templateName);
            expect(await previewCaseTemplateCasesPo.isGroupDisplayed(group1)).toBeTruthy('group is not present');
            expect(await previewCaseTemplateCasesPo.isGroupDisplayed(group2)).toBeTruthy('group is not present');
            for (let i = 0; i < dynamicFields.length; i++) {
                expect(await previewCaseTemplateCasesPo.isDynamicFieldDisplayed(dynamicFields[i])).toBeTruthy('field not present ' + dynamicFields[i]);
            }
            await previewCaseTemplateCasesPo.clickOnBackButton();
        });
        it('[DRDMV-13122]: [Dynamic Data] [UI] - Dynamic fields and groups display on Case Template preview', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('adam');
            await createCasePo.setSummary(casetemplateData.templateSummary);
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.clickOnAllTemplateTab();
            await utilityGrid.searchAndOpenHyperlink(casetemplateData.templateName);;
            //verify dynmaic groups and fields
            expect(await previewCaseTemplateCasesPo.isGroupDisplayed(group1)).toBeTruthy('group is not present');
            expect(await previewCaseTemplateCasesPo.isGroupDisplayed(group2)).toBeTruthy('group is not present');
            for (let i = 0; i < dynamicFields.length; i++) {
                expect(await previewCaseTemplateCasesPo.isDynamicFieldDisplayed(dynamicFields[i])).toBeTruthy('field not present ' + dynamicFields[i]);
            }
            await previewCaseTemplateCasesPo.clickOnBackButton();
            await selectCasetemplateBladePo.clickOnAllTemplateTab();
            await utilityGrid.searchAndOpenHyperlink(casetemplateData.templateName);
            //verify dynmaic groups and fields
            expect(await previewCaseTemplateCasesPo.isGroupDisplayed(group1)).toBeTruthy('group is not present');
            expect(await previewCaseTemplateCasesPo.isGroupDisplayed(group2)).toBeTruthy('group is not present');
            for (let i = 0; i < dynamicFields.length; i++) {
                expect(await previewCaseTemplateCasesPo.isDynamicFieldDisplayed(dynamicFields[i])).toBeTruthy('field not present ' + dynamicFields[i]);
            }
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        });
    });

    //ptidke
    describe('[DRDMV-13131]: [Dynamic Data] - Verify Dynamic Field On Case preview', async () => {
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let group1 = 'GroupLocalCaseTemplate';
        let group2 = 'PulishCaseTemplateData';
        let casetemplateData;
        let dynamicFields: string[] = ['LocalNonConfidentialDesc', 'LocalConfidentialDesc', 'nonConfidentialPulicDesc', 'confidentialPublicDesc', 'OuterNonConfidentialDesc', 'ListOfDataNameDesc', 'OuterConfidentialDesc'];
        beforeAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            casetemplateData = {
                "templateName": randomStr + 'caseTemplateDRDMV-13131',
                "templateSummary": randomStr + 'caseTemplateDRDMV-13131',
                "templateStatus": "Active",
                "company": "Petramco",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('qkatawazi');
            let newCaseTemplate = await apiHelper.createCaseTemplate(casetemplateData);
            await apiHelper.createDynamicDataOnTemplate(newCaseTemplate.id, 'CASE_TEMPLATE_WITH_CONFIDENTIAL');
        });
        it('[DRDMV-13131]: Dynamic Fields and Groups display on Case Preview', async () => {
            //qucik case preview
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('adam');
            await quickCasePo.selectCaseTemplate(casetemplateData.templateName);
            await quickCasePo.createCaseButton();
            //case preview
            await utilityCommon.closePopUpMessage();
            expect(await casePreviewPo.isGroupDisplayed(group1)).toBeTruthy('group is not present');
            expect(await casePreviewPo.isGroupDisplayed(group2)).toBeTruthy('group is not present');
            for (let i = 0; i < dynamicFields.length; i++) {
                expect(await casePreviewPo.isDynamicFieldDisplayed(dynamicFields[i])).toBeTruthy('field not present ' + dynamicFields[i]);
            }
            await quickCasePo.gotoCaseButton();
            let caseID = await viewCasePo.getCaseID();
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('qkatawazi');
            await quickCasePo.setSummaryAndClickOnRecommandedCase(caseID, casetemplateData.templateSummary);
            //case preview
            // await utilCommon.waitUntilSpinnerToHide();
            expect(await casePreviewPo.isGroupDisplayed(group1)).toBeTruthy('group is not present');
            expect(await casePreviewPo.isGroupDisplayed(group2)).toBeTruthy('group is not present');
            for (let i = 0; i < dynamicFields.length; i++) {
                expect(await casePreviewPo.isDynamicFieldDisplayed(dynamicFields[i])).toBeTruthy('field not present ' + dynamicFields[i]);
            }
            await casePreviewPo.clickBackButton();
        });
        it('[DRDMV-13131]: [Dynamic Data] [UI] - Dynamic Fields and Groups display on Case and Similar Cases preview', async () => {
            // requester case template
            let casetemplateDataRequester = {
                "templateName": randomStr + 'caseTemplateReqDRDMV-13131',
                "templateSummary": randomStr + 'caseTemplateReqDRDMV-13131',
                "templateStatus": "Active",
                "company": "Petramco",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            await apiHelper.apiLogin('qkatawazi');
            let newCaseTemplateReq = await apiHelper.createCaseTemplate(casetemplateDataRequester);
            await apiHelper.createDynamicDataOnTemplate(newCaseTemplateReq.id, 'CASE_TEMPLATE_WITH_REQUESTER');
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('adam');
            await createCasePo.setSummary('new cases');
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(casetemplateDataRequester.templateName);
            await createCasePo.clickSaveCaseButton();
            expect(await requesterResponseBladePo.getBladeHeading()).toContain("Requester's Response");
            expect(requesterResponseBladePo.isDynamicGroupDisplayed('GroupOne'));
            expect(requesterResponseBladePo.isDynamicGroupDisplayed('GroupTwo'));
            let dynamicFieldsReqester: string[] = ['FieldGroup1', 'Field2Group1', 'FieldGroup2', 'Field2Group2', 'Field1Outside'];
            for (let i = 0; i < dynamicFieldsReqester.length; i++) {
                expect(await requesterResponseBladePo.isDynamicFieldDisplayed(dynamicFieldsReqester[i])).toBeTruthy(dynamicFieldsReqester[i] + 'field not present');
            }
            await requesterResponseBladePo.clickOkButton();
            //requester case preview
            expect(await casePreviewPo.isGroupDisplayed('GroupTwo')).toBeTruthy('group is not present');
            expect(await casePreviewPo.isGroupDisplayed('GroupOne')).toBeTruthy('group is not present');
            for (let i = 0; i < dynamicFieldsReqester.length; i++) {
                expect(await casePreviewPo.isDynamicFieldDisplayed(dynamicFieldsReqester[i])).toBeTruthy('field not present ' + dynamicFieldsReqester[i]);
            }
        });
        afterAll(async () => {
            await casePreviewPo.clickGoToCaseButton();
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        });
    });

    //ptidke
    it('[DRDMV-13114]:[Dynamic Data] - Add all type of dynamic fields in Case Template', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteDynamicFieldAndGroup();
        let casetemplateData = {
            "templateName": randomStr + 'caseTemplateDRDMV-13114',
            "templateSummary": randomStr + 'caseTemplateDRDMV-13114',
            "templateStatus": "Draft",
            "assignee": "qkatawazi",
            "company": "Petramco",
            "businessUnit": "United States Support",
            "ownerBU": "United States Support",
            "supportGroup": "US Support 3",
            "ownerGroup": "US Support 3"
        }
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.createCaseTemplate(casetemplateData);
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        await utilGrid.searchAndOpenHyperlink(casetemplateData.templateName);
        await viewCasetemplatePo.clickOnMangeDynamicFieldLink();
        await dynamicFieldsPo.clickOnDynamicField();
        await dynamicFieldsPo.setFieldName('news16' + randomStr);
        await dynamicFieldsPo.setDescriptionName('newDescri16' + randomStr);
        await dynamicFieldsPo.selectFieldValueType('DATE');
        await dynamicFieldsPo.selectInfromationSource('Requester');
        await dynamicFieldsPo.clickOnDynamicField();
        await dynamicFieldsPo.setFieldName('news17' + randomStr);
        await dynamicFieldsPo.setDescriptionName('newDescri17' + randomStr);
        await dynamicFieldsPo.selectFieldValueType('NUMBER');
        await dynamicFieldsPo.selectInfromationSource('System');
        await dynamicFieldsPo.clickOnDynamicField();
        await dynamicFieldsPo.setFieldName('news18' + randomStr);
        await dynamicFieldsPo.setDescriptionName('newDescri18' + randomStr);
        await dynamicFieldsPo.selectFieldValueType('BOOLEAN');
        await dynamicFieldsPo.selectInfromationSource('Task Assignee');
        await dynamicFieldsPo.clickOnDynamicField();
        await dynamicFieldsPo.setFieldName('news19' + randomStr);
        await dynamicFieldsPo.setDescriptionName('newDescri19' + randomStr);
        await dynamicFieldsPo.selectFieldValueType('ATTACHMENT');
        await dynamicFieldsPo.selectInfromationSource('Agent');
        await dynamicFieldsPo.clickOnDynamicField();
        await dynamicFieldsPo.setFieldName('news20' + randomStr);
        await dynamicFieldsPo.setDescriptionName('newDescri20' + randomStr);
        await dynamicFieldsPo.selectFieldValueType('TEXT');
        await dynamicFieldsPo.selectInfromationSource('Agent');
        await dynamicFieldsPo.clickSaveButton();
        expect(await viewCasetemplatePo.isDynamicFieldDisplayed('newDescri16' + randomStr)).toBeTruthy('field not present');
        expect(await viewCasetemplatePo.isDynamicFieldDisplayed('newDescri17' + randomStr)).toBeTruthy('field not present');
        expect(await viewCasetemplatePo.isDynamicFieldDisplayed('newDescri18' + randomStr)).toBeTruthy('field not present');
        expect(await viewCasetemplatePo.isDynamicFieldDisplayed('newDescri19' + randomStr)).toBeTruthy('field not present');
        expect(await viewCasetemplatePo.isDynamicFieldDisplayed('newDescri20' + randomStr)).toBeTruthy('field not present');
    });

    //ptidke
    it('[DRDMV-13610]:[UI] [-ve] Update Automated Task Template Process and Task Type', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let templateData = {
            "templateName": `Automate13610${randomStr}`,
            "templateSummary": `Automate13610${randomStr}`,
            "templateStatus": "Draft",
            "processBundle": "com.bmc.dsm.case-lib",
            "processName": `Case Process 1 ${randomStr}`,
            "taskCompany": "Petramco",
            "ownerCompany": "Petramco",
            "ownerBusinessUnit": "United States Support",
            "ownerGroup": "US Support 3"
        }
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.createAutomatedTaskTemplate(templateData);
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
        await utilGrid.searchAndOpenHyperlink(templateData.templateSummary);
        await viewTaskTemplate.clickOnEditLink();
        expect(await editTaskTemplate.isAutomatedTaskTypeDisabled()).toBeTruthy('not disabled');
        expect(await editTaskTemplate.isProcessNameDisabled()).toBeTruthy('not disabled');
        await editTaskTemplate.selectTaskCategoryTier1('Applications');
        await editTaskTemplate.setSummary('update' + randomStr);
        await editTaskTemplate.selectPriorityValue('High');
        await editTaskTemplate.clickOnSaveButton();
        expect(await viewTaskTemplate.getCategoryTier1Value()).toBe('Applications');
        expect(await viewTaskTemplate.getSummaryValue()).toBe('update' + randomStr);
        expect(await viewTaskTemplate.getPriorityValue()).toBe('High');
    });

    //ptidke
    describe('[DRDMV-13153]: [Dynamic Data] [UI] - Dynamic fields and groups display on Task Template preview	', async () => {
        let templateData, tasktemplate, randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            templateData = {
                "templateName": 'ManualtaskDRDMV-13153' + randomStr,
                "templateSummary": 'ManualtaskDRDMV-13153' + randomStr,
                "templateStatus": "Active",
                "taskCompany": 'Petramco',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('qkatawazi');
            tasktemplate = await apiHelper.createManualTaskTemplate(templateData);
            await apiHelper.createDynamicDataOnTemplate(tasktemplate.id, 'TASK_TEMPLATE_WITH_CONFIDENTIAL');
        });
        it('[DRDMV-13153]: [Dynamic Data] [UI] - Dynamic fields and groups display on Task Template preview	', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('qdu');
            await createCasePo.setSummary('new cases');
            await createCasePo.clickSaveCaseButton();
            await casePreviewPo.clickGoToCaseButton();
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.clickAddTaskFromTemplateButton();
            await utilityGrid.searchAndOpenHyperlink(templateData.templateSummary);
            expect(await previewTaskTemplateCasesPo.isDynamicGroupDisplayed('TaskGroupLocalCaseTemplate')).toBeTruthy();
            expect(await previewTaskTemplateCasesPo.isDynamicGroupDisplayed('TaskPulishCaseTemplateData')).toBeTruthy();
            expect(await previewTaskTemplateCasesPo.isDynamicFieldDisplayed('TaskLocalNonConfidentialDesc')).toBeTruthy();
            expect(await previewTaskTemplateCasesPo.isDynamicFieldDisplayed('TaskLocalConfidentialDesc')).toBeTruthy();
            expect(await previewTaskTemplateCasesPo.isDynamicFieldDisplayed('TasknonConfidentialPulicDesc')).toBeTruthy();
            expect(await previewTaskTemplateCasesPo.isDynamicFieldDisplayed('TaskconfidentialPublicDesc')).toBeTruthy();
            expect(await previewTaskTemplateCasesPo.isDynamicFieldDisplayed('TaskOuterNonConfidentialDesc')).toBeTruthy();
            expect(await previewTaskTemplateCasesPo.isDynamicFieldDisplayed('TaskListOfDataNameDesc')).toBeTruthy();
            expect(await previewTaskTemplateCasesPo.isDynamicFieldDisplayed('TaskOuterConfidentialDesc')).toBeTruthy();
            await previewTaskTemplateCasesPo.clickOnBackButton();
            await manageTaskBladePo.clickTaskGridCancelButton();
            await manageTaskBladePo.clickCloseButton();


        });
        it('[DRDMV-13153]: [Dynamic Data] [UI] - Dynamic fields and groups display on Task Template preview	', async () => {
            let caseTemplateData = {
                "templateName": 'caseTemplateNameDRDMV-13153' + randomStr,
                "templateSummary": 'caseTemplateNameDRDMV-13153' + randomStr,
                "templateStatus": "Draft",
                "resolveCaseonLastTaskCompletion": "1",
                "company": "Petramco",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('qkatawazi');
            let casetemplateddetails = await apiHelper.createCaseTemplate(caseTemplateData);
            await apiHelper.associateCaseTemplateWithOneTaskTemplate(casetemplateddetails.displayId, tasktemplate.displayId);
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await utilGrid.searchAndOpenHyperlink(caseTemplateData.templateSummary);
            await viewCasetemplatePo.clickOneTask();
            expect(await previewTaskTemplateCasesPo.isDynamicGroupDisplayed('TaskGroupLocalCaseTemplate')).toBeTruthy();
            expect(await previewTaskTemplateCasesPo.isDynamicGroupDisplayed('TaskPulishCaseTemplateData')).toBeTruthy();
            expect(await previewTaskTemplateCasesPo.isDynamicFieldDisplayed('TaskLocalNonConfidentialDesc')).toBeTruthy();
            expect(await previewTaskTemplateCasesPo.isDynamicFieldDisplayed('TaskLocalConfidentialDesc')).toBeTruthy();
            expect(await previewTaskTemplateCasesPo.isDynamicFieldDisplayed('TasknonConfidentialPulicDesc')).toBeTruthy();
            expect(await previewTaskTemplateCasesPo.isDynamicFieldDisplayed('TaskconfidentialPublicDesc')).toBeTruthy();
            expect(await previewTaskTemplateCasesPo.isDynamicFieldDisplayed('TaskOuterNonConfidentialDesc')).toBeTruthy();
            expect(await previewTaskTemplateCasesPo.isDynamicFieldDisplayed('TaskListOfDataNameDesc')).toBeTruthy();
            expect(await previewTaskTemplateCasesPo.isDynamicFieldDisplayed('TaskOuterConfidentialDesc')).toBeTruthy();
            await previewTaskTemplateCasesPo.clickOnBackButton();
        });
    });

    //ptidke
    describe('[DRDMV-13154]: [Dynamic Data] - Verify Dynamic Field On Task Edit View', async () => {
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let templateData, manualTaskTemplateSummary, externalTaskTemplateSummary;
        let dynamicFields: string[] = ['temp', 'temp1', 'temp2', 'temp3', 'temp4', 'attachment1', 'attachment2', 'attachment3'];
        beforeAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            templateData = {
                "templateName": 'ManualtaskDRDMV13154' + randomStr,
                "templateSummary": 'ManualtaskDRDMV13154' + randomStr,
                "templateStatus": "Active",
                "taskCompany": 'Petramco',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('qkatawazi');
            manualTaskTemplateSummary = templateData.templateSummary;
            let tasktemplate = await apiHelper.createManualTaskTemplate(templateData);
            await apiHelper.createDynamicDataOnTemplate(tasktemplate.id, 'TASK_TEMPLATE__DYNAMIC_FIELDS');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            templateData.templateName = 'externalTaskDRDMV13154' + randomStr;
            templateData.templateSummary = 'externalTaskDRDMV13154' + randomStr,
                await apiHelper.apiLogin('qkatawazi');
            let externalTaskTemplate = await apiHelper.createExternalTaskTemplate(templateData);
            await apiHelper.createDynamicDataOnTemplate(externalTaskTemplate.id, 'EXTERNAL_TASK_TEMPLATE__DYNAMIC_FIELDS');
        });
        it('[DRDMV-13154]: Create Task Template and Verify Dynamic Fields On Task Edit view UI', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('adam');
            await createCasePo.setSummary('new cases');
            await createCasePo.clickSaveCaseButton();
            await casePreviewPo.clickGoToCaseButton();
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.addTaskFromTaskTemplate(manualTaskTemplateSummary);
            await manageTaskBladePo.waitUntilNumberOfTaskLinkAppear(1);
            await manageTaskBladePo.addTaskFromTaskTemplate(templateData.templateSummary);
            await manageTaskBladePo.waitUntilNumberOfTaskLinkAppear(2);
            await manageTaskBladePo.clickTaskLink(manualTaskTemplateSummary);
            // manual task view case
            for (let i = 0; i < dynamicFields.length; i++) {
                expect(await viewTaskPo.isDynamicFieldPresent(dynamicFields[i])).toBeTruthy('field not present ' + dynamicFields[i]);
            }
            await viewTaskPo.clickOnEditTask();
            //manual task edit
            for (let i = 0; i < dynamicFields.length; i++) {
                expect(await editTaskPo.isDynamicFieldDisplayed(dynamicFields[i])).toBeTruthy('field not present ' + dynamicFields[i]);
            }
            await editTaskPo.clickOnCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        });
        it('[DRDMV-13154]: [Dynamic Data] [UI] - Dynamic Fields display on Task Edit view UI', async () => {
            await viewTaskPo.clickOnViewCase();
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.clickTaskLink(templateData.templateSummary);
            // external task view case
            let dynamicFields1: string[] = ['externalText', 'externalNumber', 'externalDate', 'externalBoolean', 'externalDateTime', 'externalTime', 'externalAttachment1'];
            for (let i = 0; i < dynamicFields1.length; i++) {
                expect(await viewTaskPo.isDynamicFieldPresent(dynamicFields1[i])).toBeTruthy('field not present ' + dynamicFields1[i]);
            }
            await viewTaskPo.clickOnEditTask();
            //external task edit
            for (let i = 0; i < dynamicFields1.length; i++) {
                expect(await editTaskPo.isDynamicFieldDisplayed(dynamicFields1[i])).toBeTruthy('field not present ' + dynamicFields1[i]);
            }
            await editTaskPo.clickOnCancelButton();
        });
        afterAll(async () => {
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        });
    });

    //ptidke
    it('[DRDMV-13120]: [Dynamic Data] - Dynamic fields availability in field library when it is added from Case Template', async () => {
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteDynamicFieldAndGroup();
        let casetemplateData = {
            "templateName": randomStr + 'caseTemplateDRDMV13120',
            "templateSummary": randomStr + 'caseTemplateDRDMV13120',
            "templateStatus": "Active",
            "assignee": "qkatawazi",
            "company": "Petramco",
            "businessUnit": "United States Support",
            "ownerBU": "United States Support",
            "supportGroup": "US Support 3",
            "ownerGroup": "US Support 3"
        }
        await apiHelper.apiLogin('qkatawazi');
        let casetemplateddetails = await apiHelper.createCaseTemplate(casetemplateData);
        await apiHelper.createDynamicDataOnTemplate(casetemplateddetails.id, 'CASE_TEMPLATE_REQUESTER_DYNAMIC_FIELDS');
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        await utilGrid.searchAndOpenHyperlink(casetemplateData.templateName)
        let arr: string[] = ['temp', 'temp1', 'temp2', 'temp3', 'temp4', 'temp5', 'attachment1', 'dynamicList'];
        for (let i = 0; i < arr.length; i++) {
            expect(await viewCasetemplatePo.isDynamicFieldDisplayed(arr[i])).toBeTruthy('field not presnet ' + arr[i]);
        }
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Application Configuration--Dynamic Field Library', 'Field Management Console - Business Workflows');
        for (let i = 0; i < arr.length; i++) {
            await utilGrid.searchRecord(arr[i]);
            expect(await dynamicFieldLibraryConfigConsolePo.isValueDisplayed('Field Description')).toContain(arr[i], 'field not peresent ' + arr[i]);
            await utilGrid.clearGridSearchBox();
        }
    });

    //ptidke
    describe('[DRDMV-13113]: [Dynamic Data] - Verify Dynamic Field On Case Template', async () => {
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let arr: string[] = ['LibTextField', 'LibNumberField', 'LibDateField', 'LibBooleanField', 'LibDateTimeField', 'LibTimeField', 'LibattachmentField'];
        let caseTemplateData;
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            caseTemplateData = {
                "templateName": randomStr + 'caseTemplateDRDMV-13113',
                "templateSummary": randomStr + 'caseTemplateDRDMV-13113',
                "templateStatus": "Draft",
                "assignee": "qkatawazi",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "ownerBU": "United States Support",
                "supportGroup": "US Support 3",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createCaseTemplate(caseTemplateData);
        });
        it('[DRDMV-13113]: Create Dynamic Fields In Field Library', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Application Configuration--Dynamic Field Library', 'Field Management Console - Business Workflows');
            //field Text type    
            await dynamicFieldLibraryConfigConsolePo.clickAddDynamicFieldButton();
            await createDynamicFieldLibraryConfigPo.setFieldName('LibTextField');
            await createDynamicFieldLibraryConfigPo.clickOnLocalizeButton();
            await localizeValuePopPo.setLocalizeValue('LibTextField');
            await localizeValuePopPo.clickOnSaveButton();
            await createDynamicFieldLibraryConfigPo.setStatusValue('Active');
            await createDynamicFieldLibraryConfigPo.setInformationSourceValueType('Agent');
            await createDynamicFieldLibraryConfigPo.setFieldValueType('TEXT');
            await createDynamicFieldLibraryConfigPo.clickOnSaveButton();
            //field Number Type  
            await dynamicFieldLibraryConfigConsolePo.clickAddDynamicFieldButton();
            await createDynamicFieldLibraryConfigPo.setFieldName('LibNumberField');
            await createDynamicFieldLibraryConfigPo.clickOnLocalizeButton();
            await localizeValuePopPo.setLocalizeValue('LibNumberField');
            await localizeValuePopPo.clickOnSaveButton();
            await createDynamicFieldLibraryConfigPo.setStatusValue('Active');
            await createDynamicFieldLibraryConfigPo.setInformationSourceValueType('Agent');
            await createDynamicFieldLibraryConfigPo.setFieldValueType('NUMBER');
            await createDynamicFieldLibraryConfigPo.clickOnSaveButton()
            //field Date Type  
            await dynamicFieldLibraryConfigConsolePo.clickAddDynamicFieldButton();
            await createDynamicFieldLibraryConfigPo.setFieldName('LibDateField');
            await createDynamicFieldLibraryConfigPo.clickOnLocalizeButton();
            await localizeValuePopPo.setLocalizeValue('LibDateField');
            await localizeValuePopPo.clickOnSaveButton();
            await createDynamicFieldLibraryConfigPo.setStatusValue('Active');
            await createDynamicFieldLibraryConfigPo.setInformationSourceValueType('Agent');
            await createDynamicFieldLibraryConfigPo.setFieldValueType('DATE');
            await createDynamicFieldLibraryConfigPo.clickOnSaveButton()
            //field Boolean Type  
            await dynamicFieldLibraryConfigConsolePo.clickAddDynamicFieldButton();
            await createDynamicFieldLibraryConfigPo.setFieldName('LibBooleanField');
            await createDynamicFieldLibraryConfigPo.clickOnLocalizeButton();
            await localizeValuePopPo.setLocalizeValue('LibBooleanField');
            await localizeValuePopPo.clickOnSaveButton();
            await createDynamicFieldLibraryConfigPo.setStatusValue('Active');
            await createDynamicFieldLibraryConfigPo.setInformationSourceValueType('Agent');
            await createDynamicFieldLibraryConfigPo.setFieldValueType('BOOLEAN');
            await createDynamicFieldLibraryConfigPo.clickOnSaveButton();
            //field Time Type  
            await dynamicFieldLibraryConfigConsolePo.clickAddDynamicFieldButton();
            await createDynamicFieldLibraryConfigPo.setFieldName('LibTimeField');
            await createDynamicFieldLibraryConfigPo.clickOnLocalizeButton();
            await localizeValuePopPo.setLocalizeValue('LibTimeField');
            await localizeValuePopPo.clickOnSaveButton();
            await createDynamicFieldLibraryConfigPo.setStatusValue('Active');
            await createDynamicFieldLibraryConfigPo.setInformationSourceValueType('Agent');
            await createDynamicFieldLibraryConfigPo.setFieldValueType('TIME');
            await createDynamicFieldLibraryConfigPo.clickOnSaveButton();
        });
        it('[DRDMV-13113]: [Dynamic Data] - Available fields from Library when adding field in Case template', async () => {
            //field DATE_TIME Type  
            await dynamicFieldLibraryConfigConsolePo.clickAddDynamicFieldButton();
            await createDynamicFieldLibraryConfigPo.setFieldName('LibDateTimeField');
            await createDynamicFieldLibraryConfigPo.clickOnLocalizeButton();
            await localizeValuePopPo.setLocalizeValue('LibDateTimeField');
            await localizeValuePopPo.clickOnSaveButton();
            await createDynamicFieldLibraryConfigPo.setStatusValue('Active');
            await createDynamicFieldLibraryConfigPo.setInformationSourceValueType('Agent');
            await createDynamicFieldLibraryConfigPo.setFieldValueType('DATE_TIME');
            await createDynamicFieldLibraryConfigPo.clickOnSaveButton();
            //field attachment Type  
            await dynamicFieldLibraryConfigConsolePo.clickAddDynamicFieldButton();
            await createDynamicFieldLibraryConfigPo.setFieldName('LibattachmentField');
            await createDynamicFieldLibraryConfigPo.clickOnLocalizeButton();
            await localizeValuePopPo.setLocalizeValue('LibattachmentField');
            await localizeValuePopPo.clickOnSaveButton();
            await createDynamicFieldLibraryConfigPo.setStatusValue('Active');
            await createDynamicFieldLibraryConfigPo.setInformationSourceValueType('Agent');
            await createDynamicFieldLibraryConfigPo.setFieldValueType('ATTACHMENT');
            await createDynamicFieldLibraryConfigPo.clickOnSaveButton();
            //field Text Type  
            await dynamicFieldLibraryConfigConsolePo.clickAddDynamicFieldButton();
            await createDynamicFieldLibraryConfigPo.setFieldName('InactiveField');
            await createDynamicFieldLibraryConfigPo.clickOnLocalizeButton();
            await localizeValuePopPo.setLocalizeValue('InactiveField');
            await localizeValuePopPo.clickOnSaveButton();
            await createDynamicFieldLibraryConfigPo.setStatusValue('Inactive');
            await createDynamicFieldLibraryConfigPo.setInformationSourceValueType('Agent');
            await createDynamicFieldLibraryConfigPo.setFieldValueType('TEXT');
            await createDynamicFieldLibraryConfigPo.clickOnSaveButton();

        });
        it('[DRDMV-13113]: [Dynamic Data] - Available fields from Library when adding field in Case template', async () => {
            //navigate to case template
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await utilGrid.searchAndOpenHyperlink(caseTemplateData.templateName)
            await viewCasetemplatePo.clickOnMangeDynamicFieldLink();
            for (let i = 0; i < arr.length; i++) {
                expect(await dynamicFieldsPo.isDynamicFieldPresentInDynamicSection(arr[i])).toBeTruthy('field not present' + arr[i]);
            }
            await dynamicFieldsPo.searchField('InactiveField');
            expect(await dynamicFieldsPo.isDynamicFieldPresentInDynamicSection('InactiveField')).toBeFalsy('field present');
            await dynamicFieldsPo.searchField('LibNumberField');
            expect(await dynamicFieldsPo.isDynamicFieldPresentInDynamicSection('LibNumberField')).toBeTruthy('field not present LibNumberField');
            await dynamicFieldsPo.clickCancelButton();
        });
    });

    //ptidke
    describe('[DRDMV-13112]: [Dynamic Data] Verify Dynamic Field On Case Template Edit view UI', async () => {
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let templateData, inactiveTemplateName, draftTemplateName, activeTemplateName;
        let caseTemplateName = randomStr + 'caseTemplateDRDMV-13112';
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            templateData = {
                "templateName": caseTemplateName,
                "templateSummary": randomStr + 'caseTemplateDRDMV-13112',
                "templateStatus": "Active",
                "assignee": "qkatawazi",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "ownerBU": "United States Support",
                "supportGroup": "US Support 3",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createCaseTemplate(templateData);
            templateData.templateSummary = 'caseTemplate2SummaryDRDMV-13112' + randomStr;
            activeTemplateName = templateData.templateName = 'caseTemplate2DRDMV-13112' + randomStr;
            templateData.templateStatus = 'Active';
            await apiHelper.apiLogin('qkatawazi');
            let newCaseTemplate2 = await apiHelper.createCaseTemplate(templateData);
            await apiHelper.createDynamicDataOnTemplate(newCaseTemplate2.id, 'CASE_TEMPLATE_DYNAMIC_FIELDS');
            templateData.templateSummary = 'caseTemplateDraftSummaryDRDMV-13112' + randomStr;
            draftTemplateName = templateData.templateName = 'caseTemplateDraftDRDMV-13112' + randomStr;
            templateData.templateStatus = 'Draft';
            await apiHelper.createCaseTemplate(templateData);
            templateData.templateSummary = 'caseTemplateInactiveSummaryDRDMV-13112' + randomStr;
            inactiveTemplateName = templateData.templateName = 'caseTemplateInactiveDRDMV-13112' + randomStr;
            templateData.templateStatus = 'Inactive';
            await apiHelper.createCaseTemplate(templateData);
        });
        it('[DRDMV-13112]: Verify Dynamic Fields On Active Case Template  ', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await utilGrid.searchAndOpenHyperlink(caseTemplateName);
            expect(await viewCasetemplatePo.isManageDynamicFieldLinkDisplayed()).toBeFalsy();
            let arr: string[] = ['temp', 'temp1', 'temp2', 'temp3', 'temp4', 'temp5', 'attachment1', 'attachment2', 'attachment3']
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await utilGrid.searchAndOpenHyperlink(activeTemplateName);
            for (let i = 0; i < arr.length; i++) {
                expect(await viewCasetemplatePo.isDynamicFieldDisplayed(arr[i])).toBeTruthy('Group Not found');
            }
            expect(await viewCasetemplatePo.isManageDynamicFieldLinkDisplayed()).toBeFalsy();
        });
        it('[DRDMV-13112]: Create and Verify Dynamic Fields On Case Template  ', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await utilGrid.searchAndOpenHyperlink(draftTemplateName);
            expect(await viewCasetemplatePo.isManageDynamicFieldLinkDisplayed()).toBeTruthy('Link not present');
            await viewCasetemplatePo.clickOnMangeDynamicFieldLink();
            await dynamicFieldsPo.clickOnDynamicField();
            await dynamicFieldsPo.setFieldName('news112' + randomStr);
            await dynamicFieldsPo.setDescriptionName('newDescri112' + randomStr);
            await dynamicFieldsPo.selectFieldValueType('DATE');
            await dynamicFieldsPo.selectInfromationSource('Requester');
            await dynamicFieldsPo.clickOnDynamicField();
            await dynamicFieldsPo.setFieldName('news1127' + randomStr);
            await dynamicFieldsPo.setDescriptionName('newDescri1127' + randomStr);
            await dynamicFieldsPo.selectFieldValueType('NUMBER');
            await dynamicFieldsPo.selectInfromationSource('System');
            await dynamicFieldsPo.clickSaveButton();
            expect(await viewCasetemplatePo.isDynamicFieldDisplayed('newDescri112' + randomStr)).toBeTruthy('field not present');
            expect(await viewCasetemplatePo.isDynamicFieldDisplayed('newDescri1127' + randomStr)).toBeTruthy('field not present');
            await viewCasetemplatePo.clickOnEditCaseTemplateButton();
            expect(await editCasetemplatePo.isManageDynamicFieldLinkDisplayed()).toBeTruthy('Link not present');
            expect(await editCasetemplatePo.isDynamicFieldDisplayed('newDescri112' + randomStr)).toBeTruthy('field not present');
            expect(await editCasetemplatePo.isDynamicFieldDisplayed('newDescri1127' + randomStr)).toBeTruthy('field not present');
            await editCasetemplatePo.clickOnCancelButton();
            await utilCommon.clickOnWarningOk();
        });
        it('[DRDMV-13112]: [Dynamic Data] [UI] - Dynamic Fields display on Case Template Edit view UI', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await utilGrid.searchAndOpenHyperlink(inactiveTemplateName);
            expect(await viewCasetemplatePo.isManageDynamicFieldLinkDisplayed()).toBeTruthy('Link not present');
            await viewCasetemplatePo.clickOnMangeDynamicFieldLink();
            await dynamicFieldsPo.clickOnDynamicField();
            await dynamicFieldsPo.setFieldName('newInactive' + randomStr);
            await dynamicFieldsPo.setDescriptionName('newInactive' + randomStr);
            await dynamicFieldsPo.selectFieldValueType('DATE');
            await dynamicFieldsPo.selectInfromationSource('Requester');
            await dynamicFieldsPo.clickOnDynamicField();
            await dynamicFieldsPo.setFieldName('newInactiveSys' + randomStr);
            await dynamicFieldsPo.setDescriptionName('newInactiveSys' + randomStr);
            await dynamicFieldsPo.selectFieldValueType('NUMBER');
            await dynamicFieldsPo.selectInfromationSource('System');
            await dynamicFieldsPo.clickSaveButton();
            expect(await viewCasetemplatePo.isDynamicFieldDisplayed('newInactive' + randomStr)).toBeTruthy('field not present');
            expect(await viewCasetemplatePo.isDynamicFieldDisplayed('newInactiveSys' + randomStr)).toBeTruthy('field not present');
            await viewCasetemplatePo.clickOnEditCaseTemplateButton();
            expect(await editCasetemplatePo.isManageDynamicFieldLinkDisplayed()).toBeTruthy('Link not present');
            expect(await editCasetemplatePo.isDynamicFieldDisplayed('newInactive' + randomStr)).toBeTruthy('field not present');
            expect(await editCasetemplatePo.isDynamicFieldDisplayed('newInactiveSys' + randomStr)).toBeTruthy('field not present');
        });
        afterAll(async () => {
            await editCasetemplatePo.clickOnCancelButton();
            await utilCommon.clickOnWarningOk();
        });
    });

    //ankagraw
    describe('[DRDMV-13101]: [Dynamic Data] [UI] - Behavior of Save, Cancel button in Add/Update Dynamic field from Library', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        it('[DRDMV-13101]: [Dynamic Data] [UI] - Behavior of Save, Cancel button in Add/Update Dynamic field from Library', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Application Configuration--Dynamic Field Library', 'Field Management Console - Business Workflows');
            await dynamicFieldLibraryConfigConsolePo.clickAddDynamicFieldButton();
            await createDynamicFieldLibraryConfigPo.setFieldName('LibTextField' + randomStr);
            await createDynamicFieldLibraryConfigPo.setStatusValue('Active');
            await createDynamicFieldLibraryConfigPo.setInformationSourceValueType('Agent');
            await createDynamicFieldLibraryConfigPo.setFieldValueType('TEXT');
            await createDynamicFieldLibraryConfigPo.clickCancelButton();
            await utilCommon.clickOnWarningOk();
            await dynamicFieldLibraryConfigConsolePo.clickAddDynamicFieldButton();
            await createDynamicFieldLibraryConfigPo.setFieldName('LibTextField' + randomStr);
            await createDynamicFieldLibraryConfigPo.setStatusValue('Active');
            await createDynamicFieldLibraryConfigPo.setInformationSourceValueType('Agent');
            await createDynamicFieldLibraryConfigPo.setFieldValueType('TEXT');
            await createDynamicFieldLibraryConfigPo.clickOnActiveConfidentialsCheckbox();
            await createDynamicFieldLibraryConfigPo.clickOnSaveButton();
            expect(await utilCommon.isPopUpMessagePresent("Resolve the field validation errors"));
            expect(await createDynamicFieldLibraryConfigPo.getRequiredWarningMessage()).toBe("Value is required.")
            await createDynamicFieldLibraryConfigPo.clickOnLocalizeButton();
            await localizeValuePopPo.setLocalizeValue('LibTextField' + randomStr);
            await localizeValuePopPo.clickOnSaveButton();
            await createDynamicFieldLibraryConfigPo.clickOnSaveButton();
        });
        it('[DRDMV-13101]: [Dynamic Data] [UI] - Behavior of Save, Cancel button in Add/Update Dynamic field from Library', async () => {
            await utilGrid.searchAndOpenHyperlink('LibTextField' + randomStr);
            await editDynamicFieldLibraryConfigPo.clickOnLocalizeButton();
            await localizeValuePopPo.clearLocalizeValue();
            await localizeValuePopPo.clickOnSaveButton();
            await editDynamicFieldLibraryConfigPo.clickOnSaveButton();
            expect(await utilCommon.isPopUpMessagePresent("Resolve the field validation errors"));
            await editDynamicFieldLibraryConfigPo.clickOnLocalizeButton();
            await localizeValuePopPo.setLocalizeValue('NewLibTextField' + randomStr);
            await localizeValuePopPo.clickOnSaveButton();
            await editDynamicFieldLibraryConfigPo.clickOnSaveButton();
        });
        it('[DRDMV-13101]: [Dynamic Data] [UI] - Behavior of Save, Cancel button in Add/Update Dynamic field from Library', async () => {
            await utilGrid.searchAndOpenHyperlink('NewLibTextField' + randomStr);
            await editDynamicFieldLibraryConfigPo.clickOnLocalizeButton();
            await localizeValuePopPo.setLocalizeValue('NewLibTextField' + randomStr);
            await localizeValuePopPo.clickOnSaveButton();
            await editDynamicFieldLibraryConfigPo.clickCancelButton();
            expect(await utilCommon.getWarningDialogMsg()).toBe("You have unsaved data. Do you want to continue without saving?");
            await utilCommon.clickOnWarningOk();
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Application Configuration--Dynamic Field Library', 'Field Management Console - Business Workflows');
            await utilGrid.searchAndOpenHyperlink('NewLibTextField' + randomStr);
            await editDynamicFieldLibraryConfigPo.clickCancelButton();
        });
    });
});