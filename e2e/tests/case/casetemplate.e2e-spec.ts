import { browser } from "protractor";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import consoleCasetemplatePo from '../../pageobject/settings/case-management/console-casetemplate.po';
import createCaseTemplate from "../../pageobject/settings/case-management/create-casetemplate.po";
import { default as editCaseTemplate, default as editCasetemplatePo } from "../../pageobject/settings/case-management/edit-casetemplate.po";
import viewCaseTemplate from "../../pageobject/settings/case-management/view-casetemplate.po";
import utilCommon from '../../utils/util.common';
import copyCasetemplatePo from '../../pageobject/settings/case-management/copy-casetemplate.po';
import utilGrid from '../../utils/util.grid';
import apiHelper from '../../api/api.helper';

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

    it('DRDMV-10477,DRDMV-10483: Case Template creation with Template validation as OPTIONAL using BA login', async () => {
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

    it('DRDMV-10487: Case Template update with Template validation as ENFORCED', async () => {
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

    it('DRDMV-10469: Case Template creation with Template validation as ENFORCED', async () => {
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

    it('DRDMV-10481: Case Template creation with Template validation as NONE', async () => {
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

    it('DRDMV-10476: Case Template creation with Template validation as OPTIONAL using tadmin login', async () => {
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
            console.log(e);
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    });

    it('DRDMV-10479: Case Template NOT created with Template validation as OPTIONAL using Case Agent login', async () => {
        try {
            await navigationPage.signOut();
            await loginPage.login('franz');
            await navigationPage.gotoSettingsPage();
            await browser.sleep(1000);
            expect(await createCaseTemplate.getPanelHeading()).toContain('Configuration options not created for these settings.');
        } catch (e) {
            console.log(e);
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    });

    it('DRDMV-14874 : Verify the values present in the Case assignment method dropdownlist-Round Robin and None', async () => {
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

    it('DRDMV-14880: Verify Case assignment method is set to None by default in a New/already existing Case template', async () => {
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

    it('DRDMV-1231: [Edit Case Template] Template metadata edit', async () => {
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

    it('DRDMV-1229: [Case Template Console] Search by Summary and Display ID on the Case Template Console', async () => {
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
});
