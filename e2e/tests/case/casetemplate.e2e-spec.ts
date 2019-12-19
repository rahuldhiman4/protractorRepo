import { browser } from "protractor";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import consoleCasetemplatePo from '../../pageobject/settings/case-management/console-casetemplate.po';
import createCaseTemplate from "../../pageobject/settings/case-management/create-casetemplate.po";
import { default as editCaseTemplate, default as editCasetemplatePo } from "../../pageobject/settings/case-management/edit-casetemplate.po";
import viewCaseTemplate from "../../pageobject/settings/case-management/view-casetemplate.po";
import utilCommon from '../../utils/util.common';

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

});