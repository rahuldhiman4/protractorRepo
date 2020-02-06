import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import { ALL_FIELD, MANDATORY_FIELD } from '../../data/ui/case/casetemplate.data.ui';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import consoleCasetemplatePo from '../../pageobject/settings/case-management/console-casetemplate.po';
import copyCaseTemplate from "../../pageobject/settings/case-management/copy-casetemplate.po";
import createCaseTemplate from "../../pageobject/settings/case-management/create-casetemplate.po";
import editCaseTemplate from "../../pageobject/settings/case-management/edit-casetemplate.po";

let caseTemplateAllFields = ALL_FIELD;
let caseTemplateRequiredFields = MANDATORY_FIELD;

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
    });

    //ptidke
    it('[DRDMV-13551,DRDMV-13529]: Create a Copy of Case template where Company is copied properly', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        let caseTemplateName: string = caseTemplateAllFields.templateName + Math.floor(Math.random() * 100000);
        caseTemplateAllFields.templateName = caseTemplateName;
        await createCaseTemplate.createCaseTemplateWithAllFields(caseTemplateAllFields);
        let CasetemplateNew = await editCaseTemplate.getCaseTemplateID();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        await consoleCasetemplatePo.searchAndselectCaseTemplate(caseTemplateName);
        await consoleCasetemplatePo.clickOnCopyCaseTemplate();
        let copyCaseTemplateName: string = "copycasetemplate" + Math.floor(Math.random() * 10000000);
        await copyCaseTemplate.setTemplateName(copyCaseTemplateName);
        //verify all values copied from template 1 to template 2   
        await expect(await copyCaseTemplate.isValueOfCasePriorityPresent(caseTemplateAllFields.casePriority)).toBeTruthy();
        await expect(await copyCaseTemplate.getValueofCaseCategoryTier1()).toBe(caseTemplateAllFields.categoryTier1);
        await expect(await copyCaseTemplate.getValueofCaseCategoryTier2()).toBe(caseTemplateAllFields.categoryTier2);
        await expect(await copyCaseTemplate.getValueofCaseCategoryTier3()).toBe(caseTemplateAllFields.categoryTier3);
        await expect(await copyCaseTemplate.getValueOfAllowReopen()).toBe(caseTemplateAllFields.allowCaseReopen);
        await expect(await copyCaseTemplate.getValueOfFlowset()).toBe(caseTemplateAllFields.flowset);
        await expect(await copyCaseTemplate.getValueOfCaseCompany()).toBe(caseTemplateAllFields.company);
        await expect(await copyCaseTemplate.getValueOfOwnerCompany()).toBe(caseTemplateAllFields.ownerCompany);
        await expect(await copyCaseTemplate.getValueOfOwnerGroup()).toContain('Compensation and Benefits');
        await expect(await copyCaseTemplate.getValueOfAssignementMethod()).toBe(caseTemplateAllFields.assignmentMethod);
        await expect(await copyCaseTemplate.getValueOfTaskFailureConfiguration()).toBe(caseTemplateAllFields.taskFailureConfiguration);
        await expect(await copyCaseTemplate.getValueOfTemplateStatus()).toBe('Draft');
        await expect(await copyCaseTemplate.getValueOfcaseStatus()).toBe(caseTemplateAllFields.caseStatus);
        await expect(await copyCaseTemplate.getValueOfSupportCompany()).toBe(caseTemplateAllFields.company);
        await expect(await copyCaseTemplate.getValueOfAssignee()).toBe(caseTemplateAllFields.assignee);
        await expect(await copyCaseTemplate.getValueOfSupportGroup()).toBe(caseTemplateAllFields.supportGroup);
        await copyCaseTemplate.clickSaveCaseTemplate();
        await expect(await copyCaseTemplate.getValueOfStatusReason()).toBe(caseTemplateAllFields.statusReason);
        await expect(await copyCaseTemplate.getValueOfCaseDescription()).toContain(caseTemplateAllFields.templateDescription);
        await expect(await copyCaseTemplate.getValueOfCaseSummary()).toBe(caseTemplateAllFields.templateSummary);
        let copiedCasetemplateFromNew = await editCaseTemplate.getCaseTemplateID();
        await expect(copiedCasetemplateFromNew == CasetemplateNew).toBeFalsy();
        await expect(await copyCaseTemplate.getValueOfResolutionCode()).toBe(caseTemplateAllFields.resolutionCode);
        await expect(await copyCaseTemplate.getValueOfResolutionDescription()).toBe(caseTemplateAllFields.resolutionDescription);
    }, 100 * 1000);

    //ptidke
    it('[DRDMV-13543,DRDMV-13555]: Create a Copy of Case template by Case Business Analyst that belongs to Support Group,Case Template console grid should show Newly created copied template', async () => {
        try {
            await navigationPage.signOut();
            await loginPage.login("fritz");
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            let caseTemplateName: string = caseTemplateRequiredFields.templateName + Math.floor(Math.random() * 100000);
            caseTemplateRequiredFields.templateName = caseTemplateName;
            await createCaseTemplate.createCaseTemplateWithAllFields(caseTemplateRequiredFields);
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await consoleCasetemplatePo.searchAndselectCaseTemplate(caseTemplateName);
            await consoleCasetemplatePo.clickOnCopyCaseTemplate();
            let copyCaseTemplateName: string = "copycasetemplate" + Math.floor(Math.random() * 10000000);
            await copyCaseTemplate.setTemplateName(copyCaseTemplateName);
            //verify all values copied from template 1 to template 2
            await expect(await copyCaseTemplate.isValueOfCasePriorityPresent(caseTemplateRequiredFields.casePriority)).toBeTruthy();
            await expect(await copyCaseTemplate.getValueofCaseCategoryTier1()).toBe(caseTemplateRequiredFields.categoryTier1);
            await expect(await copyCaseTemplate.getValueofCaseCategoryTier2()).toBe(caseTemplateRequiredFields.categoryTier2);
            await expect(await copyCaseTemplate.getValueofCaseCategoryTier3()).toBe(caseTemplateRequiredFields.categoryTier3);
            await expect(await copyCaseTemplate.getValueOfAllowReopen()).toBe(caseTemplateRequiredFields.allowCaseReopen);
            await expect(await copyCaseTemplate.getValueOfFlowset()).toBe(caseTemplateRequiredFields.flowset);
            await expect(await copyCaseTemplate.getValueOfCaseCompany()).toBe(caseTemplateRequiredFields.company);
            await expect(await copyCaseTemplate.getValueOfOwnerCompany()).toBe(caseTemplateRequiredFields.ownerCompany);
            await expect(await copyCaseTemplate.getValueOfOwnerGroup()).toContain('Facilities');
            await expect(await copyCaseTemplate.getValueOfAssignementMethod()).toBe(caseTemplateRequiredFields.assignmentMethod);
            await expect(await copyCaseTemplate.getValueOfTaskFailureConfiguration()).toBe(caseTemplateRequiredFields.taskFailureConfiguration);
            await expect(await copyCaseTemplate.getValueOfTemplateStatus()).toBe('Draft');
            await expect(await copyCaseTemplate.getValueOfcaseStatus()).toBe(caseTemplateRequiredFields.caseStatus);
            await expect(await copyCaseTemplate.getValueOfSupportCompany()).toBe(caseTemplateRequiredFields.company);
            await expect(await copyCaseTemplate.getValueOfAssignee()).toBe(caseTemplateRequiredFields.assignee);
            await expect(await copyCaseTemplate.getValueOfSupportGroup()).toBe(caseTemplateRequiredFields.supportGroup);
            await copyCaseTemplate.clickSaveCaseTemplate();
            await expect(await copyCaseTemplate.getValueOfStatusReason()).toBe(caseTemplateRequiredFields.statusReason);
            await expect(await copyCaseTemplate.getValueOfCaseDescription()).toContain(caseTemplateRequiredFields.templateDescription);
            await expect(await copyCaseTemplate.getValueOfCaseSummary()).toBe(caseTemplateRequiredFields.templateSummary);
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await consoleCasetemplatePo.searchAndselectCaseTemplate(copyCaseTemplateName);
            await expect(await consoleCasetemplatePo.getCaseTemplateNamePresentOnGrid(copyCaseTemplateName)).toBe(copyCaseTemplateName);
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        }
    }, 120 * 1000);

    //ptidke
    it('[DRDMV-13550]: Create a Copy of Case template where Submitter do not belong to any Support Groups ', async () => {
        try {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            let caseTemplateName: string = caseTemplateRequiredFields.templateName + Math.floor(Math.random() * 100000);
            caseTemplateRequiredFields.templateName = caseTemplateName;
            await createCaseTemplate.createCaseTemplateWithAllFields(caseTemplateRequiredFields);
            await apiHelper.apiLogin('tadmin');
            let userData = {
                "firstName": "Petramco",
                "lastName": "withoutSG",
                "userId": "DRDMV-13550",
            }
            await apiHelper.createNewUser(userData);
            await apiHelper.associatePersonToCompany(userData.userId, "Petramco");
            await navigationPage.signOut();
            await loginPage.loginWithCredentials(userData.userId + "@petramco.com", 'Password_1234');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await consoleCasetemplatePo.searchAndselectCaseTemplate(caseTemplateName);
            await consoleCasetemplatePo.clickOnCopyCaseTemplate();
            let copyCaseTemplateName: string = "copycasetemplate" + Math.floor(Math.random() * 10000000);
            await copyCaseTemplate.setTemplateName(copyCaseTemplateName);
            //verify all values copied from template 1 to template 2
            await expect(await copyCaseTemplate.isValueOfCasePriorityPresent(caseTemplateRequiredFields.casePriority)).toBeTruthy();
            await expect(await copyCaseTemplate.getValueofCaseCategoryTier1()).toBe(caseTemplateRequiredFields.categoryTier1);
            await expect(await copyCaseTemplate.getValueofCaseCategoryTier2()).toBe(caseTemplateRequiredFields.categoryTier2);
            await expect(await copyCaseTemplate.getValueofCaseCategoryTier3()).toBe(caseTemplateRequiredFields.categoryTier3);
            await expect(await copyCaseTemplate.getValueOfAllowReopen()).toBe(caseTemplateRequiredFields.allowCaseReopen);
            await expect(await copyCaseTemplate.getValueOfFlowset()).toBe(caseTemplateRequiredFields.flowset);
            await expect(await copyCaseTemplate.getValueOfCaseCompany()).toBe(caseTemplateRequiredFields.company);
            await expect(await copyCaseTemplate.getValueOfAssignementMethod()).toBe(caseTemplateRequiredFields.assignmentMethod);
            await expect(await copyCaseTemplate.getValueOfTaskFailureConfiguration()).toBe(caseTemplateRequiredFields.taskFailureConfiguration);
            await expect(await copyCaseTemplate.getValueOfTemplateStatus()).toBe('Draft');
            await expect(await copyCaseTemplate.getValueOfcaseStatus()).toBe(caseTemplateRequiredFields.caseStatus);
            await expect(await copyCaseTemplate.getValueOfSupportCompany()).toBe(caseTemplateRequiredFields.company);
            await expect(await copyCaseTemplate.getValueOfAssignee()).toBe(caseTemplateRequiredFields.assignee);
            await expect(await copyCaseTemplate.getValueOfSupportGroup()).toBe(caseTemplateRequiredFields.supportGroup);
            await expect(await copyCaseTemplate.isOwnerGroupEmpty()).toBeTruthy();
            await expect(await copyCaseTemplate.isOwnerCompanyEmpty()).toBeTruthy();
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        }
    }, 120 * 1000);

    //ptidke
    it('[DRDMV-13815]: Instruction come Warning Message is displayed on Create Copy Case Template Page', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        let caseTemplateName: string = caseTemplateAllFields.templateName + Math.floor(Math.random() * 100000);
        caseTemplateAllFields.templateName = caseTemplateName;
        await createCaseTemplate.createCaseTemplateWithAllFields(caseTemplateAllFields);
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        await consoleCasetemplatePo.searchAndselectCaseTemplate(caseTemplateName);

        await consoleCasetemplatePo.clickOnCopyCaseTemplate();
        let copyCaseTemplateName: string = "copycasetemplate" + Math.floor(Math.random() * 10000000);
        await copyCaseTemplate.setTemplateName(copyCaseTemplateName);
        await expect(await copyCaseTemplate.getCopyCaseTemplateInstruction()).toContain('Task templates associated with this case template are copied and assigned the case assignee. Please make sure you specify assignment.');
        await expect(await copyCaseTemplate.getCopyCaseTemplateInstruction()).toContain('If you have changed the company:');
        await expect(await copyCaseTemplate.getCopyCaseTemplateInstruction()).toContain('Task templates similar to the associated task templates are added.');
        await expect(await copyCaseTemplate.getCopyCaseTemplateInstruction()).toContain('If no similar task templates are available, new task templates are automatically created.');
        await expect(await copyCaseTemplate.getCopyCaseTemplateInstruction()).toContain('Assignment and ownership for new task templates are copied from new case template.');
    });
});