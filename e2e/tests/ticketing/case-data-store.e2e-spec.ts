import { browser } from "protractor";
import apiHelper from "../../api/api.helper";
import { default as casePreviewPo, default as previewCasePo } from '../../pageobject/case/case-preview.po';
import { default as createCasePo } from '../../pageobject/case/create-case.po';
import editCasePo from '../../pageobject/case/edit-case.po';
import quickCasePo from '../../pageobject/case/quick-case.po';
import requesterResponseBladePo from '../../pageobject/case/requester-response-blade.po';
import selectCasetemplateBladePo from '../../pageobject/case/select-casetemplate-blade.po';
import { default as viewCasePo } from "../../pageobject/case/view-case.po";
import { default as dynamicFieldsPo } from '../../pageobject/common/dynamic-fields.po';
import localizeValuePopPo from '../../pageobject/common/localize-value-pop.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import createDynamicFieldLibraryConfigPo from '../../pageobject/settings/application-config/create-dynamic-field-library-config.po';
import dynamicFieldLibraryConfigConsolePo from '../../pageobject/settings/application-config/dynamic-field-library-config-console.po';
import editCasetemplatePo from '../../pageobject/settings/case-management/edit-casetemplate.po';
import previewCaseTemplateCasesPo from '../../pageobject/settings/case-management/preview-case-template-cases.po';
import viewCasetemplatePo from '../../pageobject/settings/case-management/view-casetemplate.po';
import editTaskTemplate from "../../pageobject/settings/task-management/edit-tasktemplate.po";
import previewTaskTemplateCasesPo from '../../pageobject/settings/task-management/preview-task-template-cases.po';
import viewTaskTemplate from "../../pageobject/settings/task-management/view-tasktemplate.po";
import editTaskPo from '../../pageobject/task/edit-task.po';
import { default as manageTaskBladePo } from "../../pageobject/task/manage-task-blade.po";
import viewTaskPo from '../../pageobject/task/view-task.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilCommon from '../../utils/util.common';
import utilGrid from '../../utils/util.grid';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';


describe('Case Data Store', () => {
    const randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    afterEach(async () => {
        await utilityCommon.refresh();
    });
    //ptidke
    it('[DRDMV-13123]:[Dynamic Data] [UI] - Dynamic Fields display on Case Edit view UI', async () => {
        try {
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            let caseTemplateName = randomStr + 'caseTemplateDRDMV-13123';
            let caseTemaplateSummary = randomStr + 'caseTemplateDRDMV-13123';
            let casetemplateData = {
                "templateName": `${caseTemplateName}`,
                "templateSummary": `${caseTemaplateSummary}`,
                "templateStatus": "Active",
            }
            await apiHelper.apiLogin('fritz');
            let newCaseTemplate = await apiHelper.createCaseTemplate(casetemplateData);
            await apiHelper.createDynamicDataOnTemplate(newCaseTemplate.id, 'CASE_TEMPLATE_DYNAMIC_FIELDS');
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('qkatawazi');
            await createCasePo.setSummary('new cases');
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName);
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
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
            await navigationPage.gotoCaseConsole();
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        }
    }, 250 * 1000);

    //ptidke
    it('[DRDMV-13126]:[Dynamic Data] - Create Case from Quick Case with Template having dynamic fields and also have field with source as Requester', async () => {
        try {
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            let caseTemplateName = randomStr + 'caseTemplateDRDMV-13126';
            let caseTemaplateSummary = randomStr + 'caseTemplateDRDMV-13126';
            let casetemplateData = {
                "templateName": `${caseTemplateName}`,
                "templateSummary": `${caseTemaplateSummary}`,
                "templateStatus": "Active",
            }
            await apiHelper.apiLogin('fritz');
            let newCaseTemplate = await apiHelper.createCaseTemplate(casetemplateData);
            await apiHelper.createDynamicDataOnTemplate(newCaseTemplate.id, 'CASE_TEMPLATE_REQUESTER_DYNAMIC_FIELDS');
            await navigationPage.gotoCaseConsole();
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('qkatawazi');
            await createCasePo.setSummary('new cases');
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName);
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
        } catch (e) { throw e }
        finally {
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        }
    }, 380 * 1000);

    //ptidke
    it('[DRDMV-13115]:[Dynamic Data] - Update Dynamic fields in Existing Case Template by replacing old fields with new Fields', async () => {
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteDynamicFieldAndGroup();
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateName = 'caseTemplateName13115' + randomStr;
        let casTemplateSummary = 'CaseSummarySummary13115' + randomStr;
        let templateData = {
            "templateName": `${caseTemplateName}`,
            "templateSummary": `${casTemplateSummary}`,
            "templateStatus": "Draft",
            "resolveCaseonLastTaskCompletion": "1",
            "assignee": "Fritz",
            "company": "Petramco",
            "supportGroup": "Facilities",
            "ownerGroup": "Facilities"
        }
        await apiHelper.apiLogin('qkatawazi');
        let newCaseTemplate = await apiHelper.createCaseTemplate(templateData);
        await apiHelper.createDynamicDataOnTemplate(newCaseTemplate.id, 'CASE_TEMPLATE_REMOVE_FIELDS');
        await navigationPage.gotoCaseConsole();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        await utilGrid.searchAndOpenHyperlink(caseTemplateName);
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
    });//, 180 * 1000);

    //ptidke
    it('[DRDMV-13118]:[Dynamic Data] - Case Template and Case UI with dynamic fields and groups having long title', async () => {
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateName = 'caseTemplateName13118' + randomStr;
        let casTemplateSummary = 'CaseSummarySummary13118' + randomStr;
        let groupName = 'GroupLocalCaseTemplateGroupLocalCaseTemplateLocalCaseTemplate';
        let field1InGroup = 'LocalNonConfidentialDescLocalNonConfidentialDescLocalNonConfidentialDesc';
        let field2InGroup = 'LocalConfidentialDescLocalConfidentialDescLocalNonConfidentialDesc';
        let field1OutSideGroup = 'theautomatedDynamicFieldsIsgettingMouseOveredMouseOvered';
        let field2OutSideGroup = 'theSecondautomatedDynamicFieldsIsgettingMouseOveredMouseOvered';
        let field3OutSideGroup = 'theThirdDynamicautomatedFieldsIsgettingMouseOveredMouseOvered';
        let field4OutSideGroup = 'temp1theNewautomatedDynamicFieldsIsgettingMouseOveredMouseOvered';
        let templateData = {
            "templateName": `${caseTemplateName}`,
            "templateSummary": `${casTemplateSummary}`,
            "templateStatus": "Active",
            "company": "Petramco",
            "ownerBU": "Facilities Support",
            "ownerGroup": "Facilities"
        }
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteDynamicFieldAndGroup();
        await apiHelper.apiLogin('qkatawazi');
        let newCaseTemplate = await apiHelper.createCaseTemplate(templateData);
        await apiHelper.createDynamicDataOnTemplate(newCaseTemplate.id, 'CASE_TEMPLATE_LONG_FIELDS');
        await navigationPage.gotoCaseConsole();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        await utilGrid.searchAndOpenHyperlink(caseTemplateName);
        expect(await viewCasetemplatePo.isGroupDisplayed(groupName)).toBeTruthy('Group Not found');
        expect(await viewCasetemplatePo.isDynamicFieldDisplayed(field1InGroup)).toBeTruthy();
        expect(await viewCasetemplatePo.isDynamicFieldDisplayed(field2InGroup)).toBeTruthy();
        expect(await viewCasetemplatePo.isDynamicFieldDisplayed(field1OutSideGroup)).toBeTruthy();
        expect(await viewCasetemplatePo.isDynamicFieldDisplayed(field2OutSideGroup)).toBeTruthy();
        expect(await viewCasetemplatePo.isDynamicFieldDisplayed(field3OutSideGroup)).toBeTruthy();
        expect(await viewCasetemplatePo.isDynamicFieldDisplayed(field4OutSideGroup)).toBeTruthy();
        await navigationPage.gotoCreateCase();
        await createCasePo.selectRequester('qtao');
        await createCasePo.setSummary('Summary');
        await createCasePo.clickSelectCaseTemplateButton();
        await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName);
        await createCasePo.clickAssignToMeButton();
        await createCasePo.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        await utilityCommon.waitUntilPopUpDisappear();
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
        expect(await viewCasePo.getValueOfDynamicFields(field4OutSideGroup)).toBe('True');
        expect(await viewCasePo.getValueOfDynamicFields(field1OutSideGroup)).toBe('field1 outside group');
        expect(await viewCasePo.getValueOfDynamicFields(field2OutSideGroup)).toBe('809888');
    }, 300 * 1000);

    //ptidke
    it('[DRDMV-13140]:[Dynamic Data] [UI] -Dynamic Fields display on Task Template Edit view UI', async () => {
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteDynamicFieldAndGroup();
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let arr: string[] = ['temp', 'temp1', 'temp2', 'temp3', 'temp4', 'temp5', 'attachment1', 'attachment2', 'attachment3']
        //Draft to active
        let taskTemplateNameDraft = 'ManualtaskDraftDRDMV-13940' + randomStr;
        let manualTaskSummaryDraft = 'ManualSummaryDraftDRDMV-13940' + randomStr;
        let templateData = {
            "templateName": `${taskTemplateNameDraft}`,
            "templateSummary": `${manualTaskSummaryDraft}`,
            "templateStatus": "Draft",
            "taskCompany": 'Petramco',
            "ownerCompany": "Petramco",
            "ownerBusinessUnit": "Facilities Support",
            "ownerGroup": "Facilities"
        }
        await apiHelper.apiLogin('qkatawazi');
        let tasktemplate = await apiHelper.createManualTaskTemplate(templateData);
        await apiHelper.createDynamicDataOnTemplate(tasktemplate.id, 'TASK_TEMPLATE__DYNAMIC_FIELDS');
        //Inactive
        let taskTemplateNameOne = 'ManualtaskInactiveDRDMV-13940' + randomStr;
        let manualTaskSummaryOne = 'ManualSummaryInactiveDRDMV-13940' + randomStr;
        let templateDataInactive = {
            "templateName": `${taskTemplateNameOne}`,
            "templateSummary": `${manualTaskSummaryOne}`,
            "templateStatus": "Inactive",
            "taskCompany": 'Petramco',
            "ownerCompany": "Petramco",
            "ownerBusinessUnit": "Facilities Support",
            "ownerGroup": "Facilities"
        }
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteDynamicFieldAndGroup();
        await apiHelper.apiLogin('qkatawazi');
        let tasktemplateInactive = await apiHelper.createManualTaskTemplate(templateDataInactive);
        await apiHelper.createDynamicDataOnTemplate(tasktemplateInactive.id, 'TASK_TEMPLATE__DYNAMIC_FIELDS');
        //Draft only
        let taskTemplateNameDraftOnly = 'ManualtaskDraftOnlyDRDMV-13940' + randomStr;
        let manualTaskSummaryDraftOnly = 'ManualSummaryDraftOnlyDRDMV-13940' + randomStr;
        let templateDataDraft = {
            "templateName": `${taskTemplateNameDraftOnly}`,
            "templateSummary": `${manualTaskSummaryDraftOnly}`,
            "templateStatus": "Draft",
            "taskCompany": 'Petramco',
            "ownerCompany": "Petramco",
            "ownerBusinessUnit": "Facilities Support",
            "ownerGroup": "Facilities"
        }
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteDynamicFieldAndGroup();
        await apiHelper.apiLogin('qkatawazi');
        let tasktemplateDraft = await apiHelper.createManualTaskTemplate(templateDataDraft);
        await apiHelper.createDynamicDataOnTemplate(tasktemplateDraft.id, 'TASK_TEMPLATE__DYNAMIC_FIELDS');
        //active
        let taskTemplateName = 'ManualtaskActiveDRDMV-13940' + randomStr;
        let manualTaskSummary = 'ManualSummaryActiveDRDMV-13940' + randomStr;
        let templateDataActive = {
            "templateName": `${taskTemplateName}`,
            "templateSummary": `${manualTaskSummary}`,
            "templateStatus": "Active",
            "taskCompany": 'Petramco',
            "ownerCompany": "Petramco",
            "ownerBusinessUnit": "Facilities Support",
            "ownerGroup": "Facilities"
        }
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteDynamicFieldAndGroup();
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.createManualTaskTemplate(templateDataActive);
        await navigationPage.gotoCaseConsole();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
        await utilGrid.searchAndOpenHyperlink(taskTemplateName);
        expect(await viewTaskPo.isDynamicFieldSectionPresent()).toBeFalsy('fields are present');
        //draft to active
        await navigationPage.gotoCaseConsole();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
        await utilGrid.searchAndOpenHyperlink(taskTemplateNameDraft);
        await viewTaskTemplate.clickOnEditMetaData();
        await editTaskTemplate.selectTemplateStatus('Active');
        await editTaskTemplate.clickOnSaveMetadata();
        for (let i = 0; i < arr.length; i++) {
            expect(await viewTaskTemplate.isDynamicFieldPresent(arr[i])).toBeTruthy('field is not present');
        }
        expect(await viewTaskTemplate.isManageDynamicFieldLinkDisplayed()).toBeFalsy('Link is present');
        //draft only
        await navigationPage.gotoCaseConsole();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
        await utilGrid.searchAndOpenHyperlink(taskTemplateNameDraftOnly);
        for (let i = 0; i < arr.length; i++) {
            expect(await viewTaskTemplate.isDynamicFieldPresent(arr[i])).toBeTruthy('field is not present');
        }
        expect(await viewTaskTemplate.isManageDynamicFieldLinkDisplayed()).toBeTruthy('Link is not present');
        //edit
        await viewTaskTemplate.clickOnEditLink();
        expect(await editTaskTemplate.isMangeDynamicFieldLinkDisplayed()).toBeTruthy('link not present');
        for (let i = 0; i < arr.length; i++) {
            expect(await editTaskTemplate.isDynamicFieldPresent(arr[i])).toBeTruthy('field is not present');
        }
        //Inactive
        await navigationPage.gotoCaseConsole();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
        await utilGrid.searchAndOpenHyperlink(taskTemplateNameOne);
        for (let i = 0; i < arr.length; i++) {
            expect(await viewTaskTemplate.isDynamicFieldPresent(arr[i])).toBeTruthy('field is not present');
        }
        expect(await viewTaskTemplate.isManageDynamicFieldLinkDisplayed()).toBeTruthy('Link is not present');
        //edit
        await viewTaskTemplate.clickOnEditLink();
        expect(await editTaskTemplate.isMangeDynamicFieldLinkDisplayed()).toBeTruthy('link not present');
        for (let i = 0; i < arr.length; i++) {
            expect(await editTaskTemplate.isDynamicFieldPresent(arr[i])).toBeTruthy('field is not present');
        }
    }, 360 * 1000);

    //ptidke
    it('[DRDMV-13122]:[Dynamic Data] [UI] - Dynamic fields and groups display on Case Template preview', async () => {
        try {
            let group1 = 'GroupLocalCaseTemplate';
            let group2 = 'PulishCaseTemplateData';
            let dynamicFields: string[] = ['LocalNonConfidentialDesc', 'LocalConfidentialDesc', 'nonConfidentialPulicDesc', 'confidentialPublicDesc', 'OuterNonConfidentialDesc', 'ListOfDataNameDesc', 'OuterConfidentialDesc'];
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            let caseTemplateName = randomStr + 'caseTemplateDRDMV-13122';
            let caseTemaplateSummary = randomStr + 'caseTemplateDRDMV-13122';
            let casetemplateData = {
                "templateName": `${caseTemplateName}`,
                "templateSummary": `${caseTemaplateSummary}`,
                "templateStatus": "Active",
                "assignee": "Fritz",
                "company": "Petramco",
                "businessUnit": "Facilities Support",
                "ownerBU": "Facilities Support",
                "supportGroup": "Facilities",
                "ownerGroup": "Facilities"
            }
            await apiHelper.apiLogin('fritz');
            let newCaseTemplate = await apiHelper.createCaseTemplate(casetemplateData);
            await apiHelper.createDynamicDataOnTemplate(newCaseTemplate.id, 'CASE_TEMPLATE_WITH_CONFIDENTIAL');
            //qucik case preview
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('qkatawazi');
            await quickCasePo.selectCaseTemplate(caseTemplateName);
            await quickCasePo.clickOnCaseTemplate(caseTemplateName);
            expect(await previewCaseTemplateCasesPo.isGroupDisplayed(group1)).toBeTruthy('group is not present');
            expect(await previewCaseTemplateCasesPo.isGroupDisplayed(group2)).toBeTruthy('group is not present');
            for (let i = 0; i < dynamicFields.length; i++) {
                expect(await previewCaseTemplateCasesPo.isDynamicFieldDisplayed(dynamicFields[i])).toBeTruthy('field not present ' + dynamicFields[i]);
            }
            await previewCaseTemplateCasesPo.clickOnBackButton();
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('qkatawazi');
            await createCasePo.setSummary(caseTemaplateSummary);
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.clickOnCaseTemplate(caseTemplateName);
            //verify dynmaic groups and fields
            expect(await previewCaseTemplateCasesPo.isGroupDisplayed(group1)).toBeTruthy('group is not present');
            expect(await previewCaseTemplateCasesPo.isGroupDisplayed(group2)).toBeTruthy('group is not present');
            for (let i = 0; i < dynamicFields.length; i++) {
                expect(await previewCaseTemplateCasesPo.isDynamicFieldDisplayed(dynamicFields[i])).toBeTruthy('field not present ' + dynamicFields[i]);
            }
            await previewCaseTemplateCasesPo.clickOnBackButton();
            await selectCasetemplateBladePo.clickOnAllTemplateTab();
            await utilityGrid.searchAndOpenHyperlink(caseTemplateName);
            //verify dynmaic groups and fields
            expect(await previewCaseTemplateCasesPo.isGroupDisplayed(group1)).toBeTruthy('group is not present');
            expect(await previewCaseTemplateCasesPo.isGroupDisplayed(group2)).toBeTruthy('group is not present');
            for (let i = 0; i < dynamicFields.length; i++) {
                expect(await previewCaseTemplateCasesPo.isDynamicFieldDisplayed(dynamicFields[i])).toBeTruthy('field not present ' + dynamicFields[i]);
            }
            await previewCaseTemplateCasesPo.clickOnBackButton();
            await utilityCommon.refresh();
            await navigationPage.gotoCaseConsole();
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        }
    }, 360 * 1000);

    //ptidke
    it('[DRDMV-13131]:[Dynamic Data] [UI] - Dynamic Fields and Groups display on Case and Similar Cases preview', async () => {
        try {
            let group1 = 'GroupLocalCaseTemplate';
            let group2 = 'PulishCaseTemplateData';
            let dynamicFields: string[] = ['LocalNonConfidentialDesc', 'LocalConfidentialDesc', 'nonConfidentialPulicDesc', 'confidentialPublicDesc', 'OuterNonConfidentialDesc', 'ListOfDataNameDesc', 'OuterConfidentialDesc'];
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            let caseTemplateName = randomStr + 'caseTemplateDRDMV-13131';
            let caseTemaplateSummary = randomStr + 'caseTemplateSummaryDRDMV-13131';
            let casetemplateData = {
                "templateName": `${caseTemplateName}`,
                "templateSummary": `${caseTemaplateSummary}`,
                "templateStatus": "Active",
                "assignee": "Fritz",
                "company": "Petramco",
                "businessUnit": "Facilities Support",
                "ownerBU": "Facilities Support",
                "supportGroup": "Facilities",
                "ownerGroup": "Facilities"
            }
            await apiHelper.apiLogin('fritz');
            let newCaseTemplate = await apiHelper.createCaseTemplate(casetemplateData);
            await apiHelper.createDynamicDataOnTemplate(newCaseTemplate.id, 'CASE_TEMPLATE_WITH_CONFIDENTIAL');
            //qucik case preview
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('qkatawazi');
            await quickCasePo.selectCaseTemplate(caseTemplateName);
            await quickCasePo.createCaseButton();
            //case preview
            // await utilityCommon.waitUntilSpinnerToHide();
            expect(await casePreviewPo.isGroupDisplayed(group1)).toBeTruthy('group is not present');
            expect(await casePreviewPo.isGroupDisplayed(group2)).toBeTruthy('group is not present');
            for (let i = 0; i < dynamicFields.length; i++) {
                expect(await casePreviewPo.isDynamicFieldDisplayed(dynamicFields[i])).toBeTruthy('field not present ' + dynamicFields[i]);
            }
            await quickCasePo.gotoCaseButton();
            let caseID = await viewCasePo.getCaseID();
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('qkatawazi');
            await quickCasePo.setSummaryAndClickOnRecommandedCase(caseID, caseTemplateName);
            //case preview
            // await utilCommon.waitUntilSpinnerToHide();
            expect(await casePreviewPo.isGroupDisplayed(group1)).toBeTruthy('group is not present');
            expect(await casePreviewPo.isGroupDisplayed(group2)).toBeTruthy('group is not present');
            for (let i = 0; i < dynamicFields.length; i++) {
                expect(await casePreviewPo.isDynamicFieldDisplayed(dynamicFields[i])).toBeTruthy('field not present ' + dynamicFields[i]);
            }
            await casePreviewPo.clickBackButton();
            // requester case template
            let caseTemplateNameWithRequester = randomStr + 'caseTemplateReqDRDMV-13131';
            let caseTemaplateSummaryRequester = randomStr + 'caseTemplateReqDRDMV-13131';
            let casetemplateDataRequester = {
                "templateName": `${caseTemplateNameWithRequester}`,
                "templateSummary": `${caseTemaplateSummaryRequester}`,
                "templateStatus": "Active",
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            await apiHelper.apiLogin('fritz');
            let newCaseTemplateReq = await apiHelper.createCaseTemplate(casetemplateDataRequester);
            await apiHelper.createDynamicDataOnTemplate(newCaseTemplateReq.id, 'CASE_TEMPLATE_WITH_REQUESTER');
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('qkatawazi');
            await createCasePo.setSummary('new cases');
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateNameWithRequester);
            await createCasePo.clickSaveCaseButton();
            expect(await requesterResponseBladePo.getBladeHeading()).toContain("Requester's Response");
            expect(requesterResponseBladePo.isDynamicGroupDisplayed('GroupOne'));
            expect(requesterResponseBladePo.isDynamicGroupDisplayed('GroupTwo'));
            let dynamicFieldsReqester: string[] = ['FieldGroup1', 'Field2Group1', 'FieldGroup2', 'Field2Group2', 'Field1Outside'];
            for (let i = 0; i < dynamicFieldsReqester.length; i++) {
                expect(await requesterResponseBladePo.isDynamicFieldDisplayed(dynamicFieldsReqester[i])).toBeTruthy(dynamicFieldsReqester[i] + 'field not present');
            }
            await requesterResponseBladePo.clickOkButton();
            await utilCommon.waitUntilSpinnerToHide();
            //requester case preview
            expect(await casePreviewPo.isGroupDisplayed('GroupTwo')).toBeTruthy('group is not present');
            expect(await casePreviewPo.isGroupDisplayed('GroupOne')).toBeTruthy('group is not present');
            for (let i = 0; i < dynamicFieldsReqester.length; i++) {
                expect(await casePreviewPo.isDynamicFieldDisplayed(dynamicFieldsReqester[i])).toBeTruthy('field not present ' + dynamicFieldsReqester[i]);
            }
            await casePreviewPo.clickGoToCaseButton();
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        }
    }, 350 * 1000);

    //ptidke
    it('[DRDMV-13114]:[Dynamic Data] - Add all type of dynamic fields in Case Template', async () => {
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteDynamicFieldAndGroup();
        let caseTemplateName = randomStr + 'caseTemplateDRDMV-13114';
        let caseTemaplateSummary = randomStr + 'caseTemplateDRDMV-13114';
        let casetemplateData = {
            "templateName": `${caseTemplateName}`,
            "templateSummary": `${caseTemaplateSummary}`,
            "templateStatus": "Draft",
        }
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.createCaseTemplate(casetemplateData);
        await navigationPage.gotoCaseConsole();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        await utilGrid.searchAndOpenHyperlink(caseTemplateName);
        await utilCommon.waitUntilSpinnerToHide();
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
    });//, 240 * 1000);

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
            "ownerBusinessUnit": "Facilities Support",
            "ownerGroup": "Facilities"
        }
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.createAutomatedTaskTemplate(templateData);
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
        await utilGrid.searchAndOpenHyperlink(`Automate13610${randomStr}`);
        await viewTaskTemplate.clickOnEditLink();
        expect(await editTaskTemplate.isAutomatedTaskTypeDisabled()).toBeTruthy('not disabled');
        expect(await editTaskTemplate.isProcessNameDisabled()).toBeTruthy('not disabled');
        await editTaskTemplate.selectTaskCategoryTier1('Accounts Receivable');
        await editTaskTemplate.setSummary('update' + randomStr);
        await editTaskTemplate.selectPriorityValue('High');
        await editTaskTemplate.clickOnSaveButton();
        expect(await viewTaskTemplate.getCategoryTier1Value()).toBe('Accounts Receivable');
        expect(await viewTaskTemplate.getSummaryValue()).toBe('update' + randomStr);
        expect(await viewTaskTemplate.getPriorityValue()).toBe('High');
    });//, 240 * 1000);

    it('[DRDMV-13153]: [Dynamic Data] [UI] - Dynamic fields and groups display on Task Template preview	', async () => {
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteDynamicFieldAndGroup();
        let taskTemplateName = 'ManualtaskDRDMV-13153' + randomStr;
        let manualTaskSummary = 'ManualSummaryDRDMV-13153' + randomStr;
        let templateData = {
            "templateName": `${taskTemplateName}`,
            "templateSummary": `${manualTaskSummary}`,
            "templateStatus": "Active",
            "taskCompany": 'Petramco',
            "ownerCompany": "Petramco",
            "ownerBusinessUnit": "Facilities Support",
            "ownerGroup": "Facilities"
        }
        let tasktemplate = await apiHelper.createManualTaskTemplate(templateData);
        await apiHelper.createDynamicDataOnTemplate(tasktemplate.id, 'TASK_TEMPLATE_WITH_CONFIDENTIAL');
        await navigationPage.gotoCreateCase();
        await createCasePo.selectRequester('qdu');
        await createCasePo.setSummary('new cases');
        await createCasePo.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        await viewCasePo.clickAddTaskButton();
        await manageTaskBladePo.clickAddTaskFromTemplateButton();
        await utilityGrid.searchAndOpenHyperlink(taskTemplateName);
        expect(await previewTaskTemplateCasesPo.isDynamicGroupDisplayed('TaskGroupLocalCaseTemplate')).toBeTruthy();
        expect(await previewTaskTemplateCasesPo.isDynamicGroupDisplayed('TaskPulishCaseTemplateData')).toBeTruthy();
        expect(await previewTaskTemplateCasesPo.isDynamicFieldDisplayed('TaskLocalNonConfidentialDesc')).toBeTruthy();
        expect(await previewTaskTemplateCasesPo.isDynamicFieldDisplayed('TaskLocalConfidentialDesc')).toBeTruthy();
        expect(await previewTaskTemplateCasesPo.isDynamicFieldDisplayed('TasknonConfidentialPulicDesc')).toBeTruthy();
        expect(await previewTaskTemplateCasesPo.isDynamicFieldDisplayed('TaskconfidentialPublicDesc')).toBeTruthy();
        expect(await previewTaskTemplateCasesPo.isDynamicFieldDisplayed('TaskOuterNonConfidentialDesc')).toBeTruthy();
        expect(await previewTaskTemplateCasesPo.isDynamicFieldDisplayed('TaskListOfDataNameDesc')).toBeTruthy();
        expect(await previewTaskTemplateCasesPo.isDynamicFieldDisplayed('TaskOuterConfidentialDesc')).toBeTruthy();
        await utilityCommon.refresh();
        let caseTemplateName = 'caseTemplateNameDRDMV-13153' + randomStr;
        let casTemplateSummary = 'CaseSummaryNameDRDMV-13153' + randomStr;
        let caseTemplateData = {
            "templateName": `${caseTemplateName}`,
            "templateSummary": `${casTemplateSummary}`,
            "templateStatus": "Draft",
            "resolveCaseonLastTaskCompletion": "1",
            "assignee": "Fritz",
            "company": "Petramco",
            "supportGroup": "Facilities",
            "ownerGroup": "Facilities"
        }
        await apiHelper.apiLogin('fritz');
        let casetemplateddetails = await apiHelper.createCaseTemplate(caseTemplateData);
        await navigationPage.gotoSettingsPage();
        await apiHelper.associateCaseTemplateWithOneTaskTemplate(casetemplateddetails.displayId, tasktemplate.displayId);
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        await utilGrid.searchAndOpenHyperlink(caseTemplateName);
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
    });
    //ptidke
    it('[DRDMV-13154]: [Dynamic Data] [UI] - Dynamic Fields display on Task Edit view UI', async () => {
        try {
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            let taskTemplateName = 'ManualtaskDRDMV-13154' + randomStr;
            let manualTaskSummary = 'ManualSummaryDRDMV-13154' + randomStr;
            let templateData = {
                "templateName": `${taskTemplateName}`,
                "templateSummary": `${manualTaskSummary}`,
                "templateStatus": "Active",
                "taskCompany": 'Petramco',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
            }
            let tasktemplate = await apiHelper.createManualTaskTemplate(templateData);
            await apiHelper.createDynamicDataOnTemplate(tasktemplate.id, 'TASK_TEMPLATE__DYNAMIC_FIELDS');
            let externalTask = 'externalTaskDRDMV-13154' + randomStr;
            let externalTaskSummary = 'externalSummaryDRDMV-13154' + randomStr;
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            let externalTemplateData = {
                "templateName": `${externalTask}`,
                "templateSummary": `${externalTaskSummary}`,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
            }
            await apiHelper.apiLogin('qkatawazi');
            let externalTaskTemplate = await apiHelper.createExternalTaskTemplate(externalTemplateData);
            await apiHelper.createDynamicDataOnTemplate(externalTaskTemplate.id, 'EXTERNAL_TASK_TEMPLATE__DYNAMIC_FIELDS');
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('qkatawazi');
            await createCasePo.setSummary('new cases');
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.addTaskFromTaskTemplate(taskTemplateName);
            await manageTaskBladePo.addTaskFromTaskTemplate(externalTask);
            await manageTaskBladePo.clickTaskLinkOnManageTask(manualTaskSummary);
            // manual task view case
            let dynamicFields: string[] = ['temp', 'temp1', 'temp2', 'temp3', 'temp4', 'attachment1', 'attachment2', 'attachment3'];
            for (let i = 0; i < dynamicFields.length; i++) {
                expect(await viewTaskPo.isDynamicFieldPresent(dynamicFields[i])).toBeTruthy('field not present ' + dynamicFields[i]);
            }
            await viewTaskPo.clickOnEditTask();
            //manual task edit
            for (let i = 0; i < dynamicFields.length; i++) {
                expect(await editTaskPo.isDynamicFieldDisplayed(dynamicFields[i])).toBeTruthy('field not present ' + dynamicFields[i]);
            }
            await editTaskPo.clickOnCancelButton();
            await viewTaskPo.clickOnViewCase();
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.clickTaskLinkOnManageTask(externalTaskSummary);
            // manual task view case
            let dynamicFields1: string[] = ['externalText', 'externalNumber', 'externalDate', 'externalBoolean', 'externalDateTime', 'externalTime', 'externalAttachment1'];
            for (let i = 0; i < dynamicFields1.length; i++) {
                expect(await viewTaskPo.isDynamicFieldPresent(dynamicFields1[i])).toBeTruthy('field not present ' + dynamicFields1[i]);
            }
            await viewTaskPo.clickOnEditTask();
            //manual task edit
            for (let i = 0; i < dynamicFields1.length; i++) {
                expect(await editTaskPo.isDynamicFieldDisplayed(dynamicFields1[i])).toBeTruthy('field not present ' + dynamicFields1[i]);
            }
        } catch (e) { throw e }
        finally {
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        }
    }, 350 * 1000);

    it('[DRDMV-13120]: [Dynamic Data] - Dynamic fields availability in field library when it is added from Case Template', async () => {
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteDynamicFieldAndGroup();
        let caseTemplateName = 'caseTemplateNameDRDMV-13120' + randomStr;
        let casTemplateSummary = 'CaseSummaryNameDRDMV-13120' + randomStr;
        let caseTemplateData = {
            "templateName": `${caseTemplateName}`,
            "templateSummary": `${casTemplateSummary}`,
            "templateStatus": "Draft",
            "company": "Petramco",
            "ownerBU": "Facilities Support",
            "ownerGroup": "Facilities"
        }
        await apiHelper.apiLogin('fritz');
        let casetemplateddetails = await apiHelper.createCaseTemplate(caseTemplateData);
        await apiHelper.createDynamicDataOnTemplate(casetemplateddetails.id, 'CASE_TEMPLATE_REQUESTER_DYNAMIC_FIELDS');
        await navigationPage.gotoCaseConsole();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        await utilGrid.searchAndOpenHyperlink(caseTemplateName)
        let arr: string[] = ['temp', 'temp1', 'temp2', 'temp3', 'temp4', 'temp5', 'attachment1', 'dynamicList'];
        for (let i = 0; i < arr.length; i++) {
            expect(await viewCasetemplatePo.isDynamicFieldDisplayed(arr[i])).toBeTruthy('field not presnet ' + arr[i]);
        }
        await navigationPage.gotoCaseConsole();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Application Configuration--Dynamic Field Library', 'Field Management Console - Business Workflows');
        for (let i = 0; i < arr.length; i++) {
            await utilGrid.searchRecord(arr[i]);
            expect(await dynamicFieldLibraryConfigConsolePo.isValueDisplayed('Field Description')).toContain(arr[i], 'field not peresent ' + arr[i]);
            await utilGrid.clearGridSearchBox();
        }
    });

    it('[DRDMV-13113]: [Dynamic Data] - Available fields from Library when adding field in Case template', async () => {
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteDynamicFieldAndGroup();
        let caseTemplateName = 'caseTemplateNameDRDMV-13113' + randomStr;
        let casTemplateSummary = 'CaseSummaryNameDRDMV-13113' + randomStr;
        let caseTemplateData = {
            "templateName": `${caseTemplateName}`,
            "templateSummary": `${casTemplateSummary}`,
            "templateStatus": "Draft",
            "assignee": "Fritz",
            "company": "Petramco",
            "businessUnit": "Facilities Support",
            "ownerBU": "Facilities Support",
            "supportGroup": "Facilities",
            "ownerGroup": "Facilities"
        }
        await apiHelper.apiLogin('qkatawazi');
        let casetemplateddetails = await apiHelper.createCaseTemplate(caseTemplateData);
        await navigationPage.gotoCaseConsole();
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
        let arr: string[] = ['LibTextField', 'LibNumberField', 'LibDateField', 'LibBooleanField', 'LibDateTimeField', 'LibTimeField', 'LibattachmentField'];
        //navigate to case template
        await navigationPage.gotoCaseConsole();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        await utilGrid.searchAndOpenHyperlink(caseTemplateName)
        await viewCasetemplatePo.clickOnMangeDynamicFieldLink();
        for (let i = 0; i < arr.length; i++) {
            expect(await dynamicFieldsPo.isDynamicFieldPresentInDynamicSection(arr[i])).toBeTruthy('field not present' + arr[i]);
        }
        await dynamicFieldsPo.searchField('InactiveField');
        expect(await dynamicFieldsPo.isDynamicFieldPresentInDynamicSection('InactiveField')).toBeFalsy('field present');
        await dynamicFieldsPo.searchField('LibNumberField');
        expect(await dynamicFieldsPo.isDynamicFieldPresentInDynamicSection('LibNumberField')).toBeTruthy('field not present LibNumberField');
        await utilityCommon.refresh();

    }, 450 * 1000);

    it('[DRDMV-13112]: [Dynamic Data] [UI] - Dynamic Fields display on Case Template Edit view UI', async () => {
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteDynamicFieldAndGroup();
        let caseTemplateName = randomStr + 'caseTemplateDRDMV-13112';
        let caseTemaplateSummary = randomStr + 'caseTemplateDRDMV-13112';
        let casetemplateData = {
            "templateName": `${caseTemplateName}`,
            "templateSummary": `${caseTemaplateSummary}`,
            "templateStatus": "Active",
            "assignee": "Fritz",
            "company": "Petramco",
            "businessUnit": "Facilities Support",
            "ownerBU": "Facilities Support",
            "supportGroup": "Facilities",
            "ownerGroup": "Facilities"
        }
        await apiHelper.apiLogin('fritz');
        let newCaseTemplate = await apiHelper.createCaseTemplate(casetemplateData);
        let caseTemplateName2 = randomStr + 'caseTemplate2DRDMV-13112';
        let caseTemaplateSummary2 = randomStr + 'caseTemplate2DRDMV-13112';
        let casetemplateData2 = {
            "templateName": `${caseTemplateName2}`,
            "templateSummary": `${caseTemaplateSummary2}`,
            "templateStatus": "Active",
            "assignee": "Fritz",
            "company": "Petramco",
            "businessUnit": "Facilities Support",
            "ownerBU": "Facilities Support",
            "supportGroup": "Facilities",
            "ownerGroup": "Facilities"
        }
        await apiHelper.apiLogin('qkatawazi');
        let newCaseTemplate2 = await apiHelper.createCaseTemplate(casetemplateData2);
        await apiHelper.createDynamicDataOnTemplate(newCaseTemplate2.id, 'CASE_TEMPLATE_DYNAMIC_FIELDS');
        let caseTemplateName3 = randomStr + 'caseTemplateDraftDRDMV-13112';
        let caseTemaplateSummary3 = randomStr + 'caseTemplateDraftDRDMV-13112';
        let casetemplateData3 = {
            "templateName": `${caseTemplateName3}`,
            "templateSummary": `${caseTemaplateSummary3}`,
            "templateStatus": "Draft",
            "assignee": "Fritz",
            "company": "Petramco",
            "businessUnit": "Facilities Support",
            "ownerBU": "Facilities Support",
            "supportGroup": "Facilities",
            "ownerGroup": "Facilities"
        }
        await apiHelper.apiLogin('qkatawazi');
        let newCaseTemplate3 = await apiHelper.createCaseTemplate(casetemplateData3);
        let caseTemplateName4 = randomStr + 'caseTemplateInactiveDRDMV-13112';
        let caseTemaplateSummary4 = randomStr + 'caseTemplateInactiveDRDMV-13112';
        let casetemplateData4 = {
            "templateName": `${caseTemplateName4}`,
            "templateSummary": `${caseTemaplateSummary4}`,
            "templateStatus": "Inactive",
            "assignee": "Fritz",
            "company": "Petramco",
            "businessUnit": "Facilities Support",
            "ownerBU": "Facilities Support",
            "supportGroup": "Facilities",
            "ownerGroup": "Facilities"
        }
        await apiHelper.apiLogin('qkatawazi');
        let newCaseTemplate4 = await apiHelper.createCaseTemplate(casetemplateData4);
        await navigationPage.gotoCaseConsole();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        await utilGrid.searchAndOpenHyperlink(caseTemplateName);
        expect(await viewCasetemplatePo.isManageDynamicFieldLinkDisplayed()).toBeFalsy();
        let arr: string[] = ['temp', 'temp1', 'temp2', 'temp3', 'temp4', 'temp5', 'attachment1', 'attachment2', 'attachment3']
        await navigationPage.gotoCaseConsole();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        await utilGrid.searchAndOpenHyperlink(caseTemplateName2);
        for (let i = 0; i < arr.length; i++) {
            expect(await viewCasetemplatePo.isDynamicFieldDisplayed(arr[i])).toBeTruthy('Group Not found');
        }
        expect(await viewCasetemplatePo.isManageDynamicFieldLinkDisplayed()).toBeFalsy();
        await navigationPage.gotoCaseConsole();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        await utilGrid.searchAndOpenHyperlink(caseTemplateName3);
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
        await navigationPage.gotoCaseConsole();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        await utilGrid.searchAndOpenHyperlink(caseTemplateName4);
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
        await editCasetemplatePo.clickOnCancelButton();
    }, 450 * 1000);
})