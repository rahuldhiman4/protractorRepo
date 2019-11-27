import { browser, $, ProtractorExpectedConditions, protractor } from "protractor";
import loginPage from "../../pageobject/login.po";
import createCaseTemplate from "../../pageobject/case/create-casetemplate.po";
import editCaseTemplate from "../../pageobject/case/edit-casetemplate.po";
import copyCaseTemplate from "../../pageobject/case/copy-casetemplate.po";
import navigationPage from "../../pageobject/navigation.po";
import consoleCasetemplatePo from '../../pageobject/case/console-casetemplate.po';

describe('CopyCaseTemplate', () => {
    beforeAll(async () => {
        await browser.get(`${browser.baseUrl}/innovationsuite/index.html#/com.bmc.dsm.bwfa`);
        browser.waitForAngularEnabled(false);
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    it('should login correctly', async () => {
        await loginPage.login("qkatawazi");
    });

    it('DRDMV-13551,DRDMV-13529: Create a Copy of Case template where Company is copied properly', async () => {
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows')).toEqual('Case Templates - Business Workflows');
        var caseTemplate = require('../../data/ui/casetemplate.ui.json');
        var caseTemplateName: string = await caseTemplate['caseTemplateWitAllFields'].templateName + Math.floor(Math.random() * 100000);
        caseTemplate['caseTemplateWitAllFields'].templateName = caseTemplateName;
        await createCaseTemplate.createCaseTemplateWithAllFields(caseTemplate['caseTemplateWitAllFields']);
        await editCaseTemplate.clickOnEditCaseTemplateMetadata();
        await editCaseTemplate.changeTemplateStatusDropdownValue(caseTemplate['caseTemplateWitAllFields'].templateStatus);
        await editCaseTemplate.clickOnSaveCaseTemplateMetadata();
        var CasetemplateNew = await editCaseTemplate.getCaseTemplateID();
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows')).toEqual('Case Templates - Business Workflows');
        await consoleCasetemplatePo.searchAndselectCaseTemplate(caseTemplateName);
        await consoleCasetemplatePo.clickOnCopyCaseTemplate();
        var copyCaseTemplateName: string = "copycasetemplate" + Math.floor(Math.random() * 10000000);
        await copyCaseTemplate.setTemplateName(copyCaseTemplateName);
        //verify all values copied from template 1 to template 2
        await expect(copyCaseTemplate.getValueOfcasePriority()).toContain(caseTemplate['caseTemplateWitAllFields'].casePriority);
        await expect(copyCaseTemplate.getValueofCaseCategoryTier1()).toBe(caseTemplate['caseTemplateWitAllFields'].categoryTier1);
        await expect(copyCaseTemplate.getValueofCaseCategoryTier2()).toBe(caseTemplate['caseTemplateWitAllFields'].categoryTier2);
        await expect(copyCaseTemplate.getValueofCaseCategoryTier3()).toBe(caseTemplate['caseTemplateWitAllFields'].categoryTier3);
        await expect(copyCaseTemplate.getValueOfAllowReopen()).toBe(caseTemplate['caseTemplateWitAllFields'].allowCaseReopen);
        await expect(copyCaseTemplate.getValueOfFlowset()).toBe(caseTemplate['caseTemplateWitAllFields'].flowset);
        await expect(copyCaseTemplate.getValueOfCaseCompany()).toBe(caseTemplate['caseTemplateWitAllFields'].company);
        await expect(copyCaseTemplate.getValueOfOwnerCompany()).toBe(caseTemplate['caseTemplateWitAllFields'].ownerCompany);
        await expect(copyCaseTemplate.getValueOfOwnerGroup()).toContain('Compensation and Benefits');
        await expect(copyCaseTemplate.getValueOfAssignementMethod()).toBe(caseTemplate['caseTemplateWitAllFields'].assignmentMethod);
        await expect(copyCaseTemplate.getValueOfTaskFailureConfiguration()).toBe(caseTemplate['caseTemplateWitAllFields'].taskFailureConfiguration);
        await expect(copyCaseTemplate.getValueOfTemplateStatus()).toBe('Draft');
        await expect(copyCaseTemplate.getValueOfcaseStatus()).toBe(caseTemplate['caseTemplateWitAllFields'].caseStatus);
        await expect(copyCaseTemplate.getValueOfcasePriority()).toBe(caseTemplate['caseTemplateWitAllFields'].casePriority);
        await expect(copyCaseTemplate.getValueOfSupportCompany()).toBe(caseTemplate['caseTemplateWitAllFields'].company);
        await expect(copyCaseTemplate.getValueOfAssignee()).toBe(caseTemplate['caseTemplateWitAllFields'].assignee);
        await expect(copyCaseTemplate.getValueOfSupportGroup()).toBe(caseTemplate['caseTemplateWitAllFields'].supportGroup);
        await copyCaseTemplate.clickSaveCaseTemplate();
        await expect(copyCaseTemplate.getValueOfStatusReason()).toBe(caseTemplate['caseTemplateWitAllFields'].statusReason);
        await expect(copyCaseTemplate.getValueOfCaseDescription()).toContain(caseTemplate['caseTemplateWitAllFields'].templateDescription);
        await expect(copyCaseTemplate.getValueOfCaseSummary()).toBe(caseTemplate['caseTemplateWitAllFields'].templateSummary);
        var copiedCasetemplateFromNew = await editCaseTemplate.getCaseTemplateID();
        await expect(copiedCasetemplateFromNew == CasetemplateNew).toBeFalsy();
        //defect https://jira.bmc.com/browse/DRDMV-18655
        //await expect(editCaseTemplate.getValueOfResolutionCode()).toBe(caseTemplate['caseTemplateWitAllFields'].resolutionCode);
        //await expect(editCaseTemplate.getValueOfResolutionDescription()).toBe(caseTemplate['caseTemplateWitAllFields'].resolutionDescription);
    }, 80 * 1000);

    it('DRDMV-13543,DRDMV-13555: Create a Copy of Case template by Case Business Analyst that belongs to Support Group,Case Template console grid should show Newly created copied template', async () => {
        await navigationPage.signOut();
        await loginPage.login("Fritz");
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows')).toEqual('Case Templates - Business Workflows');
        var caseTemplate = await require('../../data/ui/casetemplate.ui.json');
        var caseTemplatePayload = await caseTemplate['caseTemplateWithMandatoryField'];
        var caseTemplateName: string = await caseTemplatePayload.templateName + Math.floor(Math.random() * 100000);
        caseTemplatePayload.templateName = caseTemplateName;
        await createCaseTemplate.createCaseTemplateWithAllFields(caseTemplatePayload);
        await editCaseTemplate.clickOnEditCaseTemplateMetadata();
        await editCaseTemplate.changeTemplateStatusDropdownValue(caseTemplatePayload.templateStatus);
        await editCaseTemplate.clickOnSaveCaseTemplateMetadata();
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows')).toEqual('Case Templates - Business Workflows');
        await consoleCasetemplatePo.searchAndselectCaseTemplate(caseTemplateName);
        await consoleCasetemplatePo.clickOnCopyCaseTemplate();
        var copyCaseTemplateName: string = "copycasetemplate" + Math.floor(Math.random() * 10000000);
        await copyCaseTemplate.setTemplateName(copyCaseTemplateName);
        //verify all values copied from template 1 to template 2
        await expect(copyCaseTemplate.getValueOfcasePriority()).toContain(caseTemplatePayload.casePriority);
        await expect(copyCaseTemplate.getValueofCaseCategoryTier1()).toBe(caseTemplatePayload.categoryTier1);
        await expect(copyCaseTemplate.getValueofCaseCategoryTier2()).toBe(caseTemplatePayload.categoryTier2);
        await expect(copyCaseTemplate.getValueofCaseCategoryTier3()).toBe(caseTemplatePayload.categoryTier3);
        await expect(copyCaseTemplate.getValueOfAllowReopen()).toBe(caseTemplatePayload.allowCaseReopen);
        await expect(copyCaseTemplate.getValueOfFlowset()).toBe(caseTemplatePayload.flowset);
        await expect(copyCaseTemplate.getValueOfCaseCompany()).toBe(caseTemplatePayload.company);
        await expect(copyCaseTemplate.getValueOfOwnerCompany()).toBe(caseTemplatePayload.ownerCompany);
        await expect(copyCaseTemplate.getValueOfOwnerGroup()).toContain('Facilities');
        await expect(copyCaseTemplate.getValueOfAssignementMethod()).toBe(caseTemplatePayload.assignmentMethod);
        await expect(copyCaseTemplate.getValueOfTaskFailureConfiguration()).toBe(caseTemplatePayload.taskFailureConfiguration);
        await expect(copyCaseTemplate.getValueOfTemplateStatus()).toBe('Draft');
        await expect(copyCaseTemplate.getValueOfcaseStatus()).toBe(caseTemplatePayload.caseStatus);
        await expect(copyCaseTemplate.getValueOfcasePriority()).toBe(caseTemplatePayload.casePriority);
        await expect(copyCaseTemplate.getValueOfSupportCompany()).toBe(caseTemplatePayload.company);
        await expect(copyCaseTemplate.getValueOfAssignee()).toBe(caseTemplatePayload.assignee);
        await expect(copyCaseTemplate.getValueOfSupportGroup()).toBe(caseTemplatePayload.supportGroup);
        await copyCaseTemplate.clickSaveCaseTemplate();
        await expect(copyCaseTemplate.getValueOfStatusReason()).toBe(caseTemplatePayload.statusReason);
        await expect(copyCaseTemplate.getValueOfCaseDescription()).toContain(caseTemplatePayload.templateDescription);
        await expect(copyCaseTemplate.getValueOfCaseSummary()).toBe(caseTemplatePayload.templateSummary);
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows')).toEqual('Case Templates - Business Workflows');
        await consoleCasetemplatePo.searchAndselectCaseTemplate(copyCaseTemplateName);
        await expect(consoleCasetemplatePo.getCaseTemplateNamePresentOnGrid(copyCaseTemplateName)).toBe(copyCaseTemplateName);
    }, 200 * 1000);
});