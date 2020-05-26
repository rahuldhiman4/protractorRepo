import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import { ALL_FIELD, MANDATORY_FIELD } from '../../data/ui/case/casetemplate.data.ui';
import previewCasePo from '../../pageobject/case/case-preview.po';
import createCasePo from '../../pageobject/case/create-case.po';
import editCasePo from '../../pageobject/case/edit-case.po';
import quickCasePo from '../../pageobject/case/quick-case.po';
import selectCasetemplateBladePo from '../../pageobject/case/select-casetemplate-blade.po';
import viewCasePo from '../../pageobject/case/view-case.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import updateStatusBladePo from '../../pageobject/common/update.status.blade.po';
import consoleCasetemplatePo from '../../pageobject/settings/case-management/console-casetemplate.po';
import copyCasetemplatePo from '../../pageobject/settings/case-management/copy-casetemplate.po';
import createCaseTemplate from "../../pageobject/settings/case-management/create-casetemplate.po";
import { default as editCaseTemplate, default as editCasetemplatePo } from "../../pageobject/settings/case-management/edit-casetemplate.po";
import viewCaseTemplate from "../../pageobject/settings/case-management/view-casetemplate.po";
import viewTaskPo from '../../pageobject/task/view-task.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilGrid from '../../utils/util.grid';
import utilityCommon from '../../utils/utility.common';
import utilCommon from '../../utils/util.common';
import manageTaskBladePo from '../../pageobject/task/manage-task-blade.po';
import changAssignmentOldPage from '../../pageobject/common/change-assignment-old-blade.po';
import activityTabPo from '../../pageobject/social/activity-tab.po';
import caseConsolePo from '../../pageobject/case/case-console.po';
import utilityGrid from '../../utils/utility.grid';

let caseTemplateAllFields = ALL_FIELD;
let caseTemplateRequiredFields = MANDATORY_FIELD;

describe('Case Template', () => {
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login("qkatawazi");
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    afterEach(async () => {
        await utilityCommon.refresh();
    });

    //ptidke
    it('[DRDMV-10477,DRDMV-10483]: Case Template creation with Template validation as OPTIONAL using BA login', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        let caseTemplateName: string = caseTemplateAllFields.templateName + Math.floor(Math.random() * 100000);
        caseTemplateAllFields.templateName = caseTemplateName;
        await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
        await createCaseTemplate.setTemplateName(caseTemplateName);
        await createCaseTemplate.setCompanyName(caseTemplateAllFields.company);
        await createCaseTemplate.setCaseSummary(caseTemplateAllFields.templateSummary);
        await createCaseTemplate.setPriorityValue(caseTemplateAllFields.casePriority);
        await createCaseTemplate.setBusinessUnitDropdownValue(caseTemplateAllFields.ownerBusinessUnit);
        await createCaseTemplate.setOwnerGroupDropdownValue(caseTemplateAllFields.ownerGroup);
        await createCaseTemplate.setTemplateStatusDropdownValue(caseTemplateAllFields.templateStatus)
        await createCaseTemplate.setIdentityValidationValue(caseTemplateAllFields.identityValidation)
        await createCaseTemplate.clickSaveCaseTemplate();
        //await utilCommon.waitUntilPopUpDisappear();
        await expect(await viewCaseTemplate.getCaseTemplateNameValue()).toContain(caseTemplateName);
        await expect(await viewCaseTemplate.getIdentityValdationValue()).toContain(caseTemplateAllFields.identityValidation);
    });//, 170 * 1000);

    //ptidke
    it('[DRDMV-10487]: Case Template update with Template validation as ENFORCED', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        let caseTemplateName: string = caseTemplateAllFields.templateName + Math.floor(Math.random() * 100000);
        caseTemplateAllFields.templateName = caseTemplateName;
        await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
        await createCaseTemplate.setTemplateName(caseTemplateName);
        await createCaseTemplate.setCompanyName(caseTemplateAllFields.company);
        await createCaseTemplate.setCaseSummary(caseTemplateAllFields.templateSummary);
        await createCaseTemplate.setPriorityValue(caseTemplateAllFields.casePriority);
        await createCaseTemplate.setBusinessUnitDropdownValue(caseTemplateAllFields.ownerBusinessUnit);
        await createCaseTemplate.setOwnerGroupDropdownValue(caseTemplateAllFields.ownerGroup);
        await createCaseTemplate.setTemplateStatusDropdownValue(caseTemplateAllFields.templateStatus)
        await createCaseTemplate.setIdentityValidationValue(caseTemplateAllFields.identityValidation)
        await createCaseTemplate.clickSaveCaseTemplate();
        //await utilCommon.waitUntilPopUpDisappear();
        await expect(await viewCaseTemplate.getCaseTemplateNameValue()).toContain(caseTemplateName);
        await expect(await viewCaseTemplate.getIdentityValdationValue()).toContain(caseTemplateAllFields.identityValidation);
        await editCaseTemplate.clickOnEditCaseTemplateMetadata();
        await editCaseTemplate.changeTemplateStatusDropdownValue('Draft');
        await editCaseTemplate.clickOnSaveCaseTemplateMetadata();
        await editCaseTemplate.clickEditCaseTemplate();
        await editCasetemplatePo.changeIdentityValidationValue('Enforced');
        await editCaseTemplate.clickSaveCaseTemplate();
        await expect(await viewCaseTemplate.getIdentityValdationValue()).toContain('Enforced');
    },300 * 1000);

    //ptidke
    it('[DRDMV-10469]: Case Template creation with Template validation as ENFORCED', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        let caseTemplateName: string = await caseTemplateAllFields.templateName + Math.floor(Math.random() * 100000);
        caseTemplateAllFields.templateName = caseTemplateName;
        await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
        await createCaseTemplate.setTemplateName(caseTemplateName);
        await createCaseTemplate.setCompanyName(caseTemplateAllFields.company);
        await createCaseTemplate.setCaseSummary(caseTemplateAllFields.templateSummary);
        await createCaseTemplate.setPriorityValue(caseTemplateAllFields.casePriority);
        await createCaseTemplate.setBusinessUnitDropdownValue(caseTemplateAllFields.ownerBusinessUnit);
        await createCaseTemplate.setOwnerGroupDropdownValue(caseTemplateAllFields.ownerGroup);
        await createCaseTemplate.setTemplateStatusDropdownValue(caseTemplateAllFields.templateStatus)
        await createCaseTemplate.setIdentityValidationValue('Enforced')
        await createCaseTemplate.clickSaveCaseTemplate();
        //await utilCommon.waitUntilPopUpDisappear();
        await expect(await viewCaseTemplate.getCaseTemplateNameValue()).toContain(caseTemplateName);
        await expect(await viewCaseTemplate.getIdentityValdationValue()).toContain('Enforced');
    });//, 150 * 1000);

    //ptidke
    it('[DRDMV-10481]: Case Template creation with Template validation as NONE', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        let caseTemplateName: string = await caseTemplateAllFields.templateName + Math.floor(Math.random() * 100000);
        caseTemplateAllFields.templateName = caseTemplateName;
        await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
        await createCaseTemplate.setTemplateName(caseTemplateName);
        await createCaseTemplate.setCompanyName(caseTemplateAllFields.company);
        await createCaseTemplate.setCaseSummary(caseTemplateAllFields.templateSummary);
        await createCaseTemplate.setPriorityValue(caseTemplateAllFields.casePriority);
        await createCaseTemplate.setBusinessUnitDropdownValue(caseTemplateAllFields.ownerBusinessUnit);
        await createCaseTemplate.setOwnerGroupDropdownValue(caseTemplateAllFields.ownerGroup);
        await createCaseTemplate.setTemplateStatusDropdownValue(caseTemplateAllFields.templateStatus)
        await createCaseTemplate.setIdentityValidationValue('None')
        await createCaseTemplate.clickSaveCaseTemplate();
        //await utilCommon.waitUntilPopUpDisappear();
        await expect(await viewCaseTemplate.getCaseTemplateNameValue()).toContain(caseTemplateName);
        await expect(await viewCaseTemplate.getIdentityValdationValue()).toContain('None');
    });//, 160 * 1000);

    //ptidke
    it('[DRDMV-10479]: Case Template NOT created with Template validation as OPTIONAL using Case Agent login', async () => {
        try {
            await navigationPage.signOut();
            await loginPage.login('franz');
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.isSettingPanelTextMatches("Configuration options not created for these settings.")).toBeTruthy();
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    });

    //ptidke
    it('[DRDMV-14874]: Verify the values present in the Case assignment method dropdownlist-Round Robin and None', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        let caseTemplateName: string = caseTemplateAllFields.templateName + Math.floor(Math.random() * 100000);
        caseTemplateAllFields.templateName = caseTemplateName;
        await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
        await createCaseTemplate.setTemplateName(caseTemplateName);
        await createCaseTemplate.setCompanyName(caseTemplateAllFields.company);
        await createCaseTemplate.setCaseSummary(caseTemplateAllFields.templateSummary);
        await createCaseTemplate.setPriorityValue(caseTemplateAllFields.casePriority);
        await createCaseTemplate.setAssignmentMethodValue('None');
        await expect(await copyCasetemplatePo.getValueOfAssignementMethod()).toContain('None');
        await createCaseTemplate.setBusinessUnitDropdownValue(caseTemplateAllFields.ownerBusinessUnit);
        await createCaseTemplate.setOwnerGroupDropdownValue(caseTemplateAllFields.ownerGroup);
        await createCaseTemplate.setAssignmentMethodValue(caseTemplateAllFields.assignmentMethod);
        await expect(await copyCasetemplatePo.getValueOfAssignementMethod()).toContain(caseTemplateAllFields.assignmentMethod);
        await createCaseTemplate.setTemplateStatusDropdownValue('Draft')
        await createCaseTemplate.clickSaveCaseTemplate();
        //await utilCommon.waitUntilPopUpDisappear();
        await editCaseTemplate.clickEditCaseTemplate();
        await editCasetemplatePo.changeAssignmentMethodValue('None');
        await expect(await editCasetemplatePo.getValueOfAssignmentMethod()).toContain('None');
        await editCasetemplatePo.changeAssignmentMethodValue(caseTemplateAllFields.assignmentMethod);
        await expect(await editCasetemplatePo.getValueOfAssignmentMethod()).toContain(caseTemplateAllFields.assignmentMethod);
        await editCaseTemplate.clickSaveCaseTemplate();
    }, 350 * 1000);

    //ptidke
    it('[DRDMV-14880]: Verify Case assignment method is set to None by default in a New/already existing Case template', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        let caseTemplateName: string = await caseTemplateAllFields.templateName + Math.floor(Math.random() * 100000);
        caseTemplateAllFields.templateName = caseTemplateName;
        await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
        await createCaseTemplate.setTemplateName(caseTemplateName);
        await createCaseTemplate.setCompanyName(caseTemplateAllFields.company);
        await createCaseTemplate.setCaseSummary(caseTemplateAllFields.templateSummary);
        await createCaseTemplate.setPriorityValue(caseTemplateAllFields.casePriority);
        await expect(await copyCasetemplatePo.getValueOfAssignementMethod()).toContain('None');
        await createCaseTemplate.setBusinessUnitDropdownValue(caseTemplateAllFields.ownerBusinessUnit);
        await createCaseTemplate.setOwnerGroupDropdownValue(caseTemplateAllFields.ownerGroup);
        await createCaseTemplate.setTemplateStatusDropdownValue('Draft')
        await createCaseTemplate.clickSaveCaseTemplate();
        //await utilCommon.waitUntilPopUpDisappear();
        await editCaseTemplate.clickEditCaseTemplate();
        await expect(editCasetemplatePo.getValueOfAssignmentMethod()).toContain('None');
        await editCaseTemplate.clickSaveCaseTemplate();
    });//, 150 * 1000);

    //ptidke 
    it('[DRDMV-1231]: [Edit Case Template] Template metadata edit', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        let caseTemplateName: string = caseTemplateRequiredFields.templateName + Math.floor(Math.random() * 100000);
        caseTemplateRequiredFields.templateName = caseTemplateName;
        await createCaseTemplate.createCaseTemplateWithAllFields(caseTemplateRequiredFields);
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        await utilGrid.searchAndOpenHyperlink(caseTemplateName);
        await editCaseTemplate.clickOnEditCaseTemplateMetadata();
        await editCaseTemplate.changeBusinessUnitDropdownValue(caseTemplateRequiredFields.ownerBusinessUnit);
        await editCaseTemplate.changeOwnerGroupDropdownValue(caseTemplateRequiredFields.ownerGroup);
        await editCaseTemplate.changeTemplateStatusDropdownValue('Draft');
        await editCaseTemplate.clickOnSaveCaseTemplateMetadata();
        await editCaseTemplate.clickEditCaseTemplate();
        await editCaseTemplate.clearCaseSummary();
        await editCaseTemplate.clickSaveCaseTemplate();
        await expect(await utilCommon.isPopUpMessagePresent('Resolve the field validation errors and then try again.')).toBeTruthy();
        await editCaseTemplate.changeCaseSummary('Updated Summary');
        await editCaseTemplate.clickSaveCaseTemplate();
        await editCaseTemplate.clickOnEditCaseTemplateMetadata();
        await editCaseTemplate.changeTemplateStatusDropdownValue('Active');
        await editCaseTemplate.clickOnSaveCaseTemplateMetadata();
        await utilCommon.waitUntilPopUpDisappear();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        await utilGrid.searchAndOpenHyperlink(caseTemplateName);
        await expect(await viewCaseTemplate.getOwnerGroupValue()).toContain(caseTemplateRequiredFields.ownerGroup);
        await expect(await viewCaseTemplate.getOwnerCompanyValue()).toContain('Petramco');
        await expect(await viewCaseTemplate.getTemplateStatusValue()).toContain(caseTemplateRequiredFields.templateStatus);
    }, 450 * 1000);

    //ptidke 
    it('[DRDMV-1229]: [Case Template Console] Search by Summary and Display ID on the Case Template Console', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateName = 'caseTemplateName' + randomStr;
        let casTemplateSummary = 'CaseSummaryName' + randomStr;
        let templateData = {
            "templateName": `${caseTemplateName}`,
            "templateSummary": `${casTemplateSummary}`,
            "templateStatus": "Active",
            "ownerCompany": "Petramco",
            "ownerBU": "Facilities Support",
            "ownerGroup": "Facilities",
        }
        await apiHelper.apiLogin('fritz');
        let newCaseTemplate = await apiHelper.createCaseTemplate(templateData);
        console.log("active case Template is created===", newCaseTemplate.id);
        console.log("active case Template is created===", newCaseTemplate.displayId);
        let column1: string[] = ["Display ID"];
        await consoleCasetemplatePo.addColumnOnGrid(column1);
        await utilGrid.searchRecord(newCaseTemplate.displayId);
        await expect(await consoleCasetemplatePo.isValueDisplayed("Display ID")).toContain(newCaseTemplate.displayId);
        await consoleCasetemplatePo.clickOnClearSearchIcon();
        await expect(await consoleCasetemplatePo.moreRecordsArePresentAfterClear()).toBeGreaterThan(7);
        await utilGrid.searchRecord(caseTemplateName);
        await expect(await consoleCasetemplatePo.isValueDisplayed("Template Name")).toContain(caseTemplateName);
        await consoleCasetemplatePo.clickOnClearSearchIcon();
        await expect(await consoleCasetemplatePo.moreRecordsArePresentAfterClear()).toBeGreaterThan(7);
        await utilGrid.searchRecord('xyzsdasdlkdasd');
        await expect(await consoleCasetemplatePo.moreRecordsArePresentAfterClear()).toBeLessThanOrEqual(0);
        await consoleCasetemplatePo.removeColumnFromGrid(column1);
    });

    //ptidke
    it('[DRDMV-12560]: Case Agent from owner company can create a case using the template', async () => {
        try {
            let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let caseTemplateName = 'QucikCaseTemplate' + randomStr;
            let casTemplateSummary = 'QucikCaseTemplateSummaryName' + randomStr;
            let templateData = {
                "templateName": caseTemplateName,
                "templateSummary": caseTemplateName,
                "caseStatus": "InProgress",
                "templateStatus": "Active",
                "company": "Petramco",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
                "ownerBU": 'Facilities Support',
                "ownerGroup": "Facilities"
            }
            await apiHelper.apiLogin('qkatawazi');
            let newCaseTemplate = await apiHelper.createCaseTemplate(templateData);
            console.log("active case Template is created===", newCaseTemplate.id);
            console.log("active case Template is created===", newCaseTemplate.displayId);
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('fritz');
            await createCasePo.setSummary('Summary');
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName);
            await createCasePo.clickAssignToMeButton();
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.isEditLinkDisplay()).toBeTruthy();
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('fritz');
            await quickCasePo.selectCaseTemplate(caseTemplateName);
            await quickCasePo.saveCase();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.isEditLinkDisplay()).toBeTruthy();
        } catch (e) {
            throw e;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 300 * 1000);

    //ptidke
    it('[DRDMV-12578]:Case BA from other than case template owner group can NOT update the template', async () => {
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateName = 'caseTemplateName' + randomStr;
        let casTemplateSummary = 'CaseSummaryName' + randomStr;

        let templateData = {
            "templateName": caseTemplateName,
            "templateSummary": caseTemplateName,
            "resolveCaseonLastTaskCompletion": "1",
            "templateStatus": "Draft",
            "company": "Petramco",
            "businessUnit": "Facilities Support",
            "supportGroup": "Facilities",
            "assignee": "Fritz",
            "ownerBU": 'Facilities Support',
            "ownerGroup": "Facilities"
        }
        await apiHelper.apiLogin('fritz');
        await apiHelper.createCaseTemplate(templateData);
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        await utilGrid.searchAndOpenHyperlink(caseTemplateName);
        await viewCaseTemplate.clickOnEditCaseTemplateButton();
        await expect(await editCaseTemplate.isCaseSummaryReadOnly()).toBeTruthy();
        await editCaseTemplate.clickOnEditCaseTemplateMetadata();
        await expect(await editCaseTemplate.isSaveButtonOnMetaDataIsDisabled()).toBeTruthy();
    });

    //ptidke 
    it('[DRDMV-19741]:[RESOLVE_CASE_ON_LAST_TASK_COMPLETION] - Case behavior when Case Template is changed', async () => {
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateName = 'caseTemplateName' + randomStr;
        let casTemplateSummary = 'CaseSummaryName' + randomStr;
        let templateData = {
            "templateName": `${caseTemplateName}`,
            "templateSummary": `${casTemplateSummary}`,
            "templateStatus": "Active",
            "company": "Petramco",
            "resolveCaseonLastTaskCompletion": "1",
            "assignee": "Fritz",
            "supportGroup": "Facilities",
            "caseStatus": "Assigned",
        }
        await apiHelper.apiLogin('fritz');
        let newCaseTemplate = await apiHelper.createCaseTemplate(templateData);
        let taskTemplateNameWithYesValue = 'taskTemplateWithYesResolve' + randomStr;
        let taskTemplateSummaryYesValue = 'taskYesResolved' + randomStr;
        let taskTemplateDataSet = {
            "templateName": `${taskTemplateNameWithYesValue}`,
            "templateSummary": `${taskTemplateSummaryYesValue}`,
            "templateStatus": "Active",
            "assignee": "Fritz",
            "taskCompany": "Petramco",
            "ownerCompany": "Petramco",
            "ownerBusinessUnit": "Facilities Support",
            "ownerGroup": "Facilities"
        }
        let manualTaskTemplate = await apiHelper.createManualTaskTemplate(taskTemplateDataSet);
        await apiHelper.associateCaseTemplateWithOneTaskTemplate(newCaseTemplate.displayId, manualTaskTemplate.displayId);
        let caseTemplateNameWithNoValue = 'caseTemplateWithNoResolve' + randomStr;
        let caseTemplateSummaryNoValue = 'CaseSummaryNoResolved' + randomStr;
        let templateDataSet = {
            "templateName": `${caseTemplateNameWithNoValue}`,
            "templateSummary": `${caseTemplateSummaryNoValue}`,
            "templateStatus": "Active",
            "company": "Petramco",
            "resolveCaseonLastTaskCompletion": "0",
            "assignee": "Fritz",
            "supportGroup": "Facilities"
        }
        let newCaseTemplateOne = await apiHelper.createCaseTemplate(templateDataSet);
        let manualTask = 'ManualTaskTemp' + randomStr;
        let ManualTaskTempSummary = 'ManualTaskSumm' + randomStr;
        let taskTemplateData = {
            "templateName": `${manualTask}`,
            "templateSummary": `${ManualTaskTempSummary}`,
            "templateStatus": "Active",
            "taskCompany": "Petramco",
            "ownerCompany": "Petramco",
            "ownerBusinessUnit": "Facilities Support",
            "ownerGroup": "Facilities"
        }
        let manualTaskTemplateOne = await apiHelper.createManualTaskTemplate(taskTemplateData);
        await apiHelper.associateCaseTemplateWithOneTaskTemplate(newCaseTemplateOne.displayId, manualTaskTemplateOne.displayId);
        await navigationPage.gotoCreateCase();
        await createCasePo.selectRequester('fritz');
        await createCasePo.setSummary('Summary');
        await createCasePo.clickSelectCaseTemplateButton();
        await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName);
        await createCasePo.clickAssignToMeButton();
        await createCasePo.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        await viewCasePo.isEditLinkDisplay();
        await expect(await viewCasePo.isCoreTaskPresent(taskTemplateSummaryYesValue)).toBeTruthy();
        await viewCasePo.clickEditCaseButton();
        await editCasePo.clickOnChangeCaseTemplate();
        await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateNameWithNoValue);
        await editCasePo.clickSaveCase();
        await utilCommon.closePopUpMessage();
        await updateStatusBladePo.changeCaseStatus('In Progress');
        await updateStatusBladePo.clickSaveStatus();
        await viewCasePo.openTaskCard(1);
        await manageTaskBladePo.clickTaskLinkOnManageTask(ManualTaskTempSummary);
        await viewTaskPo.clickOnChangeStatus();
        await viewTaskPo.changeTaskStatus('Completed');
        await updateStatusBladePo.setStatusReason('Successful');
        await viewTaskPo.clickOnSaveStatus();
        await viewTaskPo.clickOnViewCase();
        await expect(await viewCasePo.getCaseStatusValue()).toContain('In Progress');
        await navigationPage.gotoCreateCase();
        await createCasePo.selectRequester('fritz');
        await createCasePo.setSummary('Summary');
        await createCasePo.clickSelectCaseTemplateButton();
        await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName);
        await createCasePo.clickAssignToMeButton();
        await createCasePo.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        await viewCasePo.isEditLinkDisplay();
        await expect(await viewCasePo.isCoreTaskPresent(taskTemplateSummaryYesValue)).toBeTruthy();
        await updateStatusBladePo.changeCaseStatus('In Progress');
        await updateStatusBladePo.clickSaveStatus();
        await viewCasePo.openTaskCard(1);
        await manageTaskBladePo.clickTaskLinkOnManageTask(taskTemplateSummaryYesValue);
        await viewTaskPo.clickOnChangeStatus();
        await viewTaskPo.changeTaskStatus('Completed');
        await updateStatusBladePo.setStatusReason('Successful');
        await viewTaskPo.clickOnSaveStatus();
        await viewTaskPo.clickOnViewCase();
        await expect(await viewCasePo.getCaseStatusValue()).toContain('Resolved');
    }, 300 * 1000);


    //ptidke
    it('[DRDMV-19734]:[RESOLVE_CASE_ON_LAST_TASK_COMPLETION] - Case Template view Look & Feel after adding new configuration field', async () => {
        try {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            let caseTemplateName: string = await caseTemplateAllFields.templateName + Math.floor(Math.random() * 100000);
            caseTemplateAllFields.templateName = caseTemplateName;
            await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
            await createCaseTemplate.setTemplateName(caseTemplateName);
            await createCaseTemplate.setCompanyName(caseTemplateAllFields.company);
            await createCaseTemplate.setCaseSummary(caseTemplateAllFields.templateSummary);
            await createCaseTemplate.setPriorityValue(caseTemplateAllFields.casePriority);
            await createCaseTemplate.isResolveCaseOnLastTaskCompletion(true);
            await createCaseTemplate.setPriorityValue(caseTemplateAllFields.casePriority);
            await createCaseTemplate.isResolveCaseOnLastTaskCompletion(true);
            await createCaseTemplate.clickSaveCaseTemplate();
            //await utilCommon.waitUntilPopUpDisappear();
            await expect(await viewCaseTemplate.getResolveCaseOnLastTaskCompletionValue()).toContain('Yes');
            await editCaseTemplate.clickEditCaseTemplate();
            await editCaseTemplate.isResolveCaseOnLastTaskCompletion(false);
            await editCaseTemplate.clickSaveCaseTemplate();
            await expect(await viewCaseTemplate.getResolveCaseOnLastTaskCompletionValue()).toContain('No');
        } catch (e) {
            throw e;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    });

    //ptidke
    it('[DRDMV-9003]:[Negative Testing]-Checking change case template button disabled/hidden for different case status.', async () => {
        try {
            await navigationPage.signOut();
            await loginPage.login('qtao');
            let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let caseTemplateName = 'caseTemplateName' + randomStr;
            let casTemplateSummary = 'CaseSummaryName' + randomStr;
            let templateData = {
                "templateName": caseTemplateName,
                "templateSummary": caseTemplateName,
                "resolveCaseonLastTaskCompletion": "1",
                "templateStatus": "Active",
                "company": "Petramco",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
                "ownerBU": 'Facilities Support',
                "ownerGroup": "Facilities",
            }
            await apiHelper.apiLogin('fritz');
            await navigationPage.gotoCreateCase();
            await apiHelper.createCaseTemplate(templateData);
            await createCasePo.selectRequester('fritz');
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName);
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePo.isEditLinkDisplay();
            await updateStatusBladePo.changeCaseStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            await viewCasePo.clickEditCaseButton();
            await editCasePo.waitForEditCasePageToBeDisplayed();
            await expect(await editCasePo.isChangeCaseTemplateButtonDisplayed()).toBeFalsy('change template button not Displayed');
            await editCasePo.clickOnCancelCaseButton();
            await viewCasePo.isEditLinkDisplay();
            await updateStatusBladePo.changeCaseStatus('Resolved');
            await updateStatusBladePo.setStatusReason('Auto Resolved');
            await updateStatusBladePo.clickSaveStatus();
            await viewCasePo.clickEditCaseButton();
            await editCasePo.waitForEditCasePageToBeDisplayed();
            await expect(await editCasePo.isChangeCaseTemplateButtonDisplayed()).toBeFalsy('change template button not Displayed');
            await editCasePo.clickOnCancelCaseButton();
            await viewCasePo.isEditLinkDisplay();
            //closed
            await updateStatusBladePo.changeCaseStatus('Closed');
            await updateStatusBladePo.clickSaveStatus();
            await viewCasePo.clickEditCaseButton();
            await editCasePo.waitForEditCasePageToBeDisplayed();
            await expect(await editCasePo.isChangeCaseTemplateButtonDisplayed()).toBeFalsy('change template button not Displayed');
            await editCasePo.clickOnCancelCaseButton();
            await viewCasePo.isEditLinkDisplay();
            //new case created 
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('fritz');
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName);
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePo.isEditLinkDisplay();
            await updateStatusBladePo.changeCaseStatus('Pending');
            await updateStatusBladePo.setStatusReason('Customer Response');
            await updateStatusBladePo.clickSaveStatus();
            await viewCasePo.clickEditCaseButton();
            await editCasePo.waitForEditCasePageToBeDisplayed();
            await expect(await editCasePo.isChangeCaseTemplateButtonDisplayed()).toBeFalsy('change template button not Displayed');
            await editCasePo.clickOnCancelCaseButton();
            await viewCasePo.isEditLinkDisplay();
            //cancelled
            await updateStatusBladePo.changeCaseStatus('Canceled');
            await updateStatusBladePo.setStatusReason('Customer Canceled');
            await updateStatusBladePo.clickSaveStatus();
            await viewCasePo.clickEditCaseButton();
            await editCasePo.waitForEditCasePageToBeDisplayed();
            await expect(await editCasePo.isChangeCaseTemplateButtonDisplayed()).toBeFalsy('change template button not Displayed');
            await editCasePo.clickOnCancelCaseButton();
            await viewCasePo.isEditLinkDisplay();
        } catch (e) {
            throw e;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 500 * 1000)

    //apdeshmu 
    it('[DRDMV-769]: [Case Creation] [Template Selection] Applying a Template to a Case', async () => {
        try {
            let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let caseTemplateNamePetramco = 'caseTemplateName' + randomStr;
            console.log(caseTemplateNamePetramco);

            let casetemplatePetramco = {
                "templateName": caseTemplateNamePetramco,
                "templateSummary": caseTemplateNamePetramco,
                "templateStatus": "Active",     
                "categoryTier1": "Purchasing Card",
                "categoryTier2": "Policies",
                "categoryTier3": "Card Issuance",
                "casePriority": "Low",
                "caseStatus": "New",
                "company": "Petramco",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
                "ownerBU": "Facilities Support",
                "ownerGroup": "Facilities",
            }
            
            await apiHelper.apiLogin('fritz');
            await apiHelper.createCaseTemplate(casetemplatePetramco);

            let caseTemplateNamePsilon = randomStr + 'caseTemplatePsilonDRDMV773';
            let casetemplatePsilon = {
                "templateName": caseTemplateNamePsilon,
                "templateSummary": caseTemplateNamePsilon,
                "caseStatus": "InProgress",
                "templateStatus": "Active",
                "company": "Psilon",
                "businessUnit": "Psilon Support Org1",
                "supportGroup": "Psilon Support Group1",
                "assignee": "gderuno",
            }
            await apiHelper.apiLogin('gderuno');
            await apiHelper.createCaseTemplate(casetemplatePsilon);
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('Franz');
            await createCasePo.setSummary(caseTemplateNamePetramco);
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateNamePetramco);
            //await createCasePo.clickAssignToMeButton();
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getPriorityValue()).toBe('Low');
            expect(await viewCasePo.getCategoryTier1Value()).toBe('Purchasing Card');
            expect(await viewCasePo.getCategoryTier2Value()).toBe('Policies');
            expect(await viewCasePo.getCategoryTier3Value()).toBe('Card Issuance');
            expect(await viewCasePo.getAssignedCompanyText()).toBe('Petramco');
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('qdu');
            await createCasePo.setSummary(caseTemplateNamePsilon);
            await createCasePo.clickSelectCaseTemplateButton();
            expect(await createCasePo.isTemplateNamePresent(caseTemplateNamePsilon)).toBeFalsy();
            await selectCasetemplateBladePo.clickOnCancelButton();
            await navigationPage.signOut();
            await loginPage.login('gderuno');
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('Glit');
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateNamePsilon);
            await createCasePo.clickAssignToMeButton();
            await createCasePo.clickSaveCaseButton();
            await utilityCommon.closePopUpMessage();
            expect(await previewCasePo.isCaseTemplateDisplayed(caseTemplateNamePsilon)).toBeTruthy("Template is not selected");
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 450 * 1000);


    //apdeshmu 
    it('[DRDMV-1223]: [Case Template] Template visibility', async () => {
        try {
            let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let caseTemplateName = 'caseTemplateName' + randomStr;
            let casetemplateData = {
                "templateName": caseTemplateName,
                "templateSummary": caseTemplateName,
                "resolveCaseonLastTaskCompletion": "1",
                "templateStatus": "Active",
                "company": "Petramco",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
                "ownerBU": 'Facilities Support',
                "ownerGroup": "Facilities",
            }

            await apiHelper.apiLogin('fritz');
            await apiHelper.createCaseTemplate(casetemplateData);
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('fritz');
            await createCasePo.setSummary(caseTemplateName);
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName);
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getCaseSummary()).toBe(caseTemplateName);
            await navigationPage.signOut();
            await loginPage.login('gderuno');
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('Glit');
            await createCasePo.setSummary(caseTemplateName);
            await createCasePo.clickSelectCaseTemplateButton();
            expect(await createCasePo.isTemplateNamePresent(caseTemplateName)).toBeFalsy();
            await selectCasetemplateBladePo.clickOnCancelButton();
            await utilityCommon.refresh();
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 450 * 1000);

    it('[DRDMV-1216]: [Case Template] Create Case Template with all fields data populated', async () => {
        try {
            let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let caseTemplateName = 'caseTemplateName' + randomStr;
            let caseTemplateSummary = 'CaseSummaryName' + randomStr;
            let casetemplatePetramco = {
                "templateName": caseTemplateName,
                "templateSummary": caseTemplateName,
                "templateStatus": "Active",     
                "categoryTier1": "Purchasing Card",
                "categoryTier2": "Policies",
                "categoryTier3": "Card Issuance",
                "casePriority": "Low",
                "caseStatus": "New",
                "company": "Petramco",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
                "ownerBU": "Facilities Support",
                "ownerGroup": "Facilities",
            }
            await apiHelper.apiLogin('fritz');
            await apiHelper.createCaseTemplate(casetemplatePetramco);
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await utilGrid.searchAndOpenHyperlink(caseTemplateName);
            expect(await viewCaseTemplate.getAssigneeText()).toBe("Fritz Schulz");
            expect(await viewCaseTemplate.getCaseCompanyValue()).toBe("Petramco");
            expect(await viewCaseTemplate.getCaseTemplateNameValue()).toBe(caseTemplateName);
            expect(await viewCaseTemplate.getPriorityValue()).toBe("Low");
            expect(await viewCaseTemplate.getTemplateStatusValue()).toBe("Active");
            expect(await viewCaseTemplate.getOwnerGroupValue()).toBe("Facilities");
            expect(await viewCaseTemplate.getCategoryTier2()).toBe("Policies");
            expect(await viewCaseTemplate.getCategoryTier3()).toBe("Card Issuance");
            expect(await viewCaseTemplate.getCategoryTier1()).toBe("Purchasing Card");
            expect(await viewCaseTemplate.getOwnerCompanyValue()).toBe("Petramco");
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('fritz');
            await createCasePo.setSummary(caseTemplateName);
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName);
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getPriorityValue()).toBe('Low');
            expect(await viewCasePo.getCategoryTier1Value()).toBe('Purchasing Card');
            expect(await viewCasePo.getCategoryTier2Value()).toBe('Policies');
            expect(await viewCasePo.getCategoryTier3Value()).toBe('Card Issuance');
            expect(await viewCasePo.getAssignedCompanyText()).toBe('Petramco');
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 300 * 1000);

    it('[DRDMV-1215]: [Case Template] Case Status, Template status, Priority, Case Company, Owner population', async () => {
        try {
            let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let caseTemplateName = 'caseTemplateName' + randomStr;
            let casetemplatePetramco = {
                "templateName": caseTemplateName,
                "templateSummary": caseTemplateName,
                "templateStatus": "Draft",
                "company": "Petramco",
                "resolveCaseonLastTaskCompletion": "1",
                "ownerCompany": "Petramco",
                "ownerBU": "Facilities Support",
                "ownerGroup": "Facilities",
                "buisnessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
                "categoryTier1": "Purchasing Card",
                "categoryTier2": "Policies",
                "categoryTier3": "Card Issuance",
                "casePriority": "Low",
                "caseStatus": "New",
            }
            await apiHelper.apiLogin('fritz');
            await apiHelper.createCaseTemplate(casetemplatePetramco);
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await utilGrid.searchAndOpenHyperlink(caseTemplateName);
            await viewCaseTemplate.clickOnEditCaseTemplateButton();
            await editCaseTemplate.clickOnChangeAssignmentButton();
            await changAssignmentOldPage.setAssignee('Petramco', 'United States Support', 'US Support 3', 'Qiao Feng');
            let statuses: string[] = ["New", "Assigned", "In Progress", "Resolved", "Closed"];
            expect(await editCaseTemplate.allStatusOptionsPresent(statuses)).toBeTruthy();
            await editCaseTemplate.clickOnEditCaseTemplateMetadata();
            let templateStatuses: string[] = ["Draft", "Active", "Inactive"];
            expect(await editCaseTemplate.allTemplateStatusOptionsPresent(templateStatuses)).toBeTruthy();
            await editCaseTemplate.clickOnCancelTemplateMetaData();
            let priority: string[] = ["Critical", "High", "Medium", "Low"];
            expect(await editCaseTemplate.allPriorityOptionsPresent(priority)).toBeTruthy();
            await editCaseTemplate.clickSaveCaseTemplate();
            expect(await viewCaseTemplate.getCaseTemplateNameValue()).toContain(caseTemplateName);
            expect(await viewCaseTemplate.getCategoryTier1()).toContain("Purchasing Card");
            expect(await viewCaseTemplate.getCategoryTier2()).toContain("Policies");
            expect(await viewCaseTemplate.getCategoryTier3()).toContain("Card Issuance");
            expect(await viewCaseTemplate.getCaseCompanyValue()).toContain("Petramco");
            expect(await viewCaseTemplate.getTemplateStatusValue()).toContain("Draft");
            expect(await viewCaseTemplate.getAssigneeText()).toContain('Qiao Feng');
            expect(await viewCaseTemplate.getOwnerGroupValue()).toContain('Facilities');
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 300 * 1000);

    it('[DRDMV-8965,DRDMV-8990]: Changing case template for new case status.', async () => {
        try {
            let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let caseTemplateName = 'caseTemplateName' + randomStr;
            let updatedCaseTemplateName = 'updatedCaseTemplateName' + randomStr;

            let casetemplatePetramco1 = {
                "templateName": caseTemplateName,
                "templateSummary": caseTemplateName,
                "templateStatus": "Active",     
                "categoryTier1": "Purchasing Card",
                "categoryTier2": "Policies",
                "categoryTier3": "Card Issuance",
                "casePriority": "Low",
                "caseStatus": "New",
                "company": "Petramco",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
                "ownerBU": "Facilities Support",
                "ownerGroup": "Facilities",
            }
            
            let casetemplatePetramco2 = {
                "templateName": updatedCaseTemplateName,
                "templateSummary": updatedCaseTemplateName,
                "templateStatus": "Active",     
                "categoryTier1": "Purchasing Card",
                "categoryTier2": "Policies",
                "categoryTier3": "Card Issuance",
                "casePriority": "Low",
                "caseStatus": "New",
                "company": "Petramco",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
                "ownerBU": "Facilities Support",
                "ownerGroup": "Facilities",
            }
            
            await apiHelper.apiLogin('fritz');
            await apiHelper.createCaseTemplate(casetemplatePetramco1);
            await apiHelper.createCaseTemplate(casetemplatePetramco2);
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('Franz');
            await createCasePo.setSummary(caseTemplateName);
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName);
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getCaseSummary()).toBe(caseTemplateName);
            await viewCasePo.clickEditCaseButton();
            await editCasePo.clickOnChangeCaseTemplate();
            await selectCasetemplateBladePo.selectCaseTemplate(updatedCaseTemplateName);
            await editCasePo.clickSaveCase();
            expect(await viewCasePo.getPriorityValue()).toBe('Low');
            expect(await viewCasePo.getCaseStatusValue()).toContain('New');
            expect(await viewCasePo.getCategoryTier1Value()).toBe('Purchasing Card');
            expect(await viewCasePo.getCategoryTier2Value()).toBe('Policies');
            expect(await viewCasePo.getCategoryTier3Value()).toBe('Card Issuance');
            expect(await viewCasePo.getAssignedCompanyText()).toBe('Petramco');
            expect(await activityTabPo.isTextPresentInActivityLog(updatedCaseTemplateName)).toBeTruthy('TemplateText is not available');
            expect(await activityTabPo.isTextPresentInActivityLog('applied the template')).toBeTruthy();
            await navigationPage.gotoPersonProfile();
            expect(await activityTabPo.isTextPresentInActivityLog(updatedCaseTemplateName)).toBeTruthy("Template is not avilable on profile");
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 300 * 1000);

    it('[DRDMV-9019]:[Case] [Template Selection] Changing case template for the case in Assigned Status', async () => {
        try {
            let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let caseTemplateName = 'caseTemplateName' + randomStr;
            let updatedCaseTemplateName = 'updatedCaseTemplateName' + randomStr;
            let taskTemplateName = 'taskTemplateName' + randomStr;
            let casetemplatePetramco1 = {
                "templateName": caseTemplateName,
                "templateSummary": caseTemplateName,
                "templateStatus": "Active",     
                "categoryTier1": "Purchasing Card",
                "categoryTier2": "Policies",
                "categoryTier3": "Card Issuance",
                "casePriority": "Low",
                "caseStatus": "Assigned",
                "company": "Petramco",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
                "ownerBU": "Facilities Support",
                "ownerGroup": "Facilities",
            }
            
            let casetemplatePetramco2 = {
                "templateName": updatedCaseTemplateName,
                "templateSummary": updatedCaseTemplateName,
                "templateStatus": "Active",     
                "categoryTier1": "Purchasing Card",
                "categoryTier2": "Policies",
                "categoryTier3": "Card Issuance",
                "casePriority": "Low",
                "caseStatus": "Assigned",
                "company": "Petramco",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
                "ownerBU": "Facilities Support",
                "ownerGroup": "Facilities",
            }
            let taskTemplateDataSet = {
                "templateName": taskTemplateName,
                "templateSummary": taskTemplateName,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "buisnessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
            }
            await apiHelper.apiLogin('fritz');
            let newCaseTemplate1 = await apiHelper.createCaseTemplate(casetemplatePetramco1);
            let newCaseTemplate2 = await apiHelper.createCaseTemplate(casetemplatePetramco2);
            let manualTaskTemplate = await apiHelper.createManualTaskTemplate(taskTemplateDataSet);
            await apiHelper.associateCaseTemplateWithOneTaskTemplate(newCaseTemplate1.displayId, manualTaskTemplate.displayId);
            await apiHelper.associateCaseTemplateWithOneTaskTemplate(newCaseTemplate2.displayId, manualTaskTemplate.displayId);
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('Franz');
            await createCasePo.setSummary(caseTemplateName);
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName);
            await createCasePo.clickAssignToMeButton();
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getCaseSummary()).toBe(caseTemplateName);
            await expect(await viewCasePo.isCoreTaskPresent(taskTemplateName)).toBeTruthy();
            await viewCasePo.clickEditCaseButton();
            await editCasePo.clickOnChangeCaseTemplate();
            await selectCasetemplateBladePo.selectCaseTemplate(updatedCaseTemplateName);
            await editCasePo.clickSaveCase();
            expect(await viewCasePo.getPriorityValue()).toBe('Low');
            expect(await viewCasePo.getCaseStatusValue()).toContain('Assigned');
            expect(await viewCasePo.getCategoryTier1Value()).toBe('Purchasing Card');
            expect(await viewCasePo.getCategoryTier2Value()).toBe('Policies');
            expect(await viewCasePo.getCategoryTier3Value()).toBe('Card Issuance');
            expect(await viewCasePo.getAssignedCompanyText()).toBe('Petramco');
            expect(await viewCasePo.getAssigneeText()).toBe('Fritz Schulz');
            expect(await viewCasePo.getAssignedGroupText()).toBe('Facilities');
            expect(await activityTabPo.isTextPresentInActivityLog(updatedCaseTemplateName)).toBeTruthy('TemplateText is not available');
            expect(await activityTabPo.isTextPresentInActivityLog('applied the template')).toBeTruthy();
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 400 * 1000);

    it('[DRDMV-9127]:[Negative Testing] - Verify permission for Case Agent from the same support group to edit case template.', async () => {
        try {
            let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let caseTemplateName = 'caseTemplateName' + randomStr;

            let casetemplatePetramco = {
                "templateName": caseTemplateName,
                "templateSummary": caseTemplateName,
                "templateStatus": "Active",
                "company": "Petramco",
                "resolveCaseonLastTaskCompletion": "1",
                "ownerCompany": "Petramco",
                "ownerBU": "Facilities Support",
                "ownerGroup": "Facilities",
                "buisnessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
                "categoryTier1": "Purchasing Card",
                "categoryTier2": "Policies",
                "categoryTier3": "Card Issuance",
                "casePriority": "Low",
                "caseStatus": "Assigned",
            }

            await apiHelper.apiLogin('frieda');
            await apiHelper.createCaseTemplate(casetemplatePetramco);

            await navigationPage.signOut();
            await loginPage.login('frieda');
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('adam');
            await createCasePo.setSummary(caseTemplateName);
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName);
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getCaseSummary()).toBe(caseTemplateName);

            //Login to CA with Same SupportGroup
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilter();
            await caseConsolePo.searchAndOpenCase(caseTemplateName);
            expect(await viewCasePo.getCaseSummary()).toBe(caseTemplateName);
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 500 * 1000);

    it('[DRDMV-9129]:[Negative Testing] - Verify permission for Case Agent from a different support group to edit case template.', async () => {
        try {
            let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let caseTemplateName = 'caseTemplateName' + randomStr;
            let casetemplatePetramco = {
                "templateName": caseTemplateName,
                "templateSummary": caseTemplateName,
                "templateStatus": "Active",
                "company": "Petramco",
                "resolveCaseonLastTaskCompletion": "1",
                "ownerCompany": "Petramco",
                "ownerBU": "Facilities Support",
                "ownerGroup": "Facilities",
                "buisnessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
                "categoryTier1": "Purchasing Card",
                "categoryTier2": "Policies",
                "categoryTier3": "Card Issuance",
                "casePriority": "Low",
                "caseStatus": "Assigned",
            }
            await apiHelper.apiLogin('frieda');
            await apiHelper.createCaseTemplate(casetemplatePetramco);

            await navigationPage.signOut();
            await loginPage.login('frieda');
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('adam');
            await createCasePo.setSummary(caseTemplateName);
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName);
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getCaseSummary()).toBe(caseTemplateName);
            //Login to CM with diffrent support group 
            await navigationPage.signOut();
            await loginPage.login('qdu');
            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilter();
            await caseConsolePo.searchCase(caseTemplateName);
            expect(await caseConsolePo.isCaseSummaryPresent(caseTemplateName)).toBeFalsy("Case is present for diffrent company");
            //Login to CM with diffrent company
            await navigationPage.signOut();
            await loginPage.login('rrovnitov');
            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilter();
            await caseConsolePo.searchCase(caseTemplateName);
            expect(await caseConsolePo.isCaseSummaryPresent(caseTemplateName)).toBeFalsy("Case is present for diffrent company");

        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 400 * 1000);

    it('[DRDMV-9130]:[Negative Testing] - Verify permission for Case Manager from a different support group to edit case template.', async () => {
        try {
            let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let caseTemplateName = 'caseTemplateName' + randomStr;
            let casetemplatePetramco = {
                "templateName": caseTemplateName,
                "templateSummary": caseTemplateName,
                "templateStatus": "Active",
                "company": "Petramco",
                "resolveCaseonLastTaskCompletion": "1",
                "ownerCompany": "Petramco",
                "ownerBU": "Facilities Support",
                "ownerGroup": "Facilities",
                "buisnessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
                "categoryTier1": "Purchasing Card",
                "categoryTier2": "Policies",
                "categoryTier3": "Card Issuance",
                "casePriority": "Low",
                "caseStatus": "Assigned",
            }

            await apiHelper.apiLogin('frieda');
            await apiHelper.createCaseTemplate(casetemplatePetramco);

            await navigationPage.signOut();
            await loginPage.login('frieda');
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('adam');
            await createCasePo.setSummary(caseTemplateName);
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName);
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getCaseSummary()).toBe(caseTemplateName);
            await viewCasePo.clickEditCaseButton();
            //Login to CA with diffrent support group 
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilter();
            await caseConsolePo.searchCase(caseTemplateName);
            expect(await caseConsolePo.isCaseSummaryPresent(caseTemplateName)).toBeFalsy("Case is present for diffrent company");
            //Login to CA with diffrent company 
            await navigationPage.signOut();
            await loginPage.login('werusha');
            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilter();
            await caseConsolePo.searchCase(caseTemplateName);
            expect(await caseConsolePo.isCaseSummaryPresent(caseTemplateName)).toBeFalsy("Case is present for diffrent company");
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 400 * 1000);
})
