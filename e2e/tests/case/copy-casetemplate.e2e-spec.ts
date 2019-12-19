import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import consoleCasetemplatePo from '../../pageobject/settings/case-management/console-casetemplate.po';
import copyCaseTemplate from "../../pageobject/settings/case-management/copy-casetemplate.po";
import createCaseTemplate from "../../pageobject/settings/case-management/create-casetemplate.po";
import editCaseTemplate from "../../pageobject/settings/case-management/edit-casetemplate.po";
import utilCommon from '../../utils/util.common';

describe('Copy Case Template', () => {
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

    it('DRDMV-13551,DRDMV-13529: Create a Copy of Case template where Company is copied properly', async () => {
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows')).toEqual('Case Templates - Business Workflows');
        var caseTemplate = require('../../data/ui/casetemplate.ui.json');
        var caseTemplateName: string = await caseTemplate['caseTemplateWitAllFields'].templateName + Math.floor(Math.random() * 100000);
        caseTemplate['caseTemplateWitAllFields'].templateName = caseTemplateName;
        await createCaseTemplate.createCaseTemplateWithAllFields(caseTemplate['caseTemplateWitAllFields']);
        var CasetemplateNew = await editCaseTemplate.getCaseTemplateID();
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows')).toEqual('Case Templates - Business Workflows');
        await consoleCasetemplatePo.searchAndselectCaseTemplate(caseTemplateName);
        await consoleCasetemplatePo.clickOnCopyCaseTemplate();
        var copyCaseTemplateName: string = "copycasetemplate" + Math.floor(Math.random() * 10000000);
        await copyCaseTemplate.setTemplateName(copyCaseTemplateName);
        //verify all values copied from template 1 to template 2   
        await expect(copyCaseTemplate.isValueOfCasePriorityPresent(caseTemplate['caseTemplateWitAllFields'].casePriority)).toBeTruthy();
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
        try {
            await navigationPage.signOut();
            await loginPage.login("fritz");
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows')).toEqual('Case Templates - Business Workflows');
            var caseTemplate = await require('../../data/ui/casetemplate.ui.json');
            var caseTemplatePayload = await caseTemplate['caseTemplateWithMandatoryField'];
            var caseTemplateName: string = await caseTemplatePayload.templateName + Math.floor(Math.random() * 100000);
            caseTemplatePayload.templateName = caseTemplateName;
            await createCaseTemplate.createCaseTemplateWithAllFields(caseTemplatePayload);
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows')).toEqual('Case Templates - Business Workflows');
            await consoleCasetemplatePo.searchAndselectCaseTemplate(caseTemplateName);
            await consoleCasetemplatePo.clickOnCopyCaseTemplate();
            var copyCaseTemplateName: string = "copycasetemplate" + Math.floor(Math.random() * 10000000);
            await copyCaseTemplate.setTemplateName(copyCaseTemplateName);
            //verify all values copied from template 1 to template 2
            await expect(copyCaseTemplate.isValueOfCasePriorityPresent(caseTemplatePayload.casePriority)).toBeTruthy();
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
        } catch (e) {
            console.log(e);
        } finally {
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        }
    }, 200 * 1000);

    it('DRDMV-13550: Create a Copy of Case template where Submitter do not belong to any Support Groups ', async () => {
        try {
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows')).toEqual('Case Templates - Business Workflows');
            var caseTemplate = await require('../../data/ui/casetemplate.ui.json');
            var caseTemplatePayload = await caseTemplate['caseTemplateWithMandatoryField'];
            var caseTemplateName: string = await caseTemplatePayload.templateName + Math.floor(Math.random() * 100000);
            caseTemplatePayload.templateName = caseTemplateName;
            await createCaseTemplate.createCaseTemplateWithAllFields(caseTemplatePayload);
            await apiHelper.apiLogin('tadmin');
            var userData = {
                "firstName": "Petramco",
                "lastName": "withoutSG",
                "userId": "DRDMV-13550",
            }
            await apiHelper.createNewUser(userData);
            await apiHelper.associatePersonToCompany(userData.userId, "Petramco");
            await navigationPage.signOut();
            await loginPage.loginWithCredentials(userData.userId + "@petramco.com", 'Password_1234');
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows')).toEqual('Case Templates - Business Workflows');
            await consoleCasetemplatePo.searchAndselectCaseTemplate(caseTemplateName);
            await consoleCasetemplatePo.clickOnCopyCaseTemplate();
            var copyCaseTemplateName: string = "copycasetemplate" + Math.floor(Math.random() * 10000000);
            await copyCaseTemplate.setTemplateName(copyCaseTemplateName);
            //verify all values copied from template 1 to template 2
            await expect(copyCaseTemplate.isValueOfCasePriorityPresent(caseTemplatePayload.casePriority)).toBeTruthy();
            await expect(copyCaseTemplate.getValueofCaseCategoryTier1()).toBe(caseTemplatePayload.categoryTier1);
            await expect(copyCaseTemplate.getValueofCaseCategoryTier2()).toBe(caseTemplatePayload.categoryTier2);
            await expect(copyCaseTemplate.getValueofCaseCategoryTier3()).toBe(caseTemplatePayload.categoryTier3);
            await expect(copyCaseTemplate.getValueOfAllowReopen()).toBe(caseTemplatePayload.allowCaseReopen);
            await expect(copyCaseTemplate.getValueOfFlowset()).toBe(caseTemplatePayload.flowset);
            await expect(copyCaseTemplate.getValueOfCaseCompany()).toBe(caseTemplatePayload.company);
            await expect(copyCaseTemplate.getValueOfAssignementMethod()).toBe(caseTemplatePayload.assignmentMethod);
            await expect(copyCaseTemplate.getValueOfTaskFailureConfiguration()).toBe(caseTemplatePayload.taskFailureConfiguration);
            await expect(copyCaseTemplate.getValueOfTemplateStatus()).toBe('Draft');
            await expect(copyCaseTemplate.getValueOfcaseStatus()).toBe(caseTemplatePayload.caseStatus);
            await expect(copyCaseTemplate.getValueOfSupportCompany()).toBe(caseTemplatePayload.company);
            await expect(copyCaseTemplate.getValueOfAssignee()).toBe(caseTemplatePayload.assignee);
            await expect(copyCaseTemplate.getValueOfSupportGroup()).toBe(caseTemplatePayload.supportGroup);
            await expect(copyCaseTemplate.isOwnerGroupEmpty()).toBeTruthy();
            await expect(copyCaseTemplate.isOwnerCompanyEmpty()).toBeTruthy();
        } catch (e) {
            console.log(e);
        } finally {
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        }
    }, 200 * 1000);

    it('DRDMV-13815: Instruction come Warning Message is displayed on Create Copy Case Template Page', async () => {
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows')).toEqual('Case Templates - Business Workflows');
        var caseTemplate = await require('../../data/ui/casetemplate.ui.json');
        var caseTemplatePayload = await caseTemplate['caseTemplateWithMandatoryField'];
        var caseTemplateName: string = await caseTemplatePayload.templateName + Math.floor(Math.random() * 100000);
        caseTemplatePayload.templateName = caseTemplateName;
        await createCaseTemplate.createCaseTemplateWithAllFields(caseTemplatePayload);
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows')).toEqual('Case Templates - Business Workflows');
        await consoleCasetemplatePo.searchAndselectCaseTemplate(caseTemplateName);
        await consoleCasetemplatePo.clickOnCopyCaseTemplate();
        var copyCaseTemplateName: string = "copycasetemplate" + Math.floor(Math.random() * 10000000);
        await copyCaseTemplate.setTemplateName(copyCaseTemplateName);
        expect(await copyCaseTemplate.getCopyCaseTemplateInstruction()).toContain('Task templates associated with this case template are copied and assigned the case assignee. Please make sure you specify assignment.');
        expect(await copyCaseTemplate.getCopyCaseTemplateInstruction()).toContain('If you have changed the company:');
        expect(await copyCaseTemplate.getCopyCaseTemplateInstruction()).toContain('Task templates similar to the associated task templates are added.');
        expect(await copyCaseTemplate.getCopyCaseTemplateInstruction()).toContain('If no similar task templates are available, new task templates are automatically created.');
        expect(await copyCaseTemplate.getCopyCaseTemplateInstruction()).toContain('Assignment and ownership for new task templates are copied from new case template.');
    }, 200 * 1000);
});