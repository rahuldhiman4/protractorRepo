import { browser } from "protractor";
import apiHelper from "../../api/api.helper";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import { BWF_BASE_URL } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import previewCasePo from '../../pageobject/case/case-preview.po';
import quickCasePo from '../../pageobject/case/quick-case.po';
import activityTabPo from '../../pageobject/social/activity-tab.po';
import viewCasePo from '../../pageobject/case/view-case.po';
import editCasePo from '../../pageobject/case/edit-case.po';
import resourcesTabPo from '../../pageobject/common/resources-tab.po';
describe('PIN Validation Quick Case', () => {

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('gderuno');
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    describe('[DRDMV-13708,DRDMV-10508,DRDMV-10560,DRDMV-10563,DRDMV-10564]:Case creation via Quick Case ,Template validation is ENFORCED', async () => {
        let casetemplatePsilon1, newCaseTemplate;
        let randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            casetemplatePsilon1 = {
                "templateName": `${randomStr}1Casetemplate`,
                "templateStatus": "Draft",
                "templateSummary": `${randomStr}1Summary`,
                "caseStatus": "New",
                "casePriority": "Low",
                "categoryTier1": 'Purchasing Card',
                "company": "Psilon",
                "businessUnit": "Psilon Support Org1",
                "supportGroup": "Psilon Support Group1",
                "ownerBU": "Psilon Support Org1",
                "ownerGroup": "Psilon Support Group1"
            }
            await apiHelper.apiLogin('gderuno');
            newCaseTemplate = await apiHelper.createCaseTemplate(casetemplatePsilon1);
            await apiHelper.apiLogin('tadmin');
            await apiHelper.addCommonConfig('IDENTITY_VALIDATION', ['ENFORCED'], 'Psilon');
            await apiHelper.updateCaseTemplateIdentitiyValidation(newCaseTemplate.id, 'ENFORCED');
            await apiHelper.updateCaseTemplateStatus(newCaseTemplate.id, 'Active');
        });
        it('[DRDMV-13708,DRDMV-10508,DRDMV-10560,DRDMV-10563,DRDMV-10564]:Case creation via Quick Case ,Template validation is ENFORCED', async () => {
            await navigationPage.signOut();
            await loginPage.login('werusha');
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName("gwixillian");
            await quickCasePo.selectCaseTemplate(casetemplatePsilon1.templateName);
            expect(await quickCasePo.isCreateButtonDisabled()).toBeTruthy('Save button Enabled');
            expect(await quickCasePo.isIdentityValidationMessageDisplayed('Please validate the requester.')).toBeTruthy();
            expect(resourcesTabPo.isSectionTitleDisplayed('Recommended Cases')).toBeFalsy('Section is Present');
            expect(resourcesTabPo.isSectionTitleDisplayed('Recommended Knowledge')).toBeFalsy('Section is Present');
            await quickCasePo.validatePin("1234");
            expect(await utilityCommon.isPopupMsgsMatches(['Validation of requester is unsuccessful.'])).toBeTruthy();
            await quickCasePo.clickOnPINCancelBtn();
            await utilityCommon.closePopUpMessage();
            expect(resourcesTabPo.isSectionTitleDisplayed('Recommended Cases')).toBeFalsy('Section is Present');
            expect(resourcesTabPo.isSectionTitleDisplayed('Recommended Knowledge')).toBeFalsy('Section is Present');
            await quickCasePo.validatePin("12345");
            expect(await utilityCommon.isPopupMsgsMatches(['Validation of requester is successful.'])).toBeTruthy();
            expect(resourcesTabPo.isSectionTitleDisplayed('Recommended Cases')).toBeTruthy('Section is Present');
            expect(resourcesTabPo.isSectionTitleDisplayed('Recommended Knowledge')).toBeTruthy('Section is Present');
            await quickCasePo.createCaseButton();
            expect(await previewCasePo.isRequesterNameDisplayed('Gleeu Wixillian')).toBeTruthy();
            expect(await previewCasePo.isCaseSummaryDisplayed(casetemplatePsilon1.templateSummary)).toBeTruthy();
            expect(await previewCasePo.isAssignedCompanyDisplayed('Psilon')).toBeTruthy();
            expect(await previewCasePo.isRequesterEmailIdDisplayed('gwixillian@psilon.com')).toBeTruthy();
            expect(await previewCasePo.isDescriptionDisplayed('Gleeu Wixillian ' + `${casetemplatePsilon1.templateName}`)).toBeTruthy();
            await quickCasePo.gotoCaseButton();
            expect(await quickCasePo.isIdentityValidationMessageDisplayed('Requester is not validated for this case.')).toBeFalsy();
            expect(await activityTabPo.isTitleTextDisplayedInActivity('validated the PIN of the requester', 1)).toBeTruthy();
        });
        it('[DRDMV-13708,DRDMV-10508,DRDMV-10560,DRDMV-10563,DRDMV-10564]:Case creation via Quick Case ,Template validation is ENFORCED', async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteCommonConfig('IDENTITY_VALIDATION', 'Psilon');
            await apiHelper.addCommonConfig('IDENTITY_VALIDATION', ['NONE'], 'Psilon');
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName("gwixillian");
            await quickCasePo.selectCaseTemplate(casetemplatePsilon1.templateName);
            expect(await quickCasePo.isCreateButtonDisabled()).toBeTruthy('Save button Enabled');
            expect(await quickCasePo.isIdentityValidationMessageDisplayed('Please validate the requester.')).toBeTruthy();
            expect(resourcesTabPo.isSectionTitleDisplayed('Recommended Cases')).toBeFalsy('Section is Present');
            expect(resourcesTabPo.isSectionTitleDisplayed('Recommended Knowledge')).toBeFalsy('Section is Present');
            await quickCasePo.validatePin("12345");
            expect(await utilityCommon.isPopupMsgsMatches(['Validation of requester is successful.'])).toBeTruthy();
            await quickCasePo.createCaseButton();
            await quickCasePo.gotoCaseButton();
            expect(await quickCasePo.isIdentityValidationMessageDisplayed('Requester is not validated for this case.')).toBeFalsy();
            expect(await activityTabPo.isTitleTextDisplayedInActivity('validated the PIN of the requester', 1)).toBeTruthy();
        });
        it('[DRDMV-13708,DRDMV-10508,DRDMV-10560,DRDMV-10563,DRDMV-10564]:Case creation via Quick Case ,Template validation is ENFORCED', async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteCommonConfig('IDENTITY_VALIDATION', 'Psilon');
            await apiHelper.addCommonConfig('IDENTITY_VALIDATION', ['OPTIONAL'], 'Psilon');
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName("gwixillian");
            await quickCasePo.selectCaseTemplate(casetemplatePsilon1.templateName);
            expect(await quickCasePo.isCreateButtonDisabled()).toBeTruthy('Save button Enabled');
            expect(await quickCasePo.isIdentityValidationMessageDisplayed('Please validate the requester.')).toBeTruthy();
            expect(resourcesTabPo.isSectionTitleDisplayed('Recommended Cases')).toBeFalsy('Section is Present');
            expect(resourcesTabPo.isSectionTitleDisplayed('Recommended Knowledge')).toBeFalsy('Section is Present');
            await quickCasePo.validatePin("12345");
            expect(await utilityCommon.isPopupMsgsMatches(['Validation of requester is successful.'])).toBeTruthy();
            expect(resourcesTabPo.isSectionTitleDisplayed('Recommended Cases')).toBeTruthy('Section is Present');
            expect(resourcesTabPo.isSectionTitleDisplayed('Recommended Knowledge')).toBeTruthy('Section is Present');
            await quickCasePo.createCaseButton();
            await quickCasePo.gotoCaseButton();
            expect(await quickCasePo.isIdentityValidationMessageDisplayed('Requester is not validated for this case.')).toBeFalsy();
            expect(await activityTabPo.isTitleTextDisplayedInActivity('validated the PIN of the requester', 1)).toBeTruthy();
        });
        afterAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteCommonConfig('IDENTITY_VALIDATION', 'Psilon');
            await navigationPage.signOut();
            await loginPage.login('gderuno');
        });
    });
    
    describe('[DRDMV-10506,DRDMV-10507,DRDMV-10558,DRDMV-10559,DRDMV-10562]:Case creation via Quick Case ,Template validation is OPTIONAL', async () => {
        let casetemplatePsilon1, newCaseTemplate;
        let randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            casetemplatePsilon1 = {
                "templateName": `${randomStr}2Casetemplate`,
                "templateStatus": "Draft",
                "templateSummary": `${randomStr}2Summary`,
                "caseStatus": "New",
                "casePriority": "Low",
                "categoryTier1": 'Purchasing Card',
                "company": "Psilon",
                "businessUnit": "Psilon Support Org1",
                "supportGroup": "Psilon Support Group1",
                "ownerBU": "Psilon Support Org1",
                "ownerGroup": "Psilon Support Group1"
            }
            await apiHelper.apiLogin('gderuno');
            newCaseTemplate = await apiHelper.createCaseTemplate(casetemplatePsilon1);
            await apiHelper.apiLogin('tadmin');
            await apiHelper.addCommonConfig('IDENTITY_VALIDATION', ['NONE'], 'Phylum');
            await apiHelper.updateCaseTemplateIdentitiyValidation(newCaseTemplate.id, 'OPTIONAL');
            await apiHelper.updateCaseTemplateStatus(newCaseTemplate.id, 'Active');
        });
        it('[DRDMV-10506,DRDMV-10507,DRDMV-10558,DRDMV-10559,DRDMV-10562]:Case creation via Quick Case ,Template validation is OPTIONAL', async () => {
            await navigationPage.signOut();
            await loginPage.login('werusha');
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName("gwixillian");
            await quickCasePo.selectCaseTemplate(casetemplatePsilon1.templateName);
            expect(await quickCasePo.isCreateButtonDisabled()).toBeFalsy('Save button Enabled');
            expect(await quickCasePo.isIdentityValidationMessageDisplayed('Please validate the requester.')).toBeTruthy();
            await quickCasePo.validatePin("1234");
            expect(await utilityCommon.isPopupMsgsMatches([`Requester's PIN not validated for this case.`])).toBeTruthy();
            expect(resourcesTabPo.isSectionTitleDisplayed('Recommended Cases')).toBeFalsy('Section is Present');
            expect(resourcesTabPo.isSectionTitleDisplayed('Recommended Knowledge')).toBeFalsy('Section is Present');
            await quickCasePo.createCaseButton();
            await quickCasePo.gotoCaseButton();
            expect(await quickCasePo.isIdentityValidationMessageDisplayed('Requester is not validated for this case.')).toBeTruthy();
            expect(await activityTabPo.isTitleTextDisplayedInActivity('did not validate the PIN of the requester', 1)).toBeTruthy();
            await viewCasePo.clickEditCaseButton();
            expect(await quickCasePo.isIdentityValidationMessageDisplayed('Requester is not validated for this case.')).toBeTruthy();
            await editCasePo.clickOnCancelCaseButton();
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName("gwixillian");
            await quickCasePo.selectCaseTemplate(casetemplatePsilon1.templateName);
            expect(await quickCasePo.isCreateButtonDisabled()).toBeFalsy('Save button Enabled');
            expect(await quickCasePo.isIdentityValidationMessageDisplayed('Please validate the requester.')).toBeTruthy();
            expect(resourcesTabPo.isSectionTitleDisplayed('Recommended Cases')).toBeFalsy('Section is Present');
            expect(resourcesTabPo.isSectionTitleDisplayed('Recommended Knowledge')).toBeFalsy('Section is Present');
            await quickCasePo.validatePin("12345");
            expect(await utilityCommon.isPopupMsgsMatches(['Validation of requester is successful.'])).toBeTruthy();
            expect(resourcesTabPo.isSectionTitleDisplayed('Recommended Cases')).toBeTruthy('Section is Present');
            expect(resourcesTabPo.isSectionTitleDisplayed('Recommended Knowledge')).toBeTruthy('Section is Present');
            await quickCasePo.createCaseButton();
            await quickCasePo.gotoCaseButton();
            expect(await activityTabPo.isTitleTextDisplayedInActivity('validated the PIN of the requester', 1)).toBeTruthy();
        });
        it('[DRDMV-10506,DRDMV-10507,DRDMV-10558,DRDMV-10559,DRDMV-10562]:Case creation via Quick Case ,Template validation is OPTIONAL', async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteCommonConfig('IDENTITY_VALIDATION', 'Psilon');
            await apiHelper.addCommonConfig('IDENTITY_VALIDATION', ['OPTIONAL'], 'Psilon');
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName("gwixillian");
            await quickCasePo.selectCaseTemplate(casetemplatePsilon1.templateName);
            expect(await quickCasePo.isCreateButtonDisabled()).toBeFalsy('Save button Enabled');
            expect(await quickCasePo.isIdentityValidationMessageDisplayed('Please validate the requester.')).toBeTruthy();
            await quickCasePo.validatePin("1234");
            expect(await utilityCommon.isPopupMsgsMatches([`Requester's PIN not validated for this case.`])).toBeTruthy();
            expect(resourcesTabPo.isSectionTitleDisplayed('Recommended Cases')).toBeFalsy('Section is Present');
            expect(resourcesTabPo.isSectionTitleDisplayed('Recommended Knowledge')).toBeFalsy('Section is Present');
            await quickCasePo.createCaseButton();
            await quickCasePo.gotoCaseButton();
            expect(await quickCasePo.isIdentityValidationMessageDisplayed('Requester is not validated for this case.')).toBeTruthy();
            expect(await activityTabPo.isTitleTextDisplayedInActivity('did not validate the PIN of the requester', 1)).toBeTruthy();
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName("gwixillian");
            await quickCasePo.selectCaseTemplate(casetemplatePsilon1.templateName);
            expect(await quickCasePo.isCreateButtonDisabled()).toBeFalsy('Save button Enabled');
            expect(await quickCasePo.isIdentityValidationMessageDisplayed('Please validate the requester.')).toBeTruthy();
            expect(resourcesTabPo.isSectionTitleDisplayed('Recommended Cases')).toBeFalsy('Section is Present');
            expect(resourcesTabPo.isSectionTitleDisplayed('Recommended Knowledge')).toBeFalsy('Section is Present');
            await quickCasePo.validatePin("12345");
            expect(await utilityCommon.isPopupMsgsMatches(['Validation of requester is successful.'])).toBeTruthy();
            expect(resourcesTabPo.isSectionTitleDisplayed('Recommended Cases')).toBeTruthy('Section is Present');
            expect(resourcesTabPo.isSectionTitleDisplayed('Recommended Knowledge')).toBeTruthy('Section is Present');
            await quickCasePo.createCaseButton();
            await quickCasePo.gotoCaseButton();
            expect(await activityTabPo.isTitleTextDisplayedInActivity('validated the PIN of the requester', 1)).toBeTruthy();
        });
        it('[DRDMV-10506,DRDMV-10507,DRDMV-10558,DRDMV-10559,DRDMV-10562]:Case creation via Quick Case ,Template validation is OPTIONAL', async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteCommonConfig('IDENTITY_VALIDATION', 'Psilon');
            await apiHelper.addCommonConfig('IDENTITY_VALIDATION', ['ENFORCED'], 'Psilon');
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName("gwixillian");
            await quickCasePo.selectCaseTemplate(casetemplatePsilon1.templateName);
            expect(await quickCasePo.isCreateButtonDisabled()).toBeTruthy('Save button Enabled');
            expect(await quickCasePo.isIdentityValidationMessageDisplayed('Please validate the requester.')).toBeTruthy();
            expect(resourcesTabPo.isSectionTitleDisplayed('Recommended Cases')).toBeFalsy('Section is Present');
            expect(resourcesTabPo.isSectionTitleDisplayed('Recommended Knowledge')).toBeFalsy('Section is Present');
            await quickCasePo.validatePin("12345");
            expect(await utilityCommon.isPopupMsgsMatches(['Validation of requester is successful.'])).toBeTruthy();
            expect(resourcesTabPo.isSectionTitleDisplayed('Recommended Cases')).toBeTruthy('Section is Present');
            expect(resourcesTabPo.isSectionTitleDisplayed('Recommended Knowledge')).toBeTruthy('Section is Present');
            await quickCasePo.createCaseButton();
            await quickCasePo.gotoCaseButton();
            expect(await activityTabPo.isTitleTextDisplayedInActivity('validated the PIN of the requester', 1)).toBeTruthy();
        });
        afterAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteCommonConfig('IDENTITY_VALIDATION', 'Psilon');
            await navigationPage.signOut();
            await loginPage.login('gderuno');
        });
    });
});