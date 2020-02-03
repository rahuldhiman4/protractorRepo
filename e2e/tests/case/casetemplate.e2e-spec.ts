import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
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
import utilCommon from '../../utils/util.common';
import utilGrid from '../../utils/util.grid';

var caseTemplate = require('../../data/ui/case/casetemplate.ui.json');

describe('Case Template', () => {
    beforeAll(async () => {
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa');
        await loginPage.login("qkatawazi");
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    afterEach(async () => {
        await browser.refresh();
        await utilCommon.waitUntilSpinnerToHide();
    });

    it('[DRDMV-10477,DRDMV-10483]: Case Template creation with Template validation as OPTIONAL using BA login', async () => {
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows')).toEqual('Case Templates - Business Workflows');
        var caseTemplateName: string = await caseTemplate['caseTemplateWitAllFields'].templateName + Math.floor(Math.random() * 100000);
        caseTemplate['caseTemplateWitAllFields'].templateName = caseTemplateName;
        await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
        await createCaseTemplate.setTemplateName(caseTemplateName);
        await createCaseTemplate.setCompanyName(caseTemplate['caseTemplateWitAllFields'].company);
        await createCaseTemplate.setCaseSummary(caseTemplate['caseTemplateWitAllFields'].templateSummary);
        await createCaseTemplate.setPriorityValue(caseTemplate['caseTemplateWitAllFields'].casePriority);
        await createCaseTemplate.setOwnerGroupDropdownValue(caseTemplate['caseTemplateWitAllFields'].ownerGroup);
        await createCaseTemplate.setTemplateStatusDropdownValue(caseTemplate['caseTemplateWitAllFields'].templateStatus)
        await createCaseTemplate.setIdentityValidationValue(caseTemplate['caseTemplateWitAllFields'].identityValidation)
        await createCaseTemplate.clickSaveCaseTemplate();
        await utilCommon.waitUntilPopUpDisappear();
        expect(await viewCaseTemplate.getCaseTemplateNameValue()).toContain(caseTemplateName);
        expect(await viewCaseTemplate.getIdentityValdationValue()).toContain(caseTemplate['caseTemplateWitAllFields'].identityValidation);
    });

    it('[DRDMV-10487]: Case Template update with Template validation as ENFORCED', async () => {
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows')).toEqual('Case Templates - Business Workflows');
        var caseTemplateName: string = await caseTemplate['caseTemplateWitAllFields'].templateName + Math.floor(Math.random() * 100000);
        caseTemplate['caseTemplateWitAllFields'].templateName = caseTemplateName;
        await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
        await createCaseTemplate.setTemplateName(caseTemplateName);
        await createCaseTemplate.setCompanyName(caseTemplate['caseTemplateWitAllFields'].company);
        await createCaseTemplate.setCaseSummary(caseTemplate['caseTemplateWitAllFields'].templateSummary);
        await createCaseTemplate.setPriorityValue(caseTemplate['caseTemplateWitAllFields'].casePriority);
        await createCaseTemplate.setOwnerGroupDropdownValue(caseTemplate['caseTemplateWitAllFields'].ownerGroup);
        await createCaseTemplate.setTemplateStatusDropdownValue(caseTemplate['caseTemplateWitAllFields'].templateStatus)
        await createCaseTemplate.setIdentityValidationValue(caseTemplate['caseTemplateWitAllFields'].identityValidation)
        await createCaseTemplate.clickSaveCaseTemplate();
        await utilCommon.waitUntilPopUpDisappear();
        expect(await viewCaseTemplate.getCaseTemplateNameValue()).toContain(caseTemplateName);
        expect(await viewCaseTemplate.getIdentityValdationValue()).toContain(caseTemplate['caseTemplateWitAllFields'].identityValidation);
        await editCaseTemplate.clickEditCaseTemplate();
        await editCasetemplatePo.changeIdentityValidationValue('Enforced');
        await editCaseTemplate.clickSaveCaseTemplate();
        expect(await viewCaseTemplate.getIdentityValdationValue()).toContain('Enforced');
    });

    it('[DRDMV-10469]: Case Template creation with Template validation as ENFORCED', async () => {
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows')).toEqual('Case Templates - Business Workflows');
        var caseTemplateName: string = await caseTemplate['caseTemplateWitAllFields'].templateName + Math.floor(Math.random() * 100000);
        caseTemplate['caseTemplateWitAllFields'].templateName = caseTemplateName;
        await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
        await createCaseTemplate.setTemplateName(caseTemplateName);
        await createCaseTemplate.setCompanyName(caseTemplate['caseTemplateWitAllFields'].company);
        await createCaseTemplate.setCaseSummary(caseTemplate['caseTemplateWitAllFields'].templateSummary);
        await createCaseTemplate.setPriorityValue(caseTemplate['caseTemplateWitAllFields'].casePriority);
        await createCaseTemplate.setOwnerGroupDropdownValue(caseTemplate['caseTemplateWitAllFields'].ownerGroup);
        await createCaseTemplate.setTemplateStatusDropdownValue(caseTemplate['caseTemplateWitAllFields'].templateStatus)
        await createCaseTemplate.setIdentityValidationValue('Enforced')
        await createCaseTemplate.clickSaveCaseTemplate();
        await utilCommon.waitUntilPopUpDisappear();
        expect(await viewCaseTemplate.getCaseTemplateNameValue()).toContain(caseTemplateName);
        expect(await viewCaseTemplate.getIdentityValdationValue()).toContain('Enforced');
    });

    it('[DRDMV-10481]: Case Template creation with Template validation as NONE', async () => {
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows')).toEqual('Case Templates - Business Workflows');
        var caseTemplateName: string = await caseTemplate['caseTemplateWitAllFields'].templateName + Math.floor(Math.random() * 100000);
        caseTemplate['caseTemplateWitAllFields'].templateName = caseTemplateName;
        await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
        await createCaseTemplate.setTemplateName(caseTemplateName);
        await createCaseTemplate.setCompanyName(caseTemplate['caseTemplateWitAllFields'].company);
        await createCaseTemplate.setCaseSummary(caseTemplate['caseTemplateWitAllFields'].templateSummary);
        await createCaseTemplate.setPriorityValue(caseTemplate['caseTemplateWitAllFields'].casePriority);
        await createCaseTemplate.setOwnerGroupDropdownValue(caseTemplate['caseTemplateWitAllFields'].ownerGroup);
        await createCaseTemplate.setTemplateStatusDropdownValue(caseTemplate['caseTemplateWitAllFields'].templateStatus)
        await createCaseTemplate.setIdentityValidationValue('None')
        await createCaseTemplate.clickSaveCaseTemplate();
        await utilCommon.waitUntilPopUpDisappear();
        expect(await viewCaseTemplate.getCaseTemplateNameValue()).toContain(caseTemplateName);
        expect(await viewCaseTemplate.getIdentityValdationValue()).toContain('None');
    });

    it('[DRDMV-10476]: Case Template creation with Template validation as OPTIONAL using tadmin login', async () => {
        try {
            await navigationPage.signOut();
            await loginPage.login('tadmin');
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows')).toEqual('Case Templates - Business Workflows');
            var caseTemplateName: string = await caseTemplate['caseTemplateWitAllFields'].templateName + Math.floor(Math.random() * 100000);
            caseTemplate['caseTemplateWitAllFields'].templateName = caseTemplateName;
            await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
            await createCaseTemplate.setTemplateName(caseTemplateName);
            await createCaseTemplate.setCompanyName(caseTemplate['caseTemplateWitAllFields'].company);
            await createCaseTemplate.setCaseSummary(caseTemplate['caseTemplateWitAllFields'].templateSummary);
            await createCaseTemplate.setOwnerCompanyValue(caseTemplate['caseTemplateWitAllFields'].ownerCompany)
            await createCaseTemplate.setPriorityValue(caseTemplate['caseTemplateWitAllFields'].casePriority);
            await createCaseTemplate.setOwnerGroupDropdownValue(caseTemplate['caseTemplateWitAllFields'].ownerGroup);
            await createCaseTemplate.setTemplateStatusDropdownValue(caseTemplate['caseTemplateWitAllFields'].templateStatus)
            await createCaseTemplate.setIdentityValidationValue(caseTemplate['caseTemplateWitAllFields'].identityValidation)
            await createCaseTemplate.clickSaveCaseTemplate();
            await utilCommon.waitUntilPopUpDisappear();
            expect(await viewCaseTemplate.getCaseTemplateNameValue()).toContain(caseTemplateName);
            expect(await viewCaseTemplate.getIdentityValdationValue()).toContain(caseTemplate['caseTemplateWitAllFields'].identityValidation);
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    });

    it('[DRDMV-10479]: Case Template NOT created with Template validation as OPTIONAL using Case Agent login', async () => {
        try {
            await navigationPage.signOut();
            await loginPage.login('franz');
            await navigationPage.gotoSettingsPage();
            await browser.sleep(1000);
            expect(await createCaseTemplate.getPanelHeading()).toContain('Configuration options not created for these settings.');
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    });

    it('[DRDMV-14874]: Verify the values present in the Case assignment method dropdownlist-Round Robin and None', async () => {
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows')).toEqual('Case Templates - Business Workflows');
        var caseTemplateName: string = await caseTemplate['caseTemplateWitAllFields'].templateName + Math.floor(Math.random() * 100000);
        caseTemplate['caseTemplateWitAllFields'].templateName = caseTemplateName;
        await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
        await createCaseTemplate.setTemplateName(caseTemplateName);
        await createCaseTemplate.setCompanyName(caseTemplate['caseTemplateWitAllFields'].company);
        await createCaseTemplate.setCaseSummary(caseTemplate['caseTemplateWitAllFields'].templateSummary);
        await createCaseTemplate.setPriorityValue(caseTemplate['caseTemplateWitAllFields'].casePriority);
        await createCaseTemplate.setAssignmentMethodValue('None');
        await expect(copyCasetemplatePo.getValueOfAssignementMethod()).toContain('None');
        await createCaseTemplate.setOwnerGroupDropdownValue(caseTemplate['caseTemplateWitAllFields'].ownerGroup);
        await createCaseTemplate.setAssignmentMethodValue(caseTemplate['caseTemplateWitAllFields'].assignmentMethod);
        await expect(copyCasetemplatePo.getValueOfAssignementMethod()).toContain(caseTemplate['caseTemplateWitAllFields'].assignmentMethod);
        await createCaseTemplate.setTemplateStatusDropdownValue('Draft')
        await createCaseTemplate.clickSaveCaseTemplate();
        await utilCommon.waitUntilPopUpDisappear();
        await editCaseTemplate.clickEditCaseTemplate();
        await editCasetemplatePo.changeAssignmentMethodValue('None');
        await expect(editCasetemplatePo.getValueOfAssignmentMethod()).toContain('None');
        await editCasetemplatePo.changeAssignmentMethodValue(caseTemplate['caseTemplateWitAllFields'].assignmentMethod);
        await expect(editCasetemplatePo.getValueOfAssignmentMethod()).toContain(caseTemplate['caseTemplateWitAllFields'].assignmentMethod);
        await editCaseTemplate.clickSaveCaseTemplate();
    });

    it('[DRDMV-14880]: Verify Case assignment method is set to None by default in a New/already existing Case template', async () => {
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows')).toEqual('Case Templates - Business Workflows');
        var caseTemplateName: string = await caseTemplate['caseTemplateWitAllFields'].templateName + Math.floor(Math.random() * 100000);
        caseTemplate['caseTemplateWitAllFields'].templateName = caseTemplateName;
        await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
        await createCaseTemplate.setTemplateName(caseTemplateName);
        await createCaseTemplate.setCompanyName(caseTemplate['caseTemplateWitAllFields'].company);
        await createCaseTemplate.setCaseSummary(caseTemplate['caseTemplateWitAllFields'].templateSummary);
        await createCaseTemplate.setPriorityValue(caseTemplate['caseTemplateWitAllFields'].casePriority);
        await expect(copyCasetemplatePo.getValueOfAssignementMethod()).toContain('None');
        await createCaseTemplate.setOwnerGroupDropdownValue(caseTemplate['caseTemplateWitAllFields'].ownerGroup);
        await createCaseTemplate.setTemplateStatusDropdownValue('Draft')
        await createCaseTemplate.clickSaveCaseTemplate();
        await utilCommon.waitUntilPopUpDisappear();
        await editCaseTemplate.clickEditCaseTemplate();
        await expect(editCasetemplatePo.getValueOfAssignmentMethod()).toContain('None');
        await editCaseTemplate.clickSaveCaseTemplate();
    });

    it('[DRDMV-1231]: [Edit Case Template] Template metadata edit', async () => {
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows')).toEqual('Case Templates - Business Workflows');
        var caseTemplatePayload = await caseTemplate['caseTemplateWithMandatoryField'];
        let caseTemplateName: string = await caseTemplatePayload.templateName + Math.floor(Math.random() * 100000);
        caseTemplatePayload.templateName = caseTemplateName;
        let caseTemplateStatus: string = await caseTemplatePayload.templateStatus + Math.floor(Math.random() * 100000);
        caseTemplatePayload.templateStatus = caseTemplateStatus;
        await createCaseTemplate.createCaseTemplateWithAllFields(caseTemplatePayload);
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows')).toEqual('Case Templates - Business Workflows');
        await utilGrid.searchAndOpenHyperlink(caseTemplateName);
        await editCaseTemplate.clickOnEditCaseTemplateMetadata();
        await editCaseTemplate.changeOwnerGroupDropdownValue(caseTemplate['caseTemplateWithMandatoryField'].supportGroup);
        await editCaseTemplate.changeTemplateStatusDropdownValue('Draft');
        await editCaseTemplate.clickOnSaveCaseTemplateMetadata();
        await editCaseTemplate.clickEditCaseTemplate();
        await editCaseTemplate.clearCaseSummary();
        await editCaseTemplate.clickSaveCaseTemplate();
        expect(await editCaseTemplate.getErrorMessage()).toContain('Resolve the field validation errors and then try again.');
        await editCaseTemplate.changeCaseSummary('Updated Summary');
        await editCaseTemplate.clickSaveCaseTemplate();
        expect(await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows')).toEqual('Case Templates - Business Workflows');
        await utilGrid.searchAndOpenHyperlink(caseTemplateName);
        expect(await viewCaseTemplate.getOwnerGroupValue()).toContain(caseTemplate['caseTemplateWithMandatoryField'].supportGroup);
        expect(await viewCaseTemplate.getOwnerCompanyValue()).toContain('Petramco');
        expect(await viewCaseTemplate.getTemplateStatusValue()).toContain(caseTemplate['caseTemplateWithMandatoryField'].templateStatus);
    });

    it('[DRDMV-1229]: [Case Template Console] Search by Summary and Display ID on the Case Template Console', async () => {
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows')).toEqual('Case Templates - Business Workflows');
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateName = 'caseTemplateName' + randomStr;
        let casTemplateSummary = 'CaseSummaryName' + randomStr;
        var templateData = {
            "templateName": `${caseTemplateName}`,
            "templateSummary": `${casTemplateSummary}`,
            "templateStatus": "Active",
        }
        await apiHelper.apiLogin('fritz');
        var newCaseTemplate = await apiHelper.createCaseTemplate(templateData);
        console.log("active case Template is created===", newCaseTemplate.id);
        console.log("active case Template is created===", newCaseTemplate.displayId);
        let column1: string[] = ["Display ID"];
        await consoleCasetemplatePo.addColumnOnGrid(column1);
        await utilGrid.searchRecord(newCaseTemplate.displayId);
        expect(await consoleCasetemplatePo.isValueDisplayed("Display ID")).toContain(newCaseTemplate.displayId);
        await consoleCasetemplatePo.clickOnClearSearchIcon();
        expect(await consoleCasetemplatePo.moreRecordsArePresentAfterClear()).toBeGreaterThan(7);
        await utilGrid.searchRecord(caseTemplateName);
        expect(await consoleCasetemplatePo.isValueDisplayed("Template Name")).toContain(caseTemplateName);
        await consoleCasetemplatePo.clickOnClearSearchIcon();
        expect(await consoleCasetemplatePo.moreRecordsArePresentAfterClear()).toBeGreaterThan(7);
        await utilGrid.searchRecord('xyzsdasdlkdasd');
        expect(await consoleCasetemplatePo.moreRecordsArePresentAfterClear()).toBeLessThanOrEqual(0);
        await consoleCasetemplatePo.removeColumnFromGrid(column1);
    });

    it('[DRDMV-12560]: Case Agent from owner company can create a case using the template', async () => {
        try {
            let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let caseTemplateName = 'QucikCaseTemplate' + randomStr;
            let casTemplateSummary = 'QucikCaseTemplateSummaryName' + randomStr;
            let templateData = {
                "templateName": `${caseTemplateName}`,
                "templateSummary": `${casTemplateSummary}`,
                "templateStatus": "Active",
                "company": "Petramco",
                "resolveCaseonLastTaskCompletion": "1",
                "assignee": "Fritz",
                "supportGroup": "Facilities"
            }
            await apiHelper.apiLogin('qkatawazi');
            var newCaseTemplate = await apiHelper.createCaseTemplate(templateData);
            console.log("active case Template is created===", newCaseTemplate.id);
            console.log("active case Template is created===", newCaseTemplate.displayId);
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await navigationPage.gotCreateCase();
            await createCasePo.selectRequester('fritz');
            await createCasePo.setSummary('Summary');
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName);
            await createCasePo.clickAssignToMeButton();
            await createCasePo.clickSaveCaseButton();
            await createCasePo.clickGoToCaseButton();
            await utilCommon.waitUntilPopUpDisappear();
            expect(await viewCasePo.isEditLinkDisplay()).toBeTruthy();
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('qtao');
            await quickCasePo.selectCaseTemplate(caseTemplateName);
            await quickCasePo.saveCase();
            await createCasePo.clickGoToCaseButton();
            await utilCommon.waitUntilPopUpDisappear();
            expect(await viewCasePo.isEditLinkDisplay()).toBeTruthy();
        } catch (e) {
            throw e;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    });

    it('[DRDMV-12578]:Case BA from other than case template owner group can NOT update the template', async () => {
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateName = 'caseTemplateName' + randomStr;
        let casTemplateSummary = 'CaseSummaryName' + randomStr;
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
        await apiHelper.apiLogin('fritz');
        await apiHelper.createCaseTemplate(templateData);
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows')).toEqual('Case Templates - Business Workflows');
        await utilGrid.searchAndOpenHyperlink(caseTemplateName);
        await viewCaseTemplate.clickOnEditCaseTemplateButton();
        expect(await editCaseTemplate.isCaseSummaryReadOnly()).toBeTruthy();
        await editCaseTemplate.clickOnEditCaseTemplateMetadata();
        expect(await editCaseTemplate.isSaveButtonOnMetaDataIsDisabled()).toBeTruthy();
    }),

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
                "supportGroup": "Facilities"
            }
            await apiHelper.apiLogin('fritz');
            let newCaseTemplate = await apiHelper.createCaseTemplate(templateData);
            let taskTemplateNameWithYesValue = 'taskTemplateWithYesResolve' + randomStr;
            let taskTemplateSummaryYesValue = 'taskSummaryYesResolved' + randomStr;
            var taskTemplateDataSet = {
                "templateName": `${taskTemplateNameWithYesValue}`,
                "templateSummary": `${taskTemplateSummaryYesValue}`,
                "templateStatus": "Active",
                "assignee": "Fritz",
                "company": "Petramco",
                "supportGroup": "Facilities"
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
            let ManualTaskTempSummary = 'ManualTaskTemplateSummary' + randomStr;
            let taskTemplateData = {
                "templateName": `${manualTask}`,
                "templateSummary": `${ManualTaskTempSummary}`,
                "templateStatus": "Active",
                "company": "Petramco",
                "assignee": "Fritz",
                "supportGroup": "Facilities"
            }
            let manualTaskTemplateOne = await apiHelper.createManualTaskTemplate(taskTemplateData);
            await apiHelper.associateCaseTemplateWithOneTaskTemplate(newCaseTemplateOne.displayId, manualTaskTemplateOne.displayId);
            //defect https://jira.bmc.com/browse/DRDMV-19821 
            await navigationPage.gotCreateCase();
            await createCasePo.selectRequester('fritz');
            await createCasePo.setSummary('Summary');
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName);
            await createCasePo.clickAssignToMeButton();
            await createCasePo.clickSaveCaseButton();
            await createCasePo.clickGoToCaseButton();
            await viewCasePo.isEditLinkDisplay();
            expect(await viewCasePo.isCoreTaskPresent(taskTemplateSummaryYesValue)).toBeTruthy();
            await viewCasePo.clickEditCaseButton();
            await editCasePo.clickOnChangeCaseTemplate();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateNameWithNoValue);
            await editCasePo.clickSaveCase();
            await utilCommon.waitUntilPopUpDisappear();
            await viewCasePo.changeCaseStatus('In Progress');
            await viewCasePo.clickSaveStatus();
            expect(await viewCasePo.clickOnTaskLink(ManualTaskTempSummary)).toBeTruthy();
            await viewCasePo.clickOnTaskLink(ManualTaskTempSummary);
            await viewTaskPo.clickOnChangeStatus();
            await viewTaskPo.changeTaskStatus('Completed');
            await updateStatusBladePo.setStatusReason('Done');
            await viewTaskPo.clickOnSaveStatus();
            await viewTaskPo.clickOnViewCase();
            expect(await viewCasePo.getCaseStatusValue()).toContain('In Progress');
            await navigationPage.gotCreateCase();
            await createCasePo.selectRequester('fritz');
            await createCasePo.setSummary('Summary');
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName);
            await createCasePo.clickAssignToMeButton();
            await createCasePo.clickSaveCaseButton();
            await createCasePo.clickGoToCaseButton();
            await viewCasePo.isEditLinkDisplay();
            expect(await viewCasePo.isCoreTaskPresent(taskTemplateSummaryYesValue)).toBeTruthy();
            await viewCasePo.changeCaseStatus('In Progress');
            await viewCasePo.clickSaveStatus();
            await viewCasePo.clickOnTaskLink(taskTemplateSummaryYesValue);
            await viewTaskPo.changeTaskStatus('Completed');
            await updateStatusBladePo.setStatusReason('Done');
            await viewTaskPo.clickOnSaveStatus();
            await viewTaskPo.clickOnViewCase();
            expect(await viewCasePo.getCaseStatusValue()).toContain('Resolved');
        }),

        it('[DRDMV-19734]:[RESOLVE_CASE_ON_LAST_TASK_COMPLETION] - Case Template view Look & Feel after adding new configuration field', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            let caseTemplateName: string = await caseTemplate['caseTemplateWitAllFields'].templateName + Math.floor(Math.random() * 100000);
            caseTemplate['caseTemplateWitAllFields'].templateName = caseTemplateName;
            await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
            await createCaseTemplate.setTemplateName(caseTemplateName);
            await createCaseTemplate.setCompanyName(caseTemplate['caseTemplateWitAllFields'].company);
            await createCaseTemplate.setCaseSummary(caseTemplate['caseTemplateWitAllFields'].templateSummary);
            await createCaseTemplate.setPriorityValue(caseTemplate['caseTemplateWitAllFields'].casePriority);
            await createCaseTemplate.isResolveCaseOnLastTaskCompletion(true);
            await createCaseTemplate.setPriorityValue(caseTemplate['caseTemplateWitAllFields'].casePriority);
            await createCaseTemplate.isResolveCaseOnLastTaskCompletion(true);
            await createCaseTemplate.clickSaveCaseTemplate();
            await utilCommon.waitUntilPopUpDisappear();
            expect(await viewCaseTemplate.getResolveCaseOnLastTaskCompletionValue()).toContain('Yes');
            await editCaseTemplate.clickEditCaseTemplate();
            await editCaseTemplate.isResolveCaseOnLastTaskCompletion(false);
            await editCaseTemplate.clickSaveCaseTemplate();
            expect(await viewCaseTemplate.getResolveCaseOnLastTaskCompletionValue()).toContain('No');
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
                "templateName": `${caseTemplateName}`,
                "templateSummary": `${casTemplateSummary}`,
                "templateStatus": "Active",
                "company": "Petramco",
                "resolveCaseonLastTaskCompletion": "1",
                "assignee": "Fritz",
                "supportGroup": "Facilities"
            }
            await apiHelper.apiLogin('fritz');
            await navigationPage.gotCreateCase();
            await apiHelper.createCaseTemplate(templateData);
            await createCasePo.selectRequester('fritz');
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName);
            await createCasePo.clickSaveCaseButton();
            await createCasePo.clickGoToCaseButton();
            await viewCasePo.isEditLinkDisplay();
            await viewCasePo.changeCaseStatus('In Progress');
            await viewCasePo.clickSaveStatus();
            await viewCasePo.clickEditCaseButton();
            await editCasePo.waitForEditCasePageToBeDisplayed();
            expect(await editCasePo.isChangeCaseTemplateButtonDisplayed()).toBeFalsy('change template button not Displayed');
            await editCasePo.clickOnCancelCaseButton();
            await viewCasePo.isEditLinkDisplay();
            await viewCasePo.changeCaseStatus('Resolved');
            await viewCasePo.setStatusReason('Auto Resolved');
            await viewCasePo.clickSaveStatus();
            await viewCasePo.clickEditCaseButton();
            await editCasePo.waitForEditCasePageToBeDisplayed();
            expect(await editCasePo.isChangeCaseTemplateButtonDisplayed()).toBeFalsy('change template button not Displayed');
            await editCasePo.clickOnCancelCaseButton();
            await viewCasePo.isEditLinkDisplay();
            //closed
            await viewCasePo.changeCaseStatus('Closed');
            await viewCasePo.clickSaveStatus();
            await viewCasePo.clickEditCaseButton();
            await editCasePo.waitForEditCasePageToBeDisplayed();
            expect(await editCasePo.isChangeCaseTemplateButtonDisplayed()).toBeFalsy('change template button not Displayed');
            await editCasePo.clickOnCancelCaseButton();
            await viewCasePo.isEditLinkDisplay();
            //new case created 
            await navigationPage.gotCreateCase();
            await createCasePo.selectRequester('fritz');
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName);
            await createCasePo.clickSaveCaseButton();
            await createCasePo.clickGoToCaseButton();
            await viewCasePo.isEditLinkDisplay();
            await viewCasePo.changeCaseStatus('Pending');
            await viewCasePo.setStatusReason('Customer Response');
            await viewCasePo.clickSaveStatus();
            await viewCasePo.clickEditCaseButton();
            await editCasePo.waitForEditCasePageToBeDisplayed();
            expect(await editCasePo.isChangeCaseTemplateButtonDisplayed()).toBeFalsy('change template button not Displayed');
            await editCasePo.clickOnCancelCaseButton();
            await viewCasePo.isEditLinkDisplay();
            //cancelled
            await viewCasePo.changeCaseStatus('Canceled');
            await viewCasePo.setStatusReason('Customer Canceled');
            await viewCasePo.clickSaveStatus();
            await viewCasePo.clickEditCaseButton();
            await editCasePo.waitForEditCasePageToBeDisplayed();
            expect(await editCasePo.isChangeCaseTemplateButtonDisplayed()).toBeFalsy('change template button not Displayed');
            await editCasePo.clickOnCancelCaseButton();
            await viewCasePo.isEditLinkDisplay();
        } catch (e) {
            throw e;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 180 * 1000)
})